// 料金管理システムの型定義

export interface PriceConfig {
  id: string;
  store_id: string;
  hero_image_url?: string;
  prohibitions?: any;
  updated_at: string;
  created_at: string;
}

export interface Course {
  id: string;
  price_config_id: string;
  course_key: string; // 'standard', 'stay', 'date', etc.
  name: string;
  description?: string;
  icon?: string;
  extension_per_30min: number;
  designation_fee_first: number;
  designation_fee_note?: string;
  notes?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  plans?: CoursePlan[]; // リレーション
}

export interface CoursePlan {
  id: string;
  course_id: string;
  minutes: number;
  price: number;
  sub_label?: string;
  discount_info?: string;
  display_order: number;
  created_at: string;
}

export interface TransportArea {
  id: string;
  price_config_id: string;
  area: string;
  price?: number; // NULL可（応相談の場合）
  label: string;
  note?: string;
  display_order: number;
  created_at: string;
}

export interface PriceOption {
  id: string;
  price_config_id: string;
  name: string;
  description?: string;
  price: number;
  is_relative: boolean;
  display_order: number;
  created_at: string;
}

export interface Campaign {
  id: string;
  price_config_id: string;
  title: string;
  description?: string;
  image_url?: string;
  need_entry: boolean;
  accent_text?: string;
  price_info?: string;
  display_order: number;
  created_at: string;
}

// 完全な料金設定（全リレーションを含む）
export interface FullPriceConfig extends PriceConfig {
  courses: Course[];
  transport_areas: TransportArea[];
  options: PriceOption[];
  campaigns: Campaign[];
}

// 管理画面用の編集可能な型
export interface EditableCourse {
  id?: string;
  course_key: string;
  name: string;
  description: string;
  icon: string;
  extension_per_30min: number;
  designation_fee_first: number;
  designation_fee_note: string;
  notes: string;
  display_order: number;
  plans: EditableCoursePlan[];
}

export interface EditableCoursePlan {
  id?: string;
  minutes: number;
  price: number;
  sub_label?: string;
  discount_info?: string;
  display_order: number;
}

export interface EditableTransportArea {
  id?: string;
  area: string;
  price?: number;
  label: string;
  note?: string;
  display_order: number;
}

export interface EditablePriceOption {
  id?: string;
  name: string;
  description: string;
  price: number;
  is_relative: boolean;
  display_order: number;
}

export interface EditableCampaign {
  id?: string;
  title: string;
  description: string;
  image_url?: string;
  need_entry: boolean;
  accent_text: string;
  price_info: string;
  display_order: number;
}

export interface EditablePriceConfig {
  hero_image_url?: string;
  courses: EditableCourse[];
  transport_areas: EditableTransportArea[];
  options: EditablePriceOption[];
  campaigns: EditableCampaign[];
  prohibitions: string[];
}
