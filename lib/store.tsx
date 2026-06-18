'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultState } from './defaultState';
import { supabase, WORKSPACE_ID } from './supabase';
import type { AssemblyKind, LankaState, Owner, Priority, StickerColumnId, TaskStatus } from './types';

const STORAGE_KEY = 'LANKA_HQ_NEXT_V2';

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const now = () => new Date().toISOString();

// ─── localStorage fallback ────────────────────────────────────────────────────

function saveLocal(s: LankaState) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function loadLocal(): LankaState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LankaState) : null;
  } catch { return null; }
}

// ─── Row mappers (DB snake_case → app camelCase) ──────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function rowToSticker(row: Row, selected = false) {
  return {
    id: row.id as string,
    columnId: row.column_id as StickerColumnId,
    title: row.title as string,
    note: (row.note ?? '') as string,
    selected,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToTask(row: Row) {
  return {
    id: row.id as string,
    title: row.title as string,
    status: row.status as TaskStatus,
    owner: row.owner as Owner,
    priority: row.priority as Priority,
    dueAt: (row.due_at ?? undefined) as string | undefined,
    reminderAt: (row.reminder_at ?? undefined) as string | undefined,
    source: (row.source ?? undefined) as string | undefined,
    done: row.done as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToAssembly(row: Row) {
  return {
    id: row.id as string,
    stickerIds: (row.sticker_ids ?? []) as string[],
    kind: row.kind as AssemblyKind,
    title: row.title as string,
    body: (row.body ?? '') as string,
    status: row.status as 'draft' | 'ticket' | 'executed' | 'archived',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToVault(row: Row) {
  return {
    id: row.id as string,
    title: row.title as string,
    kind: row.kind as string,
    body: (row.body ?? '') as string,
    result: (row.result ?? '') as string,
    lesson: (row.lesson ?? '') as string,
    rating: (row.rating ?? 0) as number,
    createdAt: row.created_at as string,
  };
}

// ─── Bulk seed (used on first run / import) ───────────────────────────────────

async function seedDB(s: LankaState) {
  await supabase.from('workspace').upsert({
    id: WORKSPACE_ID,
    hypothesis: s.strategy.hypothesis,
    mission: s.strategy.mission,
    current_focus: s.strategy.currentFocus,
    kpis: s.kpis,
    updated_at: now(),
  });

  if (s.stickers.length) {
    await supabase.from('stickers').upsert(
      s.stickers.map(st => ({
        id: st.id, workspace_id: WORKSPACE_ID, column_id: st.columnId,
        title: st.title, note: st.note,
        created_at: st.createdAt, updated_at: st.updatedAt,
      }))
    );
  }
  if (s.tasks.length) {
    await supabase.from('tasks').upsert(
      s.tasks.map(t => ({
        id: t.id, workspace_id: WORKSPACE_ID, title: t.title,
        status: t.status, owner: t.owner, priority: t.priority,
        due_at: t.dueAt ?? null, reminder_at: t.reminderAt ?? null,
        source: t.source ?? null, done: t.done,
        created_at: t.createdAt, updated_at: t.updatedAt,
      }))
    );
  }
  if (s.assemblies.length) {
    await supabase.from('assemblies').upsert(
      s.assemblies.map(a => ({
        id: a.id, workspace_id: WORKSPACE_ID, sticker_ids: a.stickerIds,
        kind: a.kind, title: a.title, body: a.body, status: a.status,
        created_at: a.createdAt, updated_at: a.updatedAt,
      }))
    );
  }
  if (s.vault.length) {
    await supabase.from('vault_items').upsert(
      s.vault.map(v => ({
        id: v.id, workspace_id: WORKSPACE_ID, title: v.title,
        kind: v.kind, body: v.body, result: v.result,
        lesson: v.lesson, rating: v.rating, created_at: v.createdAt,
      }))
    );
  }
}

// ─── Initial DB load (parallel queries) ──────────────────────────────────────

async function loadFromDB(): Promise<LankaState | null> {
  try {
    const [wsRes, stRes, taskRes, asmRes, vaultRes] = await Promise.all([
      supabase.from('workspace').select('*').eq('id', WORKSPACE_ID).single(),
      supabase.from('stickers').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('assemblies').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('vault_items').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
    ]);

    // PGRST116 = row not found: first run, not an error
    if (wsRes.error?.code === 'PGRST116') return null;
    if (wsRes.error) throw wsRes.error;

    const ws = wsRes.data;
    return {
      version: 2,
      strategy: {
        hypothesis:    ws.hypothesis    ?? defaultState.strategy.hypothesis,
        mission:       ws.mission       ?? defaultState.strategy.mission,
        currentFocus:  ws.current_focus ?? defaultState.strategy.currentFocus,
      },
      kpis:          ws.kpis ?? defaultState.kpis,
      stickers:      (stRes.data   ?? []).map(r => rowToSticker(r)),
      tasks:         (taskRes.data ?? []).map(rowToTask),
      assemblies:    (asmRes.data  ?? []).map(rowToAssembly),
      vault:         (vaultRes.data ?? []).map(rowToVault),
      assemblyQueue: [],
      reminders:     [],
      activity:      ['Cargado desde Supabase'],
    };
  } catch {
    return null;
  }
}

// ─── Store type ───────────────────────────────────────────────────────────────

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

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LankaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LankaState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const wsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const dbState = await loadFromDB();
      if (dbState) {
        setState(dbState);
        saveLocal(dbState);
      } else {
        // No workspace row yet: try localStorage, then seed DB from it
        const local = loadLocal();
        const seed = local ?? defaultState;
        setState(seed);
        await seedDB(seed);
      }
      setLoaded(true);
    })();

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);

  // ── Persist to localStorage on every state change ───────────────────────────
  useEffect(() => {
    if (!loaded) return;
    saveLocal(state);
  }, [state, loaded]);

  // ── Debounced workspace sync (strategy + kpis only) ─────────────────────────
  // Triggered by any change to strategy or kpis via setState (e.g. Dashboard KPI edits)
  useEffect(() => {
    if (!loaded) return;
    if (wsTimer.current) clearTimeout(wsTimer.current);
    wsTimer.current = setTimeout(() => {
      supabase.from('workspace').upsert({
        id: WORKSPACE_ID,
        hypothesis:    state.strategy.hypothesis,
        mission:       state.strategy.mission,
        current_focus: state.strategy.currentFocus,
        kpis:          state.kpis,
        updated_at:    now(),
      }).then(() => undefined);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.strategy, state.kpis, loaded]);

  // ── Realtime: per-table subscriptions ───────────────────────────────────────
  useEffect(() => {
    const ch = supabase.channel('relational_sync')

      // stickers
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'stickers', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, stickers: [rowToSticker(row), ...s.stickers.filter(x => x.id !== row.id)] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'stickers', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, stickers: s.stickers.map(x => x.id === row.id ? rowToSticker(row, x.selected) : x) }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'stickers' }, ({ old }) => {
        setState(s => ({ ...s, stickers: s.stickers.filter(x => x.id !== (old as Row).id) }));
      })

      // tasks
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, tasks: [rowToTask(row), ...s.tasks.filter(x => x.id !== row.id)] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, tasks: s.tasks.map(x => x.id === row.id ? rowToTask(row) : x) }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tasks' }, ({ old }) => {
        setState(s => ({ ...s, tasks: s.tasks.filter(x => x.id !== (old as Row).id) }));
      })

      // assemblies
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assemblies', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, assemblies: [rowToAssembly(row), ...s.assemblies.filter(x => x.id !== row.id)] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'assemblies', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, assemblies: s.assemblies.map(x => x.id === row.id ? rowToAssembly(row) : x) }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'assemblies' }, ({ old }) => {
        setState(s => ({ ...s, assemblies: s.assemblies.filter(x => x.id !== (old as Row).id) }));
      })

      // vault_items
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'vault_items', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, vault: [rowToVault(row), ...s.vault.filter(x => x.id !== row.id)] }));
      })

      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const store = useMemo<Store>(() => ({
    state,
    setState,

    updateStrategy(field, value) {
      setState(s => ({ ...s, strategy: { ...s.strategy, [field]: value } }));
      // workspace sync is handled by the debounced useEffect above
    },

    addSticker(columnId, title) {
      if (!title.trim()) return;
      const st = { id: uid('st'), columnId, title: title.trim(), note: '', selected: false, createdAt: now(), updatedAt: now() };
      setState(s => ({ ...s, stickers: [st, ...s.stickers] }));
      supabase.from('stickers').insert({
        id: st.id, workspace_id: WORKSPACE_ID, column_id: columnId,
        title: st.title, note: '', created_at: st.createdAt, updated_at: st.updatedAt,
      }).then(() => undefined);
    },

    updateSticker(id, patch) {
      setState(s => ({ ...s, stickers: s.stickers.map(st => st.id === id ? { ...st, ...patch, updatedAt: now() } : st) }));
      const db: Row = { updated_at: now() };
      if (patch.title    !== undefined) db.title     = patch.title;
      if (patch.note     !== undefined) db.note      = patch.note;
      if (patch.columnId !== undefined) db.column_id = patch.columnId;
      supabase.from('stickers').update(db).eq('id', id).then(() => undefined);
    },

    deleteSticker(id) {
      setState(s => ({ ...s, stickers: s.stickers.filter(st => st.id !== id), assemblyQueue: s.assemblyQueue.filter(x => x !== id) }));
      supabase.from('stickers').delete().eq('id', id).then(() => undefined);
    },

    // selected is UI-only, never written to DB
    toggleSticker(id) {
      setState(s => ({ ...s, stickers: s.stickers.map(st => st.id === id ? { ...st, selected: !st.selected } : st) }));
    },

    sendSelectedToAssembly() {
      setState(s => {
        const ids = s.stickers.filter(st => st.selected).map(st => st.id);
        return {
          ...s,
          assemblyQueue: Array.from(new Set([...s.assemblyQueue, ...ids])),
          stickers: s.stickers.map(st => ids.includes(st.id) ? { ...st, selected: false } : st),
        };
      });
    },

    addTask(title, opts = {}) {
      if (!title.trim()) return;
      const t = {
        id: uid('task'), title: title.trim(),
        status: opts.status ?? 'backlog' as TaskStatus,
        owner: opts.owner ?? 'Paola' as Owner,
        priority: opts.priority ?? 'Media' as Priority,
        dueAt: undefined, reminderAt: opts.reminderAt,
        source: opts.source, done: false,
        createdAt: now(), updatedAt: now(),
      };
      setState(s => ({ ...s, tasks: [t, ...s.tasks] }));
      supabase.from('tasks').insert({
        id: t.id, workspace_id: WORKSPACE_ID, title: t.title,
        status: t.status, owner: t.owner, priority: t.priority,
        reminder_at: t.reminderAt ?? null, source: t.source ?? null,
        done: false, created_at: t.createdAt, updated_at: t.updatedAt,
      }).then(() => undefined);
    },

    updateTask(id, patch) {
      setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? { ...t, ...patch, updatedAt: now() } : t) }));
      const db: Row = { updated_at: now() };
      if (patch.title       !== undefined) db.title       = patch.title;
      if (patch.status      !== undefined) db.status      = patch.status;
      if (patch.owner       !== undefined) db.owner       = patch.owner;
      if (patch.priority    !== undefined) db.priority    = patch.priority;
      if (patch.done        !== undefined) db.done        = patch.done;
      if (patch.dueAt       !== undefined) db.due_at      = patch.dueAt;
      if (patch.reminderAt  !== undefined) db.reminder_at = patch.reminderAt;
      supabase.from('tasks').update(db).eq('id', id).then(() => undefined);
    },

    createAssemblyFromQueue(kind) {
      setState(s => {
        const stickers = s.stickers.filter(st => s.assemblyQueue.includes(st.id));
        if (!stickers.length) return s;
        const a = {
          id: uid('asm'), stickerIds: stickers.map(st => st.id), kind,
          title: stickers[0]?.title ?? `Nuevo ${kind}`,
          body: ['Stickers fuente:', ...stickers.map(st => `- ${st.title}${st.note ? `\n  Nota: ${st.note}` : ''}`)].join('\n'),
          status: 'draft' as const, createdAt: now(), updatedAt: now(),
        };
        supabase.from('assemblies').insert({
          id: a.id, workspace_id: WORKSPACE_ID, sticker_ids: a.stickerIds,
          kind, title: a.title, body: a.body, status: 'draft',
          created_at: a.createdAt, updated_at: a.updatedAt,
        }).then(() => undefined);
        return { ...s, assemblyQueue: [], assemblies: [a, ...s.assemblies] };
      });
    },

    updateAssembly(id, patch) {
      setState(s => ({ ...s, assemblies: s.assemblies.map(a => a.id === id ? { ...a, ...patch, updatedAt: now() } : a) }));
      const db: Row = { updated_at: now() };
      if (patch.title  !== undefined) db.title  = patch.title;
      if (patch.body   !== undefined) db.body   = patch.body;
      if (patch.status !== undefined) db.status = patch.status;
      supabase.from('assemblies').update(db).eq('id', id).then(() => undefined);
    },

    assemblyToTask(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        const t = {
          id: uid('task'), title: a.title,
          status: 'backlog' as const, owner: 'Paola' as const, priority: 'Alta' as const,
          source: `assembly:${a.id}`, done: false, createdAt: now(), updatedAt: now(),
        };
        supabase.from('tasks').insert({
          id: t.id, workspace_id: WORKSPACE_ID, title: t.title,
          status: t.status, owner: t.owner, priority: t.priority,
          source: t.source, done: false, created_at: t.createdAt, updated_at: t.updatedAt,
        }).then(() => undefined);
        supabase.from('assemblies').update({ status: 'ticket', updated_at: now() }).eq('id', id).then(() => undefined);
        return {
          ...s,
          tasks: [t, ...s.tasks],
          assemblies: s.assemblies.map(x => x.id === id ? { ...x, status: 'ticket' as const, updatedAt: now() } : x),
        };
      });
    },

    archiveAssembly(id) {
      setState(s => {
        const a = s.assemblies.find(x => x.id === id);
        if (!a) return s;
        const v = { id: uid('vault'), title: a.title, kind: a.kind, body: a.body, result: 'Archivado', lesson: '', rating: 0, createdAt: now() };
        supabase.from('assemblies').delete().eq('id', id).then(() => undefined);
        supabase.from('vault_items').insert({
          id: v.id, workspace_id: WORKSPACE_ID, title: v.title, kind: v.kind,
          body: v.body, result: v.result, lesson: v.lesson, rating: v.rating, created_at: v.createdAt,
        }).then(() => undefined);
        return { ...s, assemblies: s.assemblies.filter(x => x.id !== id), vault: [v, ...s.vault] };
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
      await seedDB(imported);
      setState({ ...defaultState, ...imported, assemblyQueue: [], activity: ['Importado desde JSON'] });
    },

    quickAssemble(kind) {
      setState(s => {
        const selected = s.stickers.filter(st => st.selected);
        if (!selected.length) return s;
        const title = selected[0]?.title ?? `Nuevo ${kind}`;
        const body = selected.map(st => `- ${st.title}${st.note ? `\n  Nota: ${st.note}` : ''}`).join('\n');
        const deselected = s.stickers.map(st => st.selected ? { ...st, selected: false } : st);

        if (kind === 'Tarea') {
          const t = { id: uid('task'), title, status: 'today' as const, owner: 'Paola' as const, priority: 'Alta' as const, source: 'Sticker → Tarea', done: false, createdAt: now(), updatedAt: now() };
          supabase.from('tasks').insert({
            id: t.id, workspace_id: WORKSPACE_ID, title, status: 'today', owner: 'Paola',
            priority: 'Alta', source: 'Sticker → Tarea', done: false,
            created_at: t.createdAt, updated_at: t.updatedAt,
          }).then(() => undefined);
          return { ...s, tasks: [t, ...s.tasks], stickers: deselected };
        }

        const a = { id: uid('asm'), stickerIds: selected.map(st => st.id), kind, title, body, status: 'draft' as const, createdAt: now(), updatedAt: now() };
        supabase.from('assemblies').insert({
          id: a.id, workspace_id: WORKSPACE_ID, sticker_ids: a.stickerIds,
          kind, title, body, status: 'draft', created_at: a.createdAt, updated_at: a.updatedAt,
        }).then(() => undefined);
        return { ...s, assemblies: [a, ...s.assemblies], stickers: deselected };
      });
    },

    forceSyncToCloud() {
      seedDB(state).then(() => undefined);
    },

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state]);

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useLanka() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useLanka must be used inside LankaProvider');
  return ctx;
}
