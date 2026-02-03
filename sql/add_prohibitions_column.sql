-- check columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'price_configs' AND column_name = 'prohibitions';

-- add column if not exists (PostgreSQL 9.6+)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_configs' AND column_name='prohibitions') THEN
        ALTER TABLE price_configs ADD COLUMN prohibitions JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;
