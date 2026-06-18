'use client';

import { useState } from 'react';
import type { ClientCase } from '@/lib/types';
import { MATURITY_BANDS, maturityBand } from '@/lib/types';
import { useLanka } from '@/lib/store';
import { CaseForm } from './CaseForm';

const STAGE_COLORS: Record<string, string> = {
  prospecto:      'text-[var(--muted)]',
  diagnóstico:    'text-[var(--primary)]',
  implementación: 'text-[var(--amber)]',
  seguimiento:    'text-[var(--acid)]',
  cerrado:        'text-[var(--muted)]',
};

type Props = { caso: ClientCase };

export function CaseCard({ caso }: Props) {
  const { updateCase, deleteCase } = useLanka();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const band = maturityBand(caso.maturityScore);
  const kpis = caso.kpis as Record<string, number>;
  const hasFoodCostGap = kpis.foodCostTheoretical && kpis.foodCostActual &&
    kpis.foodCostActual - kpis.foodCostTheoretical > 2;

  if (editing) {
    return (
      <div className="border border-[var(--acid)] bg-[var(--surface)] p-5">
        <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">Editando: {caso.code}</p>
        <CaseForm
          initial={caso}
          onSave={patch => { updateCase(caso.id, patch); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`border bg-[var(--surface)] ${caso.stage === 'cerrado' ? 'border-[var(--line)] opacity-70' : 'border-[var(--line)]'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-mono text-sm font-black text-[var(--ink)]">{caso.code}</h3>
            {caso.filmable && (
              <span className="rounded-full bg-[var(--acid)]/20 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--acid)]">
                📹 filmable
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[9px] text-[var(--muted)]">{caso.sector}</span>
            {caso.size && <span className="font-mono text-[9px] text-[var(--muted)]">· {caso.size}</span>}
            <span className={`font-mono text-[9px] font-bold uppercase ${STAGE_COLORS[caso.stage] ?? ''}`}>
              · {caso.stage}
            </span>
          </div>
          {caso.problemMain && (
            <p className="mt-2 font-mono text-[10px] text-[var(--ink)] opacity-80">{caso.problemMain}</p>
          )}
        </div>

        {/* Maturity badge */}
        <div className="flex-shrink-0 text-center">
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded-full border-2"
            style={{ borderColor: band.color }}
          >
            <span className="text-lg font-black leading-none" style={{ color: band.color }}>{caso.maturityScore}</span>
          </div>
          <p className="mt-0.5 font-mono text-[7px] uppercase" style={{ color: band.color }}>{band.label}</p>
        </div>
      </div>

      {/* KPI mini-row */}
      {(kpis.foodCostActual || kpis.monthlyRevenue || kpis.averageTicket) ? (
        <div className="flex flex-wrap gap-3 border-t border-[var(--line)] px-4 py-2">
          {kpis.foodCostActual !== undefined && (
            <div className="text-center">
              <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Food cost</p>
              <p className={`font-mono text-sm font-black ${hasFoodCostGap ? 'text-[var(--signal)]' : 'text-[var(--ink)]'}`}>
                {kpis.foodCostActual}%
                {hasFoodCostGap && <span className="ml-1 text-[9px]">⚠</span>}
              </p>
              {kpis.foodCostTheoretical && <p className="font-mono text-[7px] text-[var(--muted)]">teo: {kpis.foodCostTheoretical}%</p>}
            </div>
          )}
          {kpis.laborCost !== undefined && (
            <div className="text-center">
              <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Labor</p>
              <p className="font-mono text-sm font-black text-[var(--ink)]">{kpis.laborCost}%</p>
            </div>
          )}
          {kpis.averageTicket !== undefined && (
            <div className="text-center">
              <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Ticket</p>
              <p className="font-mono text-sm font-black text-[var(--ink)]">${kpis.averageTicket.toLocaleString('es-MX')}</p>
            </div>
          )}
          {kpis.monthlyRevenue !== undefined && (
            <div className="text-center">
              <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Ingreso/mes</p>
              <p className="font-mono text-sm font-black text-[var(--ink)]">${(kpis.monthlyRevenue / 1000).toFixed(0)}k</p>
            </div>
          )}
          {kpis.breakEvenMonthly !== undefined && kpis.monthlyRevenue !== undefined && (
            <div className="text-center">
              <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Margen s/PE</p>
              <p className={`font-mono text-sm font-black ${kpis.monthlyRevenue > kpis.breakEvenMonthly ? 'text-[var(--acid)]' : 'text-[var(--signal)]'}`}>
                {kpis.monthlyRevenue > kpis.breakEvenMonthly ? '+' : ''}
                ${((kpis.monthlyRevenue - kpis.breakEvenMonthly) / 1000).toFixed(0)}k
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Expanded detail */}
      {expanded && (
        <div className="space-y-3 border-t border-[var(--line)] px-4 py-4">
          {caso.problemDetail && (
            <div>
              <p className="mb-1 font-mono text-[8px] uppercase text-[var(--muted)]">Contexto del problema</p>
              <p className="font-mono text-[10px] text-[var(--ink)] opacity-80 whitespace-pre-wrap">{caso.problemDetail}</p>
            </div>
          )}
          {caso.maturityNotes && (
            <div>
              <p className="mb-1 font-mono text-[8px] uppercase text-[var(--muted)]">Notas de madurez</p>
              <p className="font-mono text-[10px] text-[var(--ink)] opacity-80">{caso.maturityNotes}</p>
            </div>
          )}
          {caso.solutionApplied && (
            <div>
              <p className="mb-1 font-mono text-[8px] uppercase text-[var(--muted)]">Solución aplicada</p>
              <p className="font-mono text-[10px] text-[var(--ink)] opacity-80">{caso.solutionApplied}</p>
            </div>
          )}
          {caso.result && (
            <div>
              <p className="mb-1 font-mono text-[8px] uppercase text-[var(--acid)]">Resultado</p>
              <p className="font-mono text-[11px] font-bold text-[var(--ink)]">{caso.result}</p>
            </div>
          )}
          {caso.lesson && (
            <div>
              <p className="mb-1 font-mono text-[8px] uppercase text-[var(--muted)]">Lección</p>
              <p className="font-mono text-[10px] text-[var(--ink)] opacity-80">{caso.lesson}</p>
            </div>
          )}
          {caso.pattern && (
            <div className="border-l-2 border-[var(--acid)] pl-3">
              <p className="mb-0.5 font-mono text-[8px] uppercase text-[var(--acid)]">Patrón identificado</p>
              <p className="font-mono text-[11px] font-bold text-[var(--ink)]">{caso.pattern}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-0 border-t border-[var(--line)]">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex-1 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--ink)] transition"
        >
          {expanded ? '▲ Ocultar' : '▼ Ver detalle'}
        </button>
        <button
          onClick={() => setEditing(true)}
          className="border-l border-[var(--line)] px-4 py-2 font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition"
        >
          ✎ Editar
        </button>
        <button
          onClick={() => {
            if (confirm(`¿Eliminar caso "${caso.code}"?`)) deleteCase(caso.id);
          }}
          className="border-l border-[var(--line)] px-4 py-2 font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--signal)] transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
