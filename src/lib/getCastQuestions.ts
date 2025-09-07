import { supabase } from './supabaseClient';
import { CastQuestion, QuestionMaster } from '@/types/cast';

export async function getCastQuestions(userId: string): Promise<CastQuestion[]> {
  // 1. まずキャストを特定
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (castError || !cast) {
    console.error('❌ cast not found for user:', userId, castError);
    return [];
  }

  // 2. 特定した cast.id で質問を取得
  const { data, error } = await supabase
    .from('cast_questions')
    .select(`
      id,
      cast_id,
      question_id,
      answer,
      question:question_master (
        id,
        text,
        category,
        is_active,
        created_at
      )
    `)
    .eq('cast_id', cast.id);

  if (error) {
    console.error('❌ getCastQuestions error:', error);
    return [];
  }

  return (data ?? []).map((row: any): CastQuestion => {
  const q = row.question as QuestionMaster | null;

  return {
    id: row.id,
    cast_id: row.cast_id,
    question_id: row.question_id,
    answer: row.answer ?? undefined,
    question: q
      ? {
          id: String(q.id),
          text: String(q.text),
          category: q.category ?? undefined,
          is_active: q.is_active ?? false,
          created_at: q.created_at ?? undefined,
        }
      : undefined,
  };
});
}
