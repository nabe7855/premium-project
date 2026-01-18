-- Create page_requests table for storing layout builder data
CREATE TABLE IF NOT EXISTS public.page_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL, 
    reference_urls JSONB DEFAULT '[]'::jsonb, -- Array of strings
    sections JSONB DEFAULT '[]'::jsonb, -- Nested JSON structure for sections and grid elements
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.page_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated anon (or service role) for now.
-- Ideally restricted to admin users in production.
CREATE POLICY "Enable all access for page_requests" ON public.page_requests
    FOR ALL USING (true) WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE public.page_requests IS 'Stores page production requests created via the Layout Builder';
COMMENT ON COLUMN public.page_requests.sections IS 'Stores the entire section and grid element structure as a JSON object';
