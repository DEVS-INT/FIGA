import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

    // Monthly users (caregivers/employers)
    const monthlyRows = (await prisma.$queryRaw`
      SELECT date_trunc('month', "created_at") AS month_ts,
             to_char(date_trunc('month', "created_at"), 'Mon') AS month,
             COUNT(*) FILTER (WHERE role = 'EMPLOYEE') AS caregivers,
             COUNT(*) FILTER (WHERE role = 'EMPLOYER') AS employers
      FROM "User"
      WHERE "created_at" >= ${sixMonthsAgo}
      GROUP BY month_ts
      ORDER BY month_ts
    `) as Array<{ month_ts: Date; month: string; caregivers: bigint; employers: bigint }>;
    const monthlyUsers = monthlyRows.map((r) => ({ month: r.month, caregivers: Number(r.caregivers), employers: Number(r.employers) }));

    // Daily users over last 30 days
    const dailyRows = (await prisma.$queryRaw`
      WITH days AS (
        SELECT generate_series(${thirtyDaysAgo}::date, ${now}::date, interval '1 day') AS d
      )
      SELECT to_char(d.d, 'YYYY-MM-DD') AS date,
             COALESCE(SUM(CASE WHEN u.role = 'EMPLOYEE' THEN 1 ELSE 0 END), 0) AS caregivers,
             COALESCE(SUM(CASE WHEN u.role = 'EMPLOYER' THEN 1 ELSE 0 END), 0) AS employers
      FROM days d
      LEFT JOIN "User" u ON date_trunc('day', u."created_at") = d.d
      GROUP BY d.d
      ORDER BY d.d
    `) as Array<{ date: string; caregivers: bigint; employers: bigint }>;
    const dailyUsers = dailyRows.map((r) => ({ date: r.date, caregivers: Number(r.caregivers), employers: Number(r.employers) }));

    // Daily applications over last 30 days
    const dailyAppsRows = (await prisma.$queryRaw`
      WITH days AS (
        SELECT generate_series(${thirtyDaysAgo}::date, ${now}::date, interval '1 day') AS d
      )
      SELECT to_char(d.d, 'YYYY-MM-DD') AS date,
             COALESCE(COUNT(a.*), 0) AS applications
      FROM days d
      LEFT JOIN "Application" a ON date_trunc('day', a."applied_at") = d.d
      GROUP BY d.d
      ORDER BY d.d
    `) as Array<{ date: string; applications: bigint }>;
    const dailyApplications = dailyAppsRows.map((r) => ({ date: r.date, applications: Number(r.applications) }));

    // Jobs posted vs filled (monthly)
    const jobsRows = (await prisma.$queryRaw`
      SELECT date_trunc('month', "posted_at") AS month_ts,
             to_char(date_trunc('month', "posted_at"), 'Mon') AS month,
             COUNT(*) AS posted,
             COUNT(*) FILTER (WHERE status = 'COMPLETED') AS filled
      FROM "Job"
      WHERE "posted_at" >= ${sixMonthsAgo}
      GROUP BY month_ts
      ORDER BY month_ts
    `) as Array<{ month_ts: Date; month: string; posted: bigint; filled: bigint }>;
    const jobsPosted = jobsRows.map((r) => ({ month: r.month, posted: Number(r.posted), filled: Number(r.filled) }));

    // Role breakdown (entire dataset)
    const roleRows = (await prisma.$queryRaw`
      SELECT role, COUNT(*) AS value
      FROM "User"
      GROUP BY role
    `) as Array<{ role: string; value: bigint }>;
    const roleBreakdown = roleRows.map((r) => ({ role: r.role, value: Number(r.value) }));

    return NextResponse.json({ data: { monthlyUsers, dailyUsers, dailyApplications, jobsPosted, roleBreakdown } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
