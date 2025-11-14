import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { sessionInputSchema } from '@/lib/validation';

export async function GET(request: Request) {
  const teacher = await requireTeacher();
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const dateFilter: { gte?: Date; lte?: Date } = {};
  if (start) {
    dateFilter.gte = new Date(start);
  }
  if (end) {
    dateFilter.lte = new Date(end);
  }
  const sessions = await prisma.lessonSession.findMany({
    where: {
      class: { teacherId: teacher.id },
      ...(start || end ? { startDateTime: dateFilter } : {}),
    },
    include: { class: true, plan: true },
    orderBy: { startDateTime: 'asc' },
  });
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const teacher = await requireTeacher();
  const json = await request.json();
  const parsed = sessionInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const klass = await prisma.class.findFirst({
    where: { id: parsed.data.classId, teacherId: teacher.id },
  });
  if (!klass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }
  const session = await prisma.lessonSession.create({
    data: {
      classId: klass.id,
      plan: parsed.data.planId ? { connect: { id: parsed.data.planId } } : undefined,
      startDateTime: parsed.data.startDateTime,
    },
  });
  return NextResponse.json(session, { status: 201 });
}
