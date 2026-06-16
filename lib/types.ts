export type TabId = 'command' | 'master' | 'dashboard' | 'board' | 'assembly' | 'automations' | 'backup';

export type StickerColumnId = 'sistema' | 'tareas' | 'mercado' | 'storytelling' | 'sinResponder';
export type TaskStatus = 'backlog' | 'today' | 'doing' | 'waiting' | 'done';
export type Owner = 'Paola' | 'Mathias' | 'Ambos' | 'IA';
export type Priority = 'Alta' | 'Media' | 'Baja';
export type AssemblyKind = 'Contenido' | 'Tarea' | 'Decisión' | 'Sistema' | 'Brief IA';

export type Sticker = {
  id: string;
  columnId: StickerColumnId;
  title: string;
  note: string;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  owner: Owner;
  priority: Priority;
  dueAt?: string;
  reminderAt?: string;
  source?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Kpi = {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
};

export type AssemblyItem = {
  id: string;
  stickerIds: string[];
  kind: AssemblyKind;
  title: string;
  body: string;
  status: 'draft' | 'ticket' | 'executed' | 'archived';
  createdAt: string;
  updatedAt: string;
};

export type VaultItem = {
  id: string;
  title: string;
  kind: AssemblyKind | 'Aprendizaje';
  body: string;
  result: string;
  lesson: string;
  rating: number;
  createdAt: string;
};

export type Reminder = {
  id: string;
  title: string;
  dueAt: string;
  source?: string;
  sentAt?: string;
  createdAt: string;
};

export type LankaState = {
  version: 2;
  strategy: {
    hypothesis: string;
    mission: string;
    currentFocus: string;
  };
  stickers: Sticker[];
  tasks: Task[];
  kpis: Kpi[];
  assemblyQueue: string[];
  assemblies: AssemblyItem[];
  vault: VaultItem[];
  reminders: Reminder[];
  activity: string[];
};
