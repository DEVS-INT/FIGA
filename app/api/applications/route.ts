import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/authOptions'
import { prisma } from '@/prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'EMPLOYEE') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
  const body = await req.json().catch(() => ({}))
  const jobId = Number(body?.jobId)
  const coverLetter: string | undefined = typeof body?.coverLetter === 'string' && body.coverLetter.trim() !== '' ? body.coverLetter.trim() : undefined
    if (!jobId || Number.isNaN(jobId)) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: { job_id: jobId, employee_id: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already applied' }, { status: 409 })
    }

    // Ensure employee has a portfolio to apply with
    const portfolio = await prisma.portfolio.findFirst({ where: { user_id: session.user.id } })
    if (!portfolio) {
      return NextResponse.json({ error: 'Please complete your portfolio before applying.' }, { status: 400 })
    }

  const application = await prisma.application.create({
      data: {
        job_id: jobId,
        employee_id: session.user.id,
        portfolio_id: portfolio.id,
    cover_letter: coverLetter,
        status: 'PENDING',
        applied_at: new Date(),
      },
    })

    return NextResponse.json({ ok: true, application })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to apply' }, { status: 500 })
  }
}
