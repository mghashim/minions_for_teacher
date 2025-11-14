import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';

export async function GET() {
  const teacher = await requireTeacher();
  const notifications = await prisma.notification.findMany({
    where: { teacherId: teacher.id, sentAt: null },
    orderBy: { scheduledAt: 'asc' },
    take: 5,
  });
  return NextResponse.json(notifications);
}
