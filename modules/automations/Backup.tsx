'use client';

import { Button, Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

export function Backup() {
  const { exportJson, importJson } = useLanka();
  return (
    <div>
      <SectionTitle eyebrow="06 · Backup / Sync" title="Portabilidad total" subtitle="Exporta e importa el estado central completo." />
      <Card>
        <div className="flex flex-wrap gap-3">
          <Button onClick={exportJson}>Exportar JSON</Button>
          <label className="cursor-pointer border border-black/20 bg-white px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
            Importar JSON
            <input type="file" accept=".json" className="hidden" onChange={e => e.target.files?.[0] && importJson(e.target.files[0])} />
          </label>
        </div>
      </Card>
    </div>
  );
}
