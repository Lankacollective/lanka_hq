'use client';

import { useState } from 'react';
import { useLanka } from '@/lib/store';
import type { AssemblyKind, TabId } from '@/lib/types';
import type { GeneratedTask } from '@/app/api/generate-tasks/route';
import { AiTaskModal } from './AiTaskModal';

const actions: Array<{ kind: AssemblyKind; label: string }> = [
  { kind: 'Tarea',     label: '→ Tarea' },
  { kind: 'Contenido', label: '→ Contenido' },
  { kind: 'Decisión',  label: '→ Decisión' },
];

export function AssemblyBar({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { state, setState, quickAssemble, addAiTasks } = useLanka();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError]     = useState<string | null>(null);
  const [aiResult, setAiResult]   = useState<{ tasks: GeneratedTask[]; rationale: string } | null>(null);

  const selected = state.stickers.filter(s => s.selected);

  if (selected.length === 0 && !aiResult) return null;

  function handleAssemble(kind: AssemblyKind) {
    quickAssemble(kind);
    if (kind !== 'Tarea') onNavigate('boveda');
  }

  function clearSelection() {
    setState(s => ({ ...s, stickers: s.stickers.map(st => st.selected ? { ...st, selected: false } : st) }));
  }

  async function handleAiGenerate() {
    if (!selected.length) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stickers: selected.map(s => ({
            title:    s.title,
            note:     s.note,
            tag:      s.tag,
            columnId: s.columnId,
          })),
          strategy: state.strategy,
          today:    new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error desconocido');
      }
      const data = await res.json() as { tasks: GeneratedTask[]; rationale: string };
      setAiResult(data);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : 'Error al conectar con IA');
    } finally {
      setAiLoading(false);
    }
  }

  function handleAiConfirm(tasks: GeneratedTask[]) {
    addAiTasks(tasks);
    clearSelection();
    setAiResult(null);
    onNavigate('hoy');
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t-2 border-[var(--ink)] bg-[var(--ink)]"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <span className="flex items-center border-r border-white/20 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
          {selected.length} {selected.length === 1 ? 'sticker' : 'stickers'}
        </span>

        {actions.map(a => (
          <button
            key={a.kind}
            onClick={() => handleAssemble(a.kind)}
            className="border-r border-white/20 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/10 active:bg-white/20"
          >
            {a.label}
          </button>
        ))}

        {/* AI Generate button */}
        <button
          onClick={handleAiGenerate}
          disabled={aiLoading || selected.length === 0}
          className="border-r border-white/20 px-5 py-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] transition disabled:opacity-40"
          style={{ color: '#BFFF00', background: aiLoading ? 'rgba(191,255,0,0.08)' : undefined }}
        >
          {aiLoading ? '⟳ Generando...' : '✦ IA → Tareas'}
        </button>

        {aiError && (
          <span className="flex items-center px-4 font-mono text-[10px] text-red-400">
            {aiError}
          </span>
        )}

        <button
          onClick={clearSelection}
          className="ml-auto px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
        >
          ✕
        </button>
      </div>

      {aiResult && (
        <AiTaskModal
          tasks={aiResult.tasks}
          rationale={aiResult.rationale}
          onConfirm={handleAiConfirm}
          onClose={() => setAiResult(null)}
        />
      )}
    </>
  );
}
