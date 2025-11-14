import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { PlanCreator } from '../PlanCreator';

export default async function NewPlanPage() {
  const teacher = await requireTeacher();
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Create lesson plan</h1>
        <p className="text-sm text-slate-600">
          Capture objectives, resources, and timing for an upcoming class.
        </p>
      </header>
      <PlanCreator classes={classes} />
    </div>
  );
}
