'use client';

import { useState } from 'react';
import type { TabId } from '@/lib/types';
import { LankaProvider, useLanka } from '@/lib/store';
import { Hoy } from '@/modules/hoy/Hoy';
import { Board } from '@/modules/board/Board';
import { Sistema } from '@/modules/sistema/Sistema';
import { Boveda } from '@/modules/boveda/Boveda';
import { AssemblyBar } from '@/components/AssemblyBar';
import { Config } from '@/modules/config/Config';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'hoy',     label: '01 · Hoy' },
  { id: 'board',   label: '02 · Board' },
  { id: 'sistema', label: '03 · Sistema' },
  { id: 'boveda',  label: '04 · Bóveda' },
  { id: 'config',  label: '⚙ Config' },
];

function Active({ tab }: { tab: TabId }) {
  if (tab === 'hoy')     return <Hoy />;
  if (tab === 'board')   return <Board />;
  if (tab === 'sistema') return <Sistema />;
  if (tab === 'config')  return <Config />;
  return <Boveda />;
}

function ShellContent({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const { addSticker } = useLanka();
  const [capture, setCapture] = useState('');

  function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!capture.trim()) return;
    addSticker('sinResponder', capture.trim(), 'Preguntas sin resolver');
    setCapture('');
  }

  return (
    <>
      <header
        className="border-b-2 border-[var(--line)] px-5 py-4 md:px-6"
        style={{ background: 'rgba(12,12,12,.97)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Lanka Collective · HQ Integrado
            </p>
            <h1
              className="mt-1 uppercase text-[var(--ink)]"
              style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.01em' }}
            >
              LANKA <span className="text-[var(--terra)]" style={{ fontStyle: 'italic' }}>HQ</span>
            </h1>
          </div>
          <form onSubmit={handleCapture} className="flex min-w-0 flex-1 gap-2 md:max-w-sm">
            <input
              value={capture}
              onChange={e => setCapture(e.target.value)}
              placeholder="Captura rápida..."
              className="min-w-0 flex-1 border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
            />
            <button
              type="submit"
              className="flex-shrink-0 border border-[var(--acid)] bg-[var(--acid)] px-3 py-2 font-mono text-[10px] font-bold uppercase text-black"
            >
              ↵
            </button>
          </form>
        </div>
      </header>

      <nav
        className="sticky top-0 z-20 flex gap-0 overflow-x-auto border-b-2 border-[var(--line)] no-scrollbar"
        style={{ background: 'rgba(12,12,12,.97)', backdropFilter: 'blur(10px)' }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap border-b-[3px] border-r border-r-[var(--line)] px-4 py-[13px] font-mono text-[10px] uppercase tracking-[0.08em] transition ${
              tab === t.id
                ? 'border-b-[var(--acid)] text-[var(--ink)]'
                : 'border-b-transparent text-[var(--muted)] hover:border-b-[var(--terra)] hover:text-[var(--ink)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="px-4 py-6 pb-24 md:px-12 md:py-10 md:pb-28">
        <Active tab={tab} />
      </section>

      <AssemblyBar onNavigate={setTab} />
    </>
  );
}

export function Shell() {
  const [tab, setTab] = useState<TabId>('hoy');

  return (
    <LankaProvider>
      <main className="min-h-screen bg-[var(--bone)] text-[var(--ink)]">
        <ShellContent tab={tab} setTab={setTab} />
      </main>
    </LankaProvider>
  );
}
