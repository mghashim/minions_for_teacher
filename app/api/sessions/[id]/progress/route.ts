import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { progressInputSchema } from '@/lib/validation';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const notes = await prisma.progressNote.findMany({
    where: { sessionId: params.id, session: { class: { teacherId: teacher.id } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request, { params }: Params) {
  const teacher = await requireTeacher();
  const session = await prisma.lessonSession.findFirst({
    where: { id: params.id, class: { teacherId: teacher.id } },
  });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
  const json = await request.json();
  const parsed = progressInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const note = await prisma.progressNote.create({
    data: {
      sessionId: session.id,
      summary: parsed.data.summary,
      assignmentsGiven: parsed.data.assignmentsGiven,
      nextFocus: parsed.data.nextFocus,
    },
  });
  return NextResponse.json(note, { status: 201 });
}
