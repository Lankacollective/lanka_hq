'use client';

import { useState } from 'react';
import { SectionTitle } from '@/components/Primitives';
import { MATURITY_BANDS } from '@/lib/types';

// ─── Types ─────────────────────────────────────────────────────────────────────

type DiagInputs = {
  clientCode: string;
  sector: string;
  // Revenue
  monthlyRevenue: string;
  averageTicket: string;
  tables: string;
  turnsPerDay: string;
  operatingDays: string;
  // Food cost
  foodCostTheoretical: string;
  foodCostActual: string;
  wastePercent: string;
  // Labor
  laborCost: string;
  // Fixed costs
  rent: string;
  utilities: string;
  otherFixed: string;
};

type DiagResults = {
  // Food cost
  foodCostGap: number;
  monthlyFoodCostLoss: number;
  // Labor
  laborCostOk: boolean;
  // Break-even
  totalFixed: number;
  breakEvenRevenue: number;
  marginOverBreakEven: number;
  // Capacity
  revenueCapacity: number;
  capacityUsed: number;
  // Maturity
  maturityScore: number;
  maturityBand: typeof MATURITY_BANDS[0];
  // Alerts
  alerts: Array<{ level: 'critical' | 'warn' | 'ok'; message: string }>;
  // Recommendations
  recommendations: string[];
};

// ─── Calculation logic ─────────────────────────────────────────────────────────

function calcDiag(inputs: DiagInputs): DiagResults | null {
  const revenue = parseFloat(inputs.monthlyRevenue);
  const ticket = parseFloat(inputs.averageTicket);
  const tables = parseFloat(inputs.tables);
  const turns = parseFloat(inputs.turnsPerDay);
  const days = parseFloat(inputs.operatingDays) || 26;
  const fcTheory = parseFloat(inputs.foodCostTheoretical);
  const fcActual = parseFloat(inputs.foodCostActual);
  const waste = parseFloat(inputs.wastePercent);
  const labor = parseFloat(inputs.laborCost);
  const rent = parseFloat(inputs.rent) || 0;
  const utilities = parseFloat(inputs.utilities) || 0;
  const otherFixed = parseFloat(inputs.otherFixed) || 0;

  if (!revenue || revenue <= 0) return null;

  // Food cost gap
  const fcGap = (isNaN(fcActual) || isNaN(fcTheory)) ? 0 : fcActual - fcTheory;
  const monthlyFoodCostLoss = fcGap > 0 ? (fcGap / 100) * revenue : 0;

  // Labor
  const laborOk = !isNaN(labor) && labor < 30;

  // Break-even (fixed costs / (1 - variable cost %))
  const totalFixed = rent + utilities + otherFixed;
  const variableCostPct = (isNaN(fcActual) ? (isNaN(fcTheory) ? 30 : fcTheory) : fcActual) +
                          (isNaN(labor) ? 25 : labor);
  const contributionMargin = Math.max(1, 100 - variableCostPct) / 100;
  const breakEvenRevenue = totalFixed > 0 ? totalFixed / contributionMargin : 0;
  const marginOverBreakEven = breakEvenRevenue > 0 ? revenue - breakEvenRevenue : 0;

  // Capacity
  const revenueCapacity = (!isNaN(ticket) && !isNaN(tables) && !isNaN(turns))
    ? ticket * tables * turns * days
    : 0;
  const capacityUsed = revenueCapacity > 0 ? Math.min(100, Math.round((revenue / revenueCapacity) * 100)) : 0;

  // Maturity score
  let maturity = 0;
  if (!isNaN(revenue) && revenue > 0)         maturity += 20;
  if (!isNaN(fcTheory))                       maturity += 15;
  if (!isNaN(fcActual))                       maturity += 15;
  if (!isNaN(fcGap) && fcGap < 3)             maturity += 10;
  if (!isNaN(labor) && labor < 30)            maturity += 10;
  if (!isNaN(waste))                          maturity += 10;
  if (!isNaN(ticket) && ticket > 0)           maturity += 10;
  if (breakEvenRevenue > 0)                   maturity += 10;
  const band = MATURITY_BANDS.find(b => maturity >= b.min && maturity <= b.max) ?? MATURITY_BANDS[0];

  // Alerts
  const alerts: DiagResults['alerts'] = [];
  if (fcGap > 5) alerts.push({ level: 'critical', message: `Food cost gap crítico: +${fcGap.toFixed(1)}% por encima del teórico → pierdes $${monthlyFoodCostLoss.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN/mes en insumos` });
  else if (fcGap > 2) alerts.push({ level: 'warn', message: `Food cost gap: +${fcGap.toFixed(1)}% — hay merma o robo sin controlar → $${monthlyFoodCostLoss.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN/mes` });
  else if (!isNaN(fcGap) && fcActual > 0) alerts.push({ level: 'ok', message: `Food cost controlado: real (${fcActual}%) vs teórico (${fcTheory}%) — gap de ${fcGap.toFixed(1)}%` });

  if (!isNaN(labor) && labor > 35) alerts.push({ level: 'critical', message: `Nómina en ${labor}% de ventas — nivel insostenible. Objetivo: < 30%` });
  else if (!isNaN(labor) && labor > 30) alerts.push({ level: 'warn', message: `Nómina en ${labor}% de ventas — zona de riesgo. Objetivo: < 30%` });

  if (breakEvenRevenue > 0 && marginOverBreakEven < 0) alerts.push({ level: 'critical', message: `Operando POR DEBAJO del punto de equilibrio: déficit de $${Math.abs(marginOverBreakEven).toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN/mes` });
  else if (breakEvenRevenue > 0 && marginOverBreakEven < revenue * 0.1) alerts.push({ level: 'warn', message: `Margen sobre punto de equilibrio < 10% — negocio sin colchón de riesgo` });

  if (!isNaN(waste) && waste > 8) alerts.push({ level: 'warn', message: `Merma en ${waste}% — estándar F&B: < 5%. Revisar ficha técnica y PEPS` });

  if (capacityUsed > 0 && capacityUsed < 50) alerts.push({ level: 'warn', message: `Capacidad utilizada: ${capacityUsed}% — mesa subutilizada. Revisar pricing, horarios o marketing` });

  // Recommendations
  const recommendations: string[] = [];
  if (fcGap > 2) recommendations.push('Implementar control de inventario con método PEPS y cotejo contra recetas estándar');
  if (!isNaN(labor) && labor > 30) recommendations.push('Auditar scheduling: ratio empleados/cubiertos, horas pico vs horas muertas');
  if (maturity < 51) recommendations.push('Instalar reporte semanal de ventas, food cost y nómina — los tres KPIs mínimos');
  if (breakEvenRevenue > 0 && marginOverBreakEven < revenue * 0.15) recommendations.push('Analizar mezcla de menú (Menu Engineering) para aumentar margen por plato');
  if (!isNaN(waste) && waste > 5) recommendations.push('Estandarizar fichas técnicas y establecer control de merma diario por estación');
  if (capacityUsed > 0 && capacityUsed < 60) recommendations.push('Revisar estrategia de llenado: ¿marketing, pricing dinámico, alianzas con apps de delivery?');
  if (recommendations.length === 0) recommendations.push('El negocio muestra madurez operativa saludable. Siguiente paso: optimizar y documentar para escalar.');

  return {
    foodCostGap: fcGap,
    monthlyFoodCostLoss,
    laborCostOk: laborOk,
    totalFixed,
    breakEvenRevenue,
    marginOverBreakEven,
    revenueCapacity,
    capacityUsed,
    maturityScore: maturity,
    maturityBand: band,
    alerts,
    recommendations,
  };
}

// ─── Export brief ──────────────────────────────────────────────────────────────

function exportBrief(inputs: DiagInputs, results: DiagResults) {
  const lines = [
    `# Diagnóstico Lanka · ${inputs.clientCode || 'Cliente'}`,
    `**Sector**: ${inputs.sector}  |  **Fecha**: ${new Date().toLocaleDateString('es-MX')}`,
    '',
    `## Índice de Madurez Operativa`,
    `**Score: ${results.maturityScore}/100 · ${results.maturityBand.label}**`,
    results.maturityBand.desc,
    '',
    `## KPIs Capturados`,
    `| Indicador | Valor |`,
    `|-----------|-------|`,
    inputs.monthlyRevenue    ? `| Ventas mensuales | $${parseFloat(inputs.monthlyRevenue).toLocaleString('es-MX')} MXN |` : '',
    inputs.foodCostTheoretical ? `| Food cost teórico | ${inputs.foodCostTheoretical}% |` : '',
    inputs.foodCostActual    ? `| Food cost real | ${inputs.foodCostActual}% |` : '',
    inputs.laborCost         ? `| Nómina / ventas | ${inputs.laborCost}% |` : '',
    inputs.averageTicket     ? `| Ticket promedio | $${inputs.averageTicket} MXN |` : '',
    inputs.wastePercent      ? `| Merma | ${inputs.wastePercent}% |` : '',
    '',
    `## Hallazgos Críticos`,
    ...results.alerts.map(a => `- [${a.level.toUpperCase()}] ${a.message}`),
    '',
    results.monthlyFoodCostLoss > 0
      ? `**Pérdida estimada por food cost gap: $${results.monthlyFoodCostLoss.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN/mes**`
      : '',
    results.breakEvenRevenue > 0
      ? `**Punto de equilibrio: $${results.breakEvenRevenue.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN/mes** (${results.marginOverBreakEven >= 0 ? '+' : ''}$${results.marginOverBreakEven.toLocaleString('es-MX', { maximumFractionDigits: 0 })} vs ventas actuales)`
      : '',
    '',
    `## Recomendaciones`,
    ...results.recommendations.map((r, i) => `${i + 1}. ${r}`),
    '',
    `---`,
    `*Generado por Lanka HQ · Sistema de diagnóstico F&B*`,
  ].filter(Boolean).join('\n');

  const blob = new Blob([lines], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `diagnostico-${(inputs.clientCode || 'cliente').toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Input field component ─────────────────────────────────────────────────────

function Field({ label, value, onChange, unit, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</label>
      <div className="flex items-center border border-[var(--line)] focus-within:border-[var(--acid)]">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="min-w-0 flex-1 bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none"
        />
        {unit && (
          <span className="flex-shrink-0 bg-[var(--surface)] px-2 py-2 font-mono text-[9px] text-[var(--muted)]">{unit}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function DiagnosticoRapido({ onBack }: { onBack: () => void }) {
  const [inputs, setInputs] = useState<DiagInputs>({
    clientCode: '', sector: 'Restaurante casual',
    monthlyRevenue: '', averageTicket: '', tables: '', turnsPerDay: '', operatingDays: '26',
    foodCostTheoretical: '', foodCostActual: '', wastePercent: '',
    laborCost: '',
    rent: '', utilities: '', otherFixed: '',
  });

  const set = (key: keyof DiagInputs) => (v: string) => setInputs(i => ({ ...i, [key]: v }));
  const results = calcDiag(inputs);

  const alertColor = (level: 'critical' | 'warn' | 'ok') =>
    level === 'critical' ? 'var(--signal)' : level === 'warn' ? 'var(--amber)' : 'var(--acid)';

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--muted)] hover:text-[var(--ink)] transition"
        >
          ← Volver a Casos
        </button>
      </div>

      <SectionTitle
        eyebrow="Diagnóstico"
        title="Diagnóstico rápido de cliente"
        subtitle="Captura los KPIs del cliente → el sistema calcula food cost gap, punto de equilibrio e índice de madurez"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Left: Inputs ── */}
        <div className="space-y-6">
          {/* Identity */}
          <div className="border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--acid)]">Identidad del cliente</p>
            <div>
              <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Código / nombre del caso</label>
              <input
                value={inputs.clientCode}
                onChange={e => set('clientCode')(e.target.value)}
                placeholder="Bistró Centro, Cliente 🦁, ..."
                className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[11px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Sector</label>
              <select
                value={inputs.sector}
                onChange={e => set('sector')(e.target.value)}
                className="w-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-2 font-mono text-[10px] text-[var(--ink)] outline-none focus:border-[var(--acid)]"
              >
                {['Restaurante casual','Fine dining','Bar / Cantina','Café / Panadería','Fast casual','Food truck','Dark kitchen','Catering','Hotel F&B','Otro'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Revenue & Capacity */}
          <div className="border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--acid)]">Ventas y capacidad</p>
            <Field label="Ventas mensuales" value={inputs.monthlyRevenue} onChange={set('monthlyRevenue')} unit="MXN/mes" />
            <Field label="Ticket promedio" value={inputs.averageTicket} onChange={set('averageTicket')} unit="MXN" />
            <div className="grid grid-cols-3 gap-2">
              <Field label="Mesas" value={inputs.tables} onChange={set('tables')} placeholder="–" />
              <Field label="Turnos/día" value={inputs.turnsPerDay} onChange={set('turnsPerDay')} placeholder="–" />
              <Field label="Días/mes" value={inputs.operatingDays} onChange={set('operatingDays')} placeholder="26" />
            </div>
          </div>

          {/* Food Cost */}
          <div className="border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--acid)]">Food cost</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Teórico (recetas)" value={inputs.foodCostTheoretical} onChange={set('foodCostTheoretical')} unit="%" placeholder="28" />
              <Field label="Real (inventario)" value={inputs.foodCostActual} onChange={set('foodCostActual')} unit="%" placeholder="–" />
            </div>
            <Field label="Merma" value={inputs.wastePercent} onChange={set('wastePercent')} unit="%" placeholder="–" />
          </div>

          {/* Labor */}
          <div className="border border-[var(--line)] bg-[var(--surface)] p-4 space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--acid)]">Nómina y costos fijos</p>
            <Field label="Nómina / ventas" value={inputs.laborCost} onChange={set('laborCost')} unit="%" placeholder="25" />
            <div className="grid grid-cols-3 gap-2">
              <Field label="Renta" value={inputs.rent} onChange={set('rent')} unit="MXN" />
              <Field label="Servicios" value={inputs.utilities} onChange={set('utilities')} unit="MXN" />
              <Field label="Otros fijos" value={inputs.otherFixed} onChange={set('otherFixed')} unit="MXN" />
            </div>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="space-y-4">
          {!results ? (
            <div className="flex h-40 items-center justify-center border border-dashed border-[var(--line)] p-6">
              <p className="text-center font-mono text-[10px] text-[var(--muted)]">
                Ingresa las ventas mensuales<br />para activar el diagnóstico
              </p>
            </div>
          ) : (
            <>
              {/* Maturity */}
              <div
                className="border-2 p-4"
                style={{ borderColor: results.maturityBand.color }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full font-mono text-2xl font-black"
                    style={{ background: results.maturityBand.color + '22', color: results.maturityBand.color }}
                  >
                    {results.maturityScore}
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Índice de madurez operativa</p>
                    <p className="mt-0.5 font-mono text-xl font-black" style={{ color: results.maturityBand.color }}>
                      {results.maturityBand.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] text-[var(--muted)]">{results.maturityBand.desc}</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${results.maturityScore}%`, background: results.maturityBand.color }}
                  />
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-2">
                {results.monthlyFoodCostLoss > 0 && (
                  <div className="border border-[var(--signal)] bg-[var(--surface)] p-3">
                    <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Pérdida mensual FC gap</p>
                    <p className="mt-1 font-mono text-lg font-black text-[var(--signal)]">
                      ${results.monthlyFoodCostLoss.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="font-mono text-[8px] text-[var(--muted)]">MXN/mes</p>
                  </div>
                )}
                {results.breakEvenRevenue > 0 && (
                  <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
                    <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Punto de equilibrio</p>
                    <p className="mt-1 font-mono text-lg font-black text-[var(--ink)]">
                      ${results.breakEvenRevenue.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="font-mono text-[8px]" style={{ color: results.marginOverBreakEven >= 0 ? 'var(--acid)' : 'var(--signal)' }}>
                      {results.marginOverBreakEven >= 0 ? '+' : ''}${results.marginOverBreakEven.toLocaleString('es-MX', { maximumFractionDigits: 0 })} vs ventas
                    </p>
                  </div>
                )}
                {results.capacityUsed > 0 && (
                  <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
                    <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Capacidad utilizada</p>
                    <p className="mt-1 font-mono text-lg font-black" style={{ color: results.capacityUsed < 60 ? 'var(--amber)' : 'var(--acid)' }}>
                      {results.capacityUsed}%
                    </p>
                    <p className="font-mono text-[8px] text-[var(--muted)]">
                      ${results.revenueCapacity.toLocaleString('es-MX', { maximumFractionDigits: 0 })} potencial
                    </p>
                  </div>
                )}
                {results.foodCostGap !== 0 && (inputs.foodCostTheoretical || inputs.foodCostActual) && (
                  <div className="border border-[var(--line)] bg-[var(--surface)] p-3">
                    <p className="font-mono text-[8px] uppercase text-[var(--muted)]">Food cost gap</p>
                    <p className="mt-1 font-mono text-lg font-black" style={{ color: results.foodCostGap > 2 ? 'var(--signal)' : 'var(--acid)' }}>
                      {results.foodCostGap > 0 ? '+' : ''}{results.foodCostGap.toFixed(1)}%
                    </p>
                    <p className="font-mono text-[8px] text-[var(--muted)]">real vs teórico</p>
                  </div>
                )}
              </div>

              {/* Alerts */}
              {results.alerts.length > 0 && (
                <div className="space-y-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--muted)]">Hallazgos</p>
                  {results.alerts.map((a, i) => (
                    <div
                      key={i}
                      className="flex gap-2 border p-3"
                      style={{ borderColor: alertColor(a.level), background: alertColor(a.level) + '11' }}
                    >
                      <span className="flex-shrink-0 font-mono text-[10px]" style={{ color: alertColor(a.level) }}>
                        {a.level === 'critical' ? '⚠' : a.level === 'ok' ? '✓' : '→'}
                      </span>
                      <p className="font-mono text-[9px]" style={{ color: alertColor(a.level) }}>{a.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              <div className="border border-[var(--line)] bg-[var(--surface)] p-4">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--acid)]">Recomendaciones Lanka</p>
                <div className="space-y-2">
                  {results.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="flex-shrink-0 font-mono text-[9px] font-bold text-[var(--acid)]">{i + 1}.</span>
                      <p className="font-mono text-[9px] text-[var(--muted)]">{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <button
                onClick={() => exportBrief(inputs, results)}
                className="w-full border border-[var(--acid)] py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--acid)] transition hover:bg-[var(--acid)] hover:text-black"
              >
                ↓ Exportar brief de diagnóstico (.md)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
