import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { prisma } from '@/prisma/client';

function staffGuard(session: any) {
  if (!session?.user || (session.user as any).role !== 'STAFF' && (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const guard = staffGuard(session);
  if (guard) return guard;

  const body = await req.json();
  const to = await prisma.user.findUnique({ where: { email: body.toEmail } });
  if (!to) return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });

  const msg = await prisma.message.create({
    data: {
      to_user_id: to.id,
      from_user_id: ((session as any).user as any).id,
      subject: body.subject || null,
      body: body.body,
    }
  });

  return NextResponse.json({ message: msg });
}
