import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const apps = await prisma.application.findMany({
    orderBy: { applied_at: 'desc' },
    include: {
      job: true,
      employee: { select: { fullname: true, email: true } },
      portfolio: {
        select: {
          is_verified: true,
          english_skill: true,
          sex: true,
          suitable_work_shift: true,
          suitable_work_days: true,
        }
      },
    }
  });

  const applicants = apps
    .filter(a =>
      a.job.title.toLowerCase().includes(q) ||
      a.employee.fullname.toLowerCase().includes(q)
    )
    .map(a => ({
      applicationId: a.id,
      jobId: a.job_id,
      jobTitle: a.job.title,
      jobLocation: a.job.location,
      jobStatus: a.job.status,
      jobUrgency: a.job.job_urgency,
      appliedAt: a.applied_at,
      employeeId: a.employee_id,
      employeeName: a.employee.fullname,
      employeeEmail: a.employee.email,
      status: a.status,
      portfolio: {
        verified: a.portfolio?.is_verified ?? false,
        english: a.portfolio?.english_skill ?? null,
        sex: a.portfolio?.sex ?? null,
        workShift: a.portfolio?.suitable_work_shift ?? null,
        workDays: a.portfolio?.suitable_work_days ?? null,
      }
    }));

  return NextResponse.json({ applicants });
}
