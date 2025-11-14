const locale = 'en-US';
const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
const dayFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric' });
const timeFormatter = new Intl.DateTimeFormat(locale, {
  hour: 'numeric',
  minute: '2-digit',
});

type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  return input instanceof Date ? new Date(input.getTime()) : new Date(input);
}

type SupportedFormat = 'EEE, MMM d' | 'p' | 'EEE p' | 'EEE d MMM p';

export function format(input: DateInput, pattern: SupportedFormat): string {
  const date = toDate(input);
  switch (pattern) {
    case 'EEE, MMM d':
      return `${weekdayFormatter.format(date)}, ${monthFormatter.format(date)} ${dayFormatter.format(date)}`;
    case 'EEE p':
      return `${weekdayFormatter.format(date)} ${timeFormatter.format(date)}`;
    case 'EEE d MMM p':
      return `${weekdayFormatter.format(date)} ${dayFormatter.format(date)} ${monthFormatter.format(date)} ${timeFormatter.format(date)}`;
    case 'p':
    default:
      return timeFormatter.format(date);
  }
}

export function addDays(input: DateInput, amount: number): Date {
  const date = toDate(input);
  date.setDate(date.getDate() + amount);
  return date;
}

export function differenceInMinutes(later: DateInput, earlier: DateInput): number {
  const end = toDate(later).getTime();
  const start = toDate(earlier).getTime();
  return Math.trunc((end - start) / 60000);
}

export function isBefore(dateInput: DateInput, comparisonInput: DateInput): boolean {
  return toDate(dateInput).getTime() < toDate(comparisonInput).getTime();
}

export function isSameDay(leftInput: DateInput, rightInput: DateInput): boolean {
  const left = toDate(leftInput);
  const right = toDate(rightInput);
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function setHours(input: DateInput, hours: number): Date {
  const date = toDate(input);
  date.setHours(hours);
  return date;
}

export function setMinutes(input: DateInput, minutes: number): Date {
  const date = toDate(input);
  date.setMinutes(minutes);
  return date;
}
