# Arquitectura de recordatorios reales

## Problema actual

`setInterval(checkReminders, 30000)` solo funciona si la pestaña está abierta. Eso no es automatización confiable.

## Arquitectura correcta

```txt
Usuario crea recordatorio
↓
Se guarda en DB
↓
Cron server-side revisa recordatorios vencidos
↓
Backend envía Web Push
↓
Service Worker recibe push
↓
Sistema operativo muestra notificación
```

## Componentes

### 1. Base de datos

Tabla `reminders`:

```sql
id uuid primary key
user_id uuid
kind text
title text
body text
due_at timestamptz
sent_at timestamptz null
source_type text
source_id text
created_at timestamptz
```

Tabla `push_subscriptions`:

```sql
id uuid primary key
user_id uuid
endpoint text unique
p256dh text
auth text
user_agent text
created_at timestamptz
last_seen_at timestamptz
```

### 2. Service Worker

Archivo: `public/sw.js`

Escucha `push` y usa `registration.showNotification()`.

### 3. API de suscripción

`POST /api/push/subscribe`

Guarda el endpoint del dispositivo en la base de datos.

### 4. Cron

`GET /api/cron/reminders`

- Corre cada 15 minutos.
- Busca recordatorios vencidos.
- Envía notificación.
- Marca `sent_at`.

## Limitaciones reales

- Requiere HTTPS en producción.
- El usuario debe permitir notificaciones.
- iOS tiene restricciones específicas según navegador y modo de instalación.
- Push no debe enviar datos sensibles en texto plano.
