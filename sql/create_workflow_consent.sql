-- 性的同意ワークフローデータを保存するテーブル
CREATE TABLE IF NOT EXISTS public.workflow_consent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    client_nickname TEXT NOT NULL,
    therapist_name TEXT NOT NULL,
    consent_date TEXT NOT NULL,
    is_over_18 BOOLEAN NOT NULL DEFAULT true,
    guidelines_agreed JSONB NOT NULL, -- チェックボックスの状態を配列で保存
    therapist_pledge_agreed BOOLEAN NOT NULL DEFAULT false,
    consent_text_snapshot TEXT, -- 法的記録用のスナップショット
    log_id TEXT, -- CP-XXXXXXX 形式のID
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(reservation_id)
);

-- RLS (Row Level Security) の有効化
ALTER TABLE public.workflow_consent ENABLE ROW LEVEL SECURITY;

-- ポリシー: 認証済みユーザーは全て閲覧可能
CREATE POLICY "Authenticated users can view consent data" 
ON public.workflow_consent FOR SELECT 
USING (auth.role() = 'authenticated');

-- ポリシー: 認証済みユーザーは挿入可能
CREATE POLICY "Authenticated users can insert consent data" 
ON public.workflow_consent FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- インデックス作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_workflow_consent_reservation_id 
ON public.workflow_consent(reservation_id);

-- コメント追加
COMMENT ON TABLE public.workflow_consent IS '予約ごとの性的同意フォームデータ';
COMMENT ON COLUMN public.workflow_consent.reservation_id IS '予約ID（外部キー）';
COMMENT ON COLUMN public.workflow_consent.guidelines_agreed IS 'ガイドライン同意状況（boolean配列をJSON形式で保存）';
COMMENT ON COLUMN public.workflow_consent.consent_text_snapshot IS '法的記録用の同意内容スナップショット';
