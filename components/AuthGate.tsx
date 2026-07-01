'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const PUBLIC_PATHS = ['/diagnostico'];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some(p => pathname?.startsWith(p));

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!isPublic);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isPublic) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [isPublic]);

  if (isPublic) return <>{children}</>;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError('Credenciales inválidas.');
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <span className="text-sm opacity-60">Cargando…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8"
        >
          <h1 className="mb-1 text-xl font-bold text-white">LANKA HQ</h1>
          <p className="mb-6 text-sm text-white/50">Acceso restringido al equipo.</p>

          <label className="mb-1 block text-xs text-white/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          />

          <label className="mb-1 block text-xs text-white/60">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
          />

          {error && <p className="mb-4 text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-white py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
