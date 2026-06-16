# LANKA HQ · Next.js Starter

Migración del HTML monolítico hacia una app modular con Next.js App Router + Tailwind CSS + estado central.

## Run local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Qué incluye

- Shell de pestañas globales.
- Master OS editable.
- Dashboard con KPIs.
- Stickers de colores.
- Flujo: stickers → bandeja → ensamblaje → tarea/ticket/decisión/sistema → bóveda.
- Board de ejecución.
- Backups JSON.
- Service worker base para push.
- API routes base para suscripciones y cron de recordatorios.

## Importante sobre recordatorios reales

Los recordatorios dentro del navegador solo funcionan mientras la app esté abierta. Para recordatorios sin pestaña abierta necesitas:

1. App desplegada con HTTPS.
2. Service worker registrado.
3. Push subscription guardada en base de datos.
4. Cron server-side que revise recordatorios vencidos.
5. Envío Web Push desde backend.

Este starter deja la estructura preparada, pero debes conectar una base de datos real para producción.
