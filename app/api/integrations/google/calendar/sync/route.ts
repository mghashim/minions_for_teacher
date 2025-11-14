import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';

export async function POST(request: Request) {
  const teacher = await requireTeacher();
  const json = await request.json();
  if (json.teacherId !== teacher.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const token = await prisma.integrationToken.upsert({
    where: {
      teacherId_provider: {
        teacherId: teacher.id,
        provider: 'google_calendar',
      },
    },
    update: { token: 'stubbed-token' },
    create: {
      teacherId: teacher.id,
      provider: 'google_calendar',
      token: 'stubbed-token',
    },
  });
  return NextResponse.json({ status: 'connected', tokenId: token.id });
}
