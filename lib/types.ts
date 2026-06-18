export type TabId = 'hoy' | 'board' | 'sistema' | 'boveda';

export type StickerColumnId = 'sistema' | 'tareas' | 'mercado' | 'storytelling' | 'sinResponder';
export type TaskStatus = 'backlog' | 'today' | 'doing' | 'waiting' | 'done';
export type Owner = 'Paola' | 'Mathias' | 'Ambos' | 'IA';
export type Priority = 'Alta' | 'Media' | 'Baja';
export type AssemblyKind = 'Contenido' | 'Tarea' | 'Decisión' | 'Sistema' | 'Brief IA';

// ─── Sticker taxonomy ─────────────────────────────────────────────────────────

export type StickerSubcategory = {
  sistema:      'Producto' | 'Puntos de dolor' | 'Resuelve' | 'Herramientas' | 'Financiero' | 'Expansión' | 'Entregables' | 'Protocolos';
  mercado:      'Público Objetivo' | 'Competencia' | 'Diferenciador' | 'Inspo' | 'Objeciones';
  storytelling: 'Framework' | 'Pilar' | 'Building in Public' | 'Tono / Voz';
  tareas:       'Tareas ejecutables' | 'Ideas' | 'Caballo de Troya' | 'Ganchos';
  sinResponder: 'Preguntas sin resolver' | 'Barreras' | 'Riesgos Internos';
};

// Tag for a given column is the union of that column's subcategory literals
export type StickerTag<C extends StickerColumnId = StickerColumnId> = StickerSubcategory[C];

// Runtime lookup: column → allowed tag values
export const COLUMN_TAGS: { [C in StickerColumnId]: ReadonlyArray<StickerSubcategory[C]> } = {
  sistema:      ['Producto', 'Puntos de dolor', 'Resuelve', 'Herramientas', 'Financiero', 'Expansión', 'Entregables', 'Protocolos'],
  mercado:      ['Público Objetivo', 'Competencia', 'Diferenciador', 'Inspo', 'Objeciones'],
  storytelling: ['Framework', 'Pilar', 'Building in Public', 'Tono / Voz'],
  tareas:       ['Tareas ejecutables', 'Ideas', 'Caballo de Troya', 'Ganchos'],
  sinResponder: ['Preguntas sin resolver', 'Barreras', 'Riesgos Internos'],
} as const;

// ─── Core entities ────────────────────────────────────────────────────────────

export type Sticker = {
  id: string;
  columnId: StickerColumnId;
  title: string;
  note: string;
  /** Subcategory tag — constrained to the column's valid values at runtime */
  tag: string;
  /** Free-form sales/acquisition angle. Optional, never required to save. */
  acquisitionAngle?: string;
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
  parentId?: string;   // undefined = tarea raíz; set = subtarea
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
