import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { planInputSchema } from '@/lib/validation';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const plans = await prisma.lessonPlan.findMany({
    where: { classId: params.id, class: { teacherId: teacher.id } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(plans);
}

export async function POST(request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const json = await request.json();
  const parsed = planInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const klass = await prisma.class.findFirst({
    where: { id: params.id, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  const plan = await prisma.lessonPlan.create({
    data: {
      ...parsed.data,
      classId: klass.id,
    },
  });
  return NextResponse.json(plan, { status: 201 });
}
