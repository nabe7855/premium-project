import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const results: any = {};

    // 1. 店舗データの確認
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', 'fukuoka')
      .single();

    if (storeError) {
      results.store = { status: 'error', message: storeError.message, code: storeError.code };
    } else {
      results.store = { status: 'found', id: store.id, name: store.store_name };

      // 2. 料金設定の確認
      const { data: config, error: configError } = await supabase
        .from('price_configs')
        .select('*')
        .eq('store_id', store.id)
        .single();

      if (configError) {
        results.priceConfig = {
          status: 'error',
          message: configError.message,
          code: configError.code,
        };
      } else {
        results.priceConfig = { status: 'found', id: config.id };

        // 3. コースの確認
        const { count, error: courseError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('price_config_id', config.id);

        results.courses = {
          status: courseError ? 'error' : 'success',
          count: count,
          error: courseError?.message,
        };
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
