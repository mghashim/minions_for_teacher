import assert from 'node:assert/strict';

import { planInputSchema } from '../../lib/validation';
import { test } from '../harness';

test('planInputSchema validates correct payload', () => {
  const data = {
    title: 'Decimals',
    objectives: { focus: ['Convert decimals'] },
    resources: { links: ['https://example.com'] },
    plannedDurationMins: 45,
  };
  assert.deepStrictEqual(planInputSchema.parse(data), data);
});

test('planInputSchema rejects invalid duration', () => {
  assert.throws(() =>
    planInputSchema.parse({
      title: 'Bad',
      objectives: {},
      resources: {},
      plannedDurationMins: 5,
    }),
  );
});
