create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  kind text not null default 'reminder',
  title text not null,
  body text,
  due_at timestamptz not null,
  sent_at timestamptz,
  source_type text,
  source_id text,
  created_at timestamptz not null default now()
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists reminders_due_idx on reminders(due_at) where sent_at is null;
