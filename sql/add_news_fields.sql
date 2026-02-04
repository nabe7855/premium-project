-- Add thumbnailUrl and targetStoreSlugs columns to page_requests table
ALTER TABLE page_requests 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS target_store_slugs TEXT[] DEFAULT '{}';
