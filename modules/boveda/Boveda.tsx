'use client';

import { useLanka } from '@/lib/store';

export function Boveda() {
  const { state, updateAssembly, archiveAssembly, assemblyToTask } = useLanka();
  const active = state.assemblies.filter(a => a.status === 'draft' || a.status === 'ticket');
  const vault = state.vault;

  return (
    <div>
      {active.length > 0 && (
        <div className="mb-8">
          <p className="mb-3 border-l-[3px] border-[var(--terra)] pl-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            En progreso · {active.length}
          </p>
          <div className="grid gap-4">
            {active.map(a => (
              <div key={a.id} className="bg-white p-4" style={{ border: '1px solid var(--line)', borderLeft: '5px solid var(--terra)' }}>
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase text-[var(--terra)]">{a.kind}</p>
                    <input
                      value={a.title}
                      onChange={e => updateAssembly(a.id, { title: e.target.value })}
                      className="mt-1 w-full bg-transparent text-xl font-black uppercase outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => assemblyToTask(a.id)}
                      className="border border-[var(--ink)] px-3 py-2 font-mono text-[10px] font-bold uppercase"
                    >
                      Crear tarea
                    </button>
                    <button
                      onClick={() => archiveAssembly(a.id)}
                      className="bg-[var(--terra)] px-3 py-2 font-mono text-[10px] font-bold uppercase text-white"
                    >
                      → Bóveda
                    </button>
                  </div>
                </div>
                <textarea
                  value={a.body}
                  onChange={e => updateAssembly(a.id, { body: e.target.value })}
                  rows={6}
                  className="w-full resize-y border border-[var(--line)] bg-[var(--bone)] p-3 text-sm leading-6 outline-none focus:border-[var(--terra)]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length === 0 && vault.length === 0 && (
        <div className="border border-[var(--line)] bg-white p-8 text-center">
          <p className="font-mono text-[10px] uppercase text-[var(--muted)]">Bóveda vacía</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Selecciona stickers en el Board y usa la barra inferior para ensamblar.
          </p>
        </div>
      )}

      {vault.length > 0 && (
        <>
          <p className="mb-3 border-l-[3px] border-[var(--terra)] pl-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            Archivados · {vault.length}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {vault.map(v => (
              <div key={v.id} className="border border-[var(--line)] bg-white p-4">
                <p className="font-mono text-[10px] uppercase text-[var(--muted)]">
                  {v.kind} · {new Date(v.createdAt).toLocaleDateString('es-MX')}
                </p>
                <h4 className="mt-2 text-lg font-black uppercase">{v.title}</h4>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[var(--ink2)]">{v.body}</p>
                {v.lesson && (
                  <p className="mt-3 border-t border-[var(--line)] pt-3 text-sm text-[var(--terra)]">
                    Lección: {v.lesson}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
