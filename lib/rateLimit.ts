const requestCounts = new Map<string, { count: number; expires: number }>();

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const entry = requestCounts.get(key);
  const now = Date.now();
  if (!entry || entry.expires < now) {
    requestCounts.set(key, { count: 1, expires: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count += 1;
  requestCounts.set(key, entry);
  return true;
}
