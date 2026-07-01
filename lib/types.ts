export type TabId = 'hoy' | 'board' | 'sistema' | 'boveda' | 'casos' | 'modelo' | 'ruta' | 'config';

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

// ─── Business Model Index ─────────────────────────────────────────────────────

export type ModeloSectionStatus = 'pendiente' | 'en proceso' | 'documentado' | 'publicado';

export type ModeloSection = {
  id: string;
  /** Clave fija del índice (no editable) */
  key: string;
  /** Número de sección visible: "0", "1", "2.3", "7.1" etc. */
  index: string;
  title: string;
  description: string;
  content: string;
  status: ModeloSectionStatus;
  /** ¿Hay participación del público en esta sección? */
  publicParticipation: boolean;
  /** Notas internas / behind the scenes */
  internalNotes: string;
  /** IDs de stickers relacionados */
  stickerIds: string[];
  updatedAt: string;
};

export const MODELO_INDEX: Array<Pick<ModeloSection, 'key' | 'index' | 'title' | 'description'>> = [
  { key: 'problema',         index: '0',   title: 'Identificación del problema / oportunidad',   description: 'El dolor real en el mercado que Lanka ataca. ¿Qué no funciona y por qué nadie lo ha resuelto bien?' },
  { key: 'conceptualizacion',index: '1',   title: 'Conceptualización del modelo de negocio',      description: '¿Cómo se ataca ese problema? ¿Consultoría, software, sistema híbrido? ¿Revenue model?' },
  { key: 'publico',          index: '2',   title: 'Público objetivo / nicho de mercado',           description: '¿Quién paga? ¿Quién decide? ¿Qué perfil tiene el cliente ideal de Lanka?' },
  { key: 'variables',        index: '2.1', title: 'Variables internas y externas',                 description: 'Recursos, capacidades y limitantes de Lanka + factores del entorno que afectan el negocio.' },
  { key: 'propuesta',        index: '2.2', title: 'Propuesta de valor',                            description: '¿Qué promete Lanka que nadie más promete? ¿Cómo se diferencia en precio, velocidad, resultado?' },
  { key: 'pestel',           index: '2.3', title: 'PESTEL',                                        description: 'Político, Económico, Social, Tecnológico, Ecológico, Legal — análisis del entorno macro F&B México.' },
  { key: 'foda',             index: '2.4', title: 'FODA',                                          description: 'Fortalezas, Oportunidades, Debilidades, Amenazas — análisis interno y externo de Lanka.' },
  { key: 'came',             index: '2.5', title: 'CAME',                                          description: 'Corregir debilidades, Afrontar amenazas, Mantener fortalezas, Explotar oportunidades.' },
  { key: 'competencia',      index: '3',   title: 'Competencia',                                   description: '¿Quién más hace esto? ¿Consultoras, software F&B, freelancers? Mapeo y posicionamiento relativo.' },
  { key: 'obj_cualitativo',  index: '3.1', title: 'Objetivos cualitativos',                        description: 'Posicionamiento deseado, percepción de marca, reputación a construir en 12-24 meses.' },
  { key: 'obj_cuantitativo', index: '3.2', title: 'Objetivos cuantitativos',                       description: 'Clientes, ingresos, márgenes, NPS, retención — métricas concretas y fechas.' },
  { key: 'oferta_gastro',    index: '4',   title: 'Oferta gastronómica (producto)',                 description: 'Qué entrega Lanka en términos de diagnóstico, sistema, protocolo — el "menú" de servicios.' },
  { key: 'oferta_servicio',  index: '5',   title: 'Oferta de servicios',                           description: 'Cómo se entrega: formato, duración, modalidad, precio, garantías, soporte post-entrega.' },
  { key: 'infraestructura',  index: '6',   title: 'Infraestructura y tecnología',                  description: 'Qué herramientas, sistemas y procesos internos usa Lanka para operar y escalar.' },
  { key: 'marketing',        index: '7',   title: 'Plan de marketing',                             description: 'Cómo Lanka llega al cliente. Canales, mensajes, timing, presupuesto.' },
  { key: 'logo',             index: '7.1', title: 'Logo e identidad visual',                       description: 'Sistema visual de Lanka: logo, paleta, tipografía, aplicaciones — la promesa visual.' },
  { key: 'posicionamiento',  index: '7.2', title: 'Posicionamiento de marca',                      description: '¿Cómo quiere ser recordado Lanka en la mente del cliente? Territorio único y diferencial.' },
  { key: 'branding',         index: '7.3', title: 'Branding',                                      description: 'Expresión completa de la marca: tono, voz, estética, experiencia de cliente.' },
  { key: 'merchandising',    index: '7.4', title: 'Merchandising / materiales',                    description: 'Materiales físicos y digitales que refuerzan la marca en cada punto de contacto.' },
  { key: 'comunicacion',     index: '8',   title: 'Plan de comunicación y fidelización',           description: 'Cómo Lanka se comunica con prospectos, clientes activos y comunidad a largo plazo.' },
  { key: 'fidelizacion',     index: '8.1', title: 'Programa de fidelización y comunidad',          description: 'Cómo se retiene al cliente, se genera referidos y se construye comunidad alrededor de Lanka.' },
];

// ─── Product Roadmap ──────────────────────────────────────────────────────────

export type RoadmapStatus = 'hecho' | 'en proceso' | 'pendiente' | 'descartado';
export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  category: 'consultoría' | 'IA' | 'UX' | 'datos' | 'contenido' | 'integración';
  status: RoadmapStatus;
  priority: 'Alta' | 'Media' | 'Baja';
  notes: string;
  updatedAt: string;
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

// ─── Diagnostic (public form) ─────────────────────────────────────────────────

export type DiagnosticSection = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export type DiagnosticQuestion = {
  id: string;
  question_key: string;
  section: DiagnosticSection;
  order_index: number;
  question_text: string;
  help_text: string | null;
  input_type: 'radio' | 'number' | 'text' | 'select' | 'boolean';
  options: string[] | null;
  weight: number;
};

export type DiagnosticResult = {
  session_id: string;
  maturity_score: number;
  maturity_band: 'Caos' | 'Datos' | 'Sistema' | 'Escala';
  section_scores: Record<DiagnosticSection, number>;
  ai_summary: string;
  ai_priorities: Array<{ title: string; detail: string; impact: string }>;
  ai_quick_wins: Array<{ title: string; action: string; timeline: string }>;
};

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
  modelo: ModeloSection[];
  roadmap: RoadmapItem[];
  reminders: Reminder[];
  activity: string[];
};
