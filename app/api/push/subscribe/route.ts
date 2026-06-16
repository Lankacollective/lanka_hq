import { NextResponse } from 'next/server';

// Starter only: replace this with Supabase/Postgres/Neon.
// Serverless memory is not durable, so this is not production storage.
const subscriptions: unknown[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  subscriptions.push(body);
  return NextResponse.json({ ok: true, warning: 'Subscription received. Persist it in a real database for production.', count: subscriptions.length });
}
