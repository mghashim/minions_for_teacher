import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { z } from 'zod';

const statusSchema = z.object({ status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']) });

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const session = await prisma.lessonSession.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
    include: { class: true, plan: true, progressNotes: true },
  });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  return NextResponse.json(session);
}

export async function PATCH(request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const session = await prisma.lessonSession.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  const json = await request.json();
  const parsed = statusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const updated = await prisma.lessonSession.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const session = await prisma.lessonSession.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  await prisma.lessonSession.delete({ where: { id: session.id } });
  return NextResponse.json({ status: 'deleted' });
}
