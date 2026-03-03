-- workflow_consent テーブルのRLSポリシーを修正
-- 問題: 認証済みユーザー限定のINSERTポリシーにより、サーバーアクション（anonキー）がブロックされていた

-- 既存の INSERT ポリシーを削除
DROP POLICY IF EXISTS "Authenticated users can insert consent data" ON public.workflow_consent;

-- 新ポリシー: 予約IDがあれば誰でもINSERT可能（サービス提供上、認証不要なフォームのため）
CREATE POLICY "Anyone can insert consent data"
ON public.workflow_consent FOR INSERT
WITH CHECK (true);

-- ※ SELECTは引き続き認証済みユーザーのみ（既存ポリシーを維持）
-- "Authenticated users can view consent data" は変更なし
