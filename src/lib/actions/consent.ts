'use server';

import { supabase } from '@/lib/supabaseClient';

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

    if (error) {
      console.error('>>> [getReservationDetails] ERROR:', error);
      return null;
    }

    console.log('>>> [getReservationDetails] SUCCESS');
    return data;
  } catch (error: any) {
    console.error('>>> [getReservationDetails] CATCH ERROR:', error);
    return null;
  }
}
