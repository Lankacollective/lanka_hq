import React from 'react';

export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 border-b border-black/15 pb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{subtitle}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-black/15 bg-white/70 p-4 shadow-sm ${className}`}>{children}</div>;
}

export function Button({ children, onClick, variant = 'dark', type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'dark' | 'light' | 'terra'; type?: 'button' | 'submit' }) {
  const cls = variant === 'dark'
    ? 'bg-[var(--ink)] text-[var(--bone)] border-[var(--ink)]'
    : variant === 'terra'
      ? 'bg-[var(--terra)] text-white border-[var(--terra)]'
      : 'bg-white text-[var(--ink)] border-black/20';
  return <button type={type} onClick={onClick} className={`border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition hover:opacity-80 ${cls}`}>{children}</button>;
}

export function EditableArea({ value, onChange, rows = 4 }: { value: string; onChange: (value: string) => void; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="w-full resize-y border border-black/15 bg-[var(--bone)] p-3 text-sm leading-6 outline-none focus:border-[var(--terra)]" />;
}
