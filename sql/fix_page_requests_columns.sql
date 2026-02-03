-- 不足カラムの追加
ALTER TABLE public.page_requests ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.page_requests ADD COLUMN IF NOT EXISTS target_store_slugs TEXT[] DEFAULT '{}';
