'use client';

import { useState } from 'react';
import type { CaseStage, ClientCase, FbSector } from '@/lib/types';
import { MATURITY_BANDS, maturityBand } from '@/lib/types';

const SECTORS: FbSector[] = [
  'Restaurante casual', 'Fine dining', 'Bar / Cantina', 'Café / Panadería',
  'Fast casual', 'Food truck', 'Dark kitchen', 'Catering', 'Hotel F&B', 'Otro',
];

const STAGES: Array<{ id: CaseStage; label: string }> = [
  { id: 'prospecto',       label: 'Prospecto' },
  { id: 'diagnóstico',     label: 'Diagnóstico' },
  { id: 'implementación',  label: 'Implementación' },
  { id: 'seguimiento',     label: 'Seguimiento' },
  { id: 'cerrado',         label: 'Cerrado' },
];

type Props = {
  initial?: Partial<ClientCase>;
  onSave: (patch: Partial<ClientCase>) => void;
  onCancel: () => void;
};

export function CaseForm({ initial = {}, onSave, onCancel }: Props) {
  const [code,           setCode]           = useState(initial.code ?? '');
  const [sector,         setSector]         = useState<FbSector>(initial.sector ?? 'Restaurante casual');
  const [size,           setSize]           = useState(initial.size ?? '');
  const [stage,          setStage]          = useState<CaseStage>(initial.stage ?? 'prospecto');
  const [problemMain,    setProblemMain]    = useState(initial.problemMain ?? '');
  const [problemDetail,  setProblemDetail]  = useState(initial.problemDetail ?? '');
  const [maturityScore,  setMaturityScore]  = useState(initial.maturityScore ?? 0);
  const [maturityNotes,  setMaturityNotes]  = useState(initial.maturityNotes ?? '');
  const [solution,       setSolution]       = useState(initial.solutionApplied ?? '');
  const [result,         setResult]         = useState(initial.result ?? '');
  const [lesson,         setLesson]         = useState(initial.lesson ?? '');
  const [pattern,        setPattern]        = useState(initial.pattern ?? '');
  const [filmable,       setFilmable]       = useState(initial.filmable ?? false);
  const [startedAt,      setStartedAt]      = useState(initial.startedAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));

  // KPIs
  const [kpis, setKpis] = useState(initial.kpis ?? {});
  function setKpi(key: string, val: string) {
    const n = parseFloat(val);
    setKpis(k => ({ ...k, [key]: isNaN(n) ? undefined : n }));
  }

  const band = maturityBand(maturityScore);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    onSave({
      code, sector, size, stage, problemMain, problemDetail,
      maturityScore, maturityNotes, kpis,
      solutionApplied: solution, result, lesson, pattern, filmable,
      startedAt: startedAt + 'T12:00:00.000Z',
    });
  }

  const fieldClass = 'w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]';
  const labelClass = 'mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Identidad del caso ── */}
      <div className="border border-[var(--line)] p-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">Identidad del caso</p>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className={labelClass}>Código anónimo *</label>
            <input required value={code} onChange={e => setCode(e.target.value)}
              placeholder='ej. "Bistró Centro" o "Cliente 🦁"'
              className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value as FbSector)} className={fieldClass}>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tamaño / ubicación</label>
            <input value={size} onChange={e => setSize(e.target.value)}
              placeholder='ej. "40 mesas, Condesa CDMX"'
              className={fieldClass} />
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelClass}>Etapa actual</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button key={s.id} type="button" onClick={() => setStage(s.id)}
                  className={`border px-3 py-1 font-mono text-[9px] uppercase transition ${stage === s.id ? 'border-[var(--acid)] bg-[var(--acid)] text-black' : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--acid)]'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input type="date" value={startedAt} onChange={e => setStartedAt(e.target.value)} className={fieldClass} />
          </div>
        </div>
      </div>

      {/* ── Problema ── */}
      <div className="border border-[var(--line)] p-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">Diagnóstico del problema</p>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Problema principal (1 línea)</label>
            <input value={problemMain} onChange={e => setProblemMain(e.target.value)}
              placeholder='ej. "Restaurante lleno con food cost desconocido, margen negativo"'
              className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Detalle / contexto</label>
            <textarea value={problemDetail} onChange={e => setProblemDetail(e.target.value)}
              placeholder="Descripción completa del diagnóstico inicial — qué hacen, cómo toman decisiones, qué no saben..."
              rows={3} className={fieldClass + ' resize-y'} />
          </div>
        </div>
      </div>

      {/* ── Índice de madurez ── */}
      <div className="border border-[var(--line)] p-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">Índice de madurez operativa</p>
        <div className="mb-3 flex items-center gap-4">
          <input type="range" min={0} max={100} value={maturityScore}
            onChange={e => setMaturityScore(Number(e.target.value))}
            className="flex-1 accent-[var(--acid)]" />
          <div className="flex-shrink-0 text-right">
            <span className="text-2xl font-black" style={{ color: band.color }}>{maturityScore}</span>
            <span className="ml-1 font-mono text-[9px] text-[var(--muted)]">/100</span>
          </div>
        </div>
        {/* Bandas */}
        <div className="mb-3 flex gap-1">
          {MATURITY_BANDS.map(b => (
            <div key={b.label} className="flex-1 rounded-sm py-1 text-center" style={{ background: maturityScore >= b.min && maturityScore <= b.max ? b.color : 'rgba(255,255,255,0.06)' }}>
              <p className="font-mono text-[8px] font-bold uppercase" style={{ color: maturityScore >= b.min && maturityScore <= b.max ? '#000' : b.color }}>{b.label}</p>
              <p className="font-mono text-[7px]" style={{ color: maturityScore >= b.min && maturityScore <= b.max ? '#000' : 'rgba(255,255,255,0.35)' }}>{b.min}–{b.max}</p>
            </div>
          ))}
        </div>
        <p className="mb-2 font-mono text-[9px] text-[var(--muted)]">{band.desc}</p>
        <div>
          <label className={labelClass}>Notas del diagnóstico de madurez</label>
          <textarea value={maturityNotes} onChange={e => setMaturityNotes(e.target.value)}
            placeholder="¿Por qué este score? ¿Qué evidencias lo justifican?"
            rows={2} className={fieldClass + ' resize-y'} />
        </div>
      </div>

      {/* ── KPIs del cliente ── */}
      <div className="border border-[var(--line)] p-4">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">KPIs del cliente</p>
        <p className="mb-3 font-mono text-[9px] text-[var(--muted)]">Captura los datos reales. Deja vacío lo que no se pudo medir.</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { key: 'foodCostTheoretical', label: 'Food cost teórico',  unit: '%',   placeholder: '28' },
            { key: 'foodCostActual',      label: 'Food cost real',     unit: '%',   placeholder: '34' },
            { key: 'laborCost',           label: 'Labor cost',         unit: '%',   placeholder: '32' },
            { key: 'averageTicket',       label: 'Ticket promedio',    unit: 'MXN', placeholder: '380' },
            { key: 'monthlyRevenue',      label: 'Ingreso mensual',    unit: 'MXN', placeholder: '250000' },
            { key: 'breakEvenMonthly',    label: 'Punto de equilibrio',unit: 'MXN', placeholder: '200000' },
            { key: 'wastePercent',        label: 'Merma',              unit: '%',   placeholder: '6' },
            { key: 'tableTurnover',       label: 'Vueltas/día',        unit: 'veces', placeholder: '2.3' },
          ].map(f => (
            <div key={f.key}>
              <label className={labelClass}>{f.label} <span className="opacity-50">({f.unit})</span></label>
              <div className="flex items-center gap-1">
                <input
                  type="number" step="0.1"
                  value={(kpis as Record<string, number>)[f.key] ?? ''}
                  onChange={e => setKpi(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={fieldClass}
                />
              </div>
              {/* Si hay food cost teórico y real, muestra varianza */}
              {f.key === 'foodCostActual' && (kpis as Record<string, number>).foodCostTheoretical && (kpis as Record<string, number>).foodCostActual && (
                <p className="mt-0.5 font-mono text-[9px]" style={{
                  color: ((kpis as Record<string, number>).foodCostActual - (kpis as Record<string, number>).foodCostTheoretical) > 2 ? 'var(--signal)' : 'var(--acid)'
                }}>
                  Δ {(((kpis as Record<string, number>).foodCostActual - (kpis as Record<string, number>).foodCostTheoretical) > 0 ? '+' : '')}
                  {((kpis as Record<string, number>).foodCostActual - (kpis as Record<string, number>).foodCostTheoretical).toFixed(1)}%
                  {((kpis as Record<string, number>).foodCostActual - (kpis as Record<string, number>).foodCostTheoretical) > 2 ? ' ⚠ revisar merma/recetas' : ' ✓ dentro de rango'}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Solución y aprendizaje ── */}
      <div className="border border-[var(--line)] p-4">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--acid)]">Solución, resultado y aprendizaje</p>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Qué aplicó Lanka</label>
            <textarea value={solution} onChange={e => setSolution(e.target.value)}
              placeholder="Qué herramientas, procesos o sistemas se implementaron..."
              rows={2} className={fieldClass + ' resize-y'} />
          </div>
          <div>
            <label className={labelClass}>Resultado medible</label>
            <input value={result} onChange={e => setResult(e.target.value)}
              placeholder='ej. "Food cost bajó de 34% a 29% en 6 semanas"'
              className={fieldClass} />
          </div>
          <div>
            <label className={labelClass}>Lección aprendida</label>
            <textarea value={lesson} onChange={e => setLesson(e.target.value)}
              placeholder="Qué aprendió Lanka de este caso que se puede sistematizar..."
              rows={2} className={fieldClass + ' resize-y'} />
          </div>
          <div>
            <label className={labelClass}>Patrón identificado</label>
            <input value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder='ej. "Restaurante de 2ª generación sin estándares: siempre hay merma invisible"'
              className={fieldClass} />
          </div>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="border border-[var(--line)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-bold text-[var(--ink)]">¿Es filmable para contenido?</p>
            <p className="font-mono text-[9px] text-[var(--muted)]">El caso (anonimizado) puede documentarse para marca personal</p>
          </div>
          <button type="button" onClick={() => setFilmable(v => !v)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${filmable ? 'bg-[var(--acid)]' : 'bg-[var(--line)]'}`}>
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-black transition-transform ${filmable ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="border border-[var(--line)] px-5 py-2 font-mono text-[10px] uppercase text-[var(--muted)] hover:text-[var(--ink)]">
          Cancelar
        </button>
        <button type="submit"
          className="bg-[var(--acid)] px-6 py-2 font-mono text-[10px] font-bold uppercase text-black">
          Guardar caso
        </button>
      </div>
    </form>
  );
}
