import { StoreConfig } from '@/components/admin/price/types';
import { EditablePriceConfig } from '@/types/priceConfig';

/**
 * StoreConfig (UI表示用) から EditablePriceConfig (編集用) へ変換
 */
export function mapStoreConfigToEditableConfig(store: StoreConfig): EditablePriceConfig {
  return {
    hero_image_url: store.heroImageUrl || '/料金ページトップ画像.jpg',
    courses: store.courses.map((c, idx) => ({
      id: c.id.startsWith('temp-') ? undefined : c.id, // 新規追加分はIDなし
      course_key: c.id,
      name: c.name,
      description: c.description,
      icon: c.icon,
      extension_per_30min: c.extensionPer30min,
      designation_fee_first: c.designationFees.first,
      designation_fee_note: c.designationFees.note || '',
      notes: c.notes || '',
      display_order: idx,
      plans: c.plans.map((p, pIdx) => ({
        minutes: p.minutes,
        price: p.price,
        sub_label: p.subLabel,
        discount_info: p.discountInfo,
        display_order: pIdx,
      })),
    })),
    transport_areas: store.transportAreas.map((a, idx) => ({
      id: a.id.startsWith('temp-') ? undefined : a.id,
      area: a.area,
      price: a.price === 'negotiable' ? undefined : a.price,
      label: a.label,
      note: a.note,
      display_order: idx,
    })),
    options: store.options.map((o, idx) => ({
      id: o.id.startsWith('temp-') ? undefined : o.id,
      name: o.name,
      description: o.description,
      price: o.price,
      is_relative: o.isRelative || false,
      display_order: idx,
    })),
    campaigns: store.campaigns.map((c, idx) => ({
      id: c.id.startsWith('temp-') ? undefined : c.id,
      title: c.title,
      description: c.description,
      image_url: c.imageUrl,
      need_entry: c.needEntry,
      accent_text: c.accentText,
      price_info: c.priceInfo || '',
      display_order: idx,
    })),
  };
}
