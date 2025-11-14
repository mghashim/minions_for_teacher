export function clsx(
  ...values: Array<string | null | undefined | false>
): string {
  return values.filter((value): value is string => Boolean(value && value.trim().length)).join(' ');
}
