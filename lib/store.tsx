'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultState } from './defaultState';
import { supabase, WORKSPACE_ID } from './supabase';
import type { AssemblyKind, ClientCase, LankaState, Owner, Priority, StickerColumnId, Task, TaskStatus, VaultItem, WorkspaceConfig } from './types';
import { DEFAULT_CONFIG } from './types';
import type { GeneratedTask } from '@/app/api/generate-tasks/route';

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
    tag: (row.tag ?? '') as string,
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
    parentId: (row.parent_id ?? undefined) as string | undefined,
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
    kind: row.kind as VaultItem['kind'],
    body: (row.body ?? '') as string,
    result: (row.result ?? '') as string,
    lesson: (row.lesson ?? '') as string,
    rating: (row.rating ?? 0) as number,
    createdAt: row.created_at as string,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCase(row: Record<string, any>): ClientCase {
  return {
    id: row.id,
    code: row.code,
    sector: row.sector,
    size: row.size ?? '',
    stage: row.stage,
    problemMain: row.problem_main ?? '',
    problemDetail: row.problem_detail ?? '',
    maturityScore: row.maturity_score ?? 0,
    maturityNotes: row.maturity_notes ?? '',
    kpis: row.kpis ?? {},
    solutionApplied: row.solution_applied ?? '',
    result: row.result ?? '',
    lesson: row.lesson ?? '',
    pattern: row.pattern ?? '',
    stickerIds: row.sticker_ids ?? [],
    filmable: row.filmable ?? false,
    startedAt: row.started_at ?? row.created_at,
    closedAt: row.closed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
    config: s.config ?? DEFAULT_CONFIG,
    updated_at: now(),
  });

  if (s.stickers.length) {
    await supabase.from('stickers').upsert(
      s.stickers.map(st => ({
        id: st.id, workspace_id: WORKSPACE_ID, column_id: st.columnId,
        title: st.title, note: st.note, tag: st.tag ?? '',
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
        source: t.source ?? null, parent_id: t.parentId ?? null,
        done: t.done, created_at: t.createdAt, updated_at: t.updatedAt,
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
  if (s.cases?.length) {
    await supabase.from('client_cases').upsert(
      s.cases.map(c => ({
        id: c.id, workspace_id: WORKSPACE_ID, code: c.code,
        sector: c.sector, size: c.size, stage: c.stage,
        problem_main: c.problemMain, problem_detail: c.problemDetail,
        maturity_score: c.maturityScore, maturity_notes: c.maturityNotes,
        kpis: c.kpis, solution_applied: c.solutionApplied,
        result: c.result, lesson: c.lesson, pattern: c.pattern,
        sticker_ids: c.stickerIds, filmable: c.filmable,
        started_at: c.startedAt, closed_at: c.closedAt ?? null,
        created_at: c.createdAt, updated_at: c.updatedAt,
      }))
    );
  }
}

// ─── Initial DB load (parallel queries) ──────────────────────────────────────

async function loadFromDB(): Promise<LankaState | null> {
  try {
    const [wsRes, stRes, taskRes, asmRes, vaultRes, casesRes] = await Promise.all([
      supabase.from('workspace').select('*').eq('id', WORKSPACE_ID).single(),
      supabase.from('stickers').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('assemblies').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('vault_items').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
      supabase.from('client_cases').select('*').eq('workspace_id', WORKSPACE_ID).order('created_at', { ascending: false }),
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
      config:        ws.config ? { ...DEFAULT_CONFIG, ...(ws.config as Partial<WorkspaceConfig>) } : DEFAULT_CONFIG,
      kpis:          ws.kpis ?? defaultState.kpis,
      stickers:      (stRes.data   ?? []).map(r => rowToSticker(r)),
      tasks:         (taskRes.data ?? []).map(rowToTask),
      assemblies:    (asmRes.data  ?? []).map(rowToAssembly),
      vault:         (vaultRes.data ?? []).map(rowToVault),
      cases:         (casesRes.data ?? []).map(rowToCase),
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
  updateConfig: (patch: Partial<WorkspaceConfig>) => void;
  addSticker: (columnId: StickerColumnId, title: string, tag?: string) => void;
  updateSticker: (id: string, patch: Partial<LankaState['stickers'][number]>) => void;
  deleteSticker: (id: string) => void;
  toggleSticker: (id: string) => void;
  sendSelectedToAssembly: () => void;
  addTask: (title: string, opts?: Partial<{ status: TaskStatus; owner: Owner; priority: Priority; reminderAt: string; source: string; parentId: string }>) => void;
  updateTask: (id: string, patch: Partial<LankaState['tasks'][number]>) => void;
  deleteTask: (id: string) => void;
  createAssemblyFromQueue: (kind: AssemblyKind) => void;
  updateAssembly: (id: string, patch: Partial<LankaState['assemblies'][number]>) => void;
  assemblyToTask: (id: string) => void;
  archiveAssembly: (id: string) => void;
  addAiTasks: (tasks: GeneratedTask[]) => void;
  addCase: (patch: Partial<ClientCase>) => void;
  updateCase: (id: string, patch: Partial<ClientCase>) => void;
  deleteCase: (id: string) => void;
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

  // ── Debounced workspace sync (strategy + kpis + config) ─────────────────────
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
        config:        state.config,
        updated_at:    now(),
      }).then(() => undefined);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.strategy, state.kpis, state.config, loaded]);

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

      // client_cases
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'client_cases', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, cases: [rowToCase(row), ...s.cases.filter(x => x.id !== row.id)] }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'client_cases', filter: `workspace_id=eq.${WORKSPACE_ID}` }, ({ new: row }) => {
        setState(s => ({ ...s, cases: s.cases.map(x => x.id === row.id ? rowToCase(row) : x) }));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'client_cases' }, ({ old }) => {
        setState(s => ({ ...s, cases: s.cases.filter(x => x.id !== (old as Row).id) }));
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
    },

    updateConfig(patch) {
      setState(s => ({ ...s, config: { ...s.config, ...patch } }));
    },

    addSticker(columnId, title, tag = '') {
      if (!title.trim()) return;
      const st = { id: uid('st'), columnId, title: title.trim(), note: '', tag, selected: false, createdAt: now(), updatedAt: now() };
      setState(s => ({ ...s, stickers: [st, ...s.stickers] }));
      supabase.from('stickers').insert({
        id: st.id, workspace_id: WORKSPACE_ID, column_id: columnId,
        title: st.title, note: '', tag, created_at: st.createdAt, updated_at: st.updatedAt,
      }).then(() => undefined);
    },

    updateSticker(id, patch) {
      setState(s => ({ ...s, stickers: s.stickers.map(st => st.id === id ? { ...st, ...patch, updatedAt: now() } : st) }));
      const db: Row = { updated_at: now() };
      if (patch.title    !== undefined) db.title     = patch.title;
      if (patch.note     !== undefined) db.note      = patch.note;
      if (patch.tag      !== undefined) db.tag       = patch.tag;
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
        status: opts.status ?? state.config.defaultTaskStatus,
        owner: opts.owner ?? state.config.defaultOwner,
        priority: opts.priority ?? state.config.defaultPriority,
        dueAt: undefined, reminderAt: opts.reminderAt,
        source: opts.source, parentId: opts.parentId,
        done: false, createdAt: now(), updatedAt: now(),
      };
      // subtareas se insertan al final; tareas raíz al principio
      setState(s => ({
        ...s,
        tasks: opts.parentId ? [...s.tasks, t] : [t, ...s.tasks],
      }));
      supabase.from('tasks').insert({
        id: t.id, workspace_id: WORKSPACE_ID, title: t.title,
        status: t.status, owner: t.owner, priority: t.priority,
        reminder_at: t.reminderAt ?? null, source: t.source ?? null,
        parent_id: t.parentId ?? null,
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
      if (patch.dueAt       !== undefined) db.due_at      = patch.dueAt || null;
      if (patch.reminderAt  !== undefined) db.reminder_at = patch.reminderAt;
      supabase.from('tasks').update(db).eq('id', id).then(() => undefined);
    },

    deleteTask(id) {
      // CASCADE en DB elimina subtareas automáticamente
      setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id && t.parentId !== id) }));
      supabase.from('tasks').delete().eq('id', id).then(() => undefined);
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

    addCase(patch) {
      const c: ClientCase = {
        id: uid('case'),
        code: patch.code ?? 'Nuevo caso',
        sector: patch.sector ?? 'Restaurante casual',
        size: patch.size ?? '',
        stage: patch.stage ?? 'prospecto',
        problemMain: patch.problemMain ?? '',
        problemDetail: patch.problemDetail ?? '',
        maturityScore: patch.maturityScore ?? 0,
        maturityNotes: patch.maturityNotes ?? '',
        kpis: patch.kpis ?? {},
        solutionApplied: patch.solutionApplied ?? '',
        result: patch.result ?? '',
        lesson: patch.lesson ?? '',
        pattern: patch.pattern ?? '',
        stickerIds: patch.stickerIds ?? [],
        filmable: patch.filmable ?? false,
        startedAt: patch.startedAt ?? now(),
        closedAt: patch.closedAt,
        createdAt: now(),
        updatedAt: now(),
      };
      setState(s => ({ ...s, cases: [c, ...s.cases] }));
      supabase.from('client_cases').insert({
        id: c.id, workspace_id: WORKSPACE_ID, code: c.code,
        sector: c.sector, size: c.size, stage: c.stage,
        problem_main: c.problemMain, problem_detail: c.problemDetail,
        maturity_score: c.maturityScore, maturity_notes: c.maturityNotes,
        kpis: c.kpis, solution_applied: c.solutionApplied,
        result: c.result, lesson: c.lesson, pattern: c.pattern,
        sticker_ids: c.stickerIds, filmable: c.filmable,
        started_at: c.startedAt, closed_at: c.closedAt ?? null,
        created_at: c.createdAt, updated_at: c.updatedAt,
      }).then(() => undefined);
    },

    updateCase(id, patch) {
      setState(s => ({ ...s, cases: s.cases.map(c => c.id === id ? { ...c, ...patch, updatedAt: now() } : c) }));
      const db: Row = { updated_at: now() };
      if (patch.code            !== undefined) db.code             = patch.code;
      if (patch.sector          !== undefined) db.sector           = patch.sector;
      if (patch.size            !== undefined) db.size             = patch.size;
      if (patch.stage           !== undefined) db.stage            = patch.stage;
      if (patch.problemMain     !== undefined) db.problem_main     = patch.problemMain;
      if (patch.problemDetail   !== undefined) db.problem_detail   = patch.problemDetail;
      if (patch.maturityScore   !== undefined) db.maturity_score   = patch.maturityScore;
      if (patch.maturityNotes   !== undefined) db.maturity_notes   = patch.maturityNotes;
      if (patch.kpis            !== undefined) db.kpis             = patch.kpis;
      if (patch.solutionApplied !== undefined) db.solution_applied = patch.solutionApplied;
      if (patch.result          !== undefined) db.result           = patch.result;
      if (patch.lesson          !== undefined) db.lesson           = patch.lesson;
      if (patch.pattern         !== undefined) db.pattern          = patch.pattern;
      if (patch.stickerIds      !== undefined) db.sticker_ids      = patch.stickerIds;
      if (patch.filmable        !== undefined) db.filmable         = patch.filmable;
      if (patch.closedAt        !== undefined) db.closed_at        = patch.closedAt ?? null;
      supabase.from('client_cases').update(db).eq('id', id).then(() => undefined);
    },

    deleteCase(id) {
      setState(s => ({ ...s, cases: s.cases.filter(c => c.id !== id) }));
      supabase.from('client_cases').delete().eq('id', id).then(() => undefined);
    },

    addAiTasks(generated: GeneratedTask[]) {
      const newTasks: Task[] = [];
      const dbRows: object[] = [];
      const t = now();

      generated.forEach(g => {
        const rootId = uid('task');
        const root: Task = {
          id: rootId, title: g.title,
          status: 'today', owner: g.owner, priority: g.priority,
          dueAt: g.dueAt, source: 'IA · Stickers',
          done: false, createdAt: t, updatedAt: t,
        };
        newTasks.push(root);
        dbRows.push({
          id: root.id, workspace_id: WORKSPACE_ID, title: root.title,
          status: root.status, owner: root.owner, priority: root.priority,
          due_at: root.dueAt ?? null, source: root.source, done: false,
          created_at: t, updated_at: t,
        });

        g.subtasks.forEach(subTitle => {
          const sub: Task = {
            id: uid('task'), title: subTitle,
            status: 'backlog', owner: g.owner, priority: 'Media',
            parentId: rootId, source: 'IA · subtarea',
            done: false, createdAt: t, updatedAt: t,
          };
          newTasks.push(sub);
          dbRows.push({
            id: sub.id, workspace_id: WORKSPACE_ID, title: sub.title,
            status: sub.status, owner: sub.owner, priority: sub.priority,
            parent_id: rootId, source: sub.source, done: false,
            created_at: t, updated_at: t,
          });
        });
      });

      setState(s => ({ ...s, tasks: [...newTasks, ...s.tasks] }));
      supabase.from('tasks').insert(dbRows).then(() => undefined);
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
