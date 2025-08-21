import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { Prisma } from "@/lib/generated/prisma";

export async function GET() {
  try {
    const users = await prisma.$queryRaw<
      Array<{ id: string; fullname: string; email: string; role: string; created_at: Date; is_active: boolean }>
    >(
      Prisma.sql`SELECT id, fullname, email, role, created_at, COALESCE(is_active, true) AS is_active
                 FROM "User"
                 ORDER BY created_at DESC
                 LIMIT 50`
    );
    return NextResponse.json({ data: users });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
