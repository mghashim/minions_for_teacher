'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { clsx } from '../lib/clsx';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/classes', label: 'Classes' },
  { href: '/plans/new', label: 'New Plan' },
  { href: '/sessions/new', label: 'Schedule Session' },
  { href: '/settings', label: 'Settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-semibold text-brand">
            Teacher Diary
          </Link>
          <nav className="flex items-center gap-3 text-sm font-medium text-slate-600">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'rounded px-3 py-2 transition-colors hover:bg-slate-100 hover:text-slate-900',
                  pathname === link.href && 'bg-brand/10 text-brand-dark',
                )}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => startTransition(() => {
                void signOut({ callbackUrl: '/auth/signin' });
              })}
              className="rounded bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300"
              disabled={pending}
            >
              {pending ? 'Signing out…' : 'Sign out'}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
