'use server';

import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { markStepCompleted } from './reservation';

export async function saveConsent(data: {
  reservationId: string;
  clientNickname: string;
  therapistName: string;
  consentDate: string;
  isOver18: boolean;
  guidelinesAgreed: boolean[];
  therapistPledgeAgreed: boolean;
  consentTextSnapshot: string;
  logId: string;
}) {
  console.log('>>> [saveConsent] START', { reservationId: data.reservationId });

  try {
    const { error } = await supabase.from('workflow_consent').insert({
      reservation_id: data.reservationId,
      client_nickname: data.clientNickname,
      therapist_name: data.therapistName,
      consent_date: data.consentDate,
      is_over_18: data.isOver18,
      guidelines_agreed: data.guidelinesAgreed,
      therapist_pledge_agreed: data.therapistPledgeAgreed,
      consent_text_snapshot: data.consentTextSnapshot,
      log_id: data.logId,
    });

    if (error) {
      console.error('>>> [saveConsent] ERROR:', error);
      return { success: false, error: error.message };
    }

    console.log('>>> [saveConsent] SUCCESS');
    // ワークフローステップを完了にする（失敗しても主処理に影響しない）
    markStepCompleted(data.reservationId, 'consent').catch((e) =>
      console.error('[saveConsent] markStep failed:', e),
    );
    return { success: true };
  } catch (error: any) {
    console.error('>>> [saveConsent] CATCH ERROR:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getConsentStatus(reservationId: string) {
  console.log('>>> [getConsentStatus] Checking for:', reservationId);

  try {
    const { data, error } = await supabase
      .from('workflow_consent')
      .select('*')
      .eq('reservation_id', reservationId)
      .maybeSingle();

    if (error) {
      console.error('>>> [getConsentStatus] ERROR:', error);
      return { exists: false };
    }

    console.log('>>> [getConsentStatus] Result:', { exists: !!data });
    return { exists: !!data, data };
  } catch (error: any) {
    console.error('>>> [getConsentStatus] CATCH ERROR:', error);
    return { exists: false };
  }
}

export async function getReservationDetails(reservationId: string) {
  console.log('>>> [getReservationDetails] Fetching for:', reservationId);

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();

    console.log('>>> [getReservationDetails] SUCCESS');

    // therapist_name が空で cast_id がある場合、名前を補完する
    if (!data.therapist_name && data.cast_id) {
      const { data: castData } = await supabase
        .from('casts')
        .select('name')
        .eq('id', data.cast_id)
        .maybeSingle();
      if (castData) {
        data.therapist_name = castData.name;
      }
    }

    return data;
  } catch (error: any) {
    console.error('>>> [getReservationDetails] CATCH ERROR:', error);
    return null;
  }
}
