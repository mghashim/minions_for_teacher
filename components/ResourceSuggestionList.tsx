interface ResourceSuggestionListProps {
  enabled: boolean;
  resources: { title: string; url: string }[];
}

export function ResourceSuggestionList({ enabled, resources }: ResourceSuggestionListProps) {
  if (!enabled) {
    return (
      <div className="rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        Enable AI resource suggestions in settings to see curated links.
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded border border-slate-200 bg-white p-4 shadow">
      <h3 className="text-sm font-semibold text-slate-900">Suggested resources</h3>
      <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
        {resources.map((resource) => (
          <li key={resource.url}>
            <a href={resource.url} target="_blank" rel="noreferrer">
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
