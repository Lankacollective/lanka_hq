'use client';

import { useState } from 'react';
import { Button, Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import type { StickerColumnId, TaskStatus } from '@/lib/types';

const cols: Array<{ id: StickerColumnId; title: string; emoji: string; role: string; header: string; headerText: string; cardBg: string }> = [
  { id: 'sistema',      title: 'Sistema Lanka',  emoji: '🔵', role: 'Producto',              header: '#1565C0', headerText: '#fff',   cardBg: '#90CAF9' },
  { id: 'tareas',       title: 'Tareas',         emoji: '🟡', role: 'Ejecutables',            header: '#F9A825', headerText: '#1a1a1a',cardBg: '#FFF176' },
  { id: 'mercado',      title: 'Mercado',        emoji: '🟢', role: 'Público · Competencia',  header: '#2E7D32', headerText: '#fff',   cardBg: '#A5D6A7' },
  { id: 'storytelling', title: 'Storytelling',   emoji: '🩷', role: 'Narrativa · Contenido',  header: '#AD1457', headerText: '#fff',   cardBg: '#F48FB1' },
  { id: 'sinResponder', title: 'Sin responder',  emoji: '🟠', role: 'Pendiente de validar',   header: '#E65100', headerText: '#fff',   cardBg: '#FFCC80' },
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
        {cols.map(col => {
          const colStickers = state.stickers.filter(s => s.columnId === col.id);
          return (
          <div key={col.id} className="min-w-[258px] max-w-[258px]">
            <div className="mb-2 flex items-center justify-between px-3 py-[11px]" style={{ background: col.header, color: col.headerText, borderRadius: '9px 9px 4px 4px', boxShadow: '0 2px 0 rgba(0,0,0,.08)' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 15 }}>{col.emoji}</span>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase tracking-[0.1em]">{col.title}</div>
                  <div className="font-mono opacity-75" style={{ fontSize: 8, letterSpacing: '0.05em', marginTop: 1 }}>{col.role} · {colStickers.length}</div>
                </div>
              </div>
              <button onClick={() => {}} className="flex h-6 w-6 items-center justify-center rounded-full font-bold" style={{ background: 'rgba(255,255,255,.24)', color: col.headerText, border: 0 }}>+</button>
            </div>
            <AddSticker columnId={col.id} />
            <div className="mt-2 flex flex-col gap-2">
              {colStickers.map(st => (
                <div
                  key={st.id}
                  className="relative rounded-lg p-3 text-black transition-transform hover:scale-[1.012]"
                  style={{
                    background: col.cardBg,
                    boxShadow: st.selected
                      ? '0 0 0 4px rgba(200,216,75,.75), 2px 3px 10px rgba(0,0,0,.28)'
                      : '2px 3px 10px rgba(0,0,0,.24)',
                    outline: st.selected ? '3px solid #171717' : 'none',
                  }}
                >
                  {st.selected && (
                    <span className="absolute -top-2 right-2 rounded-full bg-[var(--ink)] px-2 py-[2px] font-mono text-[7px] uppercase tracking-[0.08em] text-white">EN ENSAMBLAJE</span>
                  )}
                  <textarea
                    value={st.title}
                    onChange={e => updateSticker(st.id, { title: e.target.value })}
                    className="w-full resize-none bg-transparent outline-none"
                    style={{ fontSize: 12.5, fontWeight: 800, lineHeight: 1.38, minHeight: 20, border: 0 }}
                  />
                  {st.note !== undefined && (
                    <textarea
                      value={st.note}
                      onChange={e => updateSticker(st.id, { note: e.target.value })}
                      placeholder="Nota..."
                      className="mt-1 w-full resize-y outline-none"
                      style={{ fontSize: 11, background: 'rgba(0,0,0,.08)', border: '1px solid rgba(0,0,0,.15)', borderRadius: 6, padding: '5px 7px', minHeight: 0 }}
                    />
                  )}
                  <div className="mt-2 flex items-center gap-1">
                    <button
                      onClick={() => toggleSticker(st.id)}
                      className="rounded-full font-mono font-black"
                      style={{ fontSize: 9, background: st.selected ? '#171717' : 'rgba(255,255,255,.5)', color: st.selected ? '#fff' : 'inherit', border: '1px solid rgba(0,0,0,.18)', padding: '3px 7px' }}
                    >
                      {st.selected ? '✓ seleccionado' : 'seleccionar'}
                    </button>
                    <button
                      onClick={() => addTask(st.title, { status: 'backlog', source: `sticker:${st.id}` })}
                      className="rounded font-mono opacity-70 hover:opacity-100"
                      style={{ fontSize: 9, background: 'rgba(0,0,0,.10)', border: 0, padding: '3px 7px' }}
                    >
                      → tarea
                    </button>
                    <button
                      onClick={() => deleteSticker(st.id)}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded-full font-mono opacity-70 hover:opacity-100"
                      style={{ fontSize: 9, background: 'rgba(0,0,0,.10)', border: 0 }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-1 font-mono opacity-55" style={{ fontSize: 8 }}>{col.emoji} {col.title}</div>
                </div>
              ))}
            </div>
          </div>
          );
        })}
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
