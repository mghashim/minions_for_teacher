import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { classInputSchema } from '@/lib/validation';

export async function GET() {
  const teacher = await requireTeacher();
  const classes = await prisma.class.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(classes);
}

export async function POST(request: Request) {
  const teacher = await requireTeacher();
  const json = await request.json();
  const parsed = classInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const created = await prisma.class.create({
    data: {
      ...parsed.data,
      teacherId: teacher.id,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
