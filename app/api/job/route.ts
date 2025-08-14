import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';
import { z } from 'zod';

const jobPostSchema = z.object({
  title: z.string().min(5),
  location: z.string().min(3),
  schedule_start: z.string().datetime(),
  schedule_end: z.string().datetime(),
  shift_type: z.enum(["Weekday", "Weekend", "Overnight", "Live-in", "One-time"]),
  gender_preference: z.string().optional(),
  driving_license_required: z.boolean().default(false),
  language_level_requirement: z.string().optional(),
  job_requirements: z.string().optional(),
  description: z.string().min(20),
  job_urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable().optional(),
  deadline: z.string().datetime().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const jobs = await prisma.job.findMany({
      where: {
        employer_id: session.user.id,
        ...(status && { status: status as any }),
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
      orderBy: { posted_at: 'desc' },
      include: {
        employer: {
          select: { fullname: true, email: true },
        },
      },
    });

    const total = await prisma.job.count({
      where: { employer_id: session.user.id },
    });

    return NextResponse.json({
      data: jobs,
      meta: { total, limit, offset },
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = jobPostSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        ...validation.data,
        employer_id: session.user.id,
        posted_at: new Date(),
        status: 'PENDING',
        schedule_start: new Date(validation.data.schedule_start),
        schedule_end: new Date(validation.data.schedule_end),
        deadline: validation.data.deadline ? new Date(validation.data.deadline) : null,
      },
    });

    return NextResponse.json(job, { status: 201 });

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}