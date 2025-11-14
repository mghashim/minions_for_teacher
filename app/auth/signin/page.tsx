'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignInPage() {
  const [email, setEmail] = useState('demo.teacher@example.com');
  const [name, setName] = useState('Demo Teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      name,
      redirect: true,
      callbackUrl: '/',
    });

    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            AI-assisted Teacher Diary
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with your email to access your classes.
          </p>
        </div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Name
          <input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded bg-brand px-4 py-2 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
