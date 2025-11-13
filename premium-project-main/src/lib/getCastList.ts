// lib/getCastList.ts
import { supabase } from './supabaseClient';
import { Cast, Store, Status } from '@/types/cast';

export async function getCastList(): Promise<{
  casts: Cast[];
  stores: Store[];
  statuses: Status[];
}> {
  const { data: castData, error: castError } = await supabase
    .from('casts')
    .select(`
      id,
      slug,                     -- ✅ slug を取得
      name,
      manager_comment,
      is_active,
      catch_copy,
      cast_store_memberships (
        stores (
          id,
          name
        )
      ),
      cast_statuses (
        status_master (
          id,
          name,
          label_color,
          text_color
        )
      )
    `);

  const { data: storeData } = await supabase
    .from('stores')
    .select('id, name');

  const { data: statusData } = await supabase
    .from('status_master')
    .select('id, name, label_color, text_color');

  if (castError) {
    console.error('❌ Cast取得エラー:', castError);
  }

  const formatted: Cast[] =
    castData?.map((c: any) => ({
      id: c.id,
      slug: c.slug, // ✅ 型に合わせて追加
      name: c.name,
      manager_comment: c.manager_comment,
      isActive: c.is_active, // ✅ キャメルケースに変換
      catch_copy: c.catch_copy,
      stores: c.cast_store_memberships?.map((cs: any) => cs.stores) || [],
      statuses: c.cast_statuses?.map((cs: any) => cs.status_master) || [],
    })) ?? [];

  return {
    casts: formatted,
    stores: storeData || [],
    statuses: statusData || [],
  };
}
