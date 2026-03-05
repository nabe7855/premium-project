'use server';

import { submitReview } from '@/lib/lovehotelApi';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { ReflectionData } from '@/types/cast-reflection';
import { getReservationDetails } from './consent';
import { markStepCompleted } from './reservation';

export async function saveReflection(data: ReflectionData & { reservationId: string }) {
  console.log('>>> [saveReflection] START', { reservationId: data.reservationId });

  try {
    const sessionId = `SESS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase.from('workflow_reflection').insert({
      reservation_id: data.reservationId,
      session_id: sessionId,
      satisfaction: data.satisfaction,
      safety_score: data.safetyScore,
      success_points: data.successPoints,
      success_memo: data.successMemo,
      improvement_points: data.improvementPoints,
      next_action: data.nextAction,
      customer_traits: data.customerTraits,
      customer_analysis: data.customerAnalysis,
      has_incident: data.hasIncident,
      incident_detail: data.incidentDetail || null,
      hotel_id: data.hotelId || null,
      hotel_rating: data.hotelRating || null,
      hotel_report: data.hotelReport || null,
      hotel_photos: data.hotelPhotos || null,
    });

    if (error) {
      console.error('>>> [saveReflection] ERROR:', error);
      return { success: false, error: error.message };
    }

    // ホテルフィードバックがあればlh_reviewsに同期
    if (data.hotelId && data.hotelReport) {
      try {
        const resInfo = await getReservationDetails(data.reservationId);
        const castName = resInfo?.therapist_name || 'Cast';

        // プロフェッショナルレポートとして同期
        await submitReview(
          {
            hotelId: data.hotelId,
            userName: `${castName} (${data.reservationId.slice(0, 4)})`,
            rating: data.hotelRating || 5,
            content: data.hotelReport,
            stayType: 'rest',
            cleanliness: 5,
            service: 5,
            rooms: 5,
            value: 5,
          },
          [],
        );

        // Manual sync logic if submitReview doesn't handle existing URLs
        const { data: review } = await supabase
          .from('lh_reviews')
          .insert({
            hotel_id: data.hotelId,
            user_name: `${castName} (プロフェッショナル報告)`,
            rating: data.hotelRating || 5,
            content: data.hotelReport,
            stay_type: 'pro_report',
          })
          .select()
          .single();

        if (review && data.hotelPhotos && data.hotelPhotos.length > 0) {
          await supabase.from('lh_review_photos').insert(
            data.hotelPhotos.map((url) => ({
              review_id: review.id,
              url: url,
              category: 'interior',
            })),
          );
        }
      } catch (syncError) {
        console.error('>>> [saveReflection] Hotel sync error:', syncError);
        // ホテル同期に失敗しても全体の保存は成功とする
      }
    }

    console.log('>>> [saveReflection] SUCCESS');
    // ワークフローのreflectionステップを完了にする
    markStepCompleted(data.reservationId, 'reflection').catch((e) =>
      console.error('[saveReflection] markStep failed:', e),
    );
    return { success: true };
  } catch (error: any) {
    console.error('>>> [saveReflection] CATCH ERROR:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getReflectionStatus(reservationId: string) {
  console.log('>>> [getReflectionStatus] Checking for:', reservationId);

  try {
    const { data, error } = await supabase
      .from('workflow_reflection')
      .select('*')
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (error) {
      console.error('>>> [getReflectionStatus] ERROR:', error);
      return { exists: false };
    }

    console.log('>>> [getReflectionStatus] Result:', { exists: !!data });
    return { exists: !!data, data };
  } catch (error: any) {
    console.error('>>> [getReflectionStatus] CATCH ERROR:', error);
    return { exists: false };
  }
}
