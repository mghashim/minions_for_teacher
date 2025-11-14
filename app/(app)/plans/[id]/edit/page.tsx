import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { PlanForm } from '../../PlanForm';

interface PlanEditPageProps {
  params: { id: string };
}

export default async function EditPlanPage({ params }: PlanEditPageProps) {
  const teacher = await requireTeacher();
  const plan = await prisma.lessonPlan.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
    include: { class: true },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit plan – {plan.title}
        </h1>
        <p className="text-sm text-slate-600">Class: {plan.class.name}</p>
      </header>
      <PlanForm
        classId={plan.classId}
        planId={plan.id}
        initial={{
          title: plan.title,
          objectives: plan.objectives as Record<string, unknown>,
          resources: plan.resources as Record<string, unknown>,
          plannedDurationMins: plan.plannedDurationMins,
        }}
      />
    </div>
  );
}
