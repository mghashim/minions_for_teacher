import assert from 'node:assert/strict';

import { suggestLesson } from '../../lib/ai/lessonPlanner';
import { test } from '../harness';

test('lessonPlanner fallback returns deterministic plan when no API key', async () => {
  const result = await suggestLesson({
    class: { name: 'Year 6 Maths', level: 'Year 6', subject: 'Mathematics' },
    latestProgress: null,
    upcomingPlan: {
      title: 'Fractions',
      objectives: { focus: ['Simplify fractions'] },
      plannedDurationMins: 45,
    },
    timeboxMins: 45,
  });
  assert.ok(result.title.includes('Fractions'));
  assert.ok(result.timeBreakdown.length > 0);
});
