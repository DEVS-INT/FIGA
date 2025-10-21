import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";

function employerGuard(session: any) {
  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const guard = employerGuard(session);
  if (guard) return guard;

  const id = Number((await ctx.params).id);
  const msg = await prisma.message.findFirst({
    where: { id, to_user_id: (session!.user as any).id },
    include: {
      from_user: { select: { id: true, fullname: true, email: true } },
      job: { select: { id: true, title: true } },
    },
  });
  if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: msg });
}

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const guard = employerGuard(session);
  if (guard) return guard;

  const id = Number((await ctx.params).id);
  const updated = await prisma.message.updateMany({
    where: { id, to_user_id: (session!.user as any).id, read_at: null },
    data: { read_at: new Date() },
  });
  if (updated.count === 0) {
    return NextResponse.json({ error: "Not found or already read" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const guard = employerGuard(session);
  if (guard) return guard;

  const id = Number((await ctx.params).id);
  const deleted = await prisma.message.deleteMany({
    where: { id, to_user_id: (session!.user as any).id },
  });
  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
