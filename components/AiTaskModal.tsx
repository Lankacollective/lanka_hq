'use client';

import { useState } from 'react';
import type { GeneratedTask } from '@/app/api/generate-tasks/route';
import type { Owner, Priority } from '@/lib/types';

const OWNERS: Owner[] = ['Paola', 'Mathias', 'Ambos', 'IA'];
const PRIORITIES: Priority[] = ['Alta', 'Media', 'Baja'];

type Props = {
  tasks: GeneratedTask[];
  rationale: string;
  onConfirm: (tasks: GeneratedTask[]) => void;
  onClose: () => void;
};

export function AiTaskModal({ tasks: initial, rationale, onConfirm, onClose }: Props) {
  const [tasks, setTasks] = useState<GeneratedTask[]>(initial);
  const [checked, setChecked] = useState<boolean[]>(initial.map(() => true));

  function updateTask(i: number, patch: Partial<GeneratedTask>) {
    setTasks(ts => ts.map((t, idx) => idx === i ? { ...t, ...patch } : t));
  }

  function removeSubtask(taskIdx: number, subIdx: number) {
    setTasks(ts => ts.map((t, i) => i === taskIdx
      ? { ...t, subtasks: t.subtasks.filter((_, j) => j !== subIdx) }
      : t
    ));
  }

  function handleConfirm() {
    onConfirm(tasks.filter((_, i) => checked[i]));
  }

  const selectedCount = checked.filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--acid)] bg-[var(--surface)] shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--surface)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">✦ IA generó {tasks.length} tareas</p>
              <p className="mt-0.5 text-xs text-[var(--muted)]">{rationale}</p>
            </div>
            <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--ink)] text-lg">✕</button>
          </div>
        </div>

        {/* Task list */}
        <div className="divide-y divide-[var(--line)]">
          {tasks.map((task, i) => (
            <div key={i} className={`px-5 py-4 transition-opacity ${checked[i] ? '' : 'opacity-40'}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={e => setChecked(ch => ch.map((v, j) => j === i ? e.target.checked : v))}
                  className="mt-1 h-4 w-4 flex-shrink-0 accent-[var(--acid)]"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  {/* Title */}
                  <input
                    value={task.title}
                    onChange={e => updateTask(i, { title: e.target.value })}
                    className="w-full bg-transparent font-bold text-[var(--ink)] outline-none text-sm"
                  />

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={task.owner}
                      onChange={e => updateTask(i, { owner: e.target.value as Owner })}
                      className="border border-[var(--line)] bg-[var(--surface2)] px-2 py-1 font-mono text-[10px] text-[var(--ink)] outline-none"
                    >
                      {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select
                      value={task.priority}
                      onChange={e => updateTask(i, { priority: e.target.value as Priority })}
                      className="border border-[var(--line)] bg-[var(--surface2)] px-2 py-1 font-mono text-[10px] text-[var(--ink)] outline-none"
                    >
                      {PRIORITIES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={task.dueAt ?? ''}
                      onChange={e => updateTask(i, { dueAt: e.target.value || undefined })}
                      className="border border-[var(--line)] bg-[var(--surface2)] px-2 py-1 font-mono text-[10px] text-[var(--ink)] outline-none"
                    />
                  </div>

                  {/* Subtasks */}
                  {task.subtasks.length > 0 && (
                    <div className="space-y-1 border-l-2 border-[var(--line)] pl-3">
                      {task.subtasks.map((sub, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span className="flex-1 font-mono text-[10px] text-[var(--muted)]">↳ {sub}</span>
                          <button
                            onClick={() => removeSubtask(i, j)}
                            className="text-[var(--muted)] hover:text-[var(--signal)] text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[var(--line)] bg-[var(--surface)] px-5 py-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-[var(--muted)]">
            {selectedCount} de {tasks.length} tareas seleccionadas
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="bg-[var(--acid)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black disabled:opacity-40"
            >
              Guardar {selectedCount > 0 ? `${selectedCount} tarea${selectedCount !== 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
