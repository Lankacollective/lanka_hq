'use client';

import { Card } from '@/components/Primitives';
import { useLanka } from '@/lib/store';

const PILARES = [
  { key: 'p1', label: 'Pilar 1', placeholder: 'Rentabilidad invisible en F&B' },
  { key: 'p2', label: 'Pilar 2', placeholder: 'Sistemas operativos con criterio estético' },
  { key: 'p3', label: 'Pilar 3', placeholder: 'Documentar el proceso en tiempo real' },
];

export function MarcaPersonal() {
  const { state, setState } = useLanka();
  const mp = state.strategy;

  return (
    <div className="space-y-4">
      {/* Posicionamiento */}
      <Card>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Posicionamiento personal
        </p>
        <div className="space-y-3">
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase text-[var(--muted)]">Audiencia objetivo personal</p>
            <textarea
              placeholder="Dueños de restaurantes que venden pero no saben si ganan. Emprendedores F&B que quieren escalar sin perder identidad..."
              className="w-full resize-y border border-[var(--line)] bg-[var(--surface2)] p-3 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] min-h-[60px]"
              value={(mp as Record<string, string>).personalAudience ?? ''}
              onChange={e => setState(s => ({
                ...s,
                strategy: { ...s.strategy, personalAudience: e.target.value } as typeof s.strategy,
              }))}
            />
          </div>
          <div>
            <p className="mb-1 font-mono text-[9px] uppercase text-[var(--muted)]">Propuesta de valor personal (≠ Lanka el producto)</p>
            <textarea
              placeholder="Paola Ríos enseña cómo convertir caos F&B en sistemas rentables, filmando el proceso en tiempo real..."
              className="w-full resize-y border border-[var(--line)] bg-[var(--surface2)] p-3 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] min-h-[60px]"
              value={(mp as Record<string, string>).personalPropuesta ?? ''}
              onChange={e => setState(s => ({
                ...s,
                strategy: { ...s.strategy, personalPropuesta: e.target.value } as typeof s.strategy,
              }))}
            />
          </div>
        </div>
      </Card>

      {/* Pilares de contenido */}
      <Card>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Pilares de contenido
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {PILARES.map(p => (
            <div key={p.key} className="border border-[var(--line)] p-3">
              <p className="mb-2 font-mono text-[9px] uppercase text-[var(--muted)]">{p.label}</p>
              <input
                placeholder={p.placeholder}
                className="w-full bg-transparent font-bold text-[var(--ink)] outline-none text-sm"
                value={(mp as Record<string, string>)[p.key] ?? ''}
                onChange={e => setState(s => ({
                  ...s,
                  strategy: { ...s.strategy, [p.key]: e.target.value } as typeof s.strategy,
                }))}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Plataformas activas */}
      <Card>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Plataformas activas
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {['Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'Newsletter', 'Podcast'].map(plat => {
            const key = `plat_${plat.toLowerCase()}`;
            const active = (mp as Record<string, unknown>)[key] === true;
            return (
              <button
                key={plat}
                onClick={() => setState(s => ({
                  ...s,
                  strategy: { ...s.strategy, [key]: !active } as typeof s.strategy,
                }))}
                className={`border px-3 py-2 text-left font-mono text-[11px] transition ${
                  active
                    ? 'border-[var(--acid)] bg-[var(--acid)]/10 text-[var(--acid)]'
                    : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--acid)]/50'
                }`}
              >
                {active ? '● ' : '○ '}{plat}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Pipeline de contenido */}
      <Card>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          Pipeline de contenido · piezas en proceso
        </p>
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-3">
            {['Idea', 'Guión', 'Grabado', 'Editado', 'Publicado'].map(stage => (
              <div key={stage} className="w-48">
                <p className="mb-2 border-b border-[var(--line)] pb-1 font-mono text-[9px] uppercase text-[var(--muted)]">{stage}</p>
                <div className="space-y-1">
                  {state.stickers
                    .filter(s => s.columnId === 'storytelling' && ((s as Record<string, unknown>)[`stage`] === stage))
                    .map(s => (
                      <div key={s.id} className="border border-[var(--line)] p-2 text-[10px] text-[var(--ink)]">{s.title}</div>
                    ))
                  }
                  <p className="font-mono text-[9px] text-[var(--muted)] italic">
                    {stage === 'Idea' ? 'Stickers de Storytelling →' : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-mono text-[9px] text-[var(--muted)]">
          Convierte stickers de Storytelling en ideas de contenido desde el Board
        </p>
      </Card>
    </div>
  );
}
