export type TabId = 'hoy' | 'board' | 'sistema' | 'boveda' | 'casos' | 'config';

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

export type WorkspaceConfig = {
  workspaceName: string;
  owners: Owner[];
  defaultOwner: Owner;
  defaultPriority: Priority;
  defaultTaskStatus: TaskStatus;
  showDoneTasksInHoy: boolean;
  boardCompactMode: boolean;
  aiModel: 'claude-haiku-4-5-20251001' | 'claude-sonnet-4-6';
};

export const DEFAULT_CONFIG: WorkspaceConfig = {
  workspaceName: 'Lanka HQ',
  owners: ['Paola', 'Mathias', 'Ambos', 'IA'],
  defaultOwner: 'Paola',
  defaultPriority: 'Media',
  defaultTaskStatus: 'today',
  showDoneTasksInHoy: false,
  boardCompactMode: false,
  aiModel: 'claude-haiku-4-5-20251001',
};

// ─── Client Cases ─────────────────────────────────────────────────────────────

export type CaseStage =
  | 'prospecto'
  | 'diagnóstico'
  | 'implementación'
  | 'seguimiento'
  | 'cerrado';

export type FbSector =
  | 'Restaurante casual'
  | 'Fine dining'
  | 'Bar / Cantina'
  | 'Café / Panadería'
  | 'Fast casual'
  | 'Food truck'
  | 'Dark kitchen'
  | 'Catering'
  | 'Hotel F&B'
  | 'Otro';

export type ClientCase = {
  id: string;
  /** Código anónimo visible (p.ej. "Bistró Centro", "Cliente 🦁") */
  code: string;
  sector: FbSector;
  /** Número de mesas o puntos de venta */
  size: string;
  stage: CaseStage;
  problemMain: string;
  problemDetail: string;
  /** 0-100: posición en el índice de madurez operativa */
  maturityScore: number;
  /** Notas sobre el diagnóstico de madurez */
  maturityNotes: string;
  /** KPIs del cliente (capturados manualmente por ahora) */
  kpis: {
    foodCostTheoretical?: number;   // % teórico según recetas
    foodCostActual?: number;        // % real (inventario)
    laborCost?: number;             // % nómina / ventas
    averageTicket?: number;         // MXN
    monthlyRevenue?: number;        // MXN
    breakEvenMonthly?: number;      // MXN
    wastePercent?: number;          // % merma
    tableTurnover?: number;         // vueltas/día promedio
  };
  /** Qué se hizo / qué propuso Lanka */
  solutionApplied: string;
  /** Resultado medible obtenido */
  result: string;
  /** Lección aprendida para el sistema */
  lesson: string;
  /** Patrón repetible identificado */
  pattern: string;
  /** IDs de stickers relacionados a este caso */
  stickerIds: string[];
  /** ¿Es documentable para contenido? */
  filmable: boolean;
  startedAt: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export const MATURITY_BANDS: Array<{ min: number; max: number; label: string; desc: string; color: string }> = [
  { min: 0,  max: 25,  label: 'Caos',    desc: 'Sin datos, decisiones intuitivas, costos desconocidos', color: '#FF1744' },
  { min: 26, max: 50,  label: 'Datos',   desc: 'Tiene POS pero no lo analiza, food cost desconocido',   color: '#FF6D00' },
  { min: 51, max: 75,  label: 'Sistema', desc: 'Recetas estandarizadas, KPIs semanales, inventario activo', color: '#F9A825' },
  { min: 76, max: 100, label: 'Escala',  desc: 'Forecasting, labor scheduling, menú engineering activo', color: '#BFFF00' },
];

export function maturityBand(score: number) {
  return MATURITY_BANDS.find(b => score >= b.min && score <= b.max) ?? MATURITY_BANDS[0];
}

export type LankaState = {
  version: 2;
  strategy: {
    hypothesis: string;
    mission: string;
    currentFocus: string;
    [key: string]: string | boolean | undefined;
  };
  config: WorkspaceConfig;
  stickers: Sticker[];
  tasks: Task[];
  kpis: Kpi[];
  assemblyQueue: string[];
  assemblies: AssemblyItem[];
  vault: VaultItem[];
  cases: ClientCase[];
  reminders: Reminder[];
  activity: string[];
};
