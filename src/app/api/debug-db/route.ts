import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  console.log('--- DB Fix Start ---');

  // 1. 都道府県のIDをクリーンアップ
  const { data: prefs } = await supabase.from('lh_prefectures').select('*');
  const results = [];

  for (const pref of prefs) {
    if (pref.id.trim() !== pref.id) {
      const oldId = pref.id;
      const newId = pref.id.trim();
      console.log(`Fixing prefecture: "${oldId}" -> "${newId}"`);

      // 市区町村の外部参照を更新
      const { error: cityErr } = await supabase
        .from('lh_cities')
        .update({ prefecture_id: newId })
        .eq('prefecture_id', oldId);

      if (cityErr) console.error('City update error:', cityErr);

      // ホテルの外部参照を更新
      const { error: hotelErr } = await supabase
        .from('lh_hotels')
        .update({ prefecture_id: newId })
        .eq('prefecture_id', oldId);

      if (hotelErr) console.error('Hotel update error:', hotelErr);

      // 新しいIDで挿入
      const { error: insErr } = await supabase
        .from('lh_prefectures')
        .insert({ ...pref, id: newId });

      if (insErr) console.error('Insert error:', insErr);

      // 旧IDを削除
      const { error: delErr } = await supabase.from('lh_prefectures').delete().eq('id', oldId);

      if (delErr) console.error('Delete error:', delErr);

      results.push({ oldId, newId, success: !insErr && !delErr });
    }
  }

  // 2. 市区町村の外部参照が残っていないか一応チェック（念のため）
  const { data: cities } = await supabase.from('lh_cities').select('*');
  for (const city of cities) {
    if (city.prefecture_id.trim() !== city.prefecture_id) {
      await supabase
        .from('lh_cities')
        .update({ prefecture_id: city.prefecture_id.trim() })
        .eq('id', city.id);
    }
  }

  return NextResponse.json({
    message: 'Normalization completed',
    results,
    currentPrefs: (await supabase.from('lh_prefectures').select('*')).data,
    currentCities: (await supabase.from('lh_cities').select('*')).data,
  });
}
