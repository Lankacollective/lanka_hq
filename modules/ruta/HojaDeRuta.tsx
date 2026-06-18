'use client';

import { useState } from 'react';
import { SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { RoadmapItem, RoadmapStatus } from '@/lib/types';

const STATUS_CFG: Record<RoadmapStatus, { label: string; color: string }> = {
  hecho:      { label: '✓ Hecho',      color: 'var(--acid)' },
  'en proceso': { label: '⟳ En proceso', color: 'var(--amber)' },
  pendiente:  { label: '◌ Pendiente',  color: 'var(--muted)' },
  descartado: { label: '✕ Descartado', color: 'var(--signal)' },
};

const STATUSES: RoadmapStatus[] = ['hecho', 'en proceso', 'pendiente', 'descartado'];

const CATEGORIES = ['consultoría', 'IA', 'UX', 'datos', 'contenido', 'integración'] as const;
type Cat = typeof CATEGORIES[number];

const CAT_COLORS: Record<Cat, string> = {
  consultoría: 'var(--terra)',
  IA:          'var(--acid)',
  UX:          'var(--primary)',
  datos:       'var(--primary)',
  contenido:   'var(--amber)',
  integración: 'var(--muted)',
};

function ItemRow({ item }: { item: RoadmapItem }) {
  const { updateRoadmapItem } = useLanka();
  const [open, setOpen] = useState(false);
  const scfg = STATUS_CFG[item.status];

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)]">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-start gap-3 px-4 py-3 text-left">
        <span className="mt-0.5 flex-shrink-0 font-mono text-[9px]" style={{ color: scfg.color }}>{scfg.label}</span>
        <div className="min-w-0 flex-1">
          <p className={`font-mono text-[11px] font-bold ${item.status === 'hecho' ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'}`}>
            {item.title}
          </p>
          {item.description && !open && (
            <p className="mt-0.5 font-mono text-[9px] text-[var(--muted)] line-clamp-1">{item.description}</p>
          )}
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[7px] uppercase"
          style={{ color: CAT_COLORS[item.category as Cat] ?? 'var(--muted)', border: `1px solid ${CAT_COLORS[item.category as Cat] ?? 'var(--muted)'}` }}
        >
          {item.category}
        </span>
        <span className="flex-shrink-0 font-mono text-[9px] text-[var(--muted)]">{item.priority}</span>
        <span className="flex-shrink-0 text-[var(--muted)]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-[var(--line)] px-4 py-4 space-y-3">
          <p className="font-mono text-[10px] text-[var(--muted)]">{item.description}</p>

          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => updateRoadmapItem(item.id, { status: s })}
                className="border px-3 py-1 font-mono text-[9px] transition"
                style={{
                  borderColor: item.status === s ? STATUS_CFG[s].color : 'var(--line)',
                  color: item.status === s ? STATUS_CFG[s].color : 'var(--muted)',
                }}
              >
                {STATUS_CFG[s].label}
              </button>
            ))}
          </div>

          {item.notes && (
            <p className="border-l-2 border-[var(--line)] pl-3 font-mono text-[9px] text-[var(--muted)] italic">{item.notes}</p>
          )}

          <textarea
            value={item.notes}
            onChange={e => updateRoadmapItem(item.id, { notes: e.target.value })}
            placeholder="Notas, bloqueos, decisiones..."
            rows={2}
            className="w-full resize-none border border-[var(--line)] bg-[var(--surface2)] p-2 font-mono text-[10px] text-[var(--muted)] outline-none focus:border-[var(--acid)]"
          />
        </div>
      )}
    </div>
  );
}

type FilterStatus = RoadmapStatus | 'todos';

export function HojaDeRuta() {
  const { state, addRoadmapItem } = useLanka();
  const roadmap = state.roadmap ?? [];
  const [filter, setFilter] = useState<FilterStatus>('todos');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<Cat>('UX');

  const filtered = filter === 'todos' ? roadmap : roadmap.filter(r => r.status === filter);

  const hecho     = roadmap.filter(r => r.status === 'hecho').length;
  const enProceso = roadmap.filter(r => r.status === 'en proceso').length;
  const pendiente = roadmap.filter(r => r.status === 'pendiente').length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addRoadmapItem({ title: newTitle.trim(), category: newCat, status: 'pendiente', priority: 'Media' });
    setNewTitle('');
    setAdding(false);
  }

  return (
    <div>
      <SectionTitle
        eyebrow="⬡ Hoja de Ruta"
        title="Roadmap del sistema"
        subtitle="Qué está hecho, qué sigue, qué está pendiente de construir en Lanka HQ"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3 text-center">
          <p className="text-2xl font-black text-[var(--acid)]">{hecho}</p>
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Hecho</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3 text-center">
          <p className="text-2xl font-black" style={{ color: 'var(--amber)' }}>{enProceso}</p>
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">En proceso</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3 text-center">
          <p className="text-2xl font-black text-[var(--muted)]">{pendiente}</p>
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Pendiente</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 border border-[var(--line)] bg-[var(--surface)] p-3">
        <div className="mb-2 flex justify-between font-mono text-[9px] text-[var(--muted)]">
          <span>Progreso del sistema</span>
          <span>{Math.round(hecho / roadmap.length * 100)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-2 bg-[var(--acid)] transition-all rounded-full" style={{ width: `${Math.round(hecho / roadmap.length * 100)}%` }} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-0 overflow-x-auto border-b border-[var(--line)]">
          {(['todos', ...STATUSES] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap border-b-[3px] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition ${
                filter === s ? 'border-b-[var(--acid)] text-[var(--ink)]' : 'border-b-transparent text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {s === 'todos' ? 'Todos' : STATUS_CFG[s].label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAdding(v => !v)}
          className="flex-shrink-0 border border-[var(--acid)] px-3 py-1.5 font-mono text-[9px] uppercase text-[var(--acid)] hover:bg-[var(--acid)] hover:text-black transition"
        >
          + Añadir
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="mb-4 flex gap-2 border border-[var(--acid)] p-3">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Nombre del feature pendiente..."
            className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-[var(--ink)] outline-none"
          />
          <select
            value={newCat}
            onChange={e => setNewCat(e.target.value as Cat)}
            className="border border-[var(--line)] bg-[var(--surface2)] px-2 font-mono text-[9px] text-[var(--ink)] outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="bg-[var(--acid)] px-3 font-mono text-[9px] font-bold text-black">↵</button>
          <button type="button" onClick={() => setAdding(false)} className="font-mono text-[9px] text-[var(--muted)]">✕</button>
        </form>
      )}

      {/* Items */}
      <div className="space-y-1">
        {filtered.map(item => <ItemRow key={item.id} item={item} />)}
      </div>

      {/* Pending features context */}
      {filter === 'pendiente' || filter === 'todos' ? (
        <div className="mt-6 border border-dashed border-[var(--line)] p-4">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--acid)]">Los 3 pendientes de mayor impacto</p>
          <div className="space-y-2">
            {roadmap.filter(r => r.status === 'pendiente' && r.priority === 'Alta').slice(0, 3).map(r => (
              <div key={r.id} className="flex gap-2">
                <span className="font-mono text-[9px] text-[var(--acid)]">→</span>
                <div>
                  <p className="font-mono text-[10px] font-bold text-[var(--ink)]">{r.title}</p>
                  <p className="font-mono text-[9px] text-[var(--muted)]">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
