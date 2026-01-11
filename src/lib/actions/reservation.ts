'use server';

import { supabase } from '@/lib/supabaseClient';
import { Reservation, WorkflowStep } from '@/types/reservation';

const INITIAL_STEPS: WorkflowStep[] = [
  { id: 'counseling', label: 'カウンセリングシート＋アンケート', isCompleted: false, type: 'pre' },
  { id: 'consent', label: '性的同意画面', isCompleted: false, type: 'pre' },
  { id: 'review', label: '口コミ', isCompleted: false, type: 'post' },
  { id: 'survey', label: '事後アンケート', isCompleted: false, type: 'post' },
  { id: 'reflection', label: '振り返りシート', isCompleted: false, type: 'post' },
];

export async function createReservation(formData: {
  customerName: string;
  clientNickname?: string;
  dateTime: string;
  visitCount: number;
  email?: string;
  phone?: string;
  notes?: string;
  castId?: string;
}) {
  console.log('>>> [createReservation] START CALL at', new Date().toISOString());
  console.log('>>> [createReservation] Input FormData:', JSON.stringify(formData, null, 2));

  try {
    const payload: any = {
      customer_name: formData.customerName,
      client_nickname: formData.clientNickname || formData.customerName,
      reservation_datetime: formData.dateTime, // 既存の必須カラムに対応
      date_time: formData.dateTime, // 追加したカラム（もしあれば）にも一応入れる
      visit_count: formData.visitCount,
      status: 'pending',
      progress_json: INITIAL_STEPS,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      cast_id: formData.castId,
    };
    console.log('>>> [createReservation] Database Payload:', JSON.stringify(payload, null, 2));

    console.log('>>> [createReservation] Executing Supabase insert...');
    const { data, error } = await supabase.from('reservations').insert([payload]).select().single();

    if (error) {
      console.error('>>> [createReservation] Supabase INSERT ERROR:', error);
      throw error;
    }

    console.log('>>> [createReservation] Supabase INSERT SUCCESS:', JSON.stringify(data, null, 2));

    // メール通知のシミュレーション
    console.log(
      `>>> [Notification] Sending reservation alert to nabe7855@gmail.com for ${formData.customerName}`,
    );

    return { success: true, data };
  } catch (error: any) {
    console.error('>>> [createReservation] CATCH ERROR:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getReservations() {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // TypeScriptの型に変換
    const formatted: Reservation[] = data.map((d: any) => ({
      id: d.id,
      customerName: d.customer_name,
      visitCount: d.visit_count,
      dateTime: d.reservation_datetime || d.date_time || '',
      status: d.status,
      steps: d.progress_json || INITIAL_STEPS,
    }));

    return formatted;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}
