import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';

import { CalendarTimeline } from '../../components/CalendarTimeline';
import { test } from '../harness';

type CalendarTimelineProps = Parameters<typeof CalendarTimeline>[0];

test('renders message when there are no sessions', () => {
  const html = renderToStaticMarkup(<CalendarTimeline sessions={[]} />);
  assert.ok(html.includes('No sessions scheduled'));
});

test('renders upcoming sessions', () => {
  const sessionList = [
    {
      id: 'session-1',
      classId: 'class-1',
      planId: 'plan-1',
      startDateTime: new Date().toISOString(),
      endDateTime: null,
      status: 'scheduled',
      createdAt: new Date(),
      class: {
        id: 'class-1',
        teacherId: 'teacher-1',
        name: 'Year 6 Maths',
        subject: 'Maths',
        level: 'Year 6',
        timetableColor: '#000000',
        createdAt: new Date(),
      },
      plan: {
        id: 'plan-1',
        classId: 'class-1',
        title: 'Fractions',
        objectives: {},
        resources: {},
        plannedDurationMins: 45,
        plannedDateTime: null,
        createdAt: new Date(),
      },
      progressNotes: [],
    },
  ] as unknown as CalendarTimelineProps['sessions'];

  const html = renderToStaticMarkup(<CalendarTimeline sessions={sessionList} />);

  assert.ok(html.includes('Year 6 Maths'));
  assert.ok(html.includes('Fractions'));
});
