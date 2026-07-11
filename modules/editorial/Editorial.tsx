'use client';

import { useState, useMemo } from 'react';
import { useLanka } from '@/lib/store';
import { EDITORIAL_CATEGORIES } from '@/lib/types';
import type { EditorialCategory, EditorialEntry, EditorialStatus } from '@/lib/types';
import { EDITORIAL_SEED_ALL } from '@/lib/editorialSeed';

type FormState = Omit<EditorialEntry, 'id' | 'createdAt' | 'updatedAt'>;

const EMPTY_FORM: FormState = {
  title: '',
  category: 'Voz Paola',
  tags: [],
  body: '',
  source: '',
  status: 'borrador',
  relatedSeries: '',
  relatedChapter: '',
  relatedCase: '',
};

const STATUS_LABEL: Record<EditorialStatus, string> = {
  activo: 'Activo',
  borrador: 'Borrador',
  archivado: 'Archivado',
};

const STATUS_COLOR: Record<EditorialStatus, string> = {
  activo: 'var(--acid)',
  borrador: '#888',
  archivado: 'var(--muted)',
};

// ─── Search helpers ───────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics: é→e, ú→u, ñ→n, etc.
    .replace(/[-_]/g, ' ')           // hyphens/underscores → spaces
    .replace(/\s+/g, ' ');           // collapse multiple spaces
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Editorial() {
  const { state, addEditorial, updateEditorial, deleteEditorial } = useLanka();
  const entries: EditorialEntry[] = state.editorial ?? [];

  const [catFilter, setCatFilter] = useState<EditorialCategory | 'Todos'>('Todos');
  const [statusFilter, setStatusFilter] = useState<EditorialStatus | 'Todos'>('Todos');
  const [tagFilter, setTagFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [seedResult, setSeedResult] = useState<{ added: number; skipped: number } | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    entries.forEach(e => e.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries;
    if (catFilter !== 'Todos') list = list.filter(e => e.category === catFilter);
    if (statusFilter !== 'Todos') list = list.filter(e => e.status === statusFilter);
    if (tagFilter) list = list.filter(e => e.tags.includes(tagFilter));
    if (search.trim()) {
      const tokens = normalizeText(search).split(' ').filter(Boolean);
      list = list.filter(e => {
        const haystack = normalizeText([
          e.title, e.body, e.tags.join(' '), e.category,
          e.source, e.relatedSeries, e.relatedChapter, e.relatedCase,
        ].join(' '));
        return tokens.every(token => haystack.includes(token));
      });
    }
    return list;
  }, [entries, catFilter, statusFilter, tagFilter, search]);

  const countMap = useMemo(() => {
    const m: Record<string, number> = { Todos: entries.length };
    entries.forEach(e => { m[e.category] = (m[e.category] ?? 0) + 1; });
    return m;
  }, [entries]);

  function loadSeed() {
    let added = 0;
    let skipped = 0;
    EDITORIAL_SEED_ALL.forEach(seed => {
      const exists = entries.some(
        e => e.title.trim().toLowerCase() === seed.title.trim().toLowerCase()
      );
      if (exists) {
        skipped++;
      } else {
        addEditorial(seed);
        added++;
      }
    });
    setSeedResult({ added, skipped });
  }

  function startAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category: catFilter !== 'Todos' ? catFilter : 'Voz Paola' });
    setTagInput('');
    setAdding(true);
  }

  function startEdit(entry: EditorialEntry) {
    setAdding(false);
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      category: entry.category,
      tags: [...entry.tags],
      body: entry.body,
      source: entry.source,
      status: entry.status,
      relatedSeries: entry.relatedSeries,
      relatedChapter: entry.relatedChapter,
      relatedCase: entry.relatedCase,
    });
    setTagInput('');
  }

  function cancelForm() {
    setAdding(false);
    setEditingId(null);
  }

  function saveForm() {
    if (!form.title.trim()) return;
    if (adding) {
      addEditorial(form);
    } else if (editingId) {
      updateEditorial(editingId, form);
    }
    setAdding(false);
    setEditingId(null);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!t || form.tags.includes(t)) { setTagInput(''); return; }
    setForm(f => ({ ...f, tags: [...f.tags, t] }));
    setTagInput('');
  }

  function removeTag(t: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));
  }

  function toggleTagFilter(t: string) {
    setTagFilter(prev => prev === t ? '' : t);
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">07 · Editorial OS</p>
          <h2
            className="mt-1 uppercase text-[var(--ink)]"
            style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 0.95, letterSpacing: '-0.01em' }}
          >
            EDITORIAL OS
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Metodología, voz, series, prompts y decisiones editoriales de @pao.sag y LANKA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSeed}
            title="Carga el corpus editorial completo (V1 + V2). Idempotente: omite entradas que ya existen."
            className="border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--muted)] transition-colors"
          >
            Base editorial
          </button>
          <button
            onClick={startAdd}
            className="border border-[var(--acid)] bg-[var(--acid)] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black hover:opacity-90 transition-opacity"
          >
            + Nueva entrada
          </button>
        </div>
      </div>

      {/* ── Seed load feedback ── */}
      {seedResult !== null && (
        <div className="mb-4 flex items-center justify-between border border-[var(--line)] bg-[var(--surface)] px-4 py-2">
          <p className="font-mono text-[10px] text-[var(--muted)]">
            {seedResult.added > 0 && (
              <span className="text-[var(--acid)]">{seedResult.added} entrada{seedResult.added !== 1 ? 's' : ''} cargada{seedResult.added !== 1 ? 's' : ''}</span>
            )}
            {seedResult.added > 0 && seedResult.skipped > 0 && ' · '}
            {seedResult.skipped > 0 && `${seedResult.skipped} ya existía${seedResult.skipped !== 1 ? 'n' : ''}`}
            {seedResult.added === 0 && seedResult.skipped === 0 && 'Sin cambios'}
          </p>
          <button
            onClick={() => setSeedResult(null)}
            className="font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Inline form (add / edit) ── */}
      {(adding || editingId !== null) && (
        <EntryForm
          form={form}
          setForm={setForm}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onSave={saveForm}
          onCancel={cancelForm}
          isNew={adding}
        />
      )}

      {/* ── Category filter ── */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-[var(--line)] pb-4">
        {(['Todos', ...EDITORIAL_CATEGORIES] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat as EditorialCategory | 'Todos')}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition ${
              catFilter === cat
                ? 'bg-[var(--acid)] text-black'
                : 'border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--muted)]'
            }`}
          >
            {cat}{countMap[cat] != null ? ` · ${countMap[cat]}` : ''}
          </button>
        ))}
      </div>

      {/* ── Search + status filter ── */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en todos los campos..."
          className="min-w-[220px] flex-1 border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as EditorialStatus | 'Todos')}
          className="border border-[var(--line)] bg-[var(--surface)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
        >
          <option value="Todos">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="borrador">Borrador</option>
          <option value="archivado">Archivado</option>
        </select>
      </div>

      {/* ── Tag cloud ── */}
      {allTags.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1">
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => toggleTagFilter(t)}
              className={`px-2 py-0.5 font-mono text-[9px] tracking-[0.06em] transition ${
                tagFilter === t
                  ? 'bg-[var(--acid)] text-black'
                  : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--ink)]'
              }`}
            >
              #{t}
            </button>
          ))}
          {tagFilter && (
            <button
              onClick={() => setTagFilter('')}
              className="ml-1 font-mono text-[9px] text-[var(--muted)] hover:text-[var(--signal)] uppercase"
            >
              ✕ limpiar
            </button>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="border border-[var(--line)] bg-[var(--surface)] p-10 text-center">
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">
            {entries.length === 0 ? 'Editorial OS vacío' : 'Sin resultados para estos filtros'}
          </p>
          {entries.length === 0 && (
            <p className="mt-2 text-sm text-[var(--muted)]">
              Crea la primera entrada para comenzar a documentar la metodología.
            </p>
          )}
        </div>
      )}

      {/* ── Entry list ── */}
      <div className="grid gap-3">
        {filtered.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            isEditingThis={editingId === entry.id}
            confirmingDelete={confirmDelete === entry.id}
            onEdit={() => startEdit(entry)}
            onDelete={() => setConfirmDelete(entry.id)}
            onConfirmDelete={() => { deleteEditorial(entry.id); setConfirmDelete(null); }}
            onCancelDelete={() => setConfirmDelete(null)}
            onTagClick={toggleTagFilter}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Entry Form ───────────────────────────────────────────────────────────────

function EntryForm({
  form,
  setForm,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
  onSave,
  onCancel,
  isNew,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  tagInput: string;
  setTagInput: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (t: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}) {
  return (
    <div
      className="mb-6 bg-[var(--surface)] p-5"
      style={{ border: '1px solid var(--line)', borderLeft: '4px solid var(--acid)' }}
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--acid)]">
        {isNew ? 'Nueva entrada' : 'Editar entrada'}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Título *</label>
          <input
            autoFocus
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Nombre de la entrada"
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 text-sm font-bold text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Categoría</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as EditorialCategory }))}
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
          >
            {EDITORIAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Estado</label>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as EditorialStatus }))}
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
          >
            <option value="borrador">Borrador</option>
            <option value="activo">Activo</option>
            <option value="archivado">Archivado</option>
          </select>
        </div>

        {/* Body */}
        <div className="md:col-span-2">
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Contenido</label>
          <textarea
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            rows={8}
            placeholder="Documenta aquí: voz, reglas, ejemplos, prompts, decisiones editoriales..."
            className="w-full resize-y border border-[var(--line)] bg-[var(--surface2)] p-3 text-sm leading-6 text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Tags</label>
          {form.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {form.tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-[var(--surface2)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  #{t}
                  <button onClick={() => onRemoveTag(t)} className="hover:text-[var(--signal)] transition-colors">✕</button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddTag(); } }}
              placeholder="Escribe un tag y presiona Enter"
              className="flex-1 border border-[var(--line)] bg-[var(--surface2)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
            />
            <button
              onClick={onAddTag}
              className="border border-[var(--line)] px-3 py-1.5 font-mono text-[10px] uppercase text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              + Tag
            </button>
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Fuente / origen</label>
          <input
            value={form.source}
            onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
            placeholder="ej: sesión 2025-07-10, nota de voz, cliente X"
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Related Series */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Serie relacionada</label>
          <input
            value={form.relatedSeries}
            onChange={e => setForm(f => ({ ...f, relatedSeries: e.target.value }))}
            placeholder="ej: Restaurante que pierde"
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Related Chapter */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Capítulo relacionado</label>
          <input
            value={form.relatedChapter}
            onChange={e => setForm(f => ({ ...f, relatedChapter: e.target.value }))}
            placeholder="ej: Cap 3 · Food Cost"
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Related Case */}
        <div>
          <label className="mb-1 block font-mono text-[10px] uppercase text-[var(--muted)]">Caso relacionado</label>
          <input
            value={form.relatedCase}
            onChange={e => setForm(f => ({ ...f, relatedCase: e.target.value }))}
            placeholder="ej: caso_abc123 o nombre anónimo"
            className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)] placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onSave}
          disabled={!form.title.trim()}
          className="bg-[var(--acid)] px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {isNew ? 'Guardar entrada' : 'Actualizar'}
        </button>
        <button
          onClick={onCancel}
          className="border border-[var(--line)] px-4 py-2 font-mono text-[10px] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  isEditingThis,
  confirmingDelete,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onTagClick,
}: {
  entry: EditorialEntry;
  isEditingThis: boolean;
  confirmingDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onTagClick: (t: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const preview = entry.body.length > 160 ? entry.body.slice(0, 160) + '…' : entry.body;
  const accentColor = STATUS_COLOR[entry.status];
  const hasRelated = entry.relatedSeries || entry.relatedChapter || entry.relatedCase || entry.source;

  return (
    <div
      className="bg-[var(--surface)] p-4 transition-colors"
      style={{
        border: `1px solid var(--line)`,
        borderLeft: `4px solid ${accentColor}`,
        opacity: entry.status === 'archivado' ? 0.6 : 1,
        outline: isEditingThis ? `1px solid var(--acid)` : undefined,
      }}
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--muted)]">{entry.category}</span>
            <span className="font-mono text-[9px] uppercase" style={{ color: accentColor }}>
              {STATUS_LABEL[entry.status]}
            </span>
          </div>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-left text-base font-black uppercase text-[var(--ink)] hover:text-[var(--acid)] transition-colors"
          >
            {entry.title}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-1">
          <button
            onClick={onEdit}
            className="border border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--muted)] transition-colors"
          >
            Editar
          </button>
          {confirmingDelete ? (
            <>
              <button
                onClick={onConfirmDelete}
                className="bg-[var(--signal)] px-2 py-1 font-mono text-[9px] uppercase text-white"
              >
                Eliminar
              </button>
              <button
                onClick={onCancelDelete}
                className="border border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--muted)]"
              >
                No
              </button>
            </>
          ) : (
            <button
              onClick={onDelete}
              className="border border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--signal)] hover:border-[var(--signal)] transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {entry.tags.map(t => (
            <button
              key={t}
              onClick={() => onTagClick(t)}
              className="bg-[var(--surface2)] px-2 py-0.5 font-mono text-[9px] text-[var(--muted)] hover:text-[var(--acid)] transition-colors"
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      {!expanded ? (
        entry.body && (
          <p
            className="mt-2 cursor-pointer text-sm leading-6 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            onClick={() => setExpanded(true)}
          >
            {preview}
            {entry.body.length > 160 && (
              <span className="ml-1 font-mono text-[9px] uppercase text-[var(--acid)]">ver más</span>
            )}
          </p>
        )
      ) : (
        <div className="mt-3">
          <pre
            className="whitespace-pre-wrap text-sm leading-6 text-[var(--ink)]"
            style={{ fontFamily: 'var(--body)' }}
          >
            {entry.body}
          </pre>

          {hasRelated && (
            <div className="mt-3 grid gap-1 border-t border-[var(--line)] pt-3">
              {entry.source && (
                <p className="font-mono text-[9px] uppercase text-[var(--muted)]">
                  <span className="text-[var(--ink2)]">Fuente:</span> {entry.source}
                </p>
              )}
              {entry.relatedSeries && (
                <p className="font-mono text-[9px] uppercase text-[var(--muted)]">
                  <span className="text-[var(--ink2)]">Serie:</span> {entry.relatedSeries}
                </p>
              )}
              {entry.relatedChapter && (
                <p className="font-mono text-[9px] uppercase text-[var(--muted)]">
                  <span className="text-[var(--ink2)]">Capítulo:</span> {entry.relatedChapter}
                </p>
              )}
              {entry.relatedCase && (
                <p className="font-mono text-[9px] uppercase text-[var(--muted)]">
                  <span className="text-[var(--ink2)]">Caso:</span> {entry.relatedCase}
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setExpanded(false)}
            className="mt-3 font-mono text-[9px] uppercase text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            ↑ Colapsar
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="mt-2 font-mono text-[9px] text-[var(--muted)]">
        {new Date(entry.updatedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  );
}
