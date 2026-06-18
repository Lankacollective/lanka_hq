'use client';

import { useState, useMemo } from 'react';
import { SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import { MATURITY_BANDS, maturityBand } from '@/lib/types';
import type { CaseStage } from '@/lib/types';
import { CaseCard } from './CaseCard';
import { CaseForm } from './CaseForm';

const STAGE_TABS: Array<{ id: CaseStage | 'todos'; label: string }> = [
  { id: 'todos',          label: 'Todos' },
  { id: 'prospecto',      label: 'Prospecto' },
  { id: 'diagnóstico',    label: 'Diagnóstico' },
  { id: 'implementación', label: 'Implementación' },
  { id: 'seguimiento',    label: 'Seguimiento' },
  { id: 'cerrado',        label: 'Cerrados' },
];

export function Casos() {
  const { state, addCase } = useLanka();
  const [stageFilter, setStageFilter] = useState<CaseStage | 'todos'>('todos');
  const [adding, setAdding] = useState(false);
  const cases = state.cases ?? [];

  const filtered = useMemo(() =>
    stageFilter === 'todos' ? cases : cases.filter(c => c.stage === stageFilter),
    [cases, stageFilter]
  );

  // ── Stats ────────────────────────────────────────────────────────────────────
  const active = cases.filter(c => c.stage !== 'cerrado');
  const closed = cases.filter(c => c.stage === 'cerrado');
  const avgMaturity = active.length
    ? Math.round(active.reduce((s, c) => s + c.maturityScore, 0) / active.length)
    : 0;
  const filmable = cases.filter(c => c.filmable).length;

  // Pattern frequency
  const patternMap: Record<string, number> = {};
  cases.forEach(c => { if (c.pattern) patternMap[c.pattern] = (patternMap[c.pattern] ?? 0) + 1; });
  const topPatterns = Object.entries(patternMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (adding) {
    return (
      <div>
        <SectionTitle eyebrow="Casos · Nuevo" title="Documentar caso" />
        <CaseForm
          onSave={patch => { addCase(patch); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <SectionTitle
          eyebrow="05 · Casos"
          title="Clientes & Patrones"
          subtitle="Cada caso documentado es validación de mercado y entrenamiento del sistema"
        />
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex-shrink-0 border border-[var(--acid)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--acid)] hover:bg-[var(--acid)] hover:text-black transition"
        >
          + Nuevo caso
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Casos activos</p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">{active.length}</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Madurez promedio</p>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-3xl font-black" style={{ color: maturityBand(avgMaturity).color }}>{avgMaturity}</p>
            <p className="font-mono text-[9px] text-[var(--muted)]">/ 100</p>
          </div>
          <p className="font-mono text-[8px]" style={{ color: maturityBand(avgMaturity).color }}>{maturityBand(avgMaturity).label}</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Cerrados</p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">{closed.length}</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Filmables</p>
          <p className="mt-1 text-3xl font-black text-[var(--acid)]">{filmable}</p>
        </div>
      </div>

      {/* ── Índice de madurez global ── */}
      {active.length > 0 && (
        <div className="mb-6 border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">Distribución por nivel de madurez</p>
          <div className="flex gap-2">
            {MATURITY_BANDS.map(band => {
              const count = active.filter(c => c.maturityScore >= band.min && c.maturityScore <= band.max).length;
              return (
                <div key={band.label} className="flex-1 border border-[var(--line)] p-2 text-center">
                  <p className="text-xl font-black" style={{ color: band.color }}>{count}</p>
                  <p className="font-mono text-[8px] font-bold uppercase" style={{ color: band.color }}>{band.label}</p>
                  <p className="font-mono text-[7px] text-[var(--muted)]">{band.min}–{band.max}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Patrones frecuentes ── */}
      {topPatterns.length > 0 && (
        <div className="mb-6 border border-[var(--line)] bg-[var(--surface)] p-4">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">Patrones más frecuentes</p>
          <div className="space-y-2">
            {topPatterns.map(([pattern, count]) => (
              <div key={pattern} className="flex items-center gap-3">
                <div
                  className="h-1.5 rounded-full bg-[var(--acid)] transition-all"
                  style={{ width: `${Math.round(count / cases.length * 100)}%`, minWidth: 8 }}
                />
                <span className="flex-shrink-0 font-mono text-[10px] font-bold text-[var(--acid)]">{count}×</span>
                <span className="font-mono text-[10px] text-[var(--ink)] opacity-80">{pattern}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[9px] text-[var(--muted)]">
            Estos patrones son la base del producto de auditoría escalable
          </p>
        </div>
      )}

      {/* ── Stage filter ── */}
      <div className="mb-4 flex gap-0 overflow-x-auto border-b border-[var(--line)]">
        {STAGE_TABS.map(t => {
          const count = t.id === 'todos' ? cases.length : cases.filter(c => c.stage === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setStageFilter(t.id)}
              className={`whitespace-nowrap border-b-[3px] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition ${
                stageFilter === t.id
                  ? 'border-b-[var(--acid)] text-[var(--ink)]'
                  : 'border-b-transparent text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              {t.label} {count > 0 && <span className="opacity-60">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* ── Case list ── */}
      {filtered.length === 0 ? (
        <div className="border border-dashed border-[var(--line)] p-8 text-center">
          <p className="font-mono text-[10px] text-[var(--muted)]">
            {cases.length === 0
              ? 'Sin casos documentados todavía. Cada cliente que diagnosticas es validación real del sistema.'
              : 'Sin casos en esta etapa.'}
          </p>
          {cases.length === 0 && (
            <button onClick={() => setAdding(true)}
              className="mt-4 border border-[var(--acid)] px-5 py-2 font-mono text-[10px] uppercase text-[var(--acid)] hover:bg-[var(--acid)] hover:text-black transition">
              Documentar primer caso
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => <CaseCard key={c.id} caso={c} />)}
        </div>
      )}
    </div>
  );
}
