'use client';

import { useState } from 'react';
import { Button, Card, EditableArea, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { AssemblyKind } from '@/lib/types';

const kinds: AssemblyKind[] = ['Contenido', 'Tarea', 'Decisión', 'Sistema', 'Brief IA'];

export function AssemblyFlow() {
  const { state, createAssemblyFromQueue, updateAssembly, assemblyToTask, archiveAssembly } = useLanka();
  const [view, setView] = useState<'queue' | 'assembly' | 'vault'>('queue');
  const queueStickers = state.stickers.filter(st => state.assemblyQueue.includes(st.id));

  return (
    <div>
      <SectionTitle eyebrow="04 · Matriz → Ensamblaje → Bóveda" title="Los stickers se ensamblan" subtitle="La bóveda es memoria de valor; no basurero de ideas crudas." />
      <div className="mb-4 flex gap-2">
        {(['queue', 'assembly', 'vault'] as const).map(v => <button key={v} onClick={() => setView(v)} className={`border px-3 py-2 font-mono text-[10px] uppercase ${view === v ? 'bg-[var(--ink)] text-white' : 'bg-white'}`}>{v === 'queue' ? 'Bandeja' : v === 'assembly' ? 'Ensamblaje' : 'Bóveda'}</button>)}
      </div>

      {view === 'queue' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <h3 className="mb-3 text-xl font-black uppercase">Bandeja de ensamblaje</h3>
            {queueStickers.length === 0 ? <p className="text-sm text-[var(--muted)]">Selecciona stickers en Board y envíalos aquí.</p> : (
              <div className="grid gap-3 md:grid-cols-2">
                {queueStickers.map(st => <div key={st.id} className="border border-black/15 bg-[var(--bone)] p-3"><p className="font-bold">{st.title}</p>{st.note && <p className="mt-2 text-xs text-[var(--muted)]">{st.note}</p>}</div>)}
              </div>
            )}
          </Card>
          <Card>
            <h3 className="mb-3 font-black uppercase">Ensamblar como</h3>
            <div className="flex flex-col gap-2">
              {kinds.map(kind => <Button key={kind} onClick={() => createAssemblyFromQueue(kind)} variant="terra">{kind}</Button>)}
            </div>
          </Card>
        </div>
      )}

      {view === 'assembly' && (
        <div className="grid gap-4">
          {state.assemblies.length === 0 ? <Card>No hay piezas ensambladas todavía.</Card> : state.assemblies.map(a => (
            <Card key={a.id}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--terra)]">{a.kind} · {a.status}</p>
                  <input value={a.title} onChange={e => updateAssembly(a.id, { title: e.target.value })} className="mt-1 w-full bg-transparent text-2xl font-black uppercase outline-none" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => assemblyToTask(a.id)}>Crear tarea</Button>
                  <Button onClick={() => archiveAssembly(a.id)} variant="terra">Mandar a bóveda</Button>
                </div>
              </div>
              <EditableArea value={a.body} onChange={v => updateAssembly(a.id, { body: v })} rows={10} />
            </Card>
          ))}
        </div>
      )}

      {view === 'vault' && (
        <div className="grid gap-4 md:grid-cols-2">
          {state.vault.map(v => <Card key={v.id}><p className="font-mono text-[10px] uppercase text-[var(--muted)]">{v.kind} · {new Date(v.createdAt).toLocaleDateString('es-MX')}</p><h3 className="mt-2 text-xl font-black uppercase">{v.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6">{v.body}</p><p className="mt-3 text-sm text-[var(--terra)]">Lección: {v.lesson || 'Pendiente'}</p></Card>)}
        </div>
      )}
    </div>
  );
}
