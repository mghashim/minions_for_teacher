import { notFound } from 'next/navigation';
import { format } from '@/lib/date';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';

interface ClassDetailPageProps {
  params: { id: string };
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const teacher = await requireTeacher();
  const klass = await prisma.class.findFirst({
    where: { id: params.id, teacherId: teacher.id },
    include: {
      lessonPlans: {
        orderBy: { plannedDateTime: 'asc' },
      },
      sessions: {
        orderBy: { startDateTime: 'desc' },
        include: {
          progressNotes: {
            orderBy: { createdAt: 'desc' },
          },
          plan: true,
        },
        take: 8,
      },
    },
  });

  if (!klass) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-slate-900">{klass.name}</h1>
        <p className="text-sm text-slate-600">
          {klass.subject} · {klass.level}
        </p>
      </header>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming plans</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {klass.lessonPlans.map((plan) => (
              <li key={plan.id} className="rounded border border-slate-100 p-3">
                <p className="font-medium text-slate-900">{plan.title}</p>
                <p>{plan.plannedDurationMins} mins</p>
                {plan.plannedDateTime ? (
                  <p className="text-xs text-slate-500">
                    {format(new Date(plan.plannedDateTime), 'EEE d MMM p')}
                  </p>
                ) : null}
              </li>
            ))}
            {klass.lessonPlans.length === 0 ? (
              <li className="rounded border border-dashed border-slate-300 p-4 text-xs text-slate-500">
                No plans yet for this class.
              </li>
            ) : null}
          </ul>
        </article>
        <article className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Recent sessions</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {klass.sessions.map((session) => (
              <li key={session.id} className="rounded border border-slate-100 p-3">
                <p className="font-medium text-slate-900">
                  {format(new Date(session.startDateTime), 'EEE d MMM p')}
                </p>
                <p>Status: {session.status.replace('_', ' ')}</p>
                {session.plan ? (
                  <p className="text-xs text-slate-500">{session.plan.title}</p>
                ) : null}
                {session.progressNotes[0] ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Last note: {session.progressNotes[0].summary}
                  </p>
                ) : null}
              </li>
            ))}
            {klass.sessions.length === 0 ? (
              <li className="rounded border border-dashed border-slate-300 p-4 text-xs text-slate-500">
                No sessions recorded yet.
              </li>
            ) : null}
          </ul>
        </article>
      </section>
    </div>
  );
}
