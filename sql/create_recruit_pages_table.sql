-- Create recruit_pages table
CREATE TABLE IF NOT EXISTS recruit_pages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(store_id, section_key)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS recruit_pages_store_id_idx ON recruit_pages(store_id);

-- Add update trigger
CREATE OR REPLACE FUNCTION update_recruit_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recruit_pages_updated_at
BEFORE UPDATE ON recruit_pages
FOR EACH ROW
EXECUTE FUNCTION update_recruit_pages_updated_at();
