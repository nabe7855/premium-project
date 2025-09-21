import { supabase } from './supabaseClient'
import { CastQuestion, QuestionMaster } from '@/types/cast'

type RawCastQuestion = {
  id: string
  cast_id?: string
  question_id?: string
  answer: string
  created_at?: string
  updated_at?: string
  question?: QuestionMaster | QuestionMaster[]
}

export async function getCastQuestions(castId: string): Promise<CastQuestion[]> {
  const { data, error } = await supabase
    .from('cast_questions')
    .select(`
      id,
      cast_id,
      question_id,
      answer,
      created_at,
      updated_at,
      question:question_master ( id, text, category, is_active, created_at )
    `)
    .eq('cast_id', castId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ CastQuestion取得エラー:', error.message)
    return []
  }

  return (data ?? []).map((d: RawCastQuestion): CastQuestion => {
    let question: QuestionMaster | undefined
    if (Array.isArray(d.question)) {
      question = d.question.length > 0 ? d.question[0] : undefined
    } else {
      question = d.question
    }

    return {
      id: d.id,
      cast_id: d.cast_id ?? castId,
      question_id: d.question_id ?? (question?.id ?? ''),
      answer: d.answer,
      question,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }
  })
}
