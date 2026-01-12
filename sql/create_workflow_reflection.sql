-- 施術振り返りワークフローデータを保存するテーブル（キャスト専用）
CREATE TABLE IF NOT EXISTS public.workflow_reflection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    
    -- セッション情報
    session_id TEXT,
    
    -- 自己評価
    satisfaction INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
    safety_score INTEGER CHECK (safety_score BETWEEN 1 AND 5),
    
    -- うまくいった点
    success_points JSONB, -- 配列データ
    success_memo TEXT,
    
    -- 改善したい点
    improvement_points JSONB, -- 配列データ
    next_action TEXT,
    
    -- お客様分析
    customer_traits JSONB, -- 配列データ
    customer_analysis TEXT,
    
    -- トラブル・懸念事項
    has_incident BOOLEAN DEFAULT false,
    incident_detail TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(reservation_id)
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.workflow_reflection ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーは全て閲覧可能
CREATE POLICY "Authenticated users can view reflection data" 
ON public.workflow_reflection FOR SELECT 
USING (auth.role() = 'authenticated');

-- ポリシー: 認証済みユーザーは挿入可能
CREATE POLICY "Authenticated users can insert reflection data" 
ON public.workflow_reflection FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_workflow_reflection_reservation_id 
ON public.workflow_reflection(reservation_id);

-- コメント追加
COMMENT ON TABLE public.workflow_reflection IS '予約ごとの施術振り返りデータ（キャスト専用）';
COMMENT ON COLUMN public.workflow_reflection.reservation_id IS '予約ID（外部キー）';
COMMENT ON COLUMN public.workflow_reflection.satisfaction IS '満足度（1-5）';
COMMENT ON COLUMN public.workflow_reflection.safety_score IS '安全運用スコア（1-5）';
COMMENT ON COLUMN public.workflow_reflection.success_points IS 'うまくいった点（複数選択）';
COMMENT ON COLUMN public.workflow_reflection.improvement_points IS '改善したい点（複数選択）';
COMMENT ON COLUMN public.workflow_reflection.customer_traits IS 'お客様の特性（複数選択）';
