-- Add status column to lh_hotels table
ALTER TABLE lh_hotels ADD COLUMN status text NOT NULL DEFAULT 'draft';

-- Optional: Update existing records to 'published' if needed (assuming current ones are live)
UPDATE lh_hotels SET status = 'published';
