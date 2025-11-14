interface Suggestion {
  title: string;
  timeBreakdown: { minutes: number; activity: string; materials: string }[];
  differentiation: { group: string; strategy: string }[];
  assessment: { type: string; when: string }[];
  homeworkSuggestion: string;
  rationale: string;
}

export function AiSuggestionCard({ suggestion }: { suggestion: Suggestion | null }) {
  if (!suggestion) {
    return (
      <div className="rounded-lg border border-dashed border-brand p-4 text-sm text-slate-600">
        Request an AI plan to see a suggested lesson flow.
      </div>
    );
  }

  return (
    <article className="space-y-4 rounded-lg border border-brand bg-white p-4 shadow">
      <header>
        <h3 className="text-lg font-semibold text-brand-dark">{suggestion.title}</h3>
        <p className="text-sm text-slate-600">{suggestion.rationale}</p>
      </header>
      <section>
        <h4 className="font-medium text-slate-900">Time breakdown</h4>
        <ul className="mt-2 space-y-2 text-sm text-slate-700">
          {suggestion.timeBreakdown.map((item, index) => (
            <li key={`${item.activity}-${index}`} className="flex items-start justify-between gap-3">
              <span className="font-medium text-slate-900">{item.activity}</span>
              <span className="text-xs text-slate-500">{item.minutes} mins</span>
              <span className="flex-1 text-right text-xs text-slate-500">{item.materials}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-slate-900">Differentiation</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {suggestion.differentiation.map((item, index) => (
            <li key={`${item.group}-${index}`}>
              <span className="font-semibold">{item.group}:</span> {item.strategy}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-slate-900">Assessment</h4>
        <ul className="mt-2 space-y-1 text-sm text-slate-700">
          {suggestion.assessment.map((item, index) => (
            <li key={`${item.type}-${index}`}>
              {item.type} – {item.when}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-slate-900">Homework suggestion</h4>
        <p className="text-sm text-slate-700">{suggestion.homeworkSuggestion}</p>
      </section>
    </article>
  );
}
