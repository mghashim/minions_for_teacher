import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { CreateClassForm } from './CreateClassForm';

export default async function ClassesPage() {
  await requireTeacher();
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    include: {
      lessonPlans: true,
      sessions: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Your classes</h1>
          <p className="text-sm text-slate-600">
            Track lesson plans, progress, and upcoming sessions for each class.
          </p>
        </header>
        <ul className="space-y-3">
          {classes.map((klass) => (
            <li key={klass.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{klass.name}</h2>
                  <p className="text-sm text-slate-500">
                    {klass.subject} · {klass.level}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="h-6 w-6 rounded-full border border-slate-200"
                  style={{ backgroundColor: klass.timetableColor }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span>{klass.lessonPlans.length} plans</span>
                <span>{klass.sessions.length} sessions</span>
                <Link href={`/classes/${klass.id}`} className="text-brand hover:underline">
                  View details
                </Link>
              </div>
            </li>
          ))}
          {classes.length === 0 ? (
            <li className="rounded border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No classes yet. Create one to begin planning lessons.
            </li>
          ) : null}
        </ul>
      </section>
      <CreateClassForm />
    </div>
  );
}
