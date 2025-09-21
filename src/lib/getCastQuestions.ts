// lib/getCastQuestions.ts
import { supabase } from './supabaseClient'
import { CastQuestion, QuestionMaster } from '@/types/cast'

export async function getCastQuestions(castId: string): Promise<CastQuestion[]> {
  console.log('🔍 getCastQuestions called with castId:', castId)

  const { data, error } = await supabase
    .from('cast_questions')
    .select(`
      id,
      cast_id,
      question_id,
      answer,
      created_at,
      updated_at,
      question:question_master (
        id,
        text,
        category,
        is_active,
        created_at
      )
    `)
    .eq('cast_id', castId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ getCastQuestions error:', error)
    return []
  }

  console.log('📦 raw cast_questions:', data)

  return (data ?? []).map((row: any): CastQuestion => {
    const q = row.question as QuestionMaster | null

    return {
      id: row.id,
      cast_id: row.cast_id,
      question_id: row.question_id,
      answer: row.answer ?? undefined,
      created_at: row.created_at,
      updated_at: row.updated_at ?? undefined,
      question: q
        ? {
            id: String(q.id),
            text: String(q.text),
            category: q.category ?? undefined,
            is_active: q.is_active ?? false,
            created_at: q.created_at ?? undefined,
          }
        : undefined,
    }
  })
}
