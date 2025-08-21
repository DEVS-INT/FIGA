import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { prisma } from "@/prisma/client";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { is_active: true } });
  return NextResponse.json({ is_active: user?.is_active ?? true });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const is_active = typeof body?.is_active === "boolean" ? body.is_active : null;
  if (is_active === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await prisma.user.update({ where: { id: session.user.id }, data: { is_active } });
  return NextResponse.json({ ok: true, is_active });
}
