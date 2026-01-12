'use server';

import { supabase } from '@/lib/supabaseClient';
import { ReflectionData } from '@/types/cast-reflection';

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
    });

    if (error) {
      console.error('>>> [saveReflection] ERROR:', error);
      return { success: false, error: error.message };
    }

    console.log('>>> [saveReflection] SUCCESS');
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
