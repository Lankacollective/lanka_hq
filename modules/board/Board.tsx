'use client';

import { useState } from 'react';
import { Card, SectionTitle } from '@/components/Primitives';
import { useLanka } from '@/lib/store';
import { COLUMN_TAGS } from '@/lib/types';
import type { StickerColumnId, TaskStatus } from '@/lib/types';

const cols: Array<{
  id: StickerColumnId;
  title: string;
  emoji: string;
  role: string;
  header: string;
  headerText: string;
  cardBg: string;
}> = [
  { id: 'sistema',      title: 'Sistema Lanka',  emoji: '🔵', role: 'Producto',             header: '#1565C0', headerText: '#fff',    cardBg: '#90CAF9' },
  { id: 'tareas',       title: 'Tareas',         emoji: '🟡', role: 'Ejecutables',           header: '#F9A825', headerText: '#111',    cardBg: '#FFF176' },
  { id: 'mercado',      title: 'Mercado',        emoji: '🟢', role: 'Público · Competencia', header: '#2E7D32', headerText: '#fff',    cardBg: '#A5D6A7' },
  { id: 'storytelling', title: 'Storytelling',   emoji: '🩷', role: 'Narrativa · Contenido', header: '#AD1457', headerText: '#fff',    cardBg: '#F48FB1' },
  { id: 'sinResponder', title: 'Sin clasificar', emoji: '🟠', role: 'Bandeja de entrada',    header: '#E65100', headerText: '#fff',    cardBg: '#FFCC80' },
];

const taskCols: Array<{ id: TaskStatus; title: string }> = [
  { id: 'backlog',  title: 'Backlog' },
  { id: 'today',   title: 'Hoy' },
  { id: 'doing',   title: 'En progreso' },
  { id: 'waiting', title: 'Esperando' },
  { id: 'done',    title: 'Hecho' },
];

function AddSticker({ columnId }: { columnId: StickerColumnId }) {
  const [title, setTitle] = useState('');
  const { addSticker } = useLanka();
  const defaultTag = COLUMN_TAGS[columnId][0];

  return (
    <form
      onSubmit={e => { e.preventDefault(); addSticker(columnId, title, defaultTag); setTitle(''); }}
      className="mt-2 flex gap-2"
    >
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Nuevo sticker..."
        className="min-w-0 flex-1 border border-black/20 bg-white/90 px-2 py-2 text-xs text-black outline-none focus:border-black/50"
      />
      <button type="submit" className="bg-black px-2 py-1 text-xs font-bold text-white">+</button>
    </form>
  );
}

export function Board() {
  const { state, updateSticker, deleteSticker, toggleSticker, addTask, updateTask } = useLanka();

  return (
    <div>
      <SectionTitle
        eyebrow="02 · Board"
        title="Captura + Triage + Ejecución"
        subtitle="Click en un sticker para seleccionarlo · La barra inferior lo convierte en acción"
      />

      {/* ── Sticker columns ── */}
      <div className="mb-10 flex gap-4 overflow-x-auto pb-4">
        {cols.map(col => {
          const colStickers = state.stickers.filter(s => s.columnId === col.id);
          const tags = COLUMN_TAGS[col.id];

          return (
            <div key={col.id} className="min-w-[268px] max-w-[268px]">
              {/* Column header */}
              <div
                className="mb-2 flex items-center gap-2 px-3 py-[11px]"
                style={{ background: col.header, color: col.headerText, borderRadius: '9px 9px 4px 4px', boxShadow: '0 2px 0 rgba(0,0,0,.18)' }}
              >
                <span style={{ fontSize: 15 }}>{col.emoji}</span>
                <div>
                  <div className="font-mono text-[10px] font-black uppercase tracking-[0.1em]">{col.title}</div>
                  <div className="font-mono opacity-75" style={{ fontSize: 8, letterSpacing: '0.05em', marginTop: 1 }}>
                    {col.role} · {colStickers.length}
                  </div>
                </div>
              </div>

              <AddSticker columnId={col.id} />

              {/* Sticker cards */}
              <div className="mt-2 flex flex-col gap-2">
                {colStickers.map(st => (
                  <div
                    key={st.id}
                    className="relative cursor-pointer rounded-lg p-3 transition-transform hover:scale-[1.012]"
                    style={{
                      background: col.cardBg,
                      color: '#111',
                      boxShadow: st.selected
                        ? `0 0 0 3px #BFFF00, 2px 3px 12px rgba(0,0,0,.4)`
                        : '2px 3px 10px rgba(0,0,0,.32)',
                      outline: st.selected ? '2px solid #111' : 'none',
                    }}
                    onClick={e => {
                      if ((e.target as HTMLElement).closest('textarea, button, input, select')) return;
                      toggleSticker(st.id);
                    }}
                  >
                    {/* Tag badge */}
                    <div className="mb-2 flex items-center justify-between gap-1">
                      <select
                        value={st.tag}
                        onChange={e => updateSticker(st.id, { tag: e.target.value })}
                        className="max-w-[160px] cursor-pointer rounded border-0 bg-black/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.06em] text-black/70 outline-none hover:bg-black/20"
                        style={{ appearance: 'none' }}
                        title="Subcategoría"
                      >
                        {tags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                      {st.selected && (
                        <span className="rounded-full bg-black px-2 py-[2px] font-mono text-[7px] uppercase tracking-[0.08em] text-white">
                          ✓ selec.
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <textarea
                      value={st.title}
                      onChange={e => updateSticker(st.id, { title: e.target.value })}
                      className="w-full resize-none bg-transparent outline-none"
                      style={{ fontSize: 12.5, fontWeight: 800, lineHeight: 1.38, minHeight: 20, border: 0, color: '#111' }}
                    />

                    {/* Note */}
                    <textarea
                      value={st.note}
                      onChange={e => updateSticker(st.id, { note: e.target.value })}
                      placeholder="Nota..."
                      className="mt-1 w-full resize-y outline-none"
                      style={{ fontSize: 11, background: 'rgba(0,0,0,.08)', border: '1px solid rgba(0,0,0,.15)', borderRadius: 5, padding: '4px 7px', minHeight: 0, color: '#111' }}
                    />

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-1">
                      <button
                        onClick={() => addTask(st.title, { status: 'today', source: `sticker:${st.id}` })}
                        className="rounded font-mono opacity-70 hover:opacity-100"
                        style={{ fontSize: 9, background: 'rgba(0,0,0,.10)', border: 0, padding: '3px 7px', color: '#111' }}
                      >
                        → tarea directa
                      </button>
                      <button
                        onClick={() => deleteSticker(st.id)}
                        className="ml-auto flex h-5 w-5 items-center justify-center rounded-full opacity-50 hover:opacity-100"
                        style={{ fontSize: 11, background: 'rgba(0,0,0,.12)', border: 0, color: '#111' }}
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-1 font-mono opacity-45" style={{ fontSize: 8, color: '#111' }}>
                      {col.emoji} {col.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Task kanban ── */}
      <p className="mb-3 border-l-[3px] border-[var(--ink2)] pl-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
        Kanban de ejecución
      </p>
      <div className="grid gap-4 md:grid-cols-5">
        {taskCols.map(col => (
          <Card key={col.id}>
            <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">{col.title}</h4>
            <div className="space-y-2">
              {state.tasks.filter(t => t.status === col.id).map(t => (
                <div key={t.id} className="border border-[var(--line)] bg-[var(--surface2)] p-3">
                  <input
                    value={t.title}
                    onChange={e => updateTask(t.id, { title: e.target.value })}
                    className="w-full bg-transparent text-sm font-bold text-[var(--ink)] outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {taskCols.map(dest => (
                      <button
                        key={dest.id}
                        onClick={() => updateTask(t.id, { status: dest.id, done: dest.id === 'done' })}
                        className="border border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--muted)] hover:border-[var(--ink2)] hover:text-[var(--ink)]"
                      >
                        {dest.title}
                      </button>
                    ))}
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
