import type { Notification } from '@prisma/client';
import { addDays, differenceInMinutes, format, isBefore } from '@/lib/date';
import { CalendarTimeline } from '@/components/CalendarTimeline';
import { ReminderToast } from '@/components/ReminderToast';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';

function buildReminderMessage(notification: Notification) {
  if (!notification) return null;
  const when = format(notification.scheduledAt, 'EEE p');
  if (notification.type === 'mid_lesson_nudge') {
    return `Check pacing for session scheduled ${when}.`;
  }
  return `Upcoming lesson reminder for ${when}.`;
}

export default async function DashboardPage() {
  const teacher = await requireTeacher();
  const now = new Date();
  const upcomingWindowEnd = addDays(now, 7);

  const upcomingSessions = await prisma.lessonSession.findMany({
    where: {
      class: { teacherId: teacher.id },
      startDateTime: {
        gte: now,
        lte: upcomingWindowEnd,
      },
    },
    include: {
      class: true,
      plan: true,
    },
    orderBy: { startDateTime: 'asc' },
  });

  const reminders = await prisma.notification.findMany({
    where: { teacherId: teacher.id, sentAt: null },
    orderBy: { scheduledAt: 'asc' },
    take: 1,
  });

  const reminder = reminders[0]
    ? {
        type: reminders[0].type,
        message: buildReminderMessage(reminders[0]) ?? '',
      }
    : null;

  const nextSession = upcomingSessions[0];
  const minutesUntil = nextSession
    ? differenceInMinutes(new Date(nextSession.startDateTime), now)
    : null;

  return (
    <div className="space-y-8">
      <header className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {teacher.name.split(' ')[0] ?? 'Teacher'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {minutesUntil && minutesUntil > 0
            ? `Your next lesson starts in ${minutesUntil} minutes.`
            : nextSession && isBefore(new Date(nextSession.startDateTime), now)
              ? 'A session is currently in progress. Jump in to capture notes!'
              : 'Plan lessons, capture progress, and let AI adapt to your class.'}
        </p>
      </header>
      <CalendarTimeline sessions={upcomingSessions} />
      <ReminderToast reminder={reminder} />
    </div>
  );
}
