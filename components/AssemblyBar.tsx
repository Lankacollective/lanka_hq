'use client';

import { useLanka } from '@/lib/store';
import type { AssemblyKind, TabId } from '@/lib/types';

const actions: Array<{ kind: AssemblyKind; label: string }> = [
  { kind: 'Tarea',    label: '→ Tarea' },
  { kind: 'Contenido', label: '→ Contenido' },
  { kind: 'Decisión',  label: '→ Decisión' },
];

export function AssemblyBar({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { state, setState, quickAssemble } = useLanka();
  const selected = state.stickers.filter(s => s.selected);

  if (selected.length === 0) return null;

  function handleAssemble(kind: AssemblyKind) {
    quickAssemble(kind);
    if (kind !== 'Tarea') onNavigate('boveda');
  }

  function clearSelection() {
    setState(s => ({ ...s, stickers: s.stickers.map(st => st.selected ? { ...st, selected: false } : st) }));
  }

  return (
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

      <button
        onClick={clearSelection}
        className="ml-auto px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}
