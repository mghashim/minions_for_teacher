'use client';

import { useEffect, useMemo, useState } from 'react';
import { format } from '@/lib/date';
import { AiSuggestionCard } from '@/components/AiSuggestionCard';
import { ProgressNoteForm } from '@/components/ProgressNoteForm';
import { ResourceSuggestionList } from '@/components/ResourceSuggestionList';

type SessionPayload = {
  id: string;
  classId: string;
  className: string;
  planTitle?: string;
  planObjectives?: Record<string, unknown>;
  latestProgress?: { summary: string; createdAt: string } | null;
  startDateTime: string;
  status: string;
};

type Suggestion = {
  title: string;
  timeBreakdown: { minutes: number; activity: string; materials: string }[];
  differentiation: { group: string; strategy: string }[];
  assessment: { type: string; when: string }[];
  homeworkSuggestion: string;
  rationale: string;
};

const nudges = ['On track', 'Behind', 'Skip'];

export function LiveLessonClient({
  session,
  defaultTimebox,
  resourceSuggestionsEnabled,
}: {
  session: SessionPayload;
  defaultTimebox: number;
  resourceSuggestionsEnabled: boolean;
}) {
  const [timebox, setTimebox] = useState(defaultTimebox);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [resourceToggle, setResourceToggle] = useState(resourceSuggestionsEnabled);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(session.startDateTime).getTime();
    setElapsed(Math.max(0, Math.round((Date.now() - start) / 60000)));
    const interval = setInterval(() => {
      setElapsed(Math.max(0, Math.round((Date.now() - start) / 60000)));
    }, 60000);
    return () => clearInterval(interval);
  }, [session.startDateTime]);

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(''), 4000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [toastMessage]);

  const objectivesList = useMemo(() => {
    const objectives = session.planObjectives ?? {};
    if (Array.isArray(objectives)) {
      return objectives.join(', ');
    }
    if ('focus' in objectives && Array.isArray((objectives as Record<string, unknown>).focus)) {
      return ((objectives as { focus: string[] }).focus).join(', ');
    }
    return JSON.stringify(objectives);
  }, [session.planObjectives]);

  const requestSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const response = await fetch('/api/ai/suggest-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: session.classId, sessionId: session.id, timeboxMins: timebox }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch suggestion');
      }
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Failed to fetch suggestion');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleProgressSave = async (payload: {
    summary: string;
    assignmentsGiven: Record<string, unknown>;
    nextFocus: string;
  }) => {
    const response = await fetch(`/api/sessions/${session.id}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error ?? 'Failed to save progress');
    }
    setToastMessage('Progress note saved');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
      <section className="space-y-4">
        <header className="rounded-lg border border-slate-200 bg-white p-4 shadow">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{session.className}</h1>
              <p className="text-sm text-slate-600">
                {session.planTitle ?? 'Ad-hoc session'} – {format(new Date(session.startDateTime), 'EEE p')}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Status: {session.status.replace('_', ' ')}</p>
              <p>Elapsed: {elapsed} mins</p>
            </div>
          </div>
        </header>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Objectives</h2>
          <p className="mt-2 text-sm text-slate-600">{objectivesList}</p>
          {session.latestProgress ? (
            <p className="mt-4 text-xs text-slate-500">
              Last note ({format(new Date(session.latestProgress.createdAt), 'EEE p')}):
              {' '}
              {session.latestProgress.summary}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setTimebox(mins)}
                className={`rounded px-3 py-1 text-sm ${
                  timebox === mins ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {mins} mins
              </button>
            ))}
            <button
              type="button"
              onClick={requestSuggestion}
              disabled={loadingSuggestion}
              className="rounded bg-brand px-3 py-1 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {loadingSuggestion ? 'Requesting…' : 'Get AI plan'}
            </button>
          </div>
        </div>
        <AiSuggestionCard suggestion={suggestion} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Checkpoint</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {nudges.map((nudge) => (
              <button
                key={nudge}
                type="button"
                onClick={() => setToastMessage(`${nudge} recorded`)}
                className="rounded border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
              >
                {nudge}
              </button>
            ))}
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Quick note</h2>
          <ProgressNoteForm onSave={handleProgressSave} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={resourceToggle}
              onChange={(event) => setResourceToggle(event.target.checked)}
            />
            Enable AI resource suggestions
          </label>
          <div className="mt-3">
            <ResourceSuggestionList
              enabled={resourceToggle}
              resources={[
                { title: 'Khan Academy practice set', url: 'https://www.khanacademy.org/' },
                { title: 'Teacher reference guide', url: 'https://www.teacher.org/' },
              ]}
            />
          </div>
        </div>
      </aside>
      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 rounded bg-slate-900 px-4 py-2 text-center text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
