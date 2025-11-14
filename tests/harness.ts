import process from 'node:process';

type TestFn = () => void | Promise<void>;

interface TestCase {
  name: string;
  fn: TestFn;
}

const tests: TestCase[] = [];

export function test(name: string, fn: TestFn) {
  tests.push({ name, fn });
}

export async function run() {
  let failures = 0;
  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`\u2713 ${name}`);
    } catch (error) {
      failures += 1;
      console.error(`\u2717 ${name}`);
      console.error(error);
    }
  }

  if (failures > 0) {
    console.error(`${failures} test(s) failed.`);
    process.exit(1);
  }

  console.log(`${tests.length} test(s) passed.`);
}
