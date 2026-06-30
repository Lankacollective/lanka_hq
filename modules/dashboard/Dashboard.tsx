'use client';

import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

export function Dashboard() {
  const { state, setState, addTask } = useLanka();
  return (
    <div>
      <SectionTitle eyebrow="02 · CEO Dashboard" title="KPIs que empujan acciones" subtitle="Si un indicador está bajo meta, se convierte en tarea. No se queda como dato muerto." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {state.kpis.map(kpi => {
          const ratio = kpi.target ? Math.min(100, Math.round((kpi.current / kpi.target) * 100)) : 0;
          const danger = ratio < 60;
          return (
            <Card key={kpi.id} className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase text-[var(--muted)]">{kpi.label}</p>
              <input
                type="number"
                value={kpi.current}
                onChange={e => setState(s => ({ ...s, kpis: s.kpis.map(x => x.id === kpi.id ? { ...x, current: Number(e.target.value) } : x) }))}
                className="w-full bg-transparent text-4xl font-black text-[var(--ink)] outline-none"
              />
              <p className="font-mono text-[10px] text-[var(--muted)]">Meta: {kpi.target} {kpi.unit}</p>
              <div className="h-2 bg-white/10"><div className={`h-2 ${danger ? 'bg-[var(--terra)]' : 'bg-[var(--green)]'}`} style={{ width: `${ratio}%` }} /></div>
              {danger && <button onClick={() => addTask(`Subir KPI: ${kpi.label}`, { status: 'today', priority: 'Alta', source: `kpi:${kpi.id}` })} className="border border-[var(--terra)] px-3 py-2 font-mono text-[10px] font-bold uppercase text-[var(--terra)]">Crear tarea crítica</button>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
