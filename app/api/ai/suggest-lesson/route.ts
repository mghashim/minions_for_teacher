import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { aiSuggestInputSchema } from '@/lib/validation';
import { suggestLesson } from '@/lib/ai/lessonPlanner';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const teacher = await requireTeacher();
  if (!checkRateLimit(`ai:${teacher.id}`)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  const json = await request.json();
  const parsed = aiSuggestInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const klass = await prisma.class.findFirst({
    where: { id: parsed.data.classId, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  const session = parsed.data.sessionId
    ? await prisma.lessonSession.findFirst({
        where: { id: parsed.data.sessionId, classId: klass.id },
        include: { plan: true, progressNotes: { orderBy: { createdAt: 'desc' }, take: 1 } },
      })
    : null;

  const fallbackPlan = await prisma.lessonPlan.findFirst({
    where: { classId: klass.id },
    orderBy: { plannedDateTime: 'asc' },
  });

  const latestProgress = session?.progressNotes[0]
    ? {
        summary: session.progressNotes[0].summary,
        nextFocus: session.progressNotes[0].nextFocus,
      }
    : null;

  const upcomingPlan = (session?.plan ?? fallbackPlan)
    ? {
        title: (session?.plan ?? fallbackPlan).title,
        objectives: (session?.plan ?? fallbackPlan).objectives as Record<string, unknown>,
        plannedDurationMins: (session?.plan ?? fallbackPlan).plannedDurationMins,
      }
    : null;

  const suggestion = await suggestLesson({
    class: { name: klass.name, subject: klass.subject, level: klass.level },
    latestProgress,
    upcomingPlan,
    timeboxMins: parsed.data.timeboxMins,
  });

  return NextResponse.json({ suggestion });
}
