'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Class, LessonPlan } from '@prisma/client';

interface SessionFormProps {
  classes: (Class & { lessonPlans: LessonPlan[] })[];
}

export function SessionForm({ classes }: SessionFormProps) {
  const router = useRouter();
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [planId, setPlanId] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const selectedClass = classes.find((klass) => klass.id === classId);

  if (classes.length === 0) {
    return <p className="text-sm text-slate-600">Create a class before scheduling a session.</p>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, planId: planId || undefined, startDateTime }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to schedule session');
      }
      const session = await response.json();
      router.push(`/sessions/${session.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule session');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-slate-900">Schedule session</h2>
      <label className="block text-sm font-medium text-slate-700" htmlFor="classId">
        Class
        <select
          id="classId"
          name="classId"
          value={classId}
          onChange={(event) => {
            setClassId(event.target.value);
            setPlanId('');
          }}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        >
          {classes.map((klass) => (
            <option key={klass.id} value={klass.id}>
              {klass.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-700" htmlFor="planId">
        Lesson plan (optional)
        <select
          id="planId"
          name="planId"
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        >
          <option value="">No linked plan</option>
          {selectedClass?.lessonPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-slate-700" htmlFor="start">
        Start time
        <input
          id="start"
          name="start"
          type="datetime-local"
          value={startDateTime}
          onChange={(event) => setStartDateTime(event.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? 'Scheduling…' : 'Create session'}
      </button>
    </form>
  );
}
