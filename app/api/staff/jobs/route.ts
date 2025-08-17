import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  // Only return unapproved jobs for review (pending or rejected)
  const jobs = await prisma.job.findMany({
    where: { status: { in: ['PENDING', 'REJECTED'] } },
    orderBy: { posted_at: 'desc' },
    include: { employer: { select: { fullname: true, email: true } } }
  });
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const body = await req.json();
  const employer = await prisma.user.findUnique({ where: { email: body.employerEmail } });
  if (!employer || employer.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
  }

  const job = await prisma.job.create({
    data: {
      employer_id: employer.id,
      title: body.title,
      location: body.location,
      schedule_start: new Date(body.schedule_start),
      schedule_end: new Date(body.schedule_end),
      shift_type: body.shift_type,
      description: body.description,
      status: 'APPROVED',
      is_reviewed: true,
      reviewed_by: ((session as any).user as any).id,
      reviewed_at: new Date(),
    },
  });
  return NextResponse.json({ job });
}
