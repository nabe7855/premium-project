'use server';

import { supabase } from '@/lib/supabaseClient';
import type { EditablePriceConfig, FullPriceConfig } from '@/types/priceConfig';

/**
 * 店舗の料金設定を取得
 */
export async function getPriceConfig(storeSlug: string): Promise<FullPriceConfig | null> {
  try {
    // 1. 店舗IDを取得
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', storeSlug)
      .single();

    if (storeError || !store) {
      console.error('Store not found:', storeError);
      return null;
    }

    // 2. 料金設定を取得
    const { data: priceConfig, error: configError } = await supabase
      .from('price_configs')
      .select('*')
      .eq('store_id', store.id)
      .single();

    if (configError) {
      console.error('Price config not found:', configError);
      return null;
    }

    // 3. コース情報を取得（プランを含む）
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(
        `
        *,
        plans:course_plans(*)
      `,
      )
      .eq('price_config_id', priceConfig.id)
      .order('display_order', { ascending: true });

    if (coursesError) {
      console.error('Courses fetch error:', coursesError);
    }

    // 4. 送迎エリアを取得
    const { data: transportAreas, error: transportError } = await supabase
      .from('transport_areas')
      .select('*')
      .eq('price_config_id', priceConfig.id)
      .order('display_order', { ascending: true });

    if (transportError) {
      console.error('Transport areas fetch error:', transportError);
    }

    // 5. オプションを取得
    const { data: options, error: optionsError } = await supabase
      .from('price_options')
      .select('*')
      .eq('price_config_id', priceConfig.id)
      .order('display_order', { ascending: true });

    if (optionsError) {
      console.error('Options fetch error:', optionsError);
    }

    // 6. キャンペーンを取得
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('price_config_id', priceConfig.id)
      .order('display_order', { ascending: true });

    if (campaignsError) {
      console.error('Campaigns fetch error:', campaignsError);
    }

    return {
      ...priceConfig,
      courses: courses || [],
      transport_areas: transportAreas || [],
      options: options || [],
      campaigns: campaigns || [],
    };
  } catch (error) {
    console.error('Error fetching price config:', error);
    return null;
  }
}

/**
 * 料金設定を保存
 */
export async function savePriceConfig(
  storeSlug: string,
  config: EditablePriceConfig,
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 店舗IDを取得
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', storeSlug)
      .single();

    if (storeError || !store) {
      return { success: false, error: 'Store not found' };
    }

    // 2. price_configを作成または更新
    const { data: priceConfig, error: configError } = await supabase
      .from('price_configs')
      .upsert(
        {
          store_id: store.id,
          hero_image_url: config.hero_image_url,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'store_id',
        },
      )
      .select()
      .single();

    if (configError || !priceConfig) {
      return { success: false, error: 'Failed to save price config' };
    }

    // 3. 既存のデータを削除（カスケード削除されるが念のため）
    await supabase.from('courses').delete().eq('price_config_id', priceConfig.id);
    await supabase.from('transport_areas').delete().eq('price_config_id', priceConfig.id);
    await supabase.from('price_options').delete().eq('price_config_id', priceConfig.id);
    await supabase.from('campaigns').delete().eq('price_config_id', priceConfig.id);

    // 4. コースを保存
    for (const course of config.courses) {
      const { data: savedCourse, error: courseError } = await supabase
        .from('courses')
        .insert({
          price_config_id: priceConfig.id,
          course_key: course.course_key,
          name: course.name,
          description: course.description,
          icon: course.icon,
          extension_per_30min: course.extension_per_30min,
          designation_fee_first: course.designation_fee_first,
          designation_fee_note: course.designation_fee_note,
          notes: course.notes,
          display_order: course.display_order,
        })
        .select()
        .single();

      if (courseError || !savedCourse) {
        console.error('Course save error:', courseError);
        continue;
      }

      // プランを保存
      if (course.plans && course.plans.length > 0) {
        const plans = course.plans.map((plan) => ({
          course_id: savedCourse.id,
          minutes: plan.minutes,
          price: plan.price,
          sub_label: plan.sub_label,
          discount_info: plan.discount_info,
          display_order: plan.display_order,
        }));

        await supabase.from('course_plans').insert(plans);
      }
    }

    // 5. 送迎エリアを保存
    if (config.transport_areas && config.transport_areas.length > 0) {
      const transportAreas = config.transport_areas.map((area) => ({
        price_config_id: priceConfig.id,
        area: area.area,
        price: area.price,
        label: area.label,
        note: area.note,
        display_order: area.display_order,
      }));

      await supabase.from('transport_areas').insert(transportAreas);
    }

    // 6. オプションを保存
    if (config.options && config.options.length > 0) {
      const options = config.options.map((option) => ({
        price_config_id: priceConfig.id,
        name: option.name,
        description: option.description,
        price: option.price,
        is_relative: option.is_relative,
        display_order: option.display_order,
      }));

      await supabase.from('price_options').insert(options);
    }

    // 7. キャンペーンを保存
    if (config.campaigns && config.campaigns.length > 0) {
      const campaigns = config.campaigns.map((campaign) => ({
        price_config_id: priceConfig.id,
        title: campaign.title,
        description: campaign.description,
        image_url: campaign.image_url,
        need_entry: campaign.need_entry,
        accent_text: campaign.accent_text,
        price_info: campaign.price_info,
        display_order: campaign.display_order,
      }));

      await supabase.from('campaigns').insert(campaigns);
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving price config:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * 画像をSupabase Storageにアップロード
 */
export async function uploadPriceImage(
  file: File,
  path: string,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage.from('price-images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('price-images').getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
}
