'use client';

import { useState } from 'react';

export function SyncGoogleButton({ teacherId }: { teacherId: string }) {
  const [status, setStatus] = useState<string>('Not synced');
  const [pending, setPending] = useState(false);

  const handleSync = async () => {
    setPending(true);
    try {
      const response = await fetch('/api/integrations/google/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'Sync failed');
      }
      setStatus(data.status ?? 'Synced');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Sync failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSync}
        disabled={pending}
        className="rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? 'Syncing…' : 'Sync with Google Calendar'}
      </button>
      <p className="text-xs text-slate-500">Status: {status}</p>
    </div>
  );
}
