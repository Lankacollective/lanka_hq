'use client';

import { useState } from 'react';
import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { Owner, Task } from '@/lib/types';

const OWNERS: Owner[] = ['Paola', 'Mathias', 'Ambos', 'IA'];
const PRIORITIES = ['Alta', 'Media', 'Baja'] as const;

// ─── TaskRow: tarea raíz con edición inline y subtareas ───────────────────────

function TaskRow({ task, depth = 0 }: { task: Task; depth?: number }) {
  const { state, updateTask, deleteTask, addTask } = useLanka();
  const [expanded, setExpanded] = useState(false);
  const [addingSub, setAddingSub] = useState(false);
  const [subTitle, setSubTitle] = useState('');

  const subtasks = state.tasks.filter(t => t.parentId === task.id);
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = !task.done && task.dueAt && task.dueAt < today;

  function submitSub(e: React.FormEvent) {
    e.preventDefault();
    if (!subTitle.trim()) return;
    addTask(subTitle.trim(), {
      owner: task.owner,
      priority: task.priority,
      parentId: task.id,
      status: task.status,
    });
    setSubTitle('');
    setAddingSub(false);
  }

  return (
    <div style={{ marginLeft: depth * 20 }}>
      <div
        className={`mb-1 border-l-[3px] bg-[var(--surface2)] p-3 ${
          task.done
            ? 'border-l-[var(--muted)] opacity-50'
            : isOverdue
            ? 'border-l-[var(--signal)]'
            : depth > 0
            ? 'border-l-[var(--primary)]'
            : 'border-l-[var(--acid)]'
        }`}
      >
        {/* Top row: checkbox + title + actions */}
        <div className="flex items-start gap-2">
          <button
            onClick={() => updateTask(task.id, { done: !task.done, status: task.done ? 'today' : 'done' })}
            className={`mt-0.5 h-4 w-4 flex-shrink-0 border-2 transition ${
              task.done ? 'border-[var(--acid)] bg-[var(--acid)]' : 'border-[var(--muted)] hover:border-[var(--acid)]'
            }`}
          />
          <div className="min-w-0 flex-1">
            <input
              value={task.title}
              onChange={e => updateTask(task.id, { title: e.target.value })}
              className={`w-full bg-transparent font-bold text-[var(--ink)] outline-none ${
                task.done ? 'line-through' : ''
              } ${depth > 0 ? 'text-sm' : 'text-base'}`}
            />
            <div className="mt-0.5 flex flex-wrap items-center gap-2 font-mono text-[10px] text-[var(--muted)]">
              <span className={task.owner === 'Paola' ? 'text-[var(--acid)]' : task.owner === 'Mathias' ? 'text-[var(--primary)]' : ''}>
                {task.owner}
              </span>
              <span>·</span>
              <span className={task.priority === 'Alta' ? 'text-[var(--signal)]' : ''}>{task.priority}</span>
              {task.dueAt && (
                <>
                  <span>·</span>
                  <span className={isOverdue ? 'text-[var(--signal)]' : ''}>
                    {isOverdue ? '⚠ ' : ''}{new Date(task.dueAt + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </span>
                </>
              )}
              {subtasks.length > 0 && (
                <>
                  <span>·</span>
                  <span>{subtasks.filter(s => s.done).length}/{subtasks.length} subtareas</span>
                  <div className="inline-flex h-1.5 w-12 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-[var(--acid)] transition-all"
                      style={{ width: `${Math.round(subtasks.filter(s => s.done).length / subtasks.length * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-shrink-0 gap-1">
            <button
              onClick={() => setExpanded(v => !v)}
              className="px-2 py-1 font-mono text-[10px] text-[var(--muted)] hover:text-[var(--ink)]"
              title="Editar"
            >
              {expanded ? '▲' : '✎'}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="px-2 py-1 font-mono text-[10px] text-[var(--muted)] hover:text-[var(--signal)]"
              title="Eliminar"
            >
              ×
            </button>
          </div>
        </div>

        {/* Inline edit panel */}
        {expanded && (
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-3 md:grid-cols-4">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase text-[var(--muted)]">Responsable</p>
              <select
                value={task.owner}
                onChange={e => updateTask(task.id, { owner: e.target.value as Owner })}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
              >
                {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase text-[var(--muted)]">Prioridad</p>
              <select
                value={task.priority}
                onChange={e => updateTask(task.id, { priority: e.target.value as Task['priority'] })}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase text-[var(--muted)]">Fecha límite</p>
              <input
                type="date"
                value={task.dueAt ?? ''}
                onChange={e => updateTask(task.id, { dueAt: e.target.value || undefined })}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-2 py-1 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
              />
            </div>
            <div className="flex items-end">
              {depth === 0 && (
                <button
                  onClick={() => { setAddingSub(true); setExpanded(false); }}
                  className="w-full border border-[var(--primary)] px-2 py-1 font-mono text-[10px] uppercase text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                >
                  + Subtarea
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtasks */}
      {subtasks.map(sub => (
        <TaskRow key={sub.id} task={sub} depth={depth + 1} />
      ))}

      {/* Add subtask form */}
      {addingSub && (
        <form
          onSubmit={submitSub}
          className="mb-1 ml-5 flex gap-2"
          style={{ marginLeft: 20 }}
        >
          <input
            autoFocus
            value={subTitle}
            onChange={e => setSubTitle(e.target.value)}
            placeholder="Nueva subtarea..."
            className="min-w-0 flex-1 border border-[var(--primary)] bg-[var(--surface)] px-2 py-1.5 font-mono text-[11px] text-[var(--ink)] outline-none"
          />
          <button type="submit" className="bg-[var(--primary)] px-3 py-1.5 font-mono text-[10px] font-bold text-white">↵</button>
          <button type="button" onClick={() => setAddingSub(false)} className="px-2 py-1.5 font-mono text-[10px] text-[var(--muted)]">✕</button>
        </form>
      )}
    </div>
  );
}

// ─── Owner section ─────────────────────────────────────────────────────────────

function OwnerSection({ owner, tasks }: { owner: Owner; tasks: Task[] }) {
  const [addingTask, setAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { addTask } = useLanka();

  const rootTasks = tasks.filter(t => !t.parentId);
  if (rootTasks.length === 0 && !addingTask) return null;

  const colorClass =
    owner === 'Paola'   ? 'text-[var(--acid)]' :
    owner === 'Mathias' ? 'text-[var(--primary)]' :
    owner === 'Ambos'   ? 'text-[var(--amber)]' :
                          'text-[var(--muted)]';

  function submitTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), { owner, status: 'today' });
    setNewTitle('');
    setAddingTask(false);
  }

  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${colorClass}`}>
          {owner} · {rootTasks.length} tarea{rootTasks.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setAddingTask(v => !v)}
          className="font-mono text-[10px] text-[var(--muted)] hover:text-[var(--acid)]"
        >
          + tarea
        </button>
      </div>

      {addingTask && (
        <form onSubmit={submitTask} className="mb-2 flex gap-2">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder={`Nueva tarea para ${owner}...`}
            className="min-w-0 flex-1 border border-[var(--acid)] bg-[var(--surface)] px-2 py-1.5 font-mono text-[11px] text-[var(--ink)] outline-none"
          />
          <button type="submit" className="bg-[var(--acid)] px-3 py-1.5 font-mono text-[10px] font-bold text-black">↵</button>
          <button type="button" onClick={() => setAddingTask(false)} className="px-2 py-1.5 font-mono text-[10px] text-[var(--muted)]">✕</button>
        </form>
      )}

      {rootTasks.map(t => <TaskRow key={t.id} task={t} />)}
    </div>
  );
}

// ─── Main Hoy view ────────────────────────────────────────────────────────────

export function Hoy() {
  const { state, setState } = useLanka();
  const today = new Date().toISOString().slice(0, 10);

  const showDone = state.config.showDoneTasksInHoy;
  const visibleTasks = state.tasks.filter(t => showDone ? true : !t.done);
  const activeTasks = visibleTasks.filter(t => !t.done);
  const overdueTasks = activeTasks.filter(t => t.dueAt && t.dueAt < today);
  const dateLabel = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  const priorityOrder: Record<string, number> = { Alta: 0, Media: 1, Baja: 2 };

  function sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // Overdue first
      const aOver = !a.done && a.dueAt && a.dueAt < today ? 0 : 1;
      const bOver = !b.done && b.dueAt && b.dueAt < today ? 0 : 1;
      if (aOver !== bOver) return aOver - bOver;
      // Then by priority
      const pDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
      if (pDiff !== 0) return pDiff;
      // Then by dueAt (nearest first)
      if (a.dueAt && b.dueAt) return a.dueAt.localeCompare(b.dueAt);
      if (a.dueAt) return -1;
      if (b.dueAt) return 1;
      return 0;
    });
  }

  // Tasks visible in Hoy: non-done root tasks by owner, sorted
  const tasksByOwner = OWNERS.map(owner => ({
    owner,
    tasks: sortTasks(visibleTasks.filter(t => t.owner === owner)),
  })).filter(g => g.tasks.length > 0);

  return (
    <div>
      <SectionTitle eyebrow="01 · Hoy" title="Centro de mando" />

      {/* ── Stats ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Fecha</p>
          <p className="mt-2 text-base font-black capitalize leading-tight">{dateLabel}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Tareas activas</p>
          <p className="mt-2 text-4xl font-black">{activeTasks.filter(t => !t.parentId).length}</p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Vencidas</p>
          <p className={`mt-2 text-4xl font-black ${overdueTasks.length > 0 ? 'text-[var(--signal)]' : ''}`}>
            {overdueTasks.length}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Completadas</p>
          <p className="mt-2 text-4xl font-black text-[var(--muted)]">
            {state.tasks.filter(t => t.done && !t.parentId).length}
          </p>
        </Card>
      </div>

      {/* ── Tasks by owner ── */}
      <Card className="mb-4">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Tareas · por responsable
        </p>
        {activeTasks.filter(t => !t.parentId).length === 0 ? (
          <p className="border-l-4 border-[var(--acid)] bg-[rgba(191,255,0,.06)] p-3 text-sm text-[var(--muted)]">
            Sin tareas activas. Captura algo en el Board → ensambla → convierte en tarea.
          </p>
        ) : (
          tasksByOwner.map(g => (
            <OwnerSection key={g.owner} owner={g.owner} tasks={g.tasks} />
          ))
        )}
      </Card>

      {/* ── KPIs — solo indicadores actualizables, sin crear tareas ── */}
      {state.kpis.some(k => k.target > 0) && (
        <Card>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
            KPIs · actualiza el valor actual
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {state.kpis.map(kpi => {
              const ratio = kpi.target ? Math.min(100, Math.round((kpi.current / kpi.target) * 100)) : 0;
              const danger = ratio < 60 && kpi.target > 0;
              return (
                <div key={kpi.id} className="border border-[var(--line)] p-3">
                  <p className="font-mono text-[10px] uppercase text-[var(--muted)]">{kpi.label}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <input
                      type="number"
                      value={kpi.current}
                      onChange={e => setState(s => ({
                        ...s,
                        kpis: s.kpis.map(x => x.id === kpi.id ? { ...x, current: Number(e.target.value) } : x),
                      }))}
                      className="w-20 bg-transparent text-3xl font-black text-[var(--ink)] outline-none"
                    />
                    <span className="font-mono text-[10px] text-[var(--muted)]">/ {kpi.target} {kpi.unit}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/10">
                    <div
                      className={`h-1.5 transition-all ${danger ? 'bg-[var(--signal)]' : 'bg-[var(--acid)]'}`}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <p className={`mt-1 font-mono text-[10px] ${danger ? 'text-[var(--signal)]' : 'text-[var(--muted)]'}`}>
                    {ratio}% de meta{danger ? ' — bajo objetivo' : ''}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--muted)]">
            Para configurar metas → <span className="text-[var(--ink)]">Sistema › Métricas</span>
          </p>
        </Card>
      )}
    </div>
  );
}
