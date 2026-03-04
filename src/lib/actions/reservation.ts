'use server';

import { prisma } from '@/lib/prisma';
import { Reservation, WorkflowStep } from '@/types/reservation';
import { revalidatePath } from 'next/cache';

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
  storeId?: string;
  preCompleteCounseling?: boolean;
}) {
  try {
    let finalStoreId = formData.storeId;

    // 店舗IDが未指定でキャストIDがある場合、キャストの所属店舗を検索
    if (!finalStoreId && formData.castId) {
      const membership = await prisma.castStoreMembership.findFirst({
        where: { cast_id: formData.castId },
        select: { store_id: true },
        orderBy: { is_main: 'desc' }, // メイン店舗を優先
      });
      if (membership) {
        finalStoreId = membership.store_id;
      }
    }

    const reservation = await (prisma.reservations as any).create({
      data: {
        id: crypto.randomUUID(),
        customer_name: formData.customerName,
        client_nickname: formData.clientNickname || formData.customerName,
        reservation_datetime: formData.dateTime,
        date_time: formData.dateTime,
        visit_count: formData.visitCount,
        status: 'pending',
        progress_json: (formData.preCompleteCounseling
          ? INITIAL_STEPS.map((s) => (s.id === 'counseling' ? { ...s, isCompleted: true } : s))
          : INITIAL_STEPS) as any,
        email: formData.email || null,
        phone: formData.phone || null,
        notes: formData.notes || null,
        cast_id: formData.castId || null,
        store_id: finalStoreId || null,
      },
      select: {
        id: true,
        customer_name: true,
      },
    });

    return { success: true, data: reservation };
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function getReservations(storeId?: string, castId?: string) {
  try {
    const where: any = {};
    if (storeId) {
      where.store_id = storeId;
    }
    if (castId) {
      where.cast_id = castId;
    }

    console.log('[getReservations] Querying with where:', JSON.stringify(where, null, 2));

    const data = await (prisma.reservations as any).findMany({
      where,
      select: {
        id: true,
        customer_name: true,
        client_nickname: true,
        reservation_datetime: true,
        date_time: true,
        visit_count: true,
        status: true,
        progress_json: true,
        email: true,
        phone: true,
        notes: true,
        cast_id: true,
        store_id: true,
        therapist_name: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    console.log(`[getReservations] Found ${data.length} records in DB.`);

    // キャストと店舗の情報も取得してマッピング
    const castIds = [...new Set(data.map((r: any) => r.cast_id).filter(Boolean))] as string[];
    const storeIds = [...new Set(data.map((r: any) => r.store_id).filter(Boolean))] as string[];

    const [casts, stores] = await Promise.all([
      prisma.cast.findMany({
        where: { id: { in: castIds } },
        select: { id: true, name: true },
      }),
      prisma.store.findMany({
        where: { id: { in: storeIds } },
        select: { id: true, name: true },
      }),
    ]);

    const castMap = new Map(casts.map((c) => [c.id, c.name]));
    const storeMap = new Map(stores.map((s) => [s.id, s.name]));

    const formatted: Reservation[] = data.map((d: any) => ({
      id: d.id,
      customerName: d.customer_name || '不明',
      visitCount: d.visit_count || 1,
      dateTime: d.reservation_datetime || d.date_time || '',
      status: (d.status as 'pending' | 'completed') || 'pending',
      steps: (d.progress_json as unknown as WorkflowStep[]) || INITIAL_STEPS,
      castId: d.cast_id || undefined,
      castName: (d.cast_id ? castMap.get(d.cast_id) : null) || d.therapist_name || '担当なし',
      storeId: d.store_id || undefined,
      storeName: (d.store_id ? storeMap.get(d.store_id) : null) || '店舗なし',
      customerRequests: d.notes || undefined,
      phone: d.phone || undefined,
      email: d.email || undefined,
      clientNickname: d.client_nickname || undefined,
    }));

    console.log(`[getReservations] Formatted ${formatted.length} reservations.`);
    return formatted;
  } catch (error) {
    console.error('[getReservations] Error fetching reservations:', error);
    return [];
  }
}

export async function getStores() {
  try {
    return await prisma.store.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

export async function getStoreBySlug(slug: string) {
  try {
    return await prisma.store.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
  } catch (error) {
    console.error('Error fetching store by slug:', error);
    return null;
  }
}

export async function updateReservationStatus(
  reservationId: string,
  status: 'pending' | 'completed',
) {
  try {
    await (prisma.reservations as any).update({
      where: { id: reservationId },
      data: {
        status,
        updated_at: new Date(),
        // completed_at: status === 'completed' ? new Date() : null, // DB反映が未完了のため一旦コメントアウト
      },
      select: { id: true },
    });
    revalidatePath('/admin/admin/reservations');
    return { success: true };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return { success: false };
  }
}

export async function updateReservationStep(
  reservationId: string,
  steps: WorkflowStep[],
  status: 'pending' | 'completed',
) {
  try {
    await (prisma.reservations as any).update({
      where: { id: reservationId },
      data: {
        progress_json: steps as any,
        status,
        updated_at: new Date(),
        // completed_at: status === 'completed' ? new Date() : null,
      },
      select: { id: true },
    });
    revalidatePath('/admin/admin/reservations');
    return { success: true };
  } catch (error) {
    console.error('Error updating reservation step:', error);
    return { success: false };
  }
}

export async function markStepCompleted(reservationId: string, stepId: string) {
  try {
    const reservation = await prisma.reservations.findUnique({
      where: { id: reservationId },
      select: { progress_json: true },
    });

    if (!reservation) return { success: false, error: 'Has reservation not found' };

    const currentSteps = (reservation.progress_json as unknown as WorkflowStep[]) || INITIAL_STEPS;
    const newSteps = currentSteps.map((step) =>
      step.id === stepId ? { ...step, isCompleted: true } : step,
    );

    const allDone = newSteps.every((s) => s.isCompleted);
    const newStatus = allDone ? 'completed' : 'pending';

    await (prisma.reservations as any).update({
      where: { id: reservationId },
      data: {
        progress_json: newSteps as any,
        status: newStatus,
        updated_at: new Date(),
        // completed_at: newStatus === 'completed' ? new Date() : null,
      },
      select: { id: true },
    });

    revalidatePath('/admin/admin/reservations');
    return { success: true };
  } catch (error) {
    console.error('Error marking step completed:', error);
    return { success: false };
  }
}

export async function getAllCasts() {
  try {
    const casts = await prisma.cast.findMany({
      select: {
        id: true,
        name: true,
        memberships: {
          select: { store_id: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // UI側の使い勝手のため、storeIds 配列を追加して返す
    return casts.map((c) => ({
      ...c,
      storeIds: c.memberships.map((m) => m.store_id),
    }));
  } catch (error) {
    console.error('Error fetching all casts:', error);
    return [];
  }
}

export async function assignCastToReservation(reservationId: string, castId: string) {
  try {
    const cast = await prisma.cast.findUnique({
      where: { id: castId },
      select: { name: true },
    });

    if (!cast) {
      throw new Error('Cast not found');
    }

    await prisma.reservations.update({
      where: { id: reservationId },
      data: {
        cast_id: castId,
        therapist_name: cast.name, // 検索用などのため、名前も同期しておく
        updated_at: new Date(),
      },
      select: { id: true },
    });

    revalidatePath('/admin/admin/reservations');
    return { success: true };
  } catch (error) {
    console.error('Error assigning cast:', error);
    return { success: false };
  }
}
