import { prisma } from '@/lib/prisma';
import { requireTeacher } from '@/lib/auth/session';
import { SyncGoogleButton } from './SyncGoogleButton';
import { ExportDataButton } from './ExportDataButton';

export default async function SettingsPage() {
  const teacher = await requireTeacher();
  const integrations = await prisma.integrationToken.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Manage your profile, AI preferences, and calendar integration.
        </p>
      </header>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-600">{teacher.name}</p>
          <p className="text-sm text-slate-500">{teacher.email}</p>
          <p className="text-xs text-slate-400">Role: Teacher</p>
        </article>
        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">AI preferences</h2>
          <p className="text-sm text-slate-600">
            AI lesson planning is {process.env.OPENAI_API_KEY ? 'enabled' : 'running in fallback mode'}.
          </p>
          <p className="text-xs text-slate-500">
            Provide an OpenAI API key in your environment to use live suggestions.
          </p>
        </article>
        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Calendar sync</h2>
          <SyncGoogleButton teacherId={teacher.id} />
          <ul className="text-xs text-slate-500">
            {integrations.length === 0 ? (
              <li>No integration tokens stored.</li>
            ) : (
              integrations.map((integration) => (
                <li key={integration.id}>
                  {integration.provider} connected {integration.createdAt.toDateString()}
                </li>
              ))
            )}
          </ul>
        </article>
        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Export</h2>
          <ExportDataButton />
        </article>
      </section>
    </div>
  );
}
