'use client';

import { useState } from 'react';
import type { LessonPlan } from '@prisma/client';

interface LessonPlanEditorProps {
  initialValue?: Pick<LessonPlan, 'objectives' | 'resources' | 'plannedDurationMins' | 'title'> & {
    timebox?: number;
  };
  onSubmit: (values: {
    title: string;
    objectives: Record<string, unknown>;
    resources: Record<string, unknown>;
    plannedDurationMins: number;
  }) => Promise<void>;
}

const exampleObjectives = {
  focus: ['Introduce new concept', 'Guided practice', 'Exit ticket reflection'],
};

const exampleResources = {
  slides: ['Lesson 3 deck'],
  manipulatives: ['Fraction tiles'],
  digital: ['https://www.khanacademy.org/math'],
};

export function LessonPlanEditor({ initialValue, onSubmit }: LessonPlanEditorProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '');
  const [objectives, setObjectives] = useState(
    JSON.stringify(initialValue?.objectives ?? exampleObjectives, null, 2),
  );
  const [resources, setResources] = useState(
    JSON.stringify(initialValue?.resources ?? exampleResources, null, 2),
  );
  const [plannedDurationMins, setPlannedDurationMins] = useState(
    initialValue?.plannedDurationMins ?? 45,
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      const parsedObjectives = JSON.parse(objectives);
      const parsedResources = JSON.parse(resources);
      setIsSubmitting(true);
      await onSubmit({
        title,
        objectives: parsedObjectives,
        resources: parsedResources,
        plannedDurationMins,
      });
    } catch {
      setError('Objectives and resources must be valid JSON.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="objectives">
          Objectives JSON
        </label>
        <textarea
          id="objectives"
          name="objectives"
          rows={6}
          value={objectives}
          onChange={(event) => setObjectives(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">
          Example: {JSON.stringify(exampleObjectives)}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="resources">
          Resources JSON
        </label>
        <textarea
          id="resources"
          name="resources"
          rows={6}
          value={resources}
          onChange={(event) => setResources(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
        />
        <p className="mt-1 text-xs text-slate-500">
          Example: {JSON.stringify(exampleResources)}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="duration">
          Planned duration (minutes)
        </label>
        <input
          id="duration"
          name="duration"
          type="number"
          min={15}
          step={5}
          value={plannedDurationMins}
          onChange={(event) => setPlannedDurationMins(Number(event.target.value))}
          className="mt-1 w-32 rounded border border-slate-300 px-3 py-2"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Save plan'}
      </button>
    </form>
  );
}
