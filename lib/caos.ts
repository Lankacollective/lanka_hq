const CAOS_API = 'https://tmypjnoapglzdidrurqq.supabase.co/functions/v1/add-task';
const CAOS_KEY = 'caos_sk_lnk_7xK9mP2vQr3bN8dTw';

export interface CaosTask {
  title: string;
  description?: string;
  project?: string;
  assignee?: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

export async function sendToCAOS(task: CaosTask): Promise<void> {
  const res = await fetch(CAOS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CAOS_KEY,
    },
    body: JSON.stringify({ ...task, source: 'lanka-hq' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error enviando a CAOS');
  }
}
