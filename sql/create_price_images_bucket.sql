-- Supabase Storage バケット作成とRLSポリシー設定
-- 実行方法: Supabase Dashboard > SQL Editor で実行

-- 1. price-images バケット作成
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'price-images',
  'price-images',
  true,
  5242880, -- 5MB制限
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS ポリシー設定

-- 全ユーザーが読み取り可能
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'price-images');

-- 認証済みユーザーがアップロード可能
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'price-images' 
  AND auth.role() = 'authenticated'
);

-- 認証済みユーザーが更新可能
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'price-images' 
  AND auth.role() = 'authenticated'
);

-- 認証済みユーザーが削除可能
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'price-images' 
  AND auth.role() = 'authenticated'
);

-- 【デバッグ用】全ユーザー（非ログイン含む）がアップロード可能にする場合
-- 注意: セキュリティ上のリスクがあるため、本番では使用しないでください
-- CREATE POLICY "Allow public upload for debug"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'price-images');
