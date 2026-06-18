'use client';

import { Card } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

export function Hoy() {
  const { state, addTask, updateTask } = useLanka();
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = state.tasks.filter(t => !t.done && (t.status === 'today' || t.dueAt === today));
  const overdue    = state.tasks.filter(t => !t.done && t.dueAt && t.dueAt < today);
  const criticalKpis = state.kpis.filter(k => k.target > 0 && k.current / k.target < 0.6);
  const dateLabel = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div>
      {/* ── Stat cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Fecha</p>
          <p className="mt-2 text-base font-black capitalize leading-tight text-[var(--ink)]">{dateLabel}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Tareas hoy</p>
          <p className="mt-2 text-4xl font-black text-[var(--ink)]">{todayTasks.length}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Vencidas</p>
          <p className={`mt-2 text-4xl font-black ${overdue.length > 0 ? 'text-[var(--terra)]' : 'text-[var(--ink)]'}`}>{overdue.length}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">KPIs bajo meta</p>
          <p className={`mt-2 text-4xl font-black ${criticalKpis.length > 0 ? 'text-[var(--terra)]' : 'text-[var(--ink)]'}`}>{criticalKpis.length}</p>
        </Card>
      </div>

      {/* ── Task list ── */}
      <Card className="mb-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">Tareas de hoy</p>
        {todayTasks.length === 0 && overdue.length === 0 ? (
          <p className="border-l-4 border-[var(--ink2)] bg-[rgba(191,255,0,.08)] p-3 text-sm text-[var(--ink)]">
            Nada urgente. Ve al Board a capturar.
          </p>
        ) : (
          <div className="space-y-2">
            {[...overdue, ...todayTasks].map(t => (
              <div
                key={t.id}
                className={`flex items-start gap-3 bg-[var(--surface2)] p-3 ${
                  t.dueAt && t.dueAt < today
                    ? 'border-l-4 border-l-[var(--terra)]'
                    : 'border-l-4 border-l-[var(--ink2)]'
                }`}
              >
                <button
                  onClick={() => updateTask(t.id, { done: true, status: 'done' })}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 border-2 border-[var(--ink)] hover:border-[var(--ink2)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight text-[var(--ink)]">{t.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-[var(--muted)]">
                    {t.owner} · {t.priority}{t.dueAt && t.dueAt < today ? ' · VENCIDA' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Critical KPIs ── */}
      {criticalKpis.length > 0 && (
        <Card className="mb-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terra)]">KPIs bajo meta</p>
          <div className="grid gap-3 md:grid-cols-2">
            {criticalKpis.map(kpi => {
              const ratio = Math.min(100, Math.round((kpi.current / kpi.target) * 100));
              return (
                <div key={kpi.id} className="flex items-center justify-between gap-3 border border-[var(--line)] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--ink)]">{kpi.label}</p>
                    <p className="font-mono text-[10px] text-[var(--muted)]">
                      {kpi.current} / {kpi.target} {kpi.unit} · {ratio}%
                    </p>
                    <div className="mt-2 h-1.5 bg-white/10">
                      <div className="h-1.5 bg-[var(--terra)]" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => addTask(`Subir KPI: ${kpi.label}`, { status: 'today', priority: 'Alta', source: `kpi:${kpi.id}` })}
                    className="flex-shrink-0 border border-[var(--terra)] px-3 py-2 font-mono text-[10px] font-bold uppercase text-[var(--terra)] hover:bg-[var(--terra)] hover:text-white"
                  >
                    + Tarea
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--muted)]">
            Para actualizar métricas → <span className="font-bold text-[var(--ink)]">Sistema › Métricas</span>
          </p>
        </Card>
      )}

      {/* ── Activity log ── */}
      {state.activity.length > 0 && (
        <Card>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">Actividad reciente</p>
          <div className="space-y-1">
            {state.activity.slice(0, 8).map((item, i) => (
              <p key={i} className="border-b border-[var(--line)] pb-2 font-mono text-[11px] text-[var(--muted)]">{item}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
