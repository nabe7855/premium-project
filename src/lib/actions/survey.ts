'use server';

import { submitReview } from '@/lib/lovehotelApi';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { SurveyResponse } from '@/types/service-feedback';
import { getReservationDetails } from './consent';
import { markStepCompleted } from './reservation';

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
      hotel_id: data.hotelId || null,
      hotel_rating: data.hotelRating || null,
      hotel_comment: data.hotelComment || null,
      skipped_flag: data.skippedFlag,
    });

    if (error) {
      console.error('>>> [saveSurvey] ERROR:', error);
      return { success: false, error: error.message };
    }

    // ホテルフィードバックがあればlh_reviewsに同期
    if (data.hotelId && (data.hotelComment || data.hotelRating !== 'no_answer')) {
      try {
        const resInfo = await getReservationDetails(data.reservationId);
        const userName = data.blockAOther || resInfo?.client_nickname || 'Guest';

        await submitReview(
          {
            hotelId: data.hotelId,
            userName: userName,
            rating: typeof data.hotelRating === 'number' ? data.hotelRating : 5,
            content: data.hotelComment || '利用させていただきました。',
            stayType: 'rest',
            cleanliness: 5,
            service: 5,
            design: 5,
            facilities: 5,
            rooms: 5,
            value: 5,
          },
          [],
        );
      } catch (syncError) {
        console.error('>>> [saveSurvey] Hotel sync error:', syncError);
      }
    }

    console.log('>>> [saveSurvey] SUCCESS');
    // ワークフローのsurveyステップを完了にする
    markStepCompleted(data.reservationId, 'survey').catch((e) =>
      console.error('[saveSurvey] markStep failed:', e),
    );
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
