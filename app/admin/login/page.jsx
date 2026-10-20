'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const next = params.get('next');
      router.replace(next?.startsWith('/admin') ? next : '/admin');
      router.refresh();
      return;
    }
    const body = await res.json().catch(() => ({}));
    setError(body.error || 'Login failed.');
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="card w-full max-w-sm p-7">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
        <Lock size={20} aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold">Back office</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage the portfolio.</p>
      <label htmlFor="password" className="label mt-6">
        Password
      </label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        required
      />
      {error ? (
        <p className="mt-3 text-sm text-accent-soft" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn-primary mt-6 w-full justify-center" disabled={busy}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
        Sign in
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
