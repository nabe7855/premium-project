-- Supabase Storageのbannersバケットに対する書き込み権限を付与するSQL

-- 既にポリシーが存在する場合のエラーを避けるため、一度削除（オプション）
-- DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow anonymous updates" ON storage.objects;

-- INSERT (新規アップロード) を許可
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow anonymous uploads'
    ) THEN
        CREATE POLICY "Allow anonymous uploads" ON storage.objects
        FOR INSERT
        TO anon
        WITH CHECK (bucket_id = 'banners');
    END IF;
END $$;

-- UPDATE (上書き) を許可
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow anonymous updates'
    ) THEN
        CREATE POLICY "Allow anonymous updates" ON storage.objects
        FOR UPDATE
        TO anon
        USING (bucket_id = 'banners');
    END IF;
END $$;

-- SELECT (読み取り) を許可 (公開バケットでもこれが必要な場合があります)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Allow public select'
    ) THEN
        CREATE POLICY "Allow public select" ON storage.objects
        FOR SELECT
        TO public
        USING (bucket_id = 'banners');
    END IF;
END $$;
