import { addDays, setHours, setMinutes } from '@/lib/date';
import { PrismaClient, SessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.teacher.upsert({
    where: { email: 'demo.teacher@example.com' },
    update: {},
    create: {
      name: 'Demo Teacher',
      email: 'demo.teacher@example.com',
      authProvider: 'magic_link',
    },
  });

  const [mathClass, literatureClass] = await Promise.all([
    prisma.class.upsert({
      where: { id: 'math-class' },
      update: {},
      create: {
        id: 'math-class',
        teacherId: teacher.id,
        name: 'Year 6 Mathematics',
        subject: 'Mathematics',
        level: 'Year 6',
        timetableColor: '#0ea5e9',
      },
    }),
    prisma.class.upsert({
      where: { id: 'literature-class' },
      update: {},
      create: {
        id: 'literature-class',
        teacherId: teacher.id,
        name: 'Year 7 Literature',
        subject: 'Literature',
        level: 'Year 7',
        timetableColor: '#ef4444',
      },
    }),
  ]);

  const baseDate = new Date();

  const mathPlans = await Promise.all([
    prisma.lessonPlan.create({
      data: {
        classId: mathClass.id,
        title: 'Fractions Revision',
        objectives: {
          focus: ['Compare fractions', 'Simplify fractions', 'Apply to word problems'],
        },
        resources: {
          manipulatives: ['Fraction tiles'],
          digital: ['https://nrich.maths.org/']
        },
        plannedDurationMins: 45,
        plannedDateTime: addDays(baseDate, 1),
      },
    }),
    prisma.lessonPlan.create({
      data: {
        classId: mathClass.id,
        title: 'Decimals to Fractions',
        objectives: {
          focus: ['Convert decimals to fractions', 'Identify recurring decimals'],
        },
        resources: {
          worksheets: ['Decimals conversion sheet']
        },
        plannedDurationMins: 45,
        plannedDateTime: addDays(baseDate, 3),
      },
    }),
  ]);

  const literaturePlans = await Promise.all([
    prisma.lessonPlan.create({
      data: {
        classId: literatureClass.id,
        title: 'Poetry Imagery',
        objectives: {
          focus: ['Identify imagery', 'Discuss emotional impact'],
        },
        resources: {
          texts: ['Stopping by Woods on a Snowy Evening'],
        },
        plannedDurationMins: 60,
        plannedDateTime: addDays(baseDate, 2),
      },
    }),
    prisma.lessonPlan.create({
      data: {
        classId: literatureClass.id,
        title: 'Character Analysis',
        objectives: {
          focus: ['Describe character traits', 'Use textual evidence'],
        },
        resources: {
          templates: ['Character map worksheet'],
        },
        plannedDurationMins: 60,
        plannedDateTime: addDays(baseDate, 5),
      },
    }),
  ]);

  const upcomingSession = await prisma.lessonSession.create({
    data: {
      classId: mathClass.id,
      planId: mathPlans[0].id,
      startDateTime: setMinutes(setHours(addDays(baseDate, 1), 9), 0),
      status: SessionStatus.scheduled,
    },
  });

  const completedSession = await prisma.lessonSession.create({
    data: {
      classId: literatureClass.id,
      planId: literaturePlans[0].id,
      startDateTime: setMinutes(setHours(addDays(baseDate, -1), 11), 30),
      endDateTime: setMinutes(setHours(baseDate, 12), 30),
      status: SessionStatus.completed,
      progressNotes: {
        create: {
          summary: 'Discussed poem imagery; students identified examples in pairs.',
          assignmentsGiven: { homework: 'Create imagery collage from chosen poem.' },
          nextFocus: 'Check understanding of metaphor vs. simile next lesson.',
        },
      },
    },
    include: { progressNotes: true },
  });

  await prisma.lessonSession.create({
    data: {
      classId: literatureClass.id,
      planId: literaturePlans[1].id,
      startDateTime: setMinutes(setHours(addDays(baseDate, 3), 10), 30),
      status: SessionStatus.scheduled,
    },
  });

  await prisma.progressNote.create({
    data: {
      sessionId: upcomingSession.id,
      summary: 'Preparation notes placeholder for quick entry.',
      assignmentsGiven: { tasks: ['Finish fraction worksheet'] },
      nextFocus: 'Revisit common misconceptions with denominators.',
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        teacherId: teacher.id,
        type: 'lesson_reminder',
        payload: { sessionId: upcomingSession.id },
        scheduledAt: setMinutes(setHours(addDays(baseDate, 1), 8), 0),
      },
      {
        teacherId: teacher.id,
        type: 'mid_lesson_nudge',
        payload: { sessionId: completedSession.id },
        scheduledAt: setMinutes(setHours(addDays(baseDate, -1), 11), 50),
      },
    ],
  });

  console.log('Seed data created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
