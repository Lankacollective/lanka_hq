'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultState } from './defaultState';
import { supabase, WORKSPACE_ID } from './supabase';
import type { AssemblyKind, LankaState, Owner, Priority, StickerColumnId, TaskStatus } from './types';

const STORAGE_KEY     = 'LANKA_HQ_NEXT_V2';
const STORAGE_KEY_BAK = 'LANKA_HQ_NEXT_V2_BAK'; // copia de seguridad local secundaria

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const now = () => new Date().toISOString();

// Un estado "tiene contenido" si el usuario creó al menos un ítem.
// Previene que el estado vacío/por-defecto sobreescriba datos reales en Supabase.
function hasContent(s: Partial<LankaState> | null | undefined): boolean {
  if (!s) return false;
  return (s.stickers?.length ?? 0) > 0 ||
         (s.tasks?.length    ?? 0) > 0 ||
         (s.assemblies?.length ?? 0) > 0 ||
         (s.vault?.length    ?? 0) > 0;
}

// Intenta cargar desde localStorage (primero la key principal, luego el backup).
// Devuelve null si no hay datos reales — nunca devuelve defaultState.
function loadLocal(): LankaState | null {
  if (typeof window === 'undefined') return null;
  for (const key of [STORAGE_KEY, STORAGE_KEY_BAK]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as Partial<LankaState>;
      if (hasContent(parsed)) return { ...defaultState, ...parsed };
    } catch {}
  }
  return null;
}

function saveLocal(s: LankaState) {
  try {
    const json = JSON.stringify(s);
    window.localStorage.setItem(STORAGE_KEY, json);
    if (hasContent(s)) window.localStorage.setItem(STORAGE_KEY_BAK, json); // solo sobreescribe backup si hay contenido
  } catch {}
}

type Store = {
  state: LankaState;
  setState: React.Dispatch<React.SetStateAction<LankaState>>;
  updateStrategy: (field: keyof LankaState['strategy'], value: string) => void;
  addSticker: (columnId: StickerColumnId, title: string) => void;
  updateSticker: (id: string, patch: Partial<LankaState['stickers'][number]>) => void;
  deleteSticker: (id: string) => void;
  toggleSticker: (id: string) => void;
  sendSelectedToAssembly: () => void;
  addTask: (title: string, opts?: Partial<{ status: TaskStatus; owner: Owner; priority: Priority; reminderAt: string; source: string }>) => void;
  updateTask: (id: string, patch: Partial<LankaState['tasks'][number]>) => void;
  createAssemblyFromQueue: (kind: AssemblyKind) => void;
  updateAssembly: (id: string, patch: Partial<LankaState['assemblies'][number]>) => void;
  assemblyToTask: (id: string) => void;
  archiveAssembly: (id: string) => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  quickAssemble: (kind: AssemblyKind) => void;
  forceSyncToCloud: () => void;
};

const Context = createContext<Store | null>(null);

export function LankaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LankaState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  // supabaseOk = Supabase respondió correctamente (incluso si no había fila).
  // Cuando es false no escribimos a Supabase para evitar borrar datos reales.
  const supabaseOk = useRef(false);

  // ── Carga inicial ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from('lanka_db')
      .select('data')
      .eq('id', WORKSPACE_ID)
      .single()
      .then(({ data, error }) => {
        // Supabase respondió (aunque no haya fila): la conexión existe
        if (!error || (error as { code?: string }).code === 'PGRST116') {
          supabaseOk.current = true;
        }

        if (!error && data?.data && hasContent(data.data as Partial<LankaState>)) {
          // ✅ Cloud tiene datos reales — úsalos y espéjalos en ambos backups locales
          const cloud = { ...defaultState, ...(data.data as LankaState) };
          setState(cloud);
          saveLocal(cloud);
        } else {
          // ⚠️ Cloud vacío o error de red — intenta localStorage
          const local = loadLocal();
          if (local) {
            setState(local);
            // Si Supabase está alcanzable pero sin datos, restáuralo desde local
            if (supabaseOk.current) {
              supabase.from('lanka_db')
                .upsert({ id: WORKSPACE_ID, data: local, updated_at: now(), updated_by: 'restore' })
                .then(() => undefined);
            }
          } else {
            // Inicio limpio: no hay datos en ningún lado
            setState(defaultState);
          }
        }
        setLoaded(true);
      });

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  // ── Realtime ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('workspace')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lanka_db', filter: `id=eq.${WORKSPACE_ID}` },
        payload => {
          if (!payload.new?.data) return;
          const incoming = payload.new.data as LankaState;
          setState(s => {
            // 🛡️ Rechazar si el update entrante vaciaría datos que ya existen
            if (hasContent(s) && !hasContent(incoming)) {
              console.warn('[Lanka HQ] Realtime: ignorado update vacío — datos actuales protegidos');
              return s;
            }
            return { ...s, ...incoming };
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Guardado ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;

    // 1. Siempre guardar en localStorage (doble copia si hay contenido)
    saveLocal(state);

    // 2. Solo guardar en Supabase si confirmamos que está alcanzable
    //    Esto previene sobrescribir datos reales con estado vacío en caso de fallo de red
    if (!supabaseOk.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from('lanka_db')
        .upsert({ id: WORKSPACE_ID, data: state, updated_at: now(), updated_by: 'app' })
        .then(() => undefined);
    }, 1500);
  }, [state, loaded]);

  // ── Store ────────────────────────────────────────────────────────────────────
  const store = useMemo<Store>(() => ({
    state,
    setState,
    updateStrategy(field, value) {
      setState(s => ({ ...s, strategy: { ...s.strategy, [field]: value }, activity: [`Master OS: ${field}`, ...s.activity].slice(0, 50) }));
    },
    addSticker(columnId, title) {
      if (!title.trim()) return;
      supabaseOk.current = true; // primera acción del usuario → habilitar sync
      setState(s => ({ ...s, stickers: [{ id: uid('st'), columnId, title: title.trim(), note: '', selected: false, createdAt: now(), updatedAt: now() }, ...s.stickers] }));
    },
    updateSticker(id, patch) {
      setState(s => ({ ...s, stickers: s.stickers.map(st => st.id === id ? { ...st, ...patch, updatedAt: now() } : st) }));
    },
    deleteSticker(id) {
      setState(s => ({ ...s, stickers: s.stickers.filter(st => st.id !== id), assemblyQueue: s.assemblyQueue.filter(x => x !== id) }));
    },
    toggleSticker(id) {
      setState(s => ({ ...s, stickers: s.stickers.map(st => st.id === id ? { ...st, selected: !st.selected, updatedAt: now() } : st) }));
    },
    sendSelectedToAssembly() {
      setState(s => {
        const selectedIds = s.stickers.filter(st => st.selected).map(st => st.id);
        const merged = Array.from(new Set([...s.assemblyQueue, ...selectedIds]));
        return { ...s, assemblyQueue: merged, stickers: s.stickers.map(st => selectedIds.includes(st.id) ? { ...st, selected: false, updatedAt: now() } : st), activity: [`${selectedIds.length} stickers → ensamblaje`, ...s.activity].slice(0, 50) };
      });
    },
    addTask(title, opts = {}) {
      if (!title.trim()) return;
      supabaseOk.current = true;
      setState(s => ({
        ...s,
        tasks: [{ id: uid('task'), title: title.trim(), status: opts.status ?? 'backlog', owner: opts.owner ?? 'Paola', priority: opts.priority ?? 'Media', reminderAt: opts.reminderAt, source: opts.source, done: false, createdAt: now(), updatedAt: now() }, ...s.tasks],
        reminders: opts.reminderAt ? [{ id: uid('rem'), title: title.trim(), dueAt: opts.reminderAt, source: opts.source ?? 'task', createdAt: now() }, ...s.reminders] : s.reminders,
      }));
    },
    updateTask(id, patch) {
      setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch, updatedAt: now() } : t) }));
    },
    createAssemblyFromQueue(kind) {
      setState(s => {
        const stickers = s.stickers.filter(st => s.assemblyQueue.includes(st.id));
        if (!stickers.length) return s;
        const title = stickers[0]?.title ?? `Nuevo ${kind}`;
        const body = ['Stickers fuente:', ...stickers.map(st => `- ${st.title}${st.note ? `\n  Nota: ${st.note}` : ''}`)].join('\n');
        return { ...s, assemblyQueue: [], assemblies: [{ id: uid('asm'), stickerIds: stickers.map(st => st.id), kind, title, body, status: 'draft', createdAt: now(), updatedAt: now() }, ...s.assemblies], activity: [`${kind}: ${title}`, ...s.activity].slice(0, 50) };
      });
    },
    updateAssembly(id, patch) {
      setState(s => ({ ...s, assemblies: s.assemblies.map(a => a.id === id ? { ...a, ...patch, updatedAt: now() } : a) }));
    },
    assemblyToTask(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        return { ...s, tasks: [{ id: uid('task'), title: a.title, status: 'backlog', owner: 'Paola', priority: 'Alta', source: `assembly:${a.id}`, done: false, createdAt: now(), updatedAt: now() }, ...s.tasks], assemblies: s.assemblies.map(x => x.id === id ? { ...x, status: 'ticket', updatedAt: now() } : x) };
      });
    },
    archiveAssembly(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        return { ...s, assemblies: s.assemblies.filter(x => x.id !== id), vault: [{ id: uid('vault'), title: a.title, kind: a.kind, body: a.body, result: 'Archivado', lesson: '', rating: 0, createdAt: now() }, ...s.vault] };
      });
    },
    exportJson() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lanka-hq-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    async importJson(file) {
      const text = await file.text();
      const imported = JSON.parse(text) as LankaState;
      if (!hasContent(imported)) throw new Error('El archivo importado parece estar vacío.');
      supabaseOk.current = true;
      setState({ ...defaultState, ...imported });
    },
    quickAssemble(kind) {
      setState(s => {
        const selected = s.stickers.filter(st => st.selected);
        if (!selected.length) return s;
        const title = selected[0]?.title ?? `Nuevo ${kind}`;
        const body = selected.map(st => `- ${st.title}${st.note ? `\n  Nota: ${st.note}` : ''}`).join('\n');
        const deselected = s.stickers.map(st => st.selected ? { ...st, selected: false, updatedAt: now() } : st);
        if (kind === 'Tarea') {
          return { ...s, tasks: [{ id: uid('task'), title, status: 'today' as const, owner: 'Paola' as const, priority: 'Alta' as const, source: 'Sticker → Tarea', done: false, createdAt: now(), updatedAt: now() }, ...s.tasks], stickers: deselected, activity: [`Tarea: ${title}`, ...s.activity].slice(0, 50) };
        }
        return { ...s, assemblies: [{ id: uid('asm'), stickerIds: selected.map(st => st.id), kind, title, body, status: 'draft' as const, createdAt: now(), updatedAt: now() }, ...s.assemblies], stickers: deselected, activity: [`${kind}: ${title}`, ...s.activity].slice(0, 50) };
      });
    },
    forceSyncToCloud() {
      supabaseOk.current = true;
      supabase.from('lanka_db')
        .upsert({ id: WORKSPACE_ID, data: state, updated_at: now(), updated_by: 'forced' })
        .then(() => undefined);
    },
  }), [state, loaded]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useLanka() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useLanka must be used inside LankaProvider');
  return ctx;
}
