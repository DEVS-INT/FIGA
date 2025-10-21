// app/api/job/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: parseInt((await params).id),
        employer_id: session.user.id,
      },
      include: {
        employer: {
          select: {
            fullname: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the input data
    if (body.status && !['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (body.job_urgency && !['LOW', 'MEDIUM', 'HIGH'].includes(body.job_urgency)) {
      return NextResponse.json({ error: 'Invalid urgency level' }, { status: 400 });
    }

    const updateData = {
      title: body.title,
      location: body.location,
      schedule_start: body.schedule_start ? new Date(body.schedule_start) : undefined,
      schedule_end: body.schedule_end ? new Date(body.schedule_end) : undefined,
      shift_type: body.shift_type,
      gender_preference: body.gender_preference,
      driving_license_required: body.driving_license_required,
      language_level_requirement: body.language_level_requirement,
      job_requirements: body.job_requirements,
      description: body.description,
      status: body.status,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      job_urgency: body.job_urgency,
      is_reviewed: body.status === 'PENDING' ? false : true,
      reviewed_by: body.status === 'PENDING' ? null : session.user.id,
      reviewed_at: body.status === 'PENDING' ? null : new Date(),
    };

    const job = await prisma.job.update({
      where: {
        id: parseInt((await params).id),
        employer_id: session.user.id,
      },
      data: updateData,
      include: {
        employer: {
          select: {
            fullname: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if job exists and belongs to the user
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt((await params).id),
        employer_id: session.user.id,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Soft delete by updating status to CANCELLED
    const deletedJob = await prisma.job.update({
      where: {
        id: parseInt((await params).id),
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json(deletedJob);
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: support PUT by delegating to PATCH for idempotent updates
export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  return PATCH(request, ctx);
}