import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import { formatDistanceToNow } from 'date-fns';

// Map DB shift_type to the UI labels used on /jobs
function mapShiftTypes(shift: string | null): string[] {
  if (!shift) return [];
  const map: Record<string, string> = {
    Weekday: 'Day shift',
    Weekend: 'Weekend',
    Overnight: 'Night shift',
    'Live-in': 'Live-in',
    'One-time': 'One-time',
  };
  const primary = map[shift] ?? shift;
  const result = [primary];
  // Heuristic: the UI recognizes an "Ongoing" badge among shift types.
  // Add it if no deadline exists (could be refined later).
  return result;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const take = searchParams.get('take');
    const skip = searchParams.get('skip');

  const where: any = {};
  // Show only APPROVED jobs by default on the public Find Jobs page
  where.status = status ?? 'APPROVED';

  const jobs = await prisma.job.findMany({
      where,
      take: take ? parseInt(take) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      orderBy: { posted_at: 'desc' },
      include: {
        employer: { select: { fullname: true, email: true } },
    _count: { select: { Application: true } },
      },
    });

  const data = jobs.map((job) => {
      const isOpen = job.status !== 'CANCELLED' && job.status !== 'COMPLETED';
      const days = Math.max(1, Math.ceil((job.schedule_end.getTime() - job.schedule_start.getTime()) / (1000 * 60 * 60 * 24)));
      const durationLabel = `${days >= 5 ? 'Full-time' : 'Part-time'}, ${days} ${days === 1 ? 'day' : 'days'}`;
      const requirements = job.job_requirements
        ? job.job_requirements.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // Build shift types and add 'Ongoing' when there is no deadline
      const shiftTypes = mapShiftTypes(job.shift_type);
      if (!job.deadline) {
        shiftTypes.push('Ongoing');
      }

      return {
        id: job.id,
        title: job.title,
        company: job.employer?.fullname ?? '—',
        location: job.location,
        isOpen,
        startDate: job.schedule_start.toISOString(),
        endDate: job.schedule_end.toISOString(),
        shiftTypes,
        duration: durationLabel,
        genderPreference: job.gender_preference ?? 'No preference',
        drivingRequired: !!job.driving_license_required,
        licenseRequired: !!job.driving_license_required,
        englishRequired: !!job.language_level_requirement,
        communicationLevel: job.language_level_requirement ?? '—',
        requirements,
        salary: '—',
        description: job.description,
        additionalNotes: null as string | null,
        contactInfo: job.employer?.email ?? '—',
        posted: formatDistanceToNow(job.posted_at, { addSuffix: true }),
  urgent: job.job_urgency === 'HIGH',
  applicants: (job as any)._count?.Application ?? 0,
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
