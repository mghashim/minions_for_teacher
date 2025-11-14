import type { LessonSession, LessonPlan, Class } from '@prisma/client';
import { format, isSameDay } from '../lib/date';
import { clsx } from '../lib/clsx';

type SessionWithRelations = LessonSession & {
  class: Class;
  plan: LessonPlan | null;
  progressNotes?: { summary: string }[];
};

interface CalendarTimelineProps {
  sessions: SessionWithRelations[];
}

const dayOrder = Array.from({ length: 7 }, (_, index) => index);

export function CalendarTimeline({ sessions }: CalendarTimelineProps) {
  const today = new Date();
  const grouped = dayOrder.map((offset) => {
    const day = new Date();
    day.setDate(today.getDate() + offset);
    return {
      day,
      sessions: sessions.filter((session) =>
        isSameDay(new Date(session.startDateTime), day),
      ),
    };
  });

  return (
    <section aria-label="Upcoming lessons" className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-slate-900">Next 7 days</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {grouped.map(({ day, sessions: daySessions }) => (
          <article
            key={day.toISOString()}
            className={clsx(
              'rounded-lg border border-slate-200 p-3',
              isSameDay(day, today) && 'border-brand bg-brand/5',
            )}
          >
            <header className="flex items-center justify-between text-sm text-slate-500">
              <span className="font-medium text-slate-700">{format(day, 'EEE, MMM d')}</span>
              {isSameDay(day, today) ? <span className="text-brand">Today</span> : null}
            </header>
            <ul className="mt-3 space-y-2">
              {daySessions.length === 0 ? (
                <li className="text-sm text-slate-500">No sessions scheduled.</li>
              ) : (
                daySessions.map((session) => (
                  <li key={session.id} className="rounded bg-slate-100 p-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {format(new Date(session.startDateTime), 'p')} · {session.class.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {session.plan?.title ?? 'Unplanned session'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Status: {session.status.replace('_', ' ')}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
