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
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode");
    const body = await req.json();

    // Define updatable columns from Portfolio schema
    const keys: Array<keyof typeof body> = [
      "sex",
      "age",
      "certifications",
      "experience",
      "state_where_experience_gained",
      "suitable_work_days",
      "suitable_work_shift",
      "comfortability",
      "university_college",
      "study_field",
      "degree",
      "english_skill",
      "us_living_years",
      "driving_details",
      "authorized_to_work",
      "currently_employed",
      "reason_left_previous_job",
      "job_type_preference",
      "profile_image",
    ];

    // Build data object
    let data: Record<string, any> = {};
    if (mode === "full") {
      // Overwrite every field (missing -> null)
      for (const k of keys) {
        const v = body[k as string];
        if (k === "age" || k === "us_living_years") {
          data[k as string] = typeof v === "number" ? v : v == null ? null : Number(v) || null;
        } else {
          data[k as string] = v === undefined ? null : v;
        }
      }
    } else {
      // Partial update: only provided keys
      for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(body, k)) {
          const v = body[k as string];
          if (k === "age" || k === "us_living_years") {
            data[k as string] = typeof v === "number" ? v : v == null ? null : Number(v) || null;
          } else {
            data[k as string] = v;
          }
        }
      }
    }

    // Emulate upsert by user_id (not unique) safely
    const existing = await prisma.portfolio.findFirst({ where: { user_id: session.user.id } });
    if (!existing && mode !== "full") {
      return NextResponse.json(
        { error: "Portfolio not created yet. Submit full portfolio first." },
        { status: 400 }
      );
    }
    let portfolio;
    if (existing) {
      portfolio = await prisma.portfolio.update({
        where: { id: existing.id },
        data,
      });
    } else {
      portfolio = await prisma.portfolio.create({
        data: ({ ...data, user_id: session.user.id } as any),
      });
    }

    return NextResponse.json({ ok: true, portfolio });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
