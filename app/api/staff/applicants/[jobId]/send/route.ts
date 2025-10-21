import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ jobId: string }> }) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const jobId = parseInt((await ctx.params).jobId);
  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { employer: true } });
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  let body: { applicationIds?: number[] } = {};
  try { body = await req.json(); } catch {}
  const applicationIds = Array.isArray(body.applicationIds) ? body.applicationIds : [];

  if (!applicationIds.length) {
    // Default to all applicants for the job if none explicitly selected
    const all = await prisma.application.findMany({ where: { job_id: jobId } });
    applicationIds.push(...all.map(a => a.id));
  }

  const apps = await prisma.application.findMany({
    where: { id: { in: applicationIds }, job_id: jobId },
    include: { employee: { select: { fullname: true, email: true } } }
  });

  if (!apps.length) {
    return NextResponse.json({ error: 'No matching applications' }, { status: 400 });
  }

  const staffUserId = (session!.user as any).id as string;
  const summary = apps.map(a => `- ${a.employee.fullname} <${a.employee.email}> (app #${a.id})`).join('\n');
  const messageBody = `The following candidates have been selected for your job "${job.title}":\n\n${summary}\n\nYou can review them in the dashboard.`;

  // Record forwarded candidates for employer review (idempotent)
  try {
    await prisma.forwardedCandidate.createMany({
      data: apps.map((a) => ({ job_id: jobId, employer_id: job.employer_id, application_id: a.id })),
      skipDuplicates: true,
    } as any);
  } catch {}

  await prisma.message.create({
    data: {
      to_user_id: job.employer_id,
      from_user_id: staffUserId,
      subject: `Selected candidates for ${job.title}`,
      body: messageBody,
      job_id: jobId,
    }
  });

  return NextResponse.json({ ok: true, sentTo: job.employer.email, count: apps.length });
}
