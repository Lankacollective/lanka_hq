'use client';

import { useState } from 'react';
import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { Owner, Priority, TaskStatus, WorkspaceConfig } from '@/lib/types';

const ALL_OWNERS: Owner[] = ['Paola', 'Mathias', 'Ambos', 'IA'];
const PRIORITIES: Priority[] = ['Alta', 'Media', 'Baja'];
const TASK_STATUSES: Array<{ id: TaskStatus; label: string }> = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'today',   label: 'Hoy' },
  { id: 'doing',   label: 'En progreso' },
];

const AI_MODELS: Array<{ id: WorkspaceConfig['aiModel']; label: string; desc: string }> = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', desc: 'Más rápido · Menor costo' },
  { id: 'claude-sonnet-4-6',         label: 'Sonnet 4.6', desc: 'Más inteligente · Mejor análisis' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{title}</p>
      {children}
    </Card>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-mono text-[11px] font-bold text-[var(--ink)]">{label}</p>
        {desc && <p className="font-mono text-[10px] text-[var(--muted)]">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
        value ? 'bg-[var(--acid)]' : 'bg-[var(--line)]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-black transition-transform ${
          value ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function Config() {
  const { state, updateConfig, exportJson, importJson, forceSyncToCloud } = useLanka();
  const cfg = state.config;
  const [syncMsg, setSyncMsg] = useState('');
  const [importError, setImportError] = useState('');

  function set<K extends keyof WorkspaceConfig>(key: K, value: WorkspaceConfig[K]) {
    updateConfig({ [key]: value });
  }

  function toggleOwner(owner: Owner) {
    const current = cfg.owners;
    if (current.includes(owner) && current.length > 1) {
      set('owners', current.filter(o => o !== owner) as Owner[]);
    } else if (!current.includes(owner)) {
      set('owners', [...current, owner] as Owner[]);
    }
  }

  async function handleSync() {
    setSyncMsg('Sincronizando...');
    forceSyncToCloud();
    await new Promise(r => setTimeout(r, 1000));
    setSyncMsg('✓ Sincronizado');
    setTimeout(() => setSyncMsg(''), 3000);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    try {
      await importJson(file);
    } catch {
      setImportError('Archivo inválido o corrompido');
    }
    e.target.value = '';
  }

  return (
    <div>
      <SectionTitle
        eyebrow="⚙ Config"
        title="Configuración global"
        subtitle="Los cambios se guardan automáticamente en Supabase"
      />

      {/* ── Workspace ── */}
      <Section title="Workspace">
        <Row label="Nombre del workspace">
          <input
            value={cfg.workspaceName}
            onChange={e => set('workspaceName', e.target.value)}
            className="border border-[var(--line)] bg-[var(--surface2)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] w-48"
          />
        </Row>
      </Section>

      {/* ── Responsables ── */}
      <Section title="Responsables activos">
        <Row
          label="Equipo"
          desc="Quién aparece en los selectores de tareas"
        >
          <div className="flex gap-2">
            {ALL_OWNERS.map(o => (
              <button
                key={o}
                onClick={() => toggleOwner(o)}
                className={`border px-3 py-1 font-mono text-[10px] uppercase transition ${
                  cfg.owners.includes(o)
                    ? 'border-[var(--acid)] bg-[var(--acid)] text-black'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--acid)] hover:text-[var(--ink)]'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Responsable por defecto" desc="Al crear una tarea sin especificar">
          <select
            value={cfg.defaultOwner}
            onChange={e => set('defaultOwner', e.target.value as Owner)}
            className="border border-[var(--line)] bg-[var(--surface2)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
          >
            {cfg.owners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Row>
      </Section>

      {/* ── Tareas ── */}
      <Section title="Comportamiento de tareas">
        <Row label="Prioridad por defecto">
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button
                key={p}
                onClick={() => set('defaultPriority', p)}
                className={`border px-3 py-1 font-mono text-[10px] uppercase transition ${
                  cfg.defaultPriority === p
                    ? 'border-[var(--acid)] bg-[var(--acid)] text-black'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--acid)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Status por defecto al crear">
          <div className="flex gap-2">
            {TASK_STATUSES.map(s => (
              <button
                key={s.id}
                onClick={() => set('defaultTaskStatus', s.id)}
                className={`border px-3 py-1 font-mono text-[10px] uppercase transition ${
                  cfg.defaultTaskStatus === s.id
                    ? 'border-[var(--acid)] bg-[var(--acid)] text-black'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--acid)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </Row>
        <Row
          label="Mostrar completadas en Hoy"
          desc="Las tareas marcadas como hechas permanecen visibles 24h"
        >
          <Toggle
            value={cfg.showDoneTasksInHoy}
            onChange={v => set('showDoneTasksInHoy', v)}
          />
        </Row>
        <Row label="Board en modo compacto por defecto">
          <Toggle
            value={cfg.boardCompactMode}
            onChange={v => set('boardCompactMode', v)}
          />
        </Row>
      </Section>

      {/* ── IA ── */}
      <Section title="Inteligencia artificial">
        <Row
          label="Modelo para generación de tareas"
          desc="Haiku es más rápido y barato. Sonnet da mejor análisis estratégico."
        >
          <div className="flex flex-col gap-2">
            {AI_MODELS.map(m => (
              <button
                key={m.id}
                onClick={() => set('aiModel', m.id)}
                className={`flex items-center justify-between gap-6 border px-3 py-2 text-left transition ${
                  cfg.aiModel === m.id
                    ? 'border-[var(--acid)] bg-[var(--acid)]/10'
                    : 'border-[var(--line)] hover:border-[var(--acid)]/50'
                }`}
              >
                <span className={`font-mono text-[11px] font-bold ${cfg.aiModel === m.id ? 'text-[var(--acid)]' : 'text-[var(--ink)]'}`}>{m.label}</span>
                <span className="font-mono text-[9px] text-[var(--muted)]">{m.desc}</span>
              </button>
            ))}
          </div>
        </Row>
        <div className="mt-2 border border-dashed border-[var(--line)] p-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Contexto estratégico enviado a IA</p>
          <p className="mt-1 font-mono text-[10px] text-[var(--ink)] opacity-70 line-clamp-2">{state.strategy.hypothesis}</p>
          <p className="mt-1 font-mono text-[9px] text-[var(--muted)]">+ stickers seleccionados + fecha actual</p>
        </div>
      </Section>

      {/* ── Datos ── */}
      <Section title="Datos · Backup">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportJson}
            className="border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink)] hover:border-[var(--acid)] hover:text-[var(--acid)]"
          >
            ↓ Exportar JSON
          </button>
          <label className="cursor-pointer border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink)] hover:border-[var(--acid)] hover:text-[var(--acid)]">
            ↑ Importar JSON
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={handleSync}
            className="border border-[var(--primary)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
          >
            ⟳ Forzar sync a Supabase
          </button>
        </div>
        {syncMsg && <p className="mt-2 font-mono text-[10px] text-[var(--acid)]">{syncMsg}</p>}
        {importError && <p className="mt-2 font-mono text-[10px] text-[var(--signal)]">{importError}</p>}

        <div className="mt-4 border-t border-[var(--line)] pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Estadísticas del workspace</p>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {[
              { label: 'Stickers', value: state.stickers.length },
              { label: 'Tareas',   value: state.tasks.filter(t => !t.parentId).length },
              { label: 'Ensamblajes', value: state.assemblies.length },
              { label: 'Bóveda',  value: state.vault.length },
            ].map(stat => (
              <div key={stat.label} className="border border-[var(--line)] p-2 text-center">
                <p className="text-2xl font-black text-[var(--ink)]">{stat.value}</p>
                <p className="font-mono text-[9px] text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
