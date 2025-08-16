import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const portfolio = await prisma.portfolio.findFirst({
      where: { user_id: session.user.id },
    });
    return NextResponse.json({ portfolio });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "EMPLOYEE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Emulate upsert by user_id (not unique) safely
    const existing = await prisma.portfolio.findFirst({ where: { user_id: session.user.id } });
    let portfolio;
    if (existing) {
      portfolio = await prisma.portfolio.update({
        where: { id: existing.id },
        data: { ...body },
      });
    } else {
      portfolio = await prisma.portfolio.create({
        data: { ...body, user_id: session.user.id },
      });
    }

    return NextResponse.json({ ok: true, portfolio });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
