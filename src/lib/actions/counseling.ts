'use server';

import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { CounselingData, SurveyData } from '@/types/counseling&survey';
import { markStepCompleted } from './reservation';

// Server Action to fetch reservation and cast details
export async function getReservationDetails(reservationId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
      *,
      casts (
        id,
        name
      )
    `,
    )
    .eq('id', reservationId)
    .single();

  if (error) {
    console.error('Error fetching reservation:', error);
    return null;
  }

  return data;
}

// Server Action to submit counseling result
export async function submitCounselingResult(
  reservationId: string,
  nickname: string,
  counselingData: CounselingData,
  surveyData?: SurveyData,
) {
  // 1. workflow_counseling に保存
  const { error: insertError } = await supabase.from('workflow_counseling').insert({
    reservation_id: reservationId,
    answers: {
      nickname,
      counseling: counselingData,
      survey: surveyData,
    },
  });

  if (insertError) {
    console.error('Error saving counseling result:', insertError);
    return { success: false, error: insertError.message };
  }

  // 2. ワークフローのcounselingステップを完了にする
  await markStepCompleted(reservationId, 'counseling');

  return { success: true };
}
