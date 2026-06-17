'use client';

import { useState } from 'react';
import type { TabId } from '@/lib/types';
import { LankaProvider } from '@/lib/store';
import { CommandCenter } from '@/modules/command-center/CommandCenter';
import { MasterOS } from '@/modules/master-os/MasterOS';
import { Dashboard } from '@/modules/dashboard/Dashboard';
import { Board } from '@/modules/board/Board';
import { AssemblyFlow } from '@/modules/assembly/AssemblyFlow';
import { Automations } from '@/modules/automations/Automations';
import { Backup } from '@/modules/automations/Backup';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'command', label: '01 · Command' },
  { id: 'master', label: '02 · Master OS' },
  { id: 'dashboard', label: '03 · Dashboard' },
  { id: 'board', label: '04 · Stickers / Board' },
  { id: 'assembly', label: '05 · Ensamblaje / Bóveda' },
  { id: 'automations', label: '06 · Automatizaciones' },
  { id: 'backup', label: '07 · Backup' },
];

function Active({ tab }: { tab: TabId }) {
  if (tab === 'command') return <CommandCenter />;
  if (tab === 'master') return <MasterOS />;
  if (tab === 'dashboard') return <Dashboard />;
  if (tab === 'board') return <Board />;
  if (tab === 'assembly') return <AssemblyFlow />;
  if (tab === 'automations') return <Automations />;
  return <Backup />;
}

export function Shell() {
  const [tab, setTab] = useState<TabId>('command');

  return (
    <LankaProvider>
      <main className="min-h-screen bg-[var(--bone)] text-[var(--ink)]">
        <header className="border-b-2 border-[var(--ink)] px-5 py-5 md:px-6 md:py-4" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">Lanka Collective · HQ Integrado</p>
              <h1 className="mt-1 uppercase" style={{ fontFamily: 'var(--display)', fontSize: 'clamp(38px, 6vw, 52px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>LANKA <span className="text-[var(--terra)]" style={{ fontStyle: 'italic' }}>HQ</span></h1>
            </div>
            <div className="font-mono text-[10px] text-[var(--muted)] md:text-right" style={{ lineHeight: 1.8 }}>
              v1.3 · stickers → ensamblaje → bóveda<br />Supabase sync · Next.js
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-20 flex gap-0 overflow-x-auto border-b-2 border-[var(--ink)] bg-[var(--bone)] px-5 no-scrollbar" style={{ backdropFilter: 'blur(10px)', background: 'rgba(235,233,228,.97)' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-[3px] border-r border-r-[var(--line)] px-4 py-[13px] font-mono text-[10px] uppercase tracking-[0.08em] transition ${tab === t.id ? 'border-b-[var(--terra)] bg-white/55 text-[var(--ink)]' : 'border-b-transparent text-[var(--muted)] hover:border-b-[var(--terra)] hover:bg-white/55 hover:text-[var(--ink)]'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <section className="px-4 py-6 md:px-12 md:py-10">
          <Active tab={tab} />
        </section>
      </main>
    </LankaProvider>
  );
}
