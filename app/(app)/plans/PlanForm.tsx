'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LessonPlanEditor } from '@/components/LessonPlanEditor';

interface PlanFormProps {
  classId: string;
  planId?: string;
  initial?: {
    title: string;
    objectives: Record<string, unknown>;
    resources: Record<string, unknown>;
    plannedDurationMins: number;
  };
}

export function PlanForm({ classId, planId, initial }: PlanFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <LessonPlanEditor
        initialValue={initial}
        onSubmit={async (values) => {
          setError('');
          const endpoint = planId ? `/api/plans/${planId}` : `/api/classes/${classId}/plans`;
          const response = await fetch(endpoint, {
            method: planId ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            const data = await response.json();
            setError(data.error ?? 'Failed to save plan');
            return;
          }
          router.push(`/classes/${classId}`);
          router.refresh();
        }}
      />
    </div>
  );
}
