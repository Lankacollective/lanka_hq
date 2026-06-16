'use client';

import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import { requestPushPermission } from '@/lib/pushClient';

export function Automations() {
  const { state } = useLanka();
  return (
    <div>
      <SectionTitle eyebrow="05 · Automatizaciones" title="Recordatorios de verdad" subtitle="El navegador abierto sirve para prototipo; producción necesita Service Worker + Push + Cron + base de datos." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-black uppercase">Activar push del dispositivo</h3>
          <p className="mb-4 text-sm leading-6 text-[var(--muted)]">Requiere HTTPS y backend conectado. En local solo registra el service worker y prueba permisos.</p>
          <button onClick={requestPushPermission} className="border border-[var(--ink)] bg-[var(--ink)] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">Solicitar permiso</button>
        </Card>
        <Card>
          <h3 className="mb-3 font-black uppercase">Recordatorios próximos</h3>
          {state.reminders.length === 0 ? <p className="text-sm text-[var(--muted)]">Todavía no hay recordatorios.</p> : state.reminders.map(r => <p key={r.id} className="border-b border-black/10 py-2 text-sm"><strong>{r.title}</strong><br /><span className="font-mono text-[10px] text-[var(--muted)]">{new Date(r.dueAt).toLocaleString('es-MX')}</span></p>)}
        </Card>
      </div>
    </div>
  );
}
