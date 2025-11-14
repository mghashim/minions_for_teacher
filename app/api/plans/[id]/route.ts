import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { planInputSchema } from '@/lib/validation';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const plan = await prisma.lessonPlan.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }
  return NextResponse.json(plan);
}

export async function PATCH(request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const plan = await prisma.lessonPlan.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }
  const json = await request.json();
  const parsed = planInputSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const updated = await prisma.lessonPlan.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const plan = await prisma.lessonPlan.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }
  await prisma.lessonPlan.delete({ where: { id: plan.id } });
  return NextResponse.json({ status: 'deleted' });
}
