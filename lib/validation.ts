import { z } from 'zod';

export const classInputSchema = z.object({
  name: z.string().min(2),
  subject: z.string().min(2),
  level: z.string().min(1),
  timetableColor: z.string().regex(/^#([0-9a-f]{3}){1,2}$/i),
});

export const planInputSchema = z.object({
  title: z.string().min(2),
  objectives: z.record(z.string(), z.any()),
  resources: z.record(z.string(), z.any()),
  plannedDurationMins: z.number().min(10).max(180),
});

export const sessionInputSchema = z.object({
  classId: z.string().cuid().or(z.string().min(1)),
  planId: z.string().cuid().optional(),
  startDateTime: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date time')
    .transform((value) => new Date(value)),
});

export const progressInputSchema = z.object({
  summary: z.string().min(4),
  assignmentsGiven: z.record(z.string(), z.any()),
  nextFocus: z.string().min(3),
});

export const aiSuggestInputSchema = z.object({
  classId: z.string(),
  sessionId: z.string().optional(),
  timeboxMins: z.number().min(5).max(120),
});

export type ClassInput = z.infer<typeof classInputSchema>;
export type PlanInput = z.infer<typeof planInputSchema>;
export type SessionInput = z.infer<typeof sessionInputSchema>;
export type ProgressInput = z.infer<typeof progressInputSchema>;
export type AiSuggestInput = z.infer<typeof aiSuggestInputSchema>;
