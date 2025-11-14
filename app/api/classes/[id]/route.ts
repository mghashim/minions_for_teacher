import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { classInputSchema } from '@/lib/validation';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const klass = await prisma.class.findFirst({
    where: { id: params.id, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  return NextResponse.json(klass);
}

export async function PATCH(request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const json = await request.json();
  const parsed = classInputSchema.partial().safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const klass = await prisma.class.findFirst({
    where: { id: params.id, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  const updated = await prisma.class.update({
    where: { id: klass.id },
    data: parsed.data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const klass = await prisma.class.findFirst({
    where: { id: params.id, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  await prisma.class.delete({ where: { id: klass.id } });
  return NextResponse.json({ status: 'deleted' });
}
