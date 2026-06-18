'use client';

import { useState } from 'react';
import { Card, EditableArea, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

function buildSnapshot(state: ReturnType<typeof useLanka>['state']): string {
  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const activeTasks = state.tasks.filter(t => !t.done && !t.parentId);
  const kpiLines = state.kpis.map(k => `- ${k.label}: ${k.current}/${k.target} ${k.unit} (${k.target ? Math.round(k.current/k.target*100) : 0}%)`).join('\n');
  const taskLines = activeTasks.slice(0, 10).map(t => `- [${t.priority}] ${t.title} — ${t.owner}${t.dueAt ? ` · ${t.dueAt}` : ''}`).join('\n');
  const stickerLines = state.stickers.slice(0, 15).map(s => `- [${s.columnId}·${s.tag}] ${s.title}`).join('\n');

  return `# Lanka HQ · Snapshot
**Fecha:** ${today}

## Estrategia
**Hipótesis:** ${state.strategy.hypothesis}

**Misión:** ${state.strategy.mission}

**Foco actual:** ${state.strategy.currentFocus}

## KPIs
${kpiLines}

## Tareas activas (${activeTasks.length})
${taskLines || 'Sin tareas activas'}

## Stickers recientes
${stickerLines || 'Sin stickers'}
`;
}

export function MasterOS() {
  const store = useLanka();
  const { state, updateStrategy } = store;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const md = buildSnapshot(state);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handleDownload() {
    const md = buildSnapshot(state);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lanka-snapshot-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SectionTitle eyebrow="01 · Master OS" title="Cerebro estratégico" subtitle="Lo que decide, limita y orienta al sistema completo." />
      <div className="grid gap-4">
        <Card>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Hipótesis central</p>
          <EditableArea value={state.strategy.hypothesis} onChange={v => updateStrategy('hypothesis', v)} />
        </Card>
        <Card>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Misión</p>
          <EditableArea value={state.strategy.mission} onChange={v => updateStrategy('mission', v)} />
        </Card>
        <Card>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Foco actual</p>
          <EditableArea value={state.strategy.currentFocus} onChange={v => updateStrategy('currentFocus', v)} rows={3} />
        </Card>

        {/* Export snapshot */}
        <Card>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Snapshot para IA · Exportar contexto</p>
          <p className="mb-3 font-mono text-[10px] text-[var(--muted)]">
            Genera un resumen en Markdown con hipótesis, KPIs y tareas activas — listo para pegar en un prompt de Claude.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="border border-[var(--acid)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--acid)] hover:bg-[var(--acid)] hover:text-black transition"
            >
              {copied ? '✓ Copiado' : '⧉ Copiar Markdown'}
            </button>
            <button
              onClick={handleDownload}
              className="border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] hover:border-[var(--acid)] hover:text-[var(--ink)] transition"
            >
              ↓ Descargar .md
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
