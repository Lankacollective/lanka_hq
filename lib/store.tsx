'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultState } from './defaultState';
import { supabase, WORKSPACE_ID } from './supabase';
import type { AssemblyKind, LankaState, Owner, Priority, StickerColumnId, TaskStatus } from './types';

const STORAGE_KEY = 'LANKA_HQ_NEXT_V2';

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const now = () => new Date().toISOString();

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
};

const Context = createContext<Store | null>(null);

function loadLocalFallback(): LankaState {
  if (typeof window === 'undefined') return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try { return { ...defaultState, ...JSON.parse(raw) } as LankaState; } catch { return defaultState; }
}

export function LankaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LankaState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carga inicial desde Supabase, fallback a localStorage
  useEffect(() => {
    supabase
      .from('lanka_db')
      .select('data')
      .eq('id', WORKSPACE_ID)
      .single()
      .then(({ data, error }) => {
        if (!error && data?.data && Object.keys(data.data).length > 0) {
          setState({ ...defaultState, ...(data.data as LankaState) });
        } else {
          setState(loadLocalFallback());
        }
        setLoaded(true);
      });

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  // Suscripción Realtime — sincroniza cambios de Mathias en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel('workspace')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lanka_db', filter: `id=eq.${WORKSPACE_ID}` }, payload => {
        if (payload.new?.data) setState(s => ({ ...s, ...(payload.new.data as LankaState) }));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Guarda en Supabase con debounce de 1.5s + mantiene localStorage como caché local
  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase
        .from('lanka_db')
        .upsert({ id: WORKSPACE_ID, data: state, updated_at: new Date().toISOString(), updated_by: 'app' })
        .then(() => undefined);
    }, 1500);
  }, [state, loaded]);

  const store = useMemo<Store>(() => ({
    state,
    setState,
    updateStrategy(field, value) {
      setState(s => ({ ...s, strategy: { ...s.strategy, [field]: value }, activity: [`Actualizado Master OS: ${field}`, ...s.activity].slice(0, 50) }));
    },
    addSticker(columnId, title) {
      if (!title.trim()) return;
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
        return {
          ...s,
          assemblyQueue: merged,
          stickers: s.stickers.map(st => selectedIds.includes(st.id) ? { ...st, selected: false, updatedAt: now() } : st),
          activity: [`${selectedIds.length} stickers enviados a ensamblaje`, ...s.activity].slice(0, 50),
        };
      });
    },
    addTask(title, opts = {}) {
      if (!title.trim()) return;
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
        const body = [
          `Tipo: ${kind}`,
          '',
          'Stickers fuente:',
          ...stickers.map(st => `- ${st.title}${st.note ? `\n  Nota: ${st.note}` : ''}`),
          '',
          'Borrador:',
          kind === 'Contenido'
            ? 'Hook:\n\nCuerpo:\n\nCTA:'
            : kind === 'Tarea'
              ? 'Resultado esperado:\n\nSiguiente acción:\n\nResponsable:'
              : kind === 'Decisión'
                ? 'Decisión propuesta:\n\nPor qué importa:\n\nFecha de revisión:'
                : kind === 'Sistema'
                  ? 'Sistema a construir:\n\nInputs:\n\nOutputs:\n\nRitual de uso:'
                  : 'Prompt/brief para IA:\n\nContexto:\n\nObjetivo:\n\nFormato de salida:',
        ].join('\n');
        return {
          ...s,
          assemblyQueue: [],
          assemblies: [{ id: uid('asm'), stickerIds: stickers.map(st => st.id), kind, title, body, status: 'draft', createdAt: now(), updatedAt: now() }, ...s.assemblies],
          activity: [`Ensamblado como ${kind}: ${title}`, ...s.activity].slice(0, 50),
        };
      });
    },
    updateAssembly(id, patch) {
      setState(s => ({ ...s, assemblies: s.assemblies.map(a => a.id === id ? { ...a, ...patch, updatedAt: now() } : a) }));
    },
    assemblyToTask(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        return {
          ...s,
          tasks: [{ id: uid('task'), title: a.title, status: 'backlog', owner: 'Paola', priority: 'Alta', source: `assembly:${a.id}`, done: false, createdAt: now(), updatedAt: now() }, ...s.tasks],
          assemblies: s.assemblies.map(x => x.id === id ? { ...x, status: 'ticket', updatedAt: now() } : x),
        };
      });
    },
    archiveAssembly(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        return {
          ...s,
          assemblies: s.assemblies.filter(x => x.id !== id),
          vault: [{ id: uid('vault'), title: a.title, kind: a.kind, body: a.body, result: 'Archivado desde Ensamblaje', lesson: '', rating: 0, createdAt: now() }, ...s.vault],
        };
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
      setState({ ...defaultState, ...imported });
    },
  }), [state, loaded]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useLanka() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useLanka must be used inside LankaProvider');
  return ctx;
}
