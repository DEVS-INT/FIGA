import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const [totalUsers, totalJobs, newApplications, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.job.count({ where: { status: { in: ["PENDING", "APPROVED"] } } }),
      prisma.application.count({ where: { applied_at: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } }),
      Promise.resolve(24800), // TODO: replace with real revenue if available
    ]);

    return NextResponse.json({
      data: { totalUsers, totalJobs, newApplications, revenue },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load metrics" }, { status: 500 });
  }
}
