'use client';

import { useState } from 'react';
import { MasterOS } from '@/modules/master-os/MasterOS';
import { Dashboard } from '@/modules/dashboard/Dashboard';
import { Automations } from '@/modules/automations/Automations';
import { Backup } from '@/modules/automations/Backup';
import { MarcaPersonal } from './MarcaPersonal';

type SubTab = 'master' | 'marca' | 'metricas' | 'auto' | 'backup';

const subTabs: Array<{ id: SubTab; label: string }> = [
  { id: 'master',   label: 'Master OS' },
  { id: 'marca',    label: 'Marca Personal' },
  { id: 'metricas', label: 'Métricas' },
  { id: 'auto',     label: 'Automatizaciones' },
  { id: 'backup',   label: 'Backup' },
];

export function Sistema() {
  const [sub, setSub] = useState<SubTab>('master');
  return (
    <div>
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-[var(--line)]">
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`whitespace-nowrap border-b-[3px] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] transition ${sub === t.id ? 'border-b-[var(--terra)] text-[var(--ink)]' : 'border-b-transparent text-[var(--muted)] hover:text-[var(--ink)]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {sub === 'master'   && <MasterOS />}
      {sub === 'marca'    && <MarcaPersonal />}
      {sub === 'metricas' && <Dashboard />}
      {sub === 'auto'     && <Automations />}
      {sub === 'backup'   && <Backup />}
    </div>
  );
}
