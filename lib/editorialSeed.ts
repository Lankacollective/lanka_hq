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
 * Base Editorial v0.3 — 8 entradas: paquete estratégico completo del Capítulo 0
 * de la serie "Creando un negocio de F&B desde cero" (Morelia, $600,000 MXN, AI first).
 * Todas en estado 'borrador': Paola las activa o edita después de revisar.
 * Identificador de versión: EDITORIAL_SEED_V3
 */
export const EDITORIAL_SEED_V3: Array<Omit<EditorialEntry, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Capítulo 0 — Paquete maestro',
    category: 'Decisiones editoriales',
    tags: ['capitulo-0', 'negocio-desde-cero', 'ai-first', 'morelia', 'documentacion'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `FUNCIÓN DEL CAPÍTULO
Capítulo 0 es el punto de partida público de la serie "Creando un negocio de F&B desde cero". Establece las reglas del juego antes de elegir cualquier concepto: presupuesto, ciudad, límite de capítulos, y el compromiso de gestionar el negocio con IA desde el primer proceso. No presenta una idea de negocio — presenta el marco dentro del cual esa idea tendrá que sobrevivir.

QUÉ DEBE ENTENDER LA AUDIENCIA
- Que se va a construir un negocio de comida real, con posibilidad real de piloto, no un ejercicio de contenido.
- Que la ciudad es Morelia y el techo de inversión es $600,000 MXN, sin excepción.
- Que la serie tiene un límite de 30 capítulos: si el negocio no se sostiene dentro de ese marco, se cierra.
- Que el modelo debe ser trasladable, replicable y escalable — no una solución única para un solo local.
- Que la IA participa desde la operación (mercado, compras, inventario, menú, marketing), no como adorno de marketing.
- Que la comunidad y expertos nacionales e internacionales van a participar activamente, dentro de reglas definidas, no en una votación libre.

CIUDAD INICIAL
Morelia.

INVERSIÓN MÁXIMA
$600,000 MXN.

LÍMITE DE LA SERIE
Máximo 30 capítulos.

MODELO
Trasladable, replicable y escalable — pensado para poder llevarse a otra ciudad si funciona.

GESTIÓN
Negocio AI first desde el origen: la IA participa desde el primer proceso, no se añade después.

POSIBILIDAD DE PILOTO O POP-UP
Si el capítulo demuestra viabilidad suficiente, el negocio puede avanzar a piloto o pop-up real.

PARTICIPACIÓN DE COMUNIDAD
La audiencia participa dentro del proceso (encuestas, reacciones, ideas), no solo como espectadora.

PARTICIPACIÓN DE EXPERTOS
Operadores y expertos nacionales e internacionales que ya abrieron negocios entran a la conversación como mesa externa.

QUÉ NO RESUELVE TODAVÍA EL CAPÍTULO 0
- No define el concepto del negocio.
- No define el nombre ni la marca.
- No define el menú ni la propuesta de valor.
- No investiga todavía el mercado de Morelia — eso es el Capítulo 1.
- No compromete el piloto o pop-up, solo deja la puerta abierta si el proceso lo justifica.

DECISIÓN FORMAL
"Se construirá públicamente un negocio F&B AI first en Morelia, con inversión máxima de $600,000 MXN y hasta 30 capítulos. Si demuestra viabilidad suficiente, podrá avanzar a piloto o pop-up."`,
  },

  {
    title: 'Capítulo 0 — Posicionamiento y reglas',
    category: 'Estructura madre',
    tags: ['capitulo-0', 'negocio-desde-cero', 'ai-first', 'documentacion'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `NOMBRE VISIBLE
"creando un negocio de F&B desde cero"

DESCRIPTOR
"un modelo realista, escalable y gestionado con IA."

FRASE ESTRUCTURAL
"la IA detecta, ordena y propone. las personas deciden, sirven y responden."

TENSIÓN NARRATIVA
"una idea puede verse increíble y no sobrevivir a la renta, al food cost o a un martes lento."

PROMESA
Se documentarán investigación, decisiones, números, errores, ideas descartadas, automatizaciones, participación de expertos, reacción de la comunidad y viabilidad final.

QUÉ NO ES
- un curso genérico
- una cafetería imaginaria bonita
- un escaparate de herramientas de IA
- una serie motivacional para emprendedores
- una votación abierta sin criterio técnico

REGLAS PÚBLICAS
- Morelia
- $600,000 MXN máximo
- máximo 30 capítulos
- modelo replicable
- IA desde la operación
- expertos reales
- comunidad dentro del proceso
- fallas incluidas

REGLAS INTERNAS
- ninguna opción se elige sin evidencia suficiente
- la comunidad vota solo entre opciones filtradas
- la IA no inventa datos ni toma decisiones críticas
- fuentes y supuestos quedan documentados
- cada capítulo produce una decisión concreta
- cada decisión actualiza la ficha maestra
- si una idea no es viable, se ajusta o se mata
- si demuestra potencial real, se plantea piloto o pop-up`,
  },

  {
    title: 'Capítulo 0 — Reel principal',
    category: 'Ejemplos aprobados',
    tags: ['capitulo-0', 'negocio-desde-cero', 'ai-first', 'morelia', 'reel', 'produccion'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `OBJETIVO
Presentar públicamente las reglas del Capítulo 0 y activar seguimiento de la serie más la primera encuesta de participación.

DURACIÓN
35–45 segundos.

GUION APROBADO
"vamos a construir un negocio de comida desde cero.

morelia.
$600,000 máximo.
replicable.
y gestionado con IA desde el primer proceso.

no una cafetería con un chatbot.

un negocio donde mercado, compras, inventario,
menú, operación, marketing y clientes
empiecen a hablar entre sí.

la IA va a investigar, ordenar,
detectar y proponer.

nosotros vamos a decidir.

también van a entrar operadores y expertos
que ya abrieron negocios en otros países.

y ustedes van a votar.

pero solo entre las ideas
que sobrevivan a los números.

máximo 30 capítulos.

si funciona, lo llevamos a piloto.
si no, lo matamos con respeto.

capítulo cero.

primero ver si merece existir."

CAPTION PRINCIPAL
"capítulo 0.

morelia. $600,000.
IA desde operación.
no desde el caption."

CAPTION ALTERNATIVO
"vamos a construir un negocio de comida desde cero.

si sobrevive al mercado, los números y la operación,
tal vez lo abrimos."

CTA PRINCIPAL
Seguir la serie.

CTA SECUNDARIO
Responder la primera encuesta.

CONCEPTO DE PORTADA
Mesa de trabajo + título de la serie / capítulo 0. Debe sentirse como documentación de proceso, no como anuncio de startup.

TEXTOS POSIBLES EN PANTALLA
- MORELIA
- $600,000 MXN
- AI FIRST
- 30 CAPÍTULOS MÁX.
- PILOTO SI SOBREVIVE`,
  },

  {
    title: 'Capítulo 0 — Dirección creativa y captura',
    category: 'Checklists de captura',
    tags: ['capitulo-0', 'produccion', 'captura', 'morelia'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `CONCEPTO
Documentación de trabajo, no anuncio de lanzamiento.

TOMAS OBLIGATORIAS
- mapa físico o digital de Morelia
- $600,000 MXN escrito o impreso
- tickets acumulados de restaurantes
- pantalla de LANKA HQ
- matriz o tabla todavía vacía
- palabra "logo" escrita y tachada
- referencias nacionales e internacionales
- Paola escribiendo o revisando datos
- videollamada o agenda de futuros expertos
- una idea descartada
- IA trabajando sobre información real
- carpeta o documento "CAPÍTULO 0"

TOMAS DESEABLES
- calles o zonas de Morelia
- personas consumiendo sin mostrar rostros claramente
- menús
- fachadas
- estacionamiento o tráfico
- café frío junto a una tabla
- manos ordenando papeles
- errores visibles
- capturas de research
- nota de voz

QUÉ NO MOSTRAR
- hologramas
- robots
- gráficos falsos
- cafetería renderizada como si ya existiera
- dashboards llenos de datos inventados
- estética excesiva de startup

EDICIÓN
- ritmo rápido al inicio y más lento al presentar reglas
- música instrumental contenida, con tensión, no épica
- voz en off + dos apariciones breves de Paola a cámara
- texto solo para palabras clave
- documental, ligeramente oscuro, con grano
- planos de 0.8 a 2 segundos
- subtítulos limpios y pequeños

CHECKLIST OPERATIVO DE CAPTURA
□ Grabar mapa físico o digital de Morelia
□ Grabar $600,000 MXN escrito o impreso
□ Grabar tickets acumulados de restaurantes
□ Grabar pantalla de LANKA HQ
□ Grabar matriz o tabla todavía vacía
□ Grabar la palabra "logo" escrita y tachada
□ Reunir referencias nacionales e internacionales
□ Grabar a Paola escribiendo o revisando datos
□ Grabar videollamada o agenda de futuros expertos
□ Grabar una idea descartada
□ Grabar IA trabajando sobre información real
□ Grabar carpeta o documento "CAPÍTULO 0"
□ Cubrir tomas deseables disponibles según locación y tiempo
□ Revisar que ninguna toma incluya elementos de la lista "qué no mostrar"
□ Confirmar audio limpio para voz en off y las dos apariciones de Paola a cámara
□ Exportar selects a 06_SELECTS/ el mismo día de captura`,
  },

  {
    title: 'Capítulo 0 — Stories y participación inicial',
    category: 'Comunidad',
    tags: ['capitulo-0', 'stories', 'comunidad', 'morelia'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `DÍA -1

Story 1:
"estamos a punto de construir
un negocio de comida desde cero."

Story 2:
"morelia.
$600,000 máximo."

Story 3:
"todavía no tiene nombre.
ni logo.
ni derecho a existir."

Story 4:
"mañana empiezan los números."

DÍA DE LANZAMIENTO

Story 1:
Compartir Reel.
Texto:
"capítulo 0.
las reglas."

Story 2:
"IA desde:
mercado
compras
inventario
operación
marketing
dirección"

Story 3:
"pero no decide sola.

detecta.
ordena.
propone.
alerta."

Story 4:
"nosotros decidimos.
la gente todavía sirve la mesa."

Story 5 — Encuesta:
"qué momento está peor resuelto en morelia:"
- desayuno entre semana
- comida rápida buena
- tardeo
- cena casual

Story 6 — Encuesta:
"qué arruina más una salida:"
- estacionamiento
- precio
- espera
- servicio

OBJETIVO DE PARTICIPACIÓN
Activar el primer pulso de la comunidad antes de definir cualquier concepto: medir cuántas personas siguen la serie desde el día 0 y cuántas responden ambas encuestas.

QUÉ DATOS BUSCAMOS
Qué momentos de consumo están peor resueltos en Morelia y qué fricciones arruinan más una salida — insumos directos para investigar el Capítulo 1, no para definir el concepto todavía.

POR QUÉ TODAVÍA NO SE LANZA EL FORMULARIO LARGO
Porque el Capítulo 0 solo establece reglas y abre participación ligera; un formulario largo requiere que primero exista suficiente contexto y confianza con la audiencia, que se construye durante los primeros capítulos.

CTA PRINCIPAL
Seguir la serie.

CTA SECUNDARIO
Responder la encuesta.`,
  },

  {
    title: 'Capítulo 0 — Arquitectura AI first',
    category: 'Decisiones editoriales',
    tags: ['capitulo-0', 'ai-first', 'documentacion'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `FUNCIÓN DE LA IA EN EL CAPÍTULO 0
- estructurar reglas
- crear ficha maestra
- clasificar respuestas
- detectar preguntas
- preparar Capítulo 1
- organizar fuentes
- registrar hipótesis
- diferenciar dato de supuesto
- preparar entrevistas por tipo de experto
- documentar decisiones

PRINCIPIO
dato → lectura IA → recomendación → aprobación → acción → resultado → aprendizaje.

LÍMITES HUMANOS
La IA no decide:
- qué necesidad es real
- qué concepto se construirá
- qué fuente es confiable sin validación
- qué negocio merece inversión
- qué contenido se publica
- qué opción pasa a piloto

DEBE DISTINGUIR CLARAMENTE
- qué hace la IA
- qué puede automatizarse
- qué requiere aprobación humana
- qué nunca se delega`,
  },

  {
    title: 'Capítulo 0 — Documentación y archivo',
    category: 'Estructura madre',
    tags: ['capitulo-0', 'documentacion', 'negocio-desde-cero'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `FICHA MAESTRA INICIAL
- estado: capítulo 0
- ciudad: Morelia
- presupuesto máximo: $600,000 MXN
- naturaleza: negocio ficticio con posibilidad de piloto
- modelo: trasladable, replicable y escalable
- gestión: AI first
- formato: pendiente
- concepto: pendiente
- cliente: pendiente
- ocasión: pendiente
- próxima pregunta: qué oportunidades de consumo existen en Morelia

DECISIÓN DEL CAPÍTULO
"Se construirá públicamente un negocio F&B AI first en Morelia, con inversión máxima de $600,000 MXN y hasta 30 capítulos."

HIPÓTESIS
- existe una oportunidad F&B todavía no identificada
- puede diseñarse un modelo replicable dentro del presupuesto
- la comunidad puede aportar datos útiles
- la IA puede reducir trabajo repetitivo y mejorar la lectura del negocio

RIESGOS
- convertir la serie en contenido sin negocio
- enamorarse de una idea antes de investigarla
- participación basada en gusto, no en viabilidad
- exceso de tecnología sobre hospitalidad
- fatiga antes de completar el modelo

ESTRUCTURA PROPUESTA DE DRIVE
PAO_SAG/
└── NEGOCIO_F&B_DESDE_CERO/
    ├── 00_SISTEMA_MAESTRO/
    │   ├── ficha_maestra/
    │   ├── reglas/
    │   ├── fuentes/
    │   └── expertos/
    └── CAP_00_LANZAMIENTO/
        ├── 01_BRIEF/
        ├── 02_RAW_VIDEO/
        ├── 03_RAW_PHOTO/
        ├── 04_SCREEN_RECORDINGS/
        ├── 05_AUDIO/
        ├── 06_SELECTS/
        ├── 07_FINAL/
        └── 08_METRICAS/

QUÉ VIVE DÓNDE
HQ = memoria estratégica y decisiones.
Herramienta de marketing = ejecución, calendario, distribución y métricas.
Drive = archivos y evidencia pesada.

CÓMO EVITAMOS DUPLICAR INFORMACIÓN
Cada sistema es dueño de un tipo de información y no la repite: HQ referencia el Drive por ruta en vez de copiar archivos pesados, y la herramienta de marketing consulta la ficha maestra de HQ en vez de mantener su propia copia de las decisiones estratégicas.`,
  },

  {
    title: 'Capítulo 0 — KPIs y criterio de cierre',
    category: 'Checklists de captura',
    tags: ['capitulo-0', 'kpi', 'documentacion'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `KPIS
- retención a 3 segundos
- retención media
- reproducciones completas
- guardados
- compartidos
- visitas al perfil
- nuevos seguidores
- respuestas a Stories
- DMs de dueños o expertos
- preguntas repetidas

ÉXITO CUALITATIVO
Buscamos respuestas equivalentes a:
- "quiero ver cómo lo hacen"
- "tengo un negocio y esto me interesa"
- "yo conozco a alguien que puede ayudar"
- "en Morelia hace falta…"
- "¿cómo van a usar IA para inventario/menú/etc.?"

ESTADOS OPERATIVOS
1. estrategia
2. brief de producción
3. captura
4. edición
5. revisión
6. programación
7. publicación
8. análisis
9. documentación
10. cierre

CRITERIO DE CIERRE
El Capítulo 0 no está terminado hasta que:
- Reel publicado
- Stories publicadas
- respuestas registradas
- métricas guardadas
- IA haya resumido dudas y patrones
- HQ esté actualizado
- pregunta del Capítulo 1 esté definida

PUENTE AL CAPÍTULO 1
Investigación real del mercado de Morelia.`,
  },

  {
    title: 'Capítulo 0 — Regla de evidencia real y documentación del proceso',
    category: 'Decisiones editoriales',
    tags: ['capitulo-0', 'evidencia', 'documentacion', 'ai-first', 'produccion', 'credibilidad', 'proceso-real'],
    status: 'borrador',
    source: 'Base Editorial v0.3',
    relatedSeries: 'F&B desde cero',
    relatedChapter: 'Capítulo 0',
    relatedCase: '',
    body: `PRINCIPIO CENTRAL

Nunca se graba o escenifica una prueba para hacer parecer que el proceso ya ocurrió.

Se documenta el proceso real mientras sucede.
Después se decide qué parte merece convertirse en contenido.

REGLAS

- Cada evidencia debe corresponder al momento real de la serie.
- No se presentan hipótesis descartadas antes de tener una razón verificable para descartarlas.
- No se muestran conclusiones de mercado antes de haber hecho investigación suficiente.
- No se presenta una tabla vacía como si fuera análisis terminado.
- No se presenta una conversación con un experto si la conversación no ocurrió realmente.
- No se presenta una clasificación de respuestas antes de recibir respuestas reales.
- La IA puede ordenar, resumir y detectar patrones, pero no debe transformar señales débiles en conclusiones.
- Siempre distinguir entre:
  1. evidencia;
  2. contexto visual;
  3. supuesto;
  4. inferencia;
  5. decisión.

ACLARACIONES

- El mapa de Morelia es una restricción real y puede aparecer desde el Capítulo 0.
- Los tickets personales pueden aparecer como textura visual y contexto, pero no constituyen una muestra representativa del mercado.
- La ficha maestra con campos "pendiente" demuestra honestamente que el concepto todavía no está decidido.
- Una pregunta enviada a un operador puede mostrarse únicamente si fue realmente enviada y se protegen datos privados.
- Una hipótesis tachada debe aparecer solo cuando exista evidencia o criterio documentado para descartarla.
- La pantalla donde se clasifican respuestas aparece después del lanzamiento, cuando ya existan respuestas reales.

SEPARACIÓN POR MOMENTO

CAPÍTULO 0:
- mapa real de Morelia;
- presupuesto máximo de $600,000 MXN;
- ficha maestra con campos pendientes;
- LANKA HQ;
- referencias iniciales;
- primera pregunta real enviada a un operador, si ocurre.

DESPUÉS DEL LANZAMIENTO:
- respuestas reales;
- clasificación con IA;
- preguntas repetidas;
- contradicciones;
- primeras hipótesis.

CAPÍTULOS POSTERIORES:
- ideas descartadas;
- hipótesis tachadas;
- modelos financieros;
- menu engineering;
- food cost;
- benchmarks;
- ubicaciones;
- pruebas de producto;
- decisiones documentadas.

REGLA FINAL

Nunca fabricamos evidencia para contar una historia.
Grabamos la historia mientras ocurre.`,
  },
];

/**
 * Corpus editorial completo: V1 + V2 + V3.
 * Usar este export en el botón de carga — idempotente por título normalizado.
 */
export const EDITORIAL_SEED_ALL = [...EDITORIAL_SEED_V1, ...EDITORIAL_SEED_V2, ...EDITORIAL_SEED_V3];
