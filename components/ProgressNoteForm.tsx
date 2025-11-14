'use client';

import { useState } from 'react';

interface ProgressNoteFormProps {
  onSave: (payload: {
    summary: string;
    assignmentsGiven: Record<string, unknown>;
    nextFocus: string;
  }) => Promise<void>;
}

const defaultAssignments = { tasks: ['Complete exit ticket', 'Review notes'] };

export function ProgressNoteForm({ onSave }: ProgressNoteFormProps) {
  const [summary, setSummary] = useState('');
  const [assignments, setAssignments] = useState(
    JSON.stringify(defaultAssignments, null, 2),
  );
  const [nextFocus, setNextFocus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const parsedAssignments = JSON.parse(assignments);
      setIsSaving(true);
      await onSave({
        summary,
        assignmentsGiven: parsedAssignments,
        nextFocus,
      });
      setSummary('');
      setNextFocus('');
    } catch {
      setError('Assignments must be valid JSON.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="summary">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={4}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="assignments">
          Assignments (JSON)
        </label>
        <textarea
          id="assignments"
          name="assignments"
          rows={4}
          value={assignments}
          onChange={(event) => setAssignments(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="nextFocus">
          Next focus
        </label>
        <input
          id="nextFocus"
          name="nextFocus"
          value={nextFocus}
          onChange={(event) => setNextFocus(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isSaving}
        className="rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {isSaving ? 'Saving…' : 'Save note'}
      </button>
    </form>
  );
}
