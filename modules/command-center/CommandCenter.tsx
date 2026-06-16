'use client';

import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

export function CommandCenter() {
  const { state } = useLanka();
  const openTasks = state.tasks.filter(t => !t.done);
  const selected = state.stickers.filter(s => s.selected).length;
  const queue = state.assemblyQueue.length;
  const criticalKpis = state.kpis.filter(k => k.current < k.target).length;
  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      <SectionTitle eyebrow="00 · Command Center" title="Día operativo" subtitle="El sistema decide dónde mirar: stickers, ensamblaje, tareas, KPIs y recordatorios." />
      <div className="mb-6 grid gap-4 md:grid-cols-5">
        <Card><p className="font-mono text-[10px] uppercase text-[var(--muted)]">Fecha</p><p className="mt-2 text-xl font-black capitalize">{today}</p></Card>
        <Card><p className="font-mono text-[10px] uppercase text-[var(--muted)]">Tareas abiertas</p><p className="mt-2 text-4xl font-black">{openTasks.length}</p></Card>
        <Card><p className="font-mono text-[10px] uppercase text-[var(--muted)]">Stickers seleccionados</p><p className="mt-2 text-4xl font-black">{selected}</p></Card>
        <Card><p className="font-mono text-[10px] uppercase text-[var(--muted)]">En bandeja</p><p className="mt-2 text-4xl font-black">{queue}</p></Card>
        <Card><p className="font-mono text-[10px] uppercase text-[var(--muted)]">KPIs bajo meta</p><p className="mt-2 text-4xl font-black text-[var(--terra)]">{criticalKpis}</p></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-black uppercase">Foco actual</h3>
          <p className="text-sm leading-6 text-[var(--ink2)]">{state.strategy.currentFocus}</p>
        </Card>
        <Card>
          <h3 className="mb-3 font-black uppercase">Actividad reciente</h3>
          <div className="space-y-2">
            {state.activity.slice(0, 6).map((item, i) => <p key={i} className="border-b border-black/10 pb-2 font-mono text-[11px] text-[var(--muted)]">{item}</p>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
