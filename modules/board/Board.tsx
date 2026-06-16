'use client';

import { useState } from 'react';
import { Button, Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { StickerColumnId, TaskStatus } from '@/lib/types';

const cols: Array<{ id: StickerColumnId; title: string; emoji: string; className: string }> = [
  { id: 'sistema', title: 'Sistema Lanka', emoji: '🔵', className: 'bg-blue-200' },
  { id: 'tareas', title: 'Tareas', emoji: '🟡', className: 'bg-yellow-200' },
  { id: 'mercado', title: 'Mercado', emoji: '🟢', className: 'bg-green-200' },
  { id: 'storytelling', title: 'Storytelling', emoji: '🩷', className: 'bg-pink-200' },
  { id: 'sinResponder', title: 'Sin responder', emoji: '🟠', className: 'bg-orange-200' },
];

const taskCols: Array<{ id: TaskStatus; title: string }> = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'today', title: 'Hoy' },
  { id: 'doing', title: 'En progreso' },
  { id: 'waiting', title: 'Esperando' },
  { id: 'done', title: 'Hecho' },
];

function AddSticker({ columnId }: { columnId: StickerColumnId }) {
  const [title, setTitle] = useState('');
  const { addSticker } = useLanka();
  return (
    <form onSubmit={e => { e.preventDefault(); addSticker(columnId, title); setTitle(''); }} className="mt-2 flex gap-2">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nuevo sticker..." className="min-w-0 flex-1 border border-black/15 bg-white/60 px-2 py-2 text-xs outline-none" />
      <button className="bg-black px-2 py-1 text-xs font-bold text-white">+</button>
    </form>
  );
}

export function Board() {
  const { state, updateSticker, deleteSticker, toggleSticker, sendSelectedToAssembly, addTask, updateTask } = useLanka();
  const selectedCount = state.stickers.filter(s => s.selected).length;

  return (
    <div>
      <SectionTitle eyebrow="03 · Board" title="Stickers de colores + ejecución" subtitle="Los stickers son materia prima: se seleccionan, se envían a bandeja y luego se ensamblan." />

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-black/15 bg-white/70 p-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{selectedCount} stickers seleccionados</span>
        <Button onClick={sendSelectedToAssembly} variant="terra">Enviar a ensamblaje</Button>
      </div>

      <div className="mb-10 flex gap-4 overflow-x-auto pb-2">
        {cols.map(col => (
          <div key={col.id} className="min-w-[260px] max-w-[260px]">
            <div className="mb-2 flex items-center justify-between border border-black/15 bg-[var(--ink)] px-3 py-2 text-white">
              <span className="text-sm font-black uppercase">{col.emoji} {col.title}</span>
            </div>
            <AddSticker columnId={col.id} />
            <div className="mt-3 space-y-3">
              {state.stickers.filter(s => s.columnId === col.id).map(st => (
                <div key={st.id} className={`rounded-md border-2 p-3 text-black shadow ${col.className} ${st.selected ? 'border-black' : 'border-transparent'}`}>
                  <textarea value={st.title} onChange={e => updateSticker(st.id, { title: e.target.value })} className="w-full resize-none bg-transparent text-sm font-bold leading-5 outline-none" />
                  <textarea value={st.note} onChange={e => updateSticker(st.id, { note: e.target.value })} placeholder="Nota..." className="mt-2 w-full resize-y rounded border border-black/15 bg-black/5 p-2 text-xs outline-none" />
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => toggleSticker(st.id)} className="rounded bg-black/10 px-2 py-1 text-[10px] font-bold uppercase">{st.selected ? 'Seleccionado' : 'Seleccionar'}</button>
                    <button onClick={() => addTask(st.title, { status: 'backlog', source: `sticker:${st.id}` })} className="rounded bg-black/10 px-2 py-1 text-[10px] font-bold uppercase">Tarea</button>
                    <button onClick={() => deleteSticker(st.id)} className="ml-auto rounded bg-black/10 px-2 py-1 text-[10px] font-bold uppercase">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-2xl font-black uppercase tracking-[-0.03em]">Kanban de ejecución</h3>
      <div className="grid gap-4 md:grid-cols-5">
        {taskCols.map(col => (
          <Card key={col.id}>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{col.title}</h4>
            <div className="space-y-2">
              {state.tasks.filter(t => t.status === col.id).map(t => (
                <div key={t.id} className="border border-black/10 bg-[var(--bone)] p-3">
                  <input value={t.title} onChange={e => updateTask(t.id, { title: e.target.value })} className="w-full bg-transparent text-sm font-bold outline-none" />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {taskCols.map(dest => <button key={dest.id} onClick={() => updateTask(t.id, { status: dest.id, done: dest.id === 'done' })} className="border border-black/15 px-2 py-1 font-mono text-[9px] uppercase">{dest.title}</button>)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
