import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      take: 50,
      orderBy: { posted_at: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        posted_at: true,
        shift_type: true,
        employer: { select: { id: true, fullname: true } },
      },
    });
    return NextResponse.json({ data: jobs });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}
