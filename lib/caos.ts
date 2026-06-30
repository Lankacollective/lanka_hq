import type { Owner, Priority, Task, TaskStatus } from './types';

export interface CaosTaskRow {
  id: string;
  title: string;
  description?: string | null;
  project?: string | null;
  assignee?: string | null;
  date?: string | null;
  time?: string | null;
  priority?: 'alta' | 'media' | 'baja' | null;
  status?: 'inbox' | 'todo' | 'doing' | 'done' | null;
  notes?: string | null;
  source?: string | null;
  created_at?: string;
  updated_at?: string;
}

// CAOS no tiene equivalente a 'waiting' — se mapea a 'doing' (lossy, documentado)
const STATUS_TO_CAOS: Record<TaskStatus, 'inbox' | 'todo' | 'doing' | 'done'> = {
  backlog: 'inbox', today: 'todo', doing: 'doing', waiting: 'doing', done: 'done',
};
const STATUS_FROM_CAOS: Record<string, TaskStatus> = {
  inbox: 'backlog', todo: 'today', doing: 'doing', done: 'done',
};
const PRIORITY_TO_CAOS: Record<Priority, 'alta' | 'media' | 'baja'> = {
  Alta: 'alta', Media: 'media', Baja: 'baja',
};
const PRIORITY_FROM_CAOS: Record<string, Priority> = {
  alta: 'Alta', media: 'Media', baja: 'Baja',
};

export function caosRowToTask(row: CaosTaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    status: STATUS_FROM_CAOS[row.status ?? 'inbox'] ?? 'backlog',
    owner: (row.assignee ?? 'Paola') as Owner,
    priority: PRIORITY_FROM_CAOS[row.priority ?? 'media'] ?? 'Media',
    dueAt: row.date ?? undefined,
    reminderAt: undefined,
    source: row.source ?? undefined,
    parentId: undefined, // CAOS no soporta subtareas — ver nota en store.tsx
    done: row.status === 'done',
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

export async function caosGetTasks(params: Record<string, string> = {}): Promise<Task[]> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/caos${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error('Error leyendo tareas de CAOS');
  const data = await res.json();
  const rows: CaosTaskRow[] = Array.isArray(data) ? data : (data.tasks ?? []);
  return rows.map(caosRowToTask);
}

export async function caosAddTask(t: {
  title: string; status: TaskStatus; owner: Owner; priority: Priority; dueAt?: string; source?: string;
}): Promise<string | null> {
  const res = await fetch('/api/caos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: t.title,
      assignee: t.owner,
      priority: PRIORITY_TO_CAOS[t.priority],
      status: STATUS_TO_CAOS[t.status],
      date: t.dueAt,
      source: t.source ?? 'lanka-hq',
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error creando tarea en CAOS');
  return (data?.id ?? data?.task?.id ?? null) as string | null;
}

export async function caosUpdateTask(id: string, patch: Partial<{
  title: string; status: TaskStatus; owner: Owner; priority: Priority; dueAt: string;
}>): Promise<void> {
  const body: Record<string, unknown> = { id };
  if (patch.title    !== undefined) body.title    = patch.title;
  if (patch.status   !== undefined) body.status   = STATUS_TO_CAOS[patch.status];
  if (patch.owner    !== undefined) body.assignee = patch.owner;
  if (patch.priority !== undefined) body.priority = PRIORITY_TO_CAOS[patch.priority];
  if (patch.dueAt    !== undefined) body.date     = patch.dueAt;
  const res = await fetch('/api/caos', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error actualizando tarea en CAOS');
}
