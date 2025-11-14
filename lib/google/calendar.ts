import type { LessonSession } from '@prisma/client';

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

export async function listEventsBetween(start: Date, end: Date): Promise<CalendarEvent[]> {
  if (!process.env.GOOGLE_CLIENT_ID) {
    // No OAuth configuration provided. Return an empty array to keep UI predictable.
    return [];
  }
  // TODO: Implement Google Calendar API call with OAuth2 tokens stored per teacher.
  // For now, return stubbed events to show shape of data.
  return [
    {
      id: 'stub-event',
      summary: 'Google Calendar placeholder',
      start: start.toISOString(),
      end: end.toISOString(),
    },
  ];
}

export async function upsertEventForSession(_session: LessonSession) {
  // TODO: Exchange stored refresh token, call Google Calendar events.insert/update.
  // Include helpful console logs for now to explain future work.
  console.info('Google Calendar sync not yet implemented.');
  return { status: 'not_implemented' };
}
