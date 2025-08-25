import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getToken } from "next-auth/jwt";

// GET /api/staff/employees
// Query: q, status=all|active|inactive, role=EMPLOYEE|EMPLOYER|STAFF, page, pageSize, cert, day, sex, minAge, maxAge, verified=all|verified|unverified
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as any).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "all").toLowerCase();
    const role = (searchParams.get("role") || "EMPLOYEE").toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
  const cert = (searchParams.get("cert") || "").trim();
  const day = (searchParams.get("day") || "any").trim().toLowerCase();
  const sex = (searchParams.get("sex") || "any").trim().toLowerCase();
  const shift = (searchParams.get("shift") || "any").trim().toLowerCase();
  const minAgeRaw = searchParams.get("minAge");
  const maxAgeRaw = searchParams.get("maxAge");
  const minAge = minAgeRaw ? parseInt(minAgeRaw, 10) : NaN;
  const maxAge = maxAgeRaw ? parseInt(maxAgeRaw, 10) : NaN;
  const verified = (searchParams.get("verified") || "all").toLowerCase();

    const where: any = { role };
    if (q) {
      where.OR = [
        { fullname: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
  { phone: { contains: q, mode: "insensitive" } },
      ];
    }
    if (status === "active") where.is_active = true;
    if (status === "inactive") where.is_active = false;

    // Portfolio-based filters
    const otherPortfolioFilters: any[] = [];
    if (cert) otherPortfolioFilters.push({ certifications: { contains: cert, mode: "insensitive" } });
  if (day && day !== "any") otherPortfolioFilters.push({ suitable_work_days: { contains: day, mode: "insensitive" } });
  if (shift && shift !== "any") otherPortfolioFilters.push({ suitable_work_shift: { contains: shift, mode: "insensitive" } });
    if (sex && sex !== "any") otherPortfolioFilters.push({ sex: { equals: sex, mode: "insensitive" } });
    if (!Number.isNaN(minAge)) otherPortfolioFilters.push({ age: { gte: minAge } });
    if (!Number.isNaN(maxAge)) otherPortfolioFilters.push({ age: { lte: maxAge } });

    // Verified filter handling, including users with no portfolio as Unverified when no other portfolio filters are set
    if (verified === "verified") {
      where.Portfolio = { some: { AND: [...otherPortfolioFilters, { is_verified: true }] } };
    } else if (verified === "unverified") {
      if (otherPortfolioFilters.length > 0) {
        // With other portfolio filters, only users with a matching portfolio can qualify
        where.Portfolio = { some: { AND: [...otherPortfolioFilters, { is_verified: false }] } };
      } else {
        // No other portfolio filters: include users without any portfolio OR with unverified portfolio
        where.OR = [
          { Portfolio: { none: {} } },
          { Portfolio: { some: { is_verified: false } } },
        ];
      }
    } else if (otherPortfolioFilters.length > 0) {
      // No verified filter but other portfolio filters exist
      where.Portfolio = { some: { AND: otherPortfolioFilters } };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
  prisma.user.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
    include: {
          Portfolio: {
            orderBy: { created_at: "desc" },
            take: 1,
      select: { certifications: true, suitable_work_days: true, suitable_work_shift: true, age: true, sex: true, is_verified: true },
          },
        },
      }),
    ]);

    const data = users.map((u) => {
      const p = (u as any).Portfolio?.[0];
      return {
        id: u.id,
        fullname: u.fullname,
        email: u.email,
  phone: u.phone ?? null,
        role: u.role,
        is_active: u.is_active ?? true,
        created_at: u.created_at,
  certifications: p?.certifications ?? null,
  working_days: p?.suitable_work_days ?? null,
  working_shifts: p?.suitable_work_shift ?? null,
    age: p?.age ?? null,
    sex: p?.sex ?? null,
  verified: typeof p?.is_verified === "boolean" ? p?.is_verified : null,
      };
    });

    return NextResponse.json({ data, total, page, pageSize });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load employees" }, { status: 500 });
  }
}
