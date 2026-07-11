import type { EditorialEntry } from './types';

/**
 * Base Editorial v0.1 — 8 entradas fundacionales del sistema editorial de @pao.sag / LANKA.
 * Todas en estado 'borrador': Paola las activa o edita después de revisar.
 * Identificador de versión: EDITORIAL_SEED_V1 (para posibles v0.2, v1.0, etc.)
 */
export const EDITORIAL_SEED_V1: Array<Omit<EditorialEntry, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Voz Paola / reglas editoriales',
    category: 'Voz Paola',
    tags: ['voz', 'tono', 'reglas', 'identidad'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `TONO GENERAL
Directo, sin rodeos, desde la experiencia real. No académico, no genérico.
Persona: operadora / estratega / fundadora. No "influencer de negocios".
Registro: primera persona, presente. "Cuando audito un restaurante..." — no "Se debe considerar...".

LO QUE SIEMPRE HACEMOS
- Anclar en un KPI real o un caso concreto antes de dar contexto
- Nombrar el problema antes de la solución
- Terminar con una acción concreta o una pregunta que active al lector

LO QUE NUNCA HACEMOS
- Predicar sin dato
- Dar consejos flotantes sin contexto operativo
- Usar jerga de marketing sin sustancia (escalabilidad, disruptivo, ecosistema)
- Comparar con grandes marcas sin relevancia para el operador F&B

MARCADORES DE VOZ
- "El restaurante estaba lleno y perdía dinero."
- "Nadie te dice que el food cost real no es el que calculaste con tus recetas."
- "Antes de hablar de experiencia, hay que hablar de food cost."

// Completa con ejemplos aprobados desde la categoría 'Ejemplos aprobados'.`,
  },

  {
    title: 'Estructura madre de contenido',
    category: 'Estructura madre',
    tags: ['estructura', 'framework', 'contenido', 'formato'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `Todo el contenido de @pao.sag parte de una estructura de 3 capas:

CAPA 1 — CASO REAL
Un restaurante, un problema específico, un número concreto.
Ejemplo: "Un café con 80% de mesas ocupadas y food cost de 44%."
Regla: si no hay caso, no hay contenido.

CAPA 2 — SISTEMA
El patrón que se repite. La palanca que mueve el número.
Ejemplo: "El problema no era el menú. Era que nadie calculaba el costo real de producción."
Regla: el sistema tiene nombre, pasos y es replicable.

CAPA 3 — ACCIÓN
Qué hacer esta semana, con qué herramienta, en qué orden.
Ejemplo: "Esta semana: levanta un costeo real de tus 5 platillos más vendidos."
Regla: la acción debe poder hacerse sin contratar a nadie.

APLICA A
- Posts de LinkedIn (300 palabras max)
- Threads
- El Ticket (newsletter dominical)
- Workshops y presentaciones
- Estudios de caso internos

PRINCIPIO CARDINAL
Primero el diagnóstico, luego la solución. Nunca al revés.`,
  },

  {
    title: 'El ticket de los domingos',
    category: 'Series activas',
    tags: ['serie', 'newsletter', 'domingo', 'ticket', 'semanal'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: 'El Ticket',
    relatedChapter: '',
    relatedCase: '',
    body: `DESCRIPCIÓN
Newsletter semanal. Sale domingos. Un problema real de F&B + un sistema + una acción concreta.

PÚBLICO
Operadores de F&B, fundadores de restaurantes, cocineros que dan el salto empresarial.
No es para chefs aspiracionales. Es para el que ya tiene mesas y no sabe si está ganando.

QUÉ CAPTURAR EN CADA EDICIÓN
- El número específico del problema (food cost, labor cost, punto de equilibrio)
- El sistema que lo explica en términos simples
- La acción concreta que el lector puede ejecutar esta semana
- Cualquier dato que cambie la percepción del operador

FORMATO
- 1 problema real con número
- 1 sistema que lo explica
- 1 acción concreta para esta semana
- Máximo 400 palabras
- Sin introducción larga ni despedida corporativa

TONO
Carta directa de alguien que ha visto el mismo error 50 veces.
No consultora que vende. Operadora que comparte.

CTA FIJO
"¿Cuál es tu food cost real esta semana?"

FRECUENCIA
Semanal. Siempre domingo. Si no hay caso real, no sale.

// Agregar enlace a archivo de plantilla cuando esté listo.`,
  },

  {
    title: 'Un negocio de F&B desde cero',
    category: 'Series activas',
    tags: ['serie', 'building-in-public', 'f&b', 'desde-cero', 'lanka'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `DESCRIPCIÓN
Documenta el proceso de construir Lanka Collective en público.
No es un diario personal. Es un reporte de sistema.

FORMATO
Posts de LinkedIn + threads ocasionales.
Sin frecuencia fija — solo cuando hay algo real que reportar.

FILOSOFÍA
Building in public desde la estrategia, no desde el lifestyle.
Se documenta lo que se construye, no cómo se siente construirlo.

LO QUE SE DOCUMENTA
- Decisiones reales con el razonamiento detrás
- Errores y lo que cambiaron
- KPIs cuando estén disponibles y tengan contexto
- Herramientas y sistemas adoptados con resultado (food cost, menu engineering, inventario)

LO QUE NO SE DOCUMENTA
- Teoría sin evidencia propia
- Aspiraciones sin fecha ni métrica
- Contenido motivacional vacío
- Números de vanidad (seguidores, likes)

CRITERIO DE PUBLICACIÓN
¿Esto le sirve al operador de F&B que está 6 meses detrás de nosotros? Si sí, se publica.`,
  },

  {
    title: 'Índice Operativo F&B',
    category: 'Índice F&B',
    tags: ['índice', 'operativo', 'f&b', 'referencia', 'kpi'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `Mapa de los temas clave que cubre el sistema editorial de Lanka.
Cada pieza de contenido debe poder ubicarse en una o más secciones.

SECCIONES PRINCIPALES

1. FOOD COST
   - Teórico vs. real (por qué siempre difieren)
   - Recetas estándar y costeo real de producción
   - Merma: identificación, control, impacto en margen
   - Benchmark por tipo de negocio F&B

2. LABOR COST
   - Nómina / ventas: cálculo y lectura
   - Productividad por turno
   - Scheduling y eficiencia operativa

3. PUNTO DE EQUILIBRIO
   - Cálculo del break-even mensual
   - Qué pasa cuando las mesas están llenas pero no hay margen
   - Análisis por canal de venta

4. INGENIERÍA DE MENÚ (menu engineering)
   - Mezcla de ventas (mix)
   - Margen de contribución por ítem
   - Categorización: estrella / vaca / interrogante / perro

5. INVENTARIOS
   - Metodología de levantamiento
   - Frecuencia recomendada por tamaño de negocio
   - Diferencial teórico vs. real como indicador de alerta

6. MADUREZ OPERATIVA
   - Score 0–100
   - Bandas: Caos (0–25) / Datos (26–50) / Sistema (51–75) / Escala (76–100)
   - Qué indica cada banda y qué acción sugiere

// Vincular a secciones del Modelo de Negocio cuando aplique.`,
  },

  {
    title: 'Definición de caso filmable',
    category: 'Casos anónimos',
    tags: ['caso', 'filmable', 'criterio', 'contenido', 'anonimato'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `Un caso es "filmable" si cumple TODOS estos criterios:

CRITERIOS DE ELEGIBILIDAD
1. Tiene un problema medible antes y un resultado medible después
   Ejemplo: food cost 44% → 31% en 8 semanas
2. El cliente da permiso explícito (anonimato siempre disponible como opción)
3. Lanka tuvo intervención directa y continua, no solo asesoría puntual
4. El resultado es replicable — puede convertirse en sistema aplicable a otros negocios

USO DE CASOS FILMABLES
- Posts de LinkedIn anónimos (siempre con permiso)
- Capítulos de El Ticket
- Estudios de caso en propuestas comerciales
- Ejemplos en workshops

CASOS NO FILMABLES
Se archivan en Bóveda como aprendizaje interno. No se publican aunque tengan buen resultado.
Causas comunes: cliente no da permiso, resultado no es generalizable, intervención fue incompleta.

PROTOCOLO DE ANONIMIZACIÓN
- Cambiar nombre del negocio y ubicación
- Redondear métricas al 5% más cercano
- Revisar que no haya detalle identificatorio en el texto
- El cliente aprueba el borrador antes de publicar

// Registrar cada caso en el módulo Casos con campo 'filmable: true/false'.`,
  },

  {
    title: 'Lógica de participación comunitaria',
    category: 'Comunidad',
    tags: ['comunidad', 'participación', 'audiencia', 'validación'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `La comunidad de Lanka no es una audiencia pasiva. Es un panel de validación.

QUÉ VALIDAMOS CON LA COMUNIDAD
- Prioridad de temas: ¿qué problema quieren resolver primero?
- Pertinencia de contenido: ¿esto les es útil o ya lo saben?
- Interés en producto: ¿hay demanda real antes de construir?

MECANISMOS DE PARTICIPACIÓN
1. Encuesta mensual en El Ticket (1 pregunta concreta, sin email requerido)
2. Pregunta abierta en LinkedIn (1 vez por semana, respuesta manual)
3. Acceso anticipado a herramientas del diagnóstico (beta cerrada, por invitación)
4. Votación de contenido: "Voten cuál serie se va a prueba este mes" — 1 vez por trimestre en LinkedIn + El Ticket

LO QUE NO PEDIMOS A LA COMUNIDAD
- Que compre sin haber tenido una interacción de valor primero
- Que comparta por compartir (solo si el contenido les sirve)
- Que opine sobre lo que no ha probado

PROTOCOLO DE RESPUESTA
- Comentarios con pregunta real: respuesta en menos de 24h
- DMs de prospecto: derivar a flujo de diagnóstico, no a propuesta directa
- Crítica al contenido: agradecer, evaluar, ajustar si tiene razón

// Vincular con sección de Fidelización en el Modelo de Negocio (sección 8.1).`,
  },

  {
    title: 'Prompts IA base para Editorial OS',
    category: 'Prompts IA',
    tags: ['ia', 'prompts', 'claude', 'editorial', 'producción'],
    status: 'borrador',
    source: 'Base Editorial v0.1',
    relatedSeries: '',
    relatedChapter: '',
    relatedCase: '',
    body: `Prompts de referencia para usar IA en el flujo editorial de Lanka.
Todos asumen que el modelo tiene contexto de Lanka. Ajustar según el sistema prompt activo.

─── CONTEXTO BASE ───────────────────────────────────────────
"Actúa como asistente editorial de Lanka Collective. Contexto: consultoría de sistemas operativos para negocios F&B en México. Voz de Paola Sagrero: directa, basada en datos reales, sin jerga de marketing. Tono: operadora con experiencia, no consultora genérica. Siempre ancla en KPI real o caso concreto."

─── CONVERSIÓN A POST DE LINKEDIN ───────────────────────────
"Toma este caso/situación y conviértelo en un post de LinkedIn de máximo 250 palabras. Estructura: 1 problema con número real + 1 sistema que lo explica + 1 acción concreta para esta semana. Sin hashtags. Sin emojis. Sin encabezados tipo 'Clave:'. Termina con una pregunta al lector."

─── CONVERSIÓN A ENTRADA DE NEWSLETTER ──────────────────────
"Convierte este caso en una entrada para El Ticket (newsletter dominical). Máximo 400 palabras. Mismo formato: problema + sistema + acción. Tono de carta directa, no de artículo. CTA final: '¿Cuál es tu food cost real esta semana?'"

─── CHECKLIST EDITORIAL ─────────────────────────────────────
"Revisa este borrador contra las reglas de voz de @pao.sag. Evalúa solo: 1) ¿hay dato real o caso concreto?, 2) ¿el problema aparece antes que la solución?, 3) ¿el tono es de operadora o de consultor genérico?, 4) ¿hay acción concreta al final? Lista solo los puntos que no pasan. Máximo 5 líneas."

─── ANONIMIZACIÓN DE CASO ───────────────────────────────────
"Anonimiza este caso de cliente para publicación. Cambia: nombre del negocio, ubicación específica, y cualquier detalle identificatorio. Redondea métricas al 5% más cercano. Mantén todos los números clave y el orden cronológico intactos."

// Agregar prompts específicos por categoría según vaya evolucionando el sistema.`,
  },
];

/**
 * Base Editorial v0.2 — 8 entradas de la serie "F&B desde cero AI first".
 * Identificador de versión: EDITORIAL_SEED_V2
 */
export const EDITORIAL_SEED_V2: Array<Omit<EditorialEntry, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'El ticket de los domingos v1.0',
    category: 'Series activas',
    tags: ['ticket', 'domingos', 'horeca-intel', 'recomendacion', 'captura', 'morelia', 'restaurantes'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'El Ticket',
    relatedChapter: '',
    relatedCase: '',
    body: `PROMESA PÚBLICA
"Cada domingo, un ticket que valió la pena guardar."
Recomendación personal con lectura F&B discreta.
Solo el must de la carta, no una reseña completa.
Muestra nombre y etiqueta del lugar.

CHECKLIST NÚCLEO DE CAPTURA
- Momento de consumo: tardeo / piqueo / cena elegante / desayuno lento / comida larga
- Total del ticket
- Número de personas
- Precio por persona
- Diferencia con/sin alcohol cuando sea material
- Tipo de visita: primera / recurrente / habitual
- Tipo de pago: pagado / invitación / colaboración

PRODUCCIÓN
Mix de voz en off, Paola en cámara y documentación del lugar.
Publicación exclusiva los domingos.

REGLAS DE PUBLICACIÓN
- Invitación no garantiza publicación.
- Revisión del formato después de los primeros 4 episodios.`,
  },

  {
    title: 'Creando un negocio de F&B desde cero — marco AI first',
    category: 'Series activas',
    tags: ['serie', 'ai-first', 'f&b', 'desde-cero', 'building-in-public', 'morelia', 'negocio'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `MARCO DE LA SERIE
Negocio ficticio con posibilidad real de piloto o pop-up.
Ciudad inicial: Morelia.
Inversión máxima: $600,000 MXN.
Modelo trasladable, replicable y escalable.
Máximo 30 capítulos.

PARTICIPANTES
- Expertos nacionales e internacionales en decisiones vinculadas.
- Comunidad participa en decisiones técnicamente viables.

IA EN LA SERIE
IA integrada desde el diseño del negocio, no añadida después.
El negocio es el protagonista, no la IA.

PRINCIPIO RECTOR
IA detecta, organiza, propone y alerta.
Humanos deciden, sirven y responden.`,
  },

  {
    title: 'Ficha maestra del negocio',
    category: 'Estructura madre',
    tags: ['ficha', 'negocio', 'morelia', 'presupuesto', 'ai-first', 'decisiones', 'plantilla'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `Fuente de verdad de ESTE negocio construido en público.
No es una ficha genérica de clientes de Lanka.

CAMPOS OBLIGATORIOS
Ciudad · Presupuesto máximo · Estado (ficticio / piloto / pop-up)
Oportunidad detectada · Concepto · Cliente prioritario
Ocasión de consumo · Formato · Tamaño · Ubicación
Ticket objetivo · Menú · Pricing
Inversión · CAPEX · OPEX · Punto de equilibrio
Proveedores · Operación · Equipo · Experiencia · Marca
Tecnología · Capa IA · Automatizaciones
Decisiones aprobadas · Hipótesis pendientes · Fallas
Cambios de versión · Posibilidad de lanzamiento real`,
  },

  {
    title: 'Metodología fija por capítulo',
    category: 'Estructura madre',
    tags: ['metodologia', 'capitulo', 'investigacion', 'evidencia', 'comunidad', 'expertos', 'ai-first'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `FLUJO OBLIGATORIO POR CAPÍTULO
Pregunta de negocio
→ Investigación
→ IA organiza y contrasta
→ Evidencia
→ Criterio técnico de Paola
→ Expertos tensionan cuando aplique
→ Opciones viables
→ Comunidad participa
→ Decisión
→ Documentación
→ Siguiente capítulo

REGISTRO OBLIGATORIO POR CAPÍTULO
- Pregunta
- Evidencia
- Decisión
- Riesgo
- Participación
- Función de IA
- Automatización posible
- Límite humano
- KPI
- Aprendizaje
- Próxima pregunta`,
  },

  {
    title: 'Participación comunitaria',
    category: 'Comunidad',
    tags: ['comunidad', 'votacion', 'co-creacion', 'hype', 'decisiones', 'serie'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `PRINCIPIO
La comunidad no vota desde cero.
Primero se investiga y se filtra; después vota entre opciones viables.
Cada opción se presenta con oportunidad, riesgo y trade-off visibles.

DÓNDE PUEDE PARTICIPAR
Ocasión · Concepto · Productos finalistas · Naming
Experiencia · Piloto · Detalles del proyecto

DÓNDE NO DECIDE
Sin marco de food cost, legal, sanidad, estructura financiera,
equipos críticos ni plantilla.

CÓMO SE DIRIGE
Participación dirigida, no "¿qué opinan?"
Se registran votos, comentarios, contradicciones e insights de cada episodio.`,
  },

  {
    title: 'Mesa externa / participación de expertos',
    category: 'Comunidad',
    tags: ['mesa-externa', 'expertos', 'internacional', 'operadores', 'cafeterias', 'restaurantes'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `PERFIL
Amigos y expertos de otros países.
Participación vinculada a una decisión concreta, no entrevista genérica.

FORMATOS POSIBLES
Meet · Videollamada · Revisión · Audio · Aportación escrita · Clips

ÁREAS DE PARTICIPACIÓN
Mercado · Ubicación · Menú · Café · Finanzas · Arquitectura
Experiencia · Tecnología · Escalabilidad

PREGUNTA MADRE
¿Qué cambió entre lo que creías antes de abrir y lo que ocurrió realmente?

LÍMITE
El experto tensiona la decisión.
No sustituye el criterio de Paola ni dirige el proyecto.`,
  },

  {
    title: 'Arquitectura AI first del negocio',
    category: 'Decisiones editoriales',
    tags: ['ai-first', 'operacion', 'automatizacion', 'datos', 'negocio', 'decisiones'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `MODELO OPERATIVO — no solo uso editorial de IA.

CAPAS
1. Captura de datos
2. Interpretación
3. Recomendación
4. Aprobación humana
5. Ejecución y aprendizaje

ÁREAS CUBIERTAS
Investigación · Finanzas · Menú · Compras · Inventario · Operación
SOPs · Equipo · Ventas · Marketing · CRM · Experiencia
Dirección · Escalabilidad

PRINCIPIO
Dato → lectura IA → recomendación → aprobación → acción → resultado → aprendizaje.

DISTINCIONES OBLIGATORIAS
- Qué hace IA
- Qué se automatiza
- Qué requiere aprobación humana
- Qué nunca se delega`,
  },

  {
    title: 'Output obligatorio de cada capítulo',
    category: 'Checklists de captura',
    tags: ['output', 'capitulo', 'checklist', 'evidencia', 'decision', 'cierre'],
    status: 'borrador',
    source: 'Base Editorial v0.2',
    relatedSeries: 'F&B desde cero',
    relatedChapter: '',
    relatedCase: '',
    body: `Un capítulo no está cerrado hasta que existan todos los siguientes:

CHECKLIST DE CIERRE
- Pregunta resuelta
- Fuentes e investigación guardadas
- Decisión documentada
- Ficha maestra actualizada
- Función de IA registrada
- Automatización definida
- Límite humano definido
- Participación comunitaria registrada
- Experto citado si aplica
- Assets guardados
- Pieza publicada o lista
- KPI definido
- Aprendizaje registrado
- Siguiente pregunta definida`,
  },
];

/**
 * Corpus editorial completo: V1 + V2.
 * Usar este export en el botón de carga — idempotente por título normalizado.
 */
export const EDITORIAL_SEED_ALL = [...EDITORIAL_SEED_V1, ...EDITORIAL_SEED_V2];
