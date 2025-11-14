import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { LiveLessonClient } from './LiveLessonClient';

interface SessionPageProps {
  params: { id: string };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const teacher = await requireTeacher();
  const session = await prisma.lessonSession.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
    include: {
      class: true,
      plan: true,
      progressNotes: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!session) {
    notFound();
  }

  const payload = {
    id: session.id,
    classId: session.classId,
    className: session.class.name,
    planTitle: session.plan?.title ?? undefined,
    planObjectives: session.plan?.objectives as Record<string, unknown> | undefined,
    latestProgress: session.progressNotes[0]
      ? {
          summary: session.progressNotes[0].summary,
          createdAt: session.progressNotes[0].createdAt.toISOString(),
        }
      : null,
    startDateTime: session.startDateTime.toISOString(),
    status: session.status,
  };

  return (
    <div className="space-y-6">
      <LiveLessonClient
        session={payload}
        defaultTimebox={session.plan?.plannedDurationMins ?? 45}
        resourceSuggestionsEnabled={Boolean(process.env.OPENAI_API_KEY)}
      />
    </div>
  );
}
