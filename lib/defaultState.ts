import type { LankaState } from './types';
import { DEFAULT_CONFIG } from './types';

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
  vault: [
    { id: id('vault'), title: 'Día Cero · Hipótesis inicial Lanka', kind: 'Aprendizaje', body: 'El primer territorio narrativo fuerte es: restaurantes que venden pero no saben si ganan.', result: 'Insight base creado', lesson: 'La conversación debe empezar en rentabilidad invisible, no en IA.', rating: 4, createdAt: now() },
  ],
  reminders: [],
  activity: ['Sistema inicializado'],
};
