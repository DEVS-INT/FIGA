import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Prisma } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const staff = await prisma.$queryRaw<
      Array<{ id: string; fullname: string; email: string; role: string; created_at: Date; is_active: boolean }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User"
                 WHERE role = 'STAFF'
                 ORDER BY created_at DESC
                 LIMIT 100`
    );
    return NextResponse.json({ data: staff });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load staff" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullname, email, password } = body || {};
    if (!fullname || !email || !password) {
      return NextResponse.json({ error: "fullname, email, and password are required" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const hashed = await bcrypt.hash(password, 10);
    // Do not set/select is_active through Prisma when client is stale; rely on DB default and fetch via raw SQL
    const created = await prisma.user.create({
      data: { fullname, email, password: hashed, role: "STAFF" },
      select: { id: true },
    });
    const [user] = await prisma.$queryRaw<
      Array<{ id: string; fullname: string; email: string; role: string; created_at: Date; is_active: boolean }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User" WHERE id = ${created.id} LIMIT 1`
    );
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}
