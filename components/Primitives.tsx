import React from 'react';

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 border-b border-[var(--line)] pb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{eyebrow}</p>
      <h2
        className="mt-2 uppercase"
        style={{ fontFamily: 'var(--display)', fontSize: 'clamp(42px, 7vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.01em' }}
      >
        {title}
      </h2>
      {subtitle && <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[var(--line)] bg-[var(--surface)] p-4 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children, onClick, variant = 'dark', type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'dark' | 'light' | 'terra' | 'acid';
  type?: 'button' | 'submit';
}) {
  const cls =
    variant === 'terra' ? 'bg-[var(--terra)] text-white border-[var(--terra)]' :
    variant === 'acid'  ? 'bg-[var(--acid)] text-black border-[var(--acid)]' :
    variant === 'light' ? 'bg-transparent text-[var(--ink)] border-[var(--line)] hover:border-[var(--ink)]' :
                          'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)]';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition hover:opacity-80 ${cls}`}
    >
      {children}
    </button>
  );
}

export function EditableArea({ value, onChange, rows = 4 }: { value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      className="w-full resize-y border border-[var(--line)] bg-[var(--surface2)] p-3 text-sm leading-6 text-[var(--ink)] outline-none focus:border-[var(--terra)]"
    />
  );
}
