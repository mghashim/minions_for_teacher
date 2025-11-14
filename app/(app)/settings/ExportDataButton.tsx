'use client';

import { useState } from 'react';

export function ExportDataButton() {
  const [status, setStatus] = useState<string>('');

  const handleExport = async () => {
    setStatus('Preparing export…');
    const response = await fetch('/api/export');
    if (!response.ok) {
      setStatus('Failed to export');
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teacher-diary-export.json';
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Export downloaded');
  };

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={handleExport}
        className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
      >
        Export data (JSON)
      </button>
      <p className="text-xs text-slate-500">{status}</p>
    </div>
  );
}
