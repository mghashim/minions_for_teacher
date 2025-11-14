'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateClassForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [timetableColor, setTimetableColor] = useState('#1e40af');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, level, timetableColor }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to create class');
      }
      setName('');
      setSubject('');
      setLevel('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create class');
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow">
      <h2 className="text-lg font-semibold text-slate-900">Create class</h2>
      <label className="block text-sm font-medium text-slate-700" htmlFor="name">
        Name
        <input
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700" htmlFor="subject">
        Subject
        <input
          id="subject"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700" htmlFor="level">
        Level
        <input
          id="level"
          name="level"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700" htmlFor="color">
        Calendar colour
        <input
          id="color"
          name="color"
          type="color"
          value={timetableColor}
          onChange={(event) => setTimetableColor(event.target.value)}
          className="mt-1 h-10 w-20 rounded border border-slate-300"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Create class'}
      </button>
    </form>
  );
}
