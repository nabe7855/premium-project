'use server';

import { supabase } from '@/lib/supabaseClient';
import { SurveyResponse } from '@/types/service-feedback';

export async function saveSurvey(data: SurveyResponse & { reservationId: string }) {
  console.log('>>> [saveSurvey] START', { reservationId: data.reservationId });

  try {
    const { error } = await supabase.from('workflow_survey').insert({
      reservation_id: data.reservationId,
      session_id: data.sessionId,
      device_type: data.deviceType,
      form_version: data.formVersion,
      overall_satisfaction: data.overallSatisfaction,
      repeat_intent: data.repeatIntent,
      recommend_intent: data.recommendIntent,
      block_a_other: data.blockAOther,
      booking_ease: data.bookingEase,
      arrival_support: data.arrivalSupport,
      site_usability: data.siteUsability,
      price_satisfaction: data.priceSatisfaction,
      block_b_other: data.blockBOther,
      therapist_name: data.therapistName,
      service_impression: data.serviceImpression,
      technical_satisfaction: data.technicalSatisfaction,
      good_points: data.goodPoints,
      improvement_points: data.improvementPoints,
      block_c_other: data.blockCOther,
      store_improvements: data.storeImprovements,
      desired_services: data.desiredServices,
      desired_hp_content: data.desiredHpContent,
      block_d_other: data.blockDOther,
      source: data.source,
      search_keyword: data.searchKeyword,
      block_e_other: data.blockEOther,
      free_text: data.freeText,
      skipped_flag: data.skippedFlag,
    });

    if (error) {
      console.error('>>> [saveSurvey] ERROR:', error);
      return { success: false, error: error.message };
    }

    console.log('>>> [saveSurvey] SUCCESS');
    return { success: true };
  } catch (error: any) {
    console.error('>>> [saveSurvey] CATCH ERROR:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getSurveyStatus(reservationId: string) {
  console.log('>>> [getSurveyStatus] Checking for:', reservationId);

  try {
    const { data, error } = await supabase
      .from('workflow_survey')
      .select('*')
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (error) {
      console.error('>>> [getSurveyStatus] ERROR:', error);
      return { exists: false };
    }

    console.log('>>> [getSurveyStatus] Result:', { exists: !!data });
    return { exists: !!data, data };
  } catch (error: any) {
    console.error('>>> [getSurveyStatus] CATCH ERROR:', error);
    return { exists: false };
  }
}
