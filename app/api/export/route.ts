import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';

export async function GET() {
  const teacher = await requireTeacher();
  const [classes, plans, sessions, notes] = await Promise.all([
    prisma.class.findMany({ where: { teacherId: teacher.id } }),
    prisma.lessonPlan.findMany({ where: { class: { teacherId: teacher.id } } }),
    prisma.lessonSession.findMany({ where: { class: { teacherId: teacher.id } } }),
    prisma.progressNote.findMany({ where: { session: { class: { teacherId: teacher.id } } } }),
  ]);
  const payload = {
    teacher,
    classes,
    plans,
    sessions,
    notes,
    exportedAt: new Date().toISOString(),
  };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="teacher-diary-export.json"',
    },
  });
}
