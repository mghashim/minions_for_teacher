declare module '@prisma/client' {
  export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

  export interface Class {
    id: string;
    teacherId: string;
    name: string;
    subject: string;
    level: string;
    timetableColor: string;
    createdAt: Date;
  }

  export interface LessonPlan {
    id: string;
    classId: string;
    title: string;
    objectives: Record<string, unknown>;
    resources: Record<string, unknown>;
    plannedDurationMins: number;
    plannedDateTime: Date | null;
    createdAt: Date;
  }

  export interface LessonSession {
    id: string;
    classId: string;
    planId: string | null;
    startDateTime: Date | string;
    endDateTime: Date | string | null;
    status: SessionStatus;
    createdAt: Date;
    class: Class;
    plan: LessonPlan | null;
    progressNotes: { summary: string }[];
  }

  export interface Notification {
    id: string;
    teacherId: string;
    type: 'lesson_reminder' | 'mid_lesson_nudge';
    payload: Record<string, unknown>;
    scheduledAt: Date;
    sentAt: Date | null;
    createdAt: Date;
  }
}
