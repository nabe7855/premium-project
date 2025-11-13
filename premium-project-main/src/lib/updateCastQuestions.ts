import { supabase } from './supabaseClient';
import { CastQuestion } from '@/types/cast';

export async function updateCastQuestions(castId: string, answers: Record<string, string>) {
  const rows: Pick<CastQuestion, 'cast_id' | 'question_id' | 'answer'>[] =
    Object.entries(answers).map(([questionId, answer]) => ({
      cast_id: castId,
      question_id: questionId,
      answer,
    }));

  const { error } = await supabase.from('cast_questions').upsert(rows, {
    onConflict: 'cast_id,question_id',
  });

  if (error) throw error;
}
