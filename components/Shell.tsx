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
        <header className="border-b-4 border-[var(--ink)] px-5 py-8 md:px-12 md:py-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">Lanka Collective · Stack Definitivo</p>
              <h1 className="mt-2 text-5xl font-black uppercase leading-none tracking-[-0.06em] md:text-7xl">LANKA<br /><span className="text-[var(--terra)]">HQ</span></h1>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)] md:text-right">
              Next.js · Tailwind · Estado Central<br />Stickers → Ensamblaje → Bóveda<br />Recordatorios server-ready
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-20 flex gap-0 overflow-x-auto border-b border-black/15 bg-[var(--bone)] px-4 md:px-12 no-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-4 font-mono text-[10px] uppercase tracking-[0.16em] transition ${tab === t.id ? 'border-[var(--ink)] text-[var(--ink)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'}`}
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
