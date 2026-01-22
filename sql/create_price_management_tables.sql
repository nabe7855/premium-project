-- 料金管理システム用テーブル作成
-- 実行順序: このファイルを順番に実行してください

-- 1. price_configs テーブル（店舗ごとの料金設定）
CREATE TABLE IF NOT EXISTS price_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  hero_image_url TEXT, -- ヒーロー画像URL
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_id)
);

-- 2. courses テーブル（コース情報）
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_config_id UUID REFERENCES price_configs(id) ON DELETE CASCADE,
  course_key TEXT NOT NULL, -- コース識別子（例: standard, stay）
  name TEXT NOT NULL, -- コース名（例: スタンダードコース）
  description TEXT, -- 説明文
  icon TEXT, -- 絵文字アイコン
  extension_per_30min INTEGER NOT NULL DEFAULT 6000, -- 延長料金（30分あたり）
  designation_fee_first INTEGER NOT NULL DEFAULT 1000, -- 本指名料
  designation_fee_note TEXT, -- 指名料の備考
  notes TEXT, -- コース注意事項
  display_order INTEGER DEFAULT 0, -- 表示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. course_plans テーブル（各コースのプラン）
CREATE TABLE IF NOT EXISTS course_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  minutes INTEGER NOT NULL, -- 時間（分）
  price INTEGER NOT NULL, -- 料金
  sub_label TEXT, -- サブラベル（例: 当店のスタンダード）
  discount_info TEXT, -- 割引情報（例: 初回2,000円OFF）
  display_order INTEGER DEFAULT 0, -- 表示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. transport_areas テーブル（送迎エリア情報）
CREATE TABLE IF NOT EXISTS transport_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_config_id UUID REFERENCES price_configs(id) ON DELETE CASCADE,
  area TEXT NOT NULL, -- エリア名
  price INTEGER, -- 料金（NULL可: 応相談の場合）
  label TEXT NOT NULL, -- ラベル（例: 1,000円エリア）
  note TEXT, -- 備考
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. price_options テーブル（オプション情報）
CREATE TABLE IF NOT EXISTS price_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_config_id UUID REFERENCES price_configs(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- オプション名
  description TEXT, -- 説明
  price INTEGER NOT NULL, -- 料金
  is_relative BOOLEAN DEFAULT false, -- 相対価格かどうか
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. campaigns テーブル（キャンペーン情報）
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_config_id UUID REFERENCES price_configs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT, -- キャンペーン画像URL
  need_entry BOOLEAN DEFAULT false,
  accent_text TEXT,
  price_info TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_price_configs_store_id ON price_configs(store_id);
CREATE INDEX IF NOT EXISTS idx_courses_price_config_id ON courses(price_config_id);
CREATE INDEX IF NOT EXISTS idx_course_plans_course_id ON course_plans(course_id);
CREATE INDEX IF NOT EXISTS idx_transport_areas_price_config_id ON transport_areas(price_config_id);
CREATE INDEX IF NOT EXISTS idx_price_options_price_config_id ON price_options(price_config_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_price_config_id ON campaigns(price_config_id);

-- RLS (Row Level Security) ポリシー設定
-- 認証済みユーザーは全てのデータにアクセス可能
ALTER TABLE price_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Public read access" ON price_configs FOR SELECT USING (true);
CREATE POLICY "Public read access" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON course_plans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transport_areas FOR SELECT USING (true);
CREATE POLICY "Public read access" ON price_options FOR SELECT USING (true);
CREATE POLICY "Public read access" ON campaigns FOR SELECT USING (true);

-- 認証済みユーザーは全ての操作が可能
CREATE POLICY "Authenticated users full access" ON price_configs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON courses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON course_plans FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON transport_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON price_options FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
