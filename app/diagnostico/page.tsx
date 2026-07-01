import { createClient } from '@supabase/supabase-js';
import { DiagnosticoPublico } from './DiagnosticoPublico';

export const metadata = {
  title: 'Diagnóstico de Madurez Operativa · Lanka Collective',
  description: '63 preguntas · 15 minutos · Resultado inmediato con IA. Descubre en qué nivel está tu restaurante.',
};

async function fetchQuestions() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from('diagnostic_questions')
    .select('id, question_key, section, order_index, question_text, help_text, input_type, options, weight')
    .order('section')
    .order('order_index');
  return data ?? [];
}

export default async function DiagnosticoPage() {
  const questions = await fetchQuestions();
  return <DiagnosticoPublico questions={questions} />;
}
