import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { SessionForm } from '../SessionForm';

export default async function NewSessionPage() {
  const teacher = await requireTeacher();
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    orderBy: { name: 'asc' },
    include: { lessonPlans: { orderBy: { createdAt: 'desc' } } },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Schedule lesson session</h1>
        <p className="text-sm text-slate-600">
          Link to a plan and pick a start time. You can edit later from the live view.
        </p>
      </header>
      <SessionForm classes={classes} />
    </div>
  );
}
