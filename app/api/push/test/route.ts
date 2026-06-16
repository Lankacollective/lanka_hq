import { NextResponse } from 'next/server';

export async function POST() {
  // Wire this to web-push + database subscriptions after adding VAPID keys.
  return NextResponse.json({ ok: true, todo: 'Load subscriptions from DB and send push with web-push.' });
}
