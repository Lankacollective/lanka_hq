import { NextRequest, NextResponse } from 'next/server';

const CAOS_BASE = 'https://tmypjnoapglzdidrurqq.supabase.co/functions/v1';
const CAOS_KEY = process.env.CAOS_API_KEY;

function missingKeyResponse() {
  return NextResponse.json({ error: 'CAOS_API_KEY no configurada en el servidor' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  if (!CAOS_KEY) return missingKeyResponse();
  const qs = req.nextUrl.searchParams.toString();
  const res = await fetch(`${CAOS_BASE}/get-tasks${qs ? `?${qs}` : ''}`, {
    headers: { 'x-api-key': CAOS_KEY },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  if (!CAOS_KEY) return missingKeyResponse();
  const body = await req.json();
  const res = await fetch(`${CAOS_BASE}/add-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': CAOS_KEY },
    body: JSON.stringify({ ...body, source: body.source ?? 'lanka-hq' }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  if (!CAOS_KEY) return missingKeyResponse();
  const body = await req.json();
  const res = await fetch(`${CAOS_BASE}/update-task`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-api-key': CAOS_KEY },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
