'use client';

import { useState } from 'react';

type Question = {
  id: string;
  question_key: string;
  section: string;
  order_index: number;
  question_text: string;
  help_text: string | null;
  input_type: string;
  options: string[] | null;
  weight: number;
};

type DiagResult = {
  session_id: string;
  maturity_score: number;
  maturity_band: string;
  section_scores: Record<string, number>;
  ai_summary: string;
  ai_priorities: Array<{ title: string; detail: string; impact: string }>;
  ai_quick_wins: Array<{ title: string; action: string; timeline: string }>;
};

type Meta = { business_name: string; sector: string; contact_email: string };

const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;

const SECTION_LABELS: Record<string, string> = {
  A: 'Identidad y operación básica',
  B: 'Control financiero',
  C: 'Operaciones y cocina',
  D: 'Ventas y marketing',
  E: 'Tecnología y datos',
  F: 'Recursos humanos',
  G: 'Estrategia y crecimiento',
};

const FB_SECTORS = [
  'Restaurante casual', 'Fine dining', 'Bar / Cantina', 'Café / Panadería',
  'Fast casual', 'Food truck', 'Dark kitchen', 'Catering', 'Hotel F&B', 'Otro',
];

const BAND_COLORS: Record<string, string> = {
  Caos: '#FF1744', Datos: '#FF6D00', Sistema: '#F9A825', Escala: '#BFFF00',
};

const BAND_DESCS: Record<string, string> = {
  Caos:    'Sin datos, decisiones intuitivas, costos desconocidos',
  Datos:   'Tienes datos pero no los analizas sistemáticamente',
  Sistema: 'Recetas estandarizadas, KPIs semanales, inventario activo',
  Escala:  'Forecasting, labor scheduling, menú engineering activo',
};

// ─── Main component ────────────────────────────────────────────────────────────

export function DiagnosticoPublico({ questions }: { questions: Question[] }) {
  const [screen, setScreen] = useState(0);
  const [meta, setMeta] = useState<Meta>({ business_name: '', sector: '', contact_email: '' });
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [result, setResult] = useState<DiagResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sectionIndex = screen - 1;
  const currentSection = screen >= 1 && screen <= 7 ? SECTIONS[sectionIndex] : null;
  const sectionQuestions = currentSection ? questions.filter(q => q.section === currentSection) : [];
  const totalAnswered = Object.keys(answers).length;

  function setAnswer(key: string, value: string | number) {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setScreen(8);
    setSubmitError(null);
    const responses = Object.entries(answers).map(([question_key, val]) => ({
      question_key,
      answer_value: typeof val === 'string' ? val : null,
      answer_number: typeof val === 'number' ? val : null,
    }));
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: meta.business_name || 'Sin nombre',
          sector: meta.sector || 'Otro',
          contact_email: meta.contact_email || null,
          responses,
        }),
      });
      if (!res.ok) throw new Error('Error del servidor');
      const data = await res.json();
      setResult(data);
      setScreen(9);
    } catch {
      setSubmitError('Ocurrió un error al procesar tu diagnóstico. Inténtalo de nuevo.');
      setScreen(7);
    }
  }

  if (screen === 0) {
    return <IntroScreen meta={meta} setMeta={setMeta} onStart={() => setScreen(1)} />;
  }
  if (screen >= 1 && screen <= 7) {
    return (
      <SectionScreen
        section={SECTIONS[sectionIndex]}
        label={SECTION_LABELS[SECTIONS[sectionIndex]]}
        questions={sectionQuestions}
        answers={answers}
        setAnswer={setAnswer}
        sectionIndex={sectionIndex}
        totalAnswered={totalAnswered}
        onBack={() => setScreen(s => s - 1)}
        onNext={() => (screen < 7 ? setScreen(s => s + 1) : submit())}
        isLast={screen === 7}
        error={submitError}
      />
    );
  }
  if (screen === 8) return <LoadingScreen />;
  if (screen === 9 && result) return <ResultScreen result={result} businessName={meta.business_name} />;
  return null;
}

// ─── Intro screen ──────────────────────────────────────────────────────────────

function IntroScreen({ meta, setMeta, onStart }: {
  meta: Meta; setMeta: (fn: (p: Meta) => Meta) => void; onStart: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--bone)] flex flex-col">
      <div className="border-b border-[var(--line)] px-6 py-4">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
          LANKA COLLECTIVE
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            DIAGNÓSTICO DE MADUREZ OPERATIVA
          </p>
          <h1 className="mb-4 text-5xl font-black leading-none text-[var(--ink)]" style={{ fontFamily: 'var(--display)' }}>
            ¿Dónde está<br />tu negocio?
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-[var(--muted)]">
            63 preguntas · ~15 minutos · Resultado inmediato con IA
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">
                Nombre del negocio *
              </label>
              <input
                type="text"
                placeholder="Ej. Bistró El Centro"
                value={meta.business_name}
                onChange={e => setMeta(p => ({ ...p, business_name: e.target.value }))}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--acid)] transition"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">
                Tipo de negocio *
              </label>
              <select
                value={meta.sector}
                onChange={e => setMeta(p => ({ ...p, sector: e.target.value }))}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--acid)] transition"
              >
                <option value="">Selecciona...</option>
                {FB_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted)]">
                Email — opcional (te enviamos el reporte)
              </label>
              <input
                type="email"
                placeholder="tu@negocio.com"
                value={meta.contact_email}
                onChange={e => setMeta(p => ({ ...p, contact_email: e.target.value }))}
                className="w-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--acid)] transition"
              />
            </div>
            <button
              onClick={onStart}
              disabled={!meta.business_name || !meta.sector}
              className="mt-2 w-full border border-[var(--acid)] bg-[var(--acid)] px-6 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-transparent hover:text-[var(--acid)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Comenzar diagnóstico →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section screen ────────────────────────────────────────────────────────────

function SectionScreen({ section, label, questions, answers, setAnswer, sectionIndex, totalAnswered, onBack, onNext, isLast, error }: {
  section: string; label: string; questions: Question[];
  answers: Record<string, string | number>; setAnswer: (k: string, v: string | number) => void;
  sectionIndex: number; totalAnswered: number;
  onBack: () => void; onNext: () => void; isLast: boolean; error: string | null;
}) {
  const progress = ((sectionIndex + 1) / 7) * 100;
  return (
    <div className="min-h-screen bg-[var(--bone)] flex flex-col">
      <div className="h-[3px] bg-[var(--line)]">
        <div className="h-[3px] bg-[var(--acid)] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="border-b border-[var(--line)] px-6 py-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--acid)]">
          LANKA · DIAGNÓSTICO
        </span>
        <span className="font-mono text-[10px] text-[var(--muted)]">
          Sección {sectionIndex + 1}/7 · {totalAnswered} respondidas
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--acid)]">
            Sección {section}
          </p>
          <h2 className="mb-8 text-4xl font-black text-[var(--ink)]" style={{ fontFamily: 'var(--display)' }}>
            {label}
          </h2>
          <div className="space-y-8">
            {questions.map((q, idx) => (
              <QuestionItem
                key={q.id}
                question={q}
                index={idx + 1}
                answer={answers[q.question_key]}
                setAnswer={(val) => setAnswer(q.question_key, val)}
              />
            ))}
          </div>
          {error && <p className="mt-6 text-sm text-[var(--signal)]">{error}</p>}
        </div>
      </div>
      <div className="border-t border-[var(--line)] px-6 py-4 flex justify-between">
        <button
          onClick={onBack}
          className="border border-[var(--line)] px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--ink)] transition"
        >
          ← Anterior
        </button>
        <button
          onClick={onNext}
          className="border border-[var(--acid)] px-6 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--acid)] hover:bg-[var(--acid)] hover:text-black transition"
        >
          {isLast ? 'Ver resultado →' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}

// ─── Question item ─────────────────────────────────────────────────────────────

function QuestionItem({ question, index, answer, setAnswer }: {
  question: Question; index: number;
  answer: string | number | undefined; setAnswer: (v: string | number) => void;
}) {
  if (question.input_type === 'radio' && question.options) {
    return (
      <div>
        <p className="mb-1 font-mono text-[9px] text-[var(--muted)]">{index}.</p>
        <p className="mb-2 text-sm font-medium leading-snug text-[var(--ink)]">{question.question_text}</p>
        {question.help_text && (
          <p className="mb-3 text-xs text-[var(--muted)]">{question.help_text}</p>
        )}
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswer(opt)}
              className={`w-full border px-4 py-3 text-left text-xs transition ${
                answer === opt
                  ? 'border-[var(--acid)] bg-[var(--acid)]/10 text-[var(--acid)]'
                  : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--ink)]/40 hover:text-[var(--ink)]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.input_type === 'number') {
    return (
      <div>
        <p className="mb-1 font-mono text-[9px] text-[var(--muted)]">{index}.</p>
        <p className="mb-2 text-sm font-medium leading-snug text-[var(--ink)]">{question.question_text}</p>
        {question.help_text && (
          <p className="mb-3 text-xs text-[var(--muted)]">{question.help_text}</p>
        )}
        <input
          type="number"
          min="0"
          value={answer ?? ''}
          onChange={e => {
            const n = e.target.valueAsNumber;
            if (!isNaN(n)) setAnswer(n);
          }}
          className="w-full max-w-[220px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--acid)] transition"
          placeholder="0"
        />
      </div>
    );
  }

  return null;
}

// ─── Loading screen ────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[var(--bone)]">
      <div className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--acid)]" />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
        Analizando con IA...
      </p>
    </div>
  );
}

// ─── Result screen ─────────────────────────────────────────────────────────────

function ResultScreen({ result, businessName }: { result: DiagResult; businessName: string }) {
  const { maturity_score, maturity_band, section_scores, ai_summary, ai_priorities, ai_quick_wins } = result;
  const bandColor = BAND_COLORS[maturity_band] ?? '#BFFF00';

  return (
    <div className="min-h-screen bg-[var(--bone)]">
      <div className="border-b border-[var(--line)] px-6 py-4">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--acid)]">
          LANKA COLLECTIVE · DIAGNÓSTICO
        </span>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">

        {/* Score hero */}
        <div className="mb-8 border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {businessName || 'Tu negocio'} · Índice de madurez operativa
          </p>
          <p className="text-9xl font-black leading-none" style={{ color: bandColor, fontFamily: 'var(--display)' }}>
            {maturity_score}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">/ 100</p>
          <p className="mt-3 text-3xl font-black" style={{ color: bandColor, fontFamily: 'var(--display)' }}>
            {maturity_band}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">
            {BAND_DESCS[maturity_band]}
          </p>
        </div>

        {/* Section breakdown */}
        <div className="mb-8 border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Desglose por área
          </p>
          <div className="space-y-3">
            {SECTIONS.map(s => {
              const score = section_scores[s] ?? 0;
              const c = score <= 25 ? '#FF1744' : score <= 50 ? '#FF6D00' : score <= 75 ? '#F9A825' : '#BFFF00';
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-5 font-mono text-[9px] font-bold" style={{ color: c }}>{s}</span>
                  <div className="flex-1 h-1.5 bg-[var(--line)]">
                    <div className="h-1.5 transition-all" style={{ width: `${score}%`, backgroundColor: c }} />
                  </div>
                  <span className="w-8 text-right font-mono text-[9px] font-bold" style={{ color: c }}>{score}</span>
                  <span className="w-36 hidden sm:block font-mono text-[8px] text-[var(--muted)]">
                    {SECTION_LABELS[s]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Summary */}
        {ai_summary && (
          <div className="mb-8 border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">Análisis</p>
            <p className="text-sm leading-relaxed text-[var(--ink)] whitespace-pre-line">{ai_summary}</p>
          </div>
        )}

        {/* Priorities */}
        {ai_priorities?.length > 0 && (
          <div className="mb-8">
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Prioridades urgentes
            </p>
            <div className="space-y-3">
              {ai_priorities.map((p, i) => (
                <div key={i} className="border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-[9px] font-bold text-[var(--signal)]">0{i + 1}</span>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-[var(--ink)]">{p.title}</p>
                      <p className="mb-2 text-xs text-[var(--muted)]">{p.detail}</p>
                      <p className="font-mono text-[9px] text-[var(--acid)]">→ {p.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick wins */}
        {ai_quick_wins?.length > 0 && (
          <div className="mb-10">
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Quick wins — próximos 30 días
            </p>
            <div className="space-y-3">
              {ai_quick_wins.map((w, i) => (
                <div key={i} className="border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="mb-1 text-sm font-semibold text-[var(--ink)]">{w.title}</p>
                  <p className="mb-2 text-xs text-[var(--muted)]">{w.action}</p>
                  <span className="font-mono text-[9px] text-[var(--amber)]">{w.timeline}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="border border-[var(--acid)] bg-[var(--surface)] p-6 text-center">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted)]">
            ¿Listo para resolverlo?
          </p>
          <p className="mb-4 text-2xl font-black text-[var(--ink)]" style={{ fontFamily: 'var(--display)' }}>
            Habla con el equipo de Lanka
          </p>
          <a
            href={`https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(`Hola, hice el diagnóstico de madurez operativa de Lanka. Mi negocio obtuvo ${maturity_score}/100 (${maturity_band}). Me gustaría hablar con el equipo.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[var(--acid)] bg-[var(--acid)] px-8 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black transition hover:bg-transparent hover:text-[var(--acid)]"
          >
            Agendar llamada →
          </a>
        </div>
      </div>
    </div>
  );
}
