'use client';

import { useState } from 'react';
import { SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { ModeloSection, ModeloSectionStatus } from '@/lib/types';

const STATUS_CONFIG: Record<ModeloSectionStatus, { label: string; color: string; bg: string }> = {
  pendiente:    { label: 'Pendiente',    color: 'var(--muted)',   bg: 'rgba(255,255,255,0.04)' },
  'en proceso': { label: 'En proceso',   color: 'var(--amber)',   bg: 'rgba(249,168,37,0.08)' },
  documentado:  { label: 'Documentado',  color: 'var(--primary)', bg: 'rgba(0,87,255,0.08)' },
  publicado:    { label: 'Publicado ✓',  color: 'var(--acid)',    bg: 'rgba(191,255,0,0.08)' },
};

const STATUSES: ModeloSectionStatus[] = ['pendiente', 'en proceso', 'documentado', 'publicado'];

function SectionRow({ sec }: { sec: ModeloSection }) {
  const { updateModeloSection } = useLanka();
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[sec.status];

  return (
    <div
      className="border border-[var(--line)] transition-colors"
      style={{ background: open ? cfg.bg : undefined }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex-shrink-0 font-mono text-[10px] font-black text-[var(--muted)] w-7">{sec.index}</span>
        <span className="flex-1 font-mono text-[11px] font-bold text-[var(--ink)]">{sec.title}</span>
        {sec.publicParticipation && (
          <span className="flex-shrink-0 rounded-full bg-[var(--acid)]/20 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-[var(--acid)]">público</span>
        )}
        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 font-mono text-[8px] font-bold uppercase"
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}` }}
        >
          {cfg.label}
        </span>
        <span className="flex-shrink-0 font-mono text-[10px] text-[var(--muted)]">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-[var(--line)] px-4 py-4 space-y-4">
          {/* Description */}
          <p className="font-mono text-[10px] text-[var(--muted)] italic">{sec.description}</p>

          {/* Status selector */}
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Estado</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => {
                const c = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => updateModeloSection(sec.key, { status: s })}
                    className="border px-3 py-1 font-mono text-[9px] uppercase transition"
                    style={{
                      borderColor: sec.status === s ? c.color : 'var(--line)',
                      color: sec.status === s ? c.color : 'var(--muted)',
                      background: sec.status === s ? c.bg : undefined,
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Contenido / desarrollo</p>
            <textarea
              value={sec.content}
              onChange={e => updateModeloSection(sec.key, { content: e.target.value })}
              placeholder={`Desarrolla esta sección: ${sec.description}`}
              rows={5}
              className="w-full resize-y border border-[var(--line)] bg-[var(--surface2)] p-3 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
            />
          </div>

          {/* Internal notes */}
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Notas internas (no publicables)</p>
            <textarea
              value={sec.internalNotes}
              onChange={e => updateModeloSection(sec.key, { internalNotes: e.target.value })}
              placeholder="Contexto behind-the-scenes, decisiones tomadas, cosas que no van en el contenido público..."
              rows={2}
              className="w-full resize-y border border-dashed border-[var(--line)] bg-[var(--surface)] p-3 font-mono text-[10px] text-[var(--muted)] outline-none focus:border-[var(--acid)]"
            />
          </div>

          {/* Public participation toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold text-[var(--ink)]">Participación del público</p>
              <p className="font-mono text-[9px] text-[var(--muted)]">Esta sección incluye preguntas o decisiones abiertas a la audiencia</p>
            </div>
            <button
              onClick={() => updateModeloSection(sec.key, { publicParticipation: !sec.publicParticipation })}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${sec.publicParticipation ? 'bg-[var(--acid)]' : 'bg-[var(--line)]'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-black transition-transform ${sec.publicParticipation ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Modelo() {
  const { state } = useLanka();
  const sections = state.modelo ?? [];

  const done      = sections.filter(s => s.status === 'publicado' || s.status === 'documentado').length;
  const inProcess = sections.filter(s => s.status === 'en proceso').length;
  const progress  = Math.round(done / sections.length * 100);
  const withPublic = sections.filter(s => s.publicParticipation).length;

  return (
    <div>
      <SectionTitle
        eyebrow="06 · Modelo"
        title="Índice de construcción"
        subtitle="Documenta el modelo de negocio Lanka desde cero · El público participa en las secciones marcadas"
      />

      {/* Progress */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Progreso general</p>
          <p className="mt-1 text-3xl font-black text-[var(--ink)]">{progress}%</p>
          <div className="mt-2 h-1 bg-white/10">
            <div className="h-1 bg-[var(--acid)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Documentadas</p>
          <p className="mt-1 text-3xl font-black text-[var(--primary)]">{done}</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">En proceso</p>
          <p className="mt-1 text-3xl font-black" style={{ color: 'var(--amber)' }}>{inProcess}</p>
        </div>
        <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
          <p className="font-mono text-[9px] uppercase text-[var(--muted)]">Con participación pública</p>
          <p className="mt-1 text-3xl font-black text-[var(--acid)]">{withPublic}</p>
        </div>
      </div>

      {/* Section list */}
      <div className="space-y-1">
        {sections.map(sec => (
          <SectionRow key={sec.key} sec={sec} />
        ))}
      </div>

      <p className="mt-4 font-mono text-[9px] text-[var(--muted)]">
        Los cambios se guardan automáticamente en Supabase · Los campos "notas internas" nunca son visibles al público
      </p>
    </div>
  );
}
