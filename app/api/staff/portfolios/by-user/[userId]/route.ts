import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(req: Request, ctx: any) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const userId = ctx.params.userId;
  const portfolio = await prisma.portfolio.findFirst({
    where: { user_id: userId },
    include: { user: { select: { fullname: true, email: true, phone: true } } }
  });
  if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
  return NextResponse.json({ portfolio });
}
