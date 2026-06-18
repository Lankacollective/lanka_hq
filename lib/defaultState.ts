import type { LankaState } from './types';
import { DEFAULT_CONFIG, MODELO_INDEX } from './types';

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const defaultState: LankaState = {
  version: 2,
  config: DEFAULT_CONFIG,
  strategy: {
    hypothesis: 'Lanka convierte experiencia F&B real + IA + criterio estético en sistemas operativos rentables para negocios gastronómicos.',
    mission: 'Diseñar infraestructura estratégica, operativa y narrativa para convertir caos F&B en margen, cultura y ejecución medible.',
    currentFocus: 'Día Cero: capturar caos, seleccionar patrones, ensamblar primera pieza y crear acciones reales.',
  },
  stickers: [
    { id: id('st'), columnId: 'sistema',      tag: 'Producto',               title: 'Definir primer producto Lanka: diagnóstico, auditoría o sistema mensual', note: '', acquisitionAngle: undefined, selected: false, createdAt: now(), updatedAt: now() },
    { id: id('st'), columnId: 'tareas',       tag: 'Tareas ejecutables',    title: 'Pedir a Mathias los 5 KPIs que revisa primero en una auditoría',           note: '', acquisitionAngle: undefined, selected: false, createdAt: now(), updatedAt: now() },
    { id: id('st'), columnId: 'mercado',      tag: 'Público Objetivo',      title: 'Restaurantes llenos pueden perder dinero',                                   note: '', acquisitionAngle: undefined, selected: false, createdAt: now(), updatedAt: now() },
    { id: id('st'), columnId: 'storytelling', tag: 'Pilar',                 title: 'Tu restaurante puede estar lleno y aun así perder dinero',                   note: '', acquisitionAngle: undefined, selected: false, createdAt: now(), updatedAt: now() },
    { id: id('st'), columnId: 'sinResponder', tag: 'Preguntas sin resolver', title: '¿Lanka debe mostrarse como consultoría, laboratorio o software?',            note: '', acquisitionAngle: undefined, selected: false, createdAt: now(), updatedAt: now() },
  ],
  tasks: [
    { id: id('task'), title: 'Cerrar Día Cero: revisar stickers, tareas y primer ensamblaje', status: 'today', owner: 'Paola', priority: 'Alta', done: false, createdAt: now(), updatedAt: now() },
  ],
  kpis: [
    { id: 'content',   label: 'Contenido publicado', current: 0, target: 3,      unit: 'piezas/semana' },
    { id: 'tasks',     label: 'Tareas cerradas',      current: 0, target: 8,      unit: 'semana' },
    { id: 'prospects', label: 'Prospectos',           current: 0, target: 5,      unit: 'mes' },
    { id: 'revenue',   label: 'Ingreso Lanka',        current: 0, target: 350000, unit: 'MXN/mes' },
  ],
  assemblyQueue: [],
  assemblies: [],
  cases: [],
  // Inicializa todas las secciones del índice con estado pendiente
  modelo: MODELO_INDEX.map(s => ({
    id: id('mod'),
    key: s.key,
    index: s.index,
    title: s.title,
    description: s.description,
    content: '',
    status: 'pendiente' as const,
    publicParticipation: false,
    internalNotes: '',
    stickerIds: [],
    updatedAt: now(),
  })),
  roadmap: [
    // ── Hecho ──────────────────────────────────────────────────────────────────
    { id: id('r'), title: 'Diseño Dark Warm Brutalism',           category: 'UX',           status: 'hecho',      priority: 'Alta',  description: 'Design system completo con tokens CSS, tipografías Barlow/Space Grotesk/Space Mono.',                          notes: '', updatedAt: now() },
    { id: id('r'), title: 'Base de datos relacional (Supabase)',  category: 'datos',         status: 'hecho',      priority: 'Alta',  description: '5 tablas relacionales (workspace, stickers, tasks, assemblies, vault_items) + Realtime.',                      notes: '', updatedAt: now() },
    { id: id('r'), title: 'Taxonomía de stickers',                category: 'UX',           status: 'hecho',      priority: 'Alta',  description: 'Subcategorías por columna con dropdown filtrado. COLUMN_TAGS tipado.',                                         notes: '', updatedAt: now() },
    { id: id('r'), title: 'Subtareas jerárquicas',                category: 'UX',           status: 'hecho',      priority: 'Alta',  description: 'parent_id en tasks, TaskRow recursivo, progreso visual inline.',                                              notes: '', updatedAt: now() },
    { id: id('r'), title: 'Pipeline IA → Tareas',                 category: 'IA',           status: 'hecho',      priority: 'Alta',  description: 'Stickers seleccionados → Claude (Haiku/Sonnet) → modal de revisión → tareas con subtareas.',                   notes: '', updatedAt: now() },
    { id: id('r'), title: 'Configuración global',                 category: 'UX',           status: 'hecho',      priority: 'Media', description: 'Tab Config: owners, defaults, modelo IA, backup/restore, estadísticas.',                                       notes: '', updatedAt: now() },
    { id: id('r'), title: 'Módulo Casos de Cliente',              category: 'consultoría',  status: 'hecho',      priority: 'Alta',  description: 'ClientCase con madurez 0-100, 8 KPIs, patrón, filmable, Realtime sync.',                                      notes: '', updatedAt: now() },
    { id: id('r'), title: 'Módulo Marca Personal',                category: 'contenido',    status: 'hecho',      priority: 'Media', description: 'Pilares de contenido, plataformas activas, pipeline Idea→Publicado.',                                         notes: '', updatedAt: now() },
    { id: id('r'), title: 'Exportar snapshot Markdown',           category: 'IA',           status: 'hecho',      priority: 'Media', description: 'Desde Master OS: copia o descarga contexto estratégico listo para pegar en Claude.',                           notes: '', updatedAt: now() },
    { id: id('r'), title: 'Índice Modelo de Negocio',             category: 'consultoría',  status: 'hecho',      priority: 'Alta',  description: '21 secciones documentables desde 0 (problema) hasta 8.1 (fidelización). Con participación pública.',           notes: '', updatedAt: now() },

    // ── En proceso ─────────────────────────────────────────────────────────────
    { id: id('r'), title: 'API key ANTHROPIC configurada en Vercel', category: 'integración', status: 'en proceso', priority: 'Alta', description: 'Variable de entorno ANTHROPIC_API_KEY necesaria para el pipeline de IA.',                                       notes: 'Paola lo configura manualmente en Vercel Dashboard', updatedAt: now() },

    // ── Pendiente ──────────────────────────────────────────────────────────────
    { id: id('r'), title: 'Vista Diagnóstico de cliente',         category: 'consultoría',  status: 'pendiente',  priority: 'Alta',  description: 'Form de captura rápida de KPIs de cliente → cálculo automático de food cost gap, punto de equilibrio, score de madurez → PDF o brief exportable.', notes: '', updatedAt: now() },
    { id: id('r'), title: 'Generación automática de Brief',       category: 'IA',           status: 'pendiente',  priority: 'Alta',  description: 'Desde Casos: botón "Generar Brief IA" que toma KPIs del caso + patrones del Bóveda → Claude produce brief de diagnóstico y propuesta personalizada.', notes: '', updatedAt: now() },
    { id: id('r'), title: 'Prompt base Lanka (contexto IA)',      category: 'IA',           status: 'pendiente',  priority: 'Alta',  description: 'Sección en Config para construir el system prompt de Lanka: hipótesis + protocolos + patrones de casos → alimenta todas las llamadas a Claude.', notes: '', updatedAt: now() },
    { id: id('r'), title: 'Búsqueda en Bóveda',                  category: 'UX',           status: 'pendiente',  priority: 'Media', description: 'Buscar por keyword en VaultItems cuando haya 50+ entradas. Filtro por kind.',                                     notes: '', updatedAt: now() },
    { id: id('r'), title: 'Filtro de cliente en stickers',        category: 'datos',        status: 'pendiente',  priority: 'Media', description: 'Campo clientCode en stickers para agrupar por caso. Vista "stickers de este cliente".',                          notes: '', updatedAt: now() },
    { id: id('r'), title: 'Histórico de KPIs (tendencia)',        category: 'datos',        status: 'pendiente',  priority: 'Media', description: 'Guardar valor anterior de KPI para mostrar tendencia semanal (↑↓ vs semana pasada).',                          notes: '', updatedAt: now() },
    { id: id('r'), title: 'Integración POS (futuro)',             category: 'integración',  status: 'pendiente',  priority: 'Baja',  description: 'API de Square/Toast/Lightspeed para importar ventas y calcular food cost automáticamente.',                    notes: 'Producto premium post-validación', updatedAt: now() },
    { id: id('r'), title: 'Sección Protocolos Lanka',             category: 'consultoría',  status: 'pendiente',  priority: 'Media', description: 'En Sistema: checklist de auditoría, template de diagnóstico, entregables estándar — la IP consultiva documentada.', notes: '', updatedAt: now() },
    { id: id('r'), title: 'Notificaciones / recordatorios',       category: 'UX',           status: 'pendiente',  priority: 'Baja',  description: 'Alertas de tareas vencidas y recordatorio diario configurable.',                                               notes: '', updatedAt: now() },
  ],
  vault: [
    { id: id('vault'), title: 'Día Cero · Hipótesis inicial Lanka', kind: 'Aprendizaje', body: 'El primer territorio narrativo fuerte es: restaurantes que venden pero no saben si ganan.', result: 'Insight base creado', lesson: 'La conversación debe empezar en rentabilidad invisible, no en IA.', rating: 4, createdAt: now() },
  ],
  reminders: [],
  activity: ['Sistema inicializado'],
};
