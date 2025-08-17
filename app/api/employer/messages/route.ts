import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";

function employerGuard(session: any) {
  if (!session?.user || (session.user as any).role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const guard = employerGuard(session);
  if (guard) return guard;

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unreadOnly") === "true";

  const messages = await prisma.message.findMany({
    where: {
      to_user_id: (session!.user as any).id,
      ...(unreadOnly ? { read_at: null } : {}),
    },
    include: {
      from_user: { select: { id: true, fullname: true, email: true } },
      job: { select: { id: true, title: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ data: messages });
}
