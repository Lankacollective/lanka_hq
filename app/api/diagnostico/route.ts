import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

type Response = { question_key: string; answer_value: string | null; answer_number: number | null };
type RequestBody = {
  business_name: string;
  sector: string;
  contact_email?: string | null;
  responses: Response[];
};

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();
  const { business_name, sector, contact_email, responses } = body;

  if (!responses?.length) {
    return NextResponse.json({ error: 'No responses provided' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Fetch questions for scoring and mapping
  const { data: questions, error: qErr } = await supabase
    .from('diagnostic_questions')
    .select('id, question_key, section, input_type, options, weight')
    .order('section').order('order_index');

  if (qErr || !questions?.length) {
    return NextResponse.json({ error: 'Error fetching questions' }, { status: 500 });
  }

  const questionMap = Object.fromEntries(questions.map(q => [q.question_key, q]));

  // 2. Build answers map
  const answersMap: Record<string, string | number> = {};
  responses.forEach(r => {
    if (r.answer_value !== null) answersMap[r.question_key] = r.answer_value;
    else if (r.answer_number !== null) answersMap[r.question_key] = r.answer_number;
  });

  // 3. Calculate section scores (radio questions only, weighted)
  const sectionScores: Record<string, number> = {};
  for (const section of SECTIONS) {
    const qs = questions.filter(q => q.section === section && q.input_type === 'radio');
    let totalWeight = 0;
    let weightedScore = 0;
    for (const q of qs) {
      const answer = answersMap[q.question_key];
      if (answer === undefined || !q.options) continue;
      const opts = q.options as string[];
      const idx = opts.indexOf(String(answer));
      if (idx === -1) continue;
      const score = Math.round((idx / (opts.length - 1)) * 100);
      weightedScore += score * Number(q.weight);
      totalWeight += Number(q.weight);
    }
    sectionScores[section] = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  const overallScore = Math.round(
    SECTIONS.reduce((sum, s) => sum + (sectionScores[s] ?? 0), 0) / SECTIONS.length
  );

  const band =
    overallScore <= 25 ? 'Caos' :
    overallScore <= 50 ? 'Datos' :
    overallScore <= 75 ? 'Sistema' : 'Escala';

  // 4. Create client case (prospecto)
  const caseNotes = `Diagnóstico automático. Score: ${overallScore}/100 (${band}).${contact_email ? ` Email: ${contact_email}` : ''}`;
  const { data: clientCase } = await supabase
    .from('client_cases')
    .insert({
      workspace_id: 'lanka_hq_next',
      code: business_name,
      sector,
      stage: 'prospecto',
      maturity_score: overallScore,
      maturity_notes: caseNotes,
    })
    .select('id')
    .single();

  // 5. Create session
  const { data: session, error: sessionErr } = await supabase
    .from('diagnostic_sessions')
    .insert({
      client_case_id: clientCase?.id ?? null,
      workspace_id: 'lanka_hq_next',
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: 'Error creating session' }, { status: 500 });
  }

  // 6. Insert responses
  const responseRows = responses
    .filter(r => questionMap[r.question_key])
    .map(r => ({
      session_id: session.id,
      question_id: questionMap[r.question_key].id,
      question_key: r.question_key,
      answer_value: r.answer_value,
      answer_number: r.answer_number,
    }));

  await supabase.from('diagnostic_responses').insert(responseRows);

  // 7. Build context for Claude
  const answerLines = responses
    .map(r => {
      const q = questionMap[r.question_key];
      if (!q) return null;
      const val = r.answer_value ?? (r.answer_number !== null ? String(r.answer_number) : '—');
      return `[${r.question_key}] ${q.question_text}: ${val}`;
    })
    .filter(Boolean)
    .join('\n');

  const prompt = `Eres el sistema de diagnóstico de Lanka Collective, consultoría F&B especializada en escalar restaurantes en México.

NEGOCIO: ${business_name} | SECTOR: ${sector}
SCORE DE MADUREZ: ${overallScore}/100 | BANDA: ${band}
SCORES POR SECCIÓN: ${SECTIONS.map(s => `${s}:${sectionScores[s]}`).join(' | ')}

RESPUESTAS:
${answerLines}

Analiza las respuestas y genera un diagnóstico ejecutivo específico para este negocio. Sé concreto, usa los datos reales, no genérico.

Responde ÚNICAMENTE con JSON válido (sin markdown, sin texto extra):
{
  "summary": "Resumen ejecutivo de 2-3 párrafos. Menciona el sector, puntos críticos identificados en las respuestas, y el potencial del negocio.",
  "priorities": [
    {"title": "Título corto de la prioridad", "detail": "Por qué es urgente basado en las respuestas específicas", "impact": "Resultado esperado si se resuelve"},
    {"title": "...", "detail": "...", "impact": "..."},
    {"title": "...", "detail": "...", "impact": "..."}
  ],
  "quick_wins": [
    {"title": "Acción concreta", "action": "Descripción específica de qué hacer en los próximos 30 días", "timeline": "X semanas"},
    {"title": "...", "action": "...", "timeline": "..."},
    {"title": "...", "action": "...", "timeline": "..."}
  ]
}`;

  let aiSummary = '';
  let aiPriorities: object[] = [];
  let aiQuickWins: object[] = [];
  let aiModelUsed = 'claude-haiku-4-5-20251001';
  let promptTokens = 0;
  let responseTokens = 0;

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);
    aiSummary = parsed.summary ?? '';
    aiPriorities = parsed.priorities ?? [];
    aiQuickWins = parsed.quick_wins ?? [];
    promptTokens = msg.usage.input_tokens;
    responseTokens = msg.usage.output_tokens;
  } catch (err) {
    console.error('Claude error:', err);
    aiSummary = 'Análisis no disponible temporalmente. El equipo de Lanka revisará tu diagnóstico manualmente.';
  }

  // 8. Store result
  await supabase.from('diagnostic_results').insert({
    session_id: session.id,
    maturity_score: overallScore,
    maturity_band: band,
    section_scores: sectionScores,
    ai_summary: aiSummary,
    ai_priorities: aiPriorities,
    ai_quick_wins: aiQuickWins,
    ai_model_used: aiModelUsed,
    raw_prompt_tokens: promptTokens,
    raw_response_tokens: responseTokens,
  });

  return NextResponse.json({
    session_id: session.id,
    maturity_score: overallScore,
    maturity_band: band,
    section_scores: sectionScores,
    ai_summary: aiSummary,
    ai_priorities: aiPriorities,
    ai_quick_wins: aiQuickWins,
  });
}
