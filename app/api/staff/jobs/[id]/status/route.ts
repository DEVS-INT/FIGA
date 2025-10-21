import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const body = await req.json();
  if (!['APPROVED','REJECTED'].includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const job = await prisma.job.update({
    where: { id: parseInt((await ctx.params).id) },
    data: {
      status: body.status,
      is_reviewed: true,
      reviewed_by: ((session as any).user as any).id,
      reviewed_at: new Date(),
    },
  });
  return NextResponse.json(job);
}
