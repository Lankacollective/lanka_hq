# LANKA HQ · Migración técnica al stack definitivo

## Decisión

El HTML monolítico deja de ser la base. A partir de ahora, LANKA HQ se divide en módulos dentro de Next.js:

- `CommandCenter`
- `MasterOS`
- `Dashboard`
- `Board`
- `AssemblyFlow`
- `Automations`
- `Backup`

## Por qué

1. React conserva estado de interfaz sin reescribir el DOM completo.
2. Next.js App Router permite separar UI, API routes y automatizaciones server-side.
3. Tailwind reduce el CSS monolítico a clases utilitarias y tokens mínimos.
4. Service Worker + Push API permiten notificaciones aunque la pestaña no esté abierta.
5. Cron server-side permite revisar recordatorios sin depender de una pestaña activa.

## Flujo funcional preservado

```txt
Stickers de colores
↓
Bandeja de ensamblaje
↓
Ensamblaje
↓
Tarea / Ticket / Decisión / Sistema / Brief IA
↓
Bóveda
```

## Fases

### Fase 1 — UI modular

- Migrar componentes visuales del HTML a React.
- Mantener datos en localStorage para prototipo.
- Eliminar parpadeos por renderizado manual.

### Fase 2 — Persistencia real

- Sustituir localStorage por IndexedDB local + Postgres/Supabase en nube.
- Agregar usuarios/dispositivos.
- Guardar push subscriptions.

### Fase 3 — Automatizaciones reales

- Cron cada 15 minutos.
- Buscar recordatorios vencidos.
- Enviar Web Push.
- Marcar como enviados.
- Crear tareas automáticas por KPIs críticos.

### Fase 4 — PWA

- Manifest.
- Iconos.
- Instalación en móvil.
- Offline básico.
- Sync cuando vuelva conexión.

## Migración desde el HTML viejo

1. Exportar backup JSON del HTML actual.
2. Crear función `migrateLegacyState()`.
3. Mapear:
   - stickers → `state.stickers`
   - tasks → `state.tasks`
   - kpis → `state.kpis`
   - assemblies → `state.assemblies`
   - vault → `state.vault`
4. Importar en Next app usando Backup.
