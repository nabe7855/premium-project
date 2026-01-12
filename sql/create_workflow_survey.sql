-- 事後アンケートワークフローデータを保存するテーブル
CREATE TABLE IF NOT EXISTS public.workflow_survey (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    device_type TEXT,
    form_version TEXT DEFAULT '1.0.0',
    
    -- Block A: 全体満足度
    overall_satisfaction TEXT,
    repeat_intent TEXT,
    recommend_intent TEXT,
    block_a_other TEXT,
    
    -- Block B: サービス品質
    booking_ease TEXT,
    arrival_support TEXT,
    site_usability TEXT,
    price_satisfaction TEXT,
    block_b_other TEXT,
    
    -- Block C: セラピストについて
    therapist_name TEXT,
    service_impression JSONB, -- 配列データ
    technical_satisfaction TEXT,
    good_points JSONB, -- 配列データ
    improvement_points JSONB, -- 配列データ
    block_c_other TEXT,
    
    -- Block D: サービス改善・新企画
    store_improvements JSONB, -- 配列データ
    desired_services JSONB, -- 配列データ
    desired_hp_content JSONB, -- 配列データ
    block_d_other TEXT,
    
    -- Block E: 流入経路
    source TEXT,
    search_keyword TEXT,
    block_e_other TEXT,
    
    -- Block F: 自由記述
    free_text TEXT,
    
    skipped_flag BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(reservation_id)
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.workflow_survey ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーは全て閲覧可能
CREATE POLICY "Authenticated users can view survey data" 
ON public.workflow_survey FOR SELECT 
USING (auth.role() = 'authenticated');

-- ポリシー: 認証済みユーザーは挿入可能
CREATE POLICY "Authenticated users can insert survey data" 
ON public.workflow_survey FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_workflow_survey_reservation_id 
ON public.workflow_survey(reservation_id);

-- コメント追加
COMMENT ON TABLE public.workflow_survey IS '予約ごとの事後アンケートデータ';
COMMENT ON COLUMN public.workflow_survey.reservation_id IS '予約ID（外部キー）';
COMMENT ON COLUMN public.workflow_survey.service_impression IS '接客の印象（複数選択）';
COMMENT ON COLUMN public.workflow_survey.good_points IS '良かった点（複数選択）';
COMMENT ON COLUMN public.workflow_survey.improvement_points IS '改善してほしい点（複数選択）';
COMMENT ON COLUMN public.workflow_survey.store_improvements IS '店舗の改善要望（複数選択）';
COMMENT ON COLUMN public.workflow_survey.desired_services IS '希望するサービス（複数選択）';
COMMENT ON COLUMN public.workflow_survey.desired_hp_content IS '希望するHPコンテンツ（複数選択）';
