'use client';

import { useEffect, useState } from 'react';

interface ReminderToastProps {
  reminder: { type: string; message: string } | null;
}

export function ReminderToast({ reminder }: ReminderToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reminder) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- showing the toast is a side effect of receiving a reminder
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [reminder]);

  if (!reminder || !visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border border-brand bg-white p-4 shadow-lg">
      <p className="text-sm font-semibold text-brand-dark">
        {reminder.type === 'mid_lesson_nudge' ? 'Mid-lesson nudge' : 'Upcoming lesson'}
      </p>
      <p className="text-sm text-slate-700">{reminder.message}</p>
    </div>
  );
}
