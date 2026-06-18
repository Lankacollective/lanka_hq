import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export type GeneratedTask = {
  title: string;
  owner: 'Paola' | 'Mathias' | 'Ambos' | 'IA';
  priority: 'Alta' | 'Media' | 'Baja';
  dueAt?: string; // YYYY-MM-DD
  subtasks: string[];
};

type RequestBody = {
  stickers: Array<{ title: string; note: string; tag: string; columnId: string }>;
  strategy: { hypothesis: string; mission: string; currentFocus: string };
  today: string; // YYYY-MM-DD
};

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { stickers, strategy, today } = body;

  if (!stickers?.length) {
    return NextResponse.json({ error: 'No stickers provided' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const stickerList = stickers
    .map(s => `[${s.columnId} · ${s.tag}] ${s.title}${s.note ? ` — Nota: ${s.note}` : ''}`)
    .join('\n');

  const prompt = `Eres el sistema operativo de Lanka Collective, una agencia de consultoría F&B.

CONTEXTO ESTRATÉGICO:
- Hipótesis: ${strategy.hypothesis}
- Misión: ${strategy.mission}
- Foco actual: ${strategy.currentFocus}

Fecha de hoy: ${today}

El equipo son: Paola (estrategia, contenido, marca personal), Mathias (F&B, operaciones, cliente), Ambos (trabajo conjunto), IA (tareas automatizables con Claude).

STICKERS SELECCIONADOS PARA ANALIZAR:
${stickerList}

Analiza estos stickers y genera entre 2 y 6 tareas concretas y ejecutables que el equipo debe hacer.
Cada tarea debe:
- Ser específica y accionable (empezar con verbo: Crear, Definir, Grabar, Agendar, Revisar...)
- Tener asignado al responsable correcto según el contenido
- Tener prioridad según urgencia/impacto
- Tener fecha límite realista en los próximos 7-30 días (relativa a hoy: ${today})
- Incluir 1-4 subtareas concretas cuando la tarea principal sea compleja

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin explicación, sin comillas extras):
{
  "tasks": [
    {
      "title": "título de la tarea",
      "owner": "Paola|Mathias|Ambos|IA",
      "priority": "Alta|Media|Baja",
      "dueAt": "YYYY-MM-DD",
      "subtasks": ["subtarea 1", "subtarea 2"]
    }
  ],
  "rationale": "Una frase breve explicando la lógica detrás de estas tareas"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';

    // Strip potential markdown code blocks
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned) as { tasks: GeneratedTask[]; rationale: string };

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('generate-tasks error:', err);
    return NextResponse.json({ error: 'Error generando tareas con IA' }, { status: 500 });
  }
}
