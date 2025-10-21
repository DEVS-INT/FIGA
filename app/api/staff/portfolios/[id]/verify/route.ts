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
  const portfolio = await prisma.portfolio.update({
    where: { id: parseInt((await ctx.params).id) },
    data: {
      is_verified: !!body.is_verified,
      verified_by: ((session as any).user as any).id,
      verified_at: new Date(),
    }
  });
  return NextResponse.json(portfolio);
}
