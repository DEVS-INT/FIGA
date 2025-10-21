import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Prisma } from "@/lib/generated/prisma";

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await _req.json();
    const { fullname, email, is_active } = body || {};
    await prisma.user.update({
      where: { id },
      data: { fullname, email, is_active },
    });
    const [user] = await prisma.$queryRaw<
      Array<{ id: string; fullname: string; email: string; role: string; created_at: Date; is_active: boolean }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User" WHERE id = ${id} LIMIT 1`
    );
    return NextResponse.json({ data: user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
  }
}
