'use client';

import { useState } from 'react';
import type { Class } from '@prisma/client';
import { PlanForm } from './PlanForm';

export function PlanCreator({ classes }: { classes: Class[] }) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id ?? '');

  if (classes.length === 0) {
    return <p className="text-sm text-slate-600">Create a class before adding a plan.</p>;
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700" htmlFor="classId">
        Class
        <select
          id="classId"
          name="classId"
          value={selectedClassId}
          onChange={(event) => setSelectedClassId(event.target.value)}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        >
          {classes.map((klass) => (
            <option key={klass.id} value={klass.id}>
              {klass.name}
            </option>
          ))}
        </select>
      </label>
      {selectedClassId ? <PlanForm classId={selectedClassId} /> : null}
    </div>
  );
}
