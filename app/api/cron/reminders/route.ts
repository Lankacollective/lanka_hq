import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Production algorithm:
  // 1. Query reminders where dueAt <= now and sentAt is null.
  // 2. Query active push subscriptions for each reminder/user.
  // 3. Send Web Push notification.
  // 4. Mark reminder.sentAt = now.
  // 5. Optionally create follow-up tasks for overdue items.
  return NextResponse.json({ ok: true, checkedAt: new Date().toISOString(), todo: 'Connect database + web-push sender.' });
}
