'use client';

import { Card, EditableArea, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

export function MasterOS() {
  const { state, updateStrategy } = useLanka();
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
      </div>
    </div>
  );
}
