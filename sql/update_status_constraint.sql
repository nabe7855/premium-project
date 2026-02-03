-- 既存の制約を削除して、'private' を許可するように修正
ALTER TABLE public.page_requests 
DROP CONSTRAINT IF EXISTS page_requests_status_check;

ALTER TABLE public.page_requests 
ADD CONSTRAINT page_requests_status_check 
CHECK (status IN ('private', 'published'));

-- 既存のデータのデフォルト値を合わせる（もしあれば）
ALTER TABLE public.page_requests 
ALTER COLUMN status SET DEFAULT 'private';
