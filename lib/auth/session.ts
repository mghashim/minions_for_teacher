import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './options';
import { prisma } from '../prisma';

export async function requireTeacher() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const teacher = await prisma.teacher.findUnique({
    where: { email: session.user.email },
  });

  if (!teacher) {
    redirect('/auth/signin');
  }

  return teacher;
}
