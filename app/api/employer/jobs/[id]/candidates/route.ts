import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobId = Number((await ctx.params).id);
  if (!jobId) return NextResponse.json({ error: "Invalid job id" }, { status: 400 });

  // Only allow employer to fetch for their own job
  const job = await prisma.job.findFirst({ where: { id: jobId, employer_id: session.user.id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids");
  const filterIds = idsParam
    ? idsParam
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n))
    : [];

  const forwarded = await prisma.forwardedCandidate.findMany({
    where: { job_id: jobId, employer_id: session.user.id },
    include: {
      application: {
        include: {
          employee: { select: { id: true, fullname: true, email: true, phone: true } },
          portfolio: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  let data = forwarded.map((f) => ({
    id: f.id,
    applicationId: f.application_id,
    forwardedAt: f.created_at,
    employee: f.application.employee,
    portfolio: f.application.portfolio,
  }));

  if (filterIds.length) {
    // If specific application IDs requested (per-message selection), override with those
    const apps = await prisma.application.findMany({
      where: { id: { in: filterIds }, job_id: jobId },
      include: {
  employee: { select: { id: true, fullname: true, email: true, phone: true } },
        portfolio: true,
      },
    });
    data = apps.map((a) => ({
      id: a.id,
      applicationId: a.id,
      forwardedAt: a.applied_at,
      employee: a.employee,
      portfolio: a.portfolio,
    }));
  }

  if (data.length > 0) return NextResponse.json({ data });

  // Fallback: parse recent staff messages for this job; if none found, show all applications for this job
  const msgs = await prisma.message.findMany({
    where: { job_id: jobId, to_user_id: session.user.id },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  const idSet = new Set<number>();
  const regex = /app\s*#(\d+)/gi;
  for (const msg of msgs) {
    if (!msg.body) continue;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(msg.body))) {
      const id = parseInt(m[1], 10);
      if (!Number.isNaN(id)) idSet.add(id);
    }
  }

  if (idSet.size > 0) {
    const ids = Array.from(idSet);
    const apps = await prisma.application.findMany({
      where: { id: { in: ids }, job_id: jobId },
      include: {
  employee: { select: { id: true, fullname: true, email: true, phone: true } },
        portfolio: true,
      },
      orderBy: { applied_at: "desc" },
    });
    const fallback = apps.map((a) => ({
      id: a.id,
      applicationId: a.id,
      forwardedAt: msgs[0]?.created_at ?? new Date(),
      employee: a.employee,
      portfolio: a.portfolio,
    }));
    return NextResponse.json({ data: fallback });
  }

  // As a last resort, return all applicants for this job
  const allApps = await prisma.application.findMany({
    where: { job_id: jobId },
    include: {
      employee: { select: { id: true, fullname: true, email: true, phone: true } },
      portfolio: true,
    },
    orderBy: { applied_at: "desc" },
  });
  const all = allApps.map((a) => ({
    id: a.id,
    applicationId: a.id,
    forwardedAt: msgs[0]?.created_at ?? a.applied_at,
    employee: a.employee,
    portfolio: a.portfolio,
  }));
  return NextResponse.json({ data: all });
}
