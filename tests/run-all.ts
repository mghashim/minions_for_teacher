import { run } from './harness';

import './server/lessonPlanner.test';
import './server/validation.test';
import './ui/CalendarTimeline.test';

async function main() {
  await run();
}

void main();
