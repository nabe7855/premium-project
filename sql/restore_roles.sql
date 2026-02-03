CREATE TABLE IF NOT EXISTS public.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    role text,
    created_at timestamp without time zone DEFAULT now()
);

INSERT INTO public.roles (user_id, role) 
VALUES ('f4299d71-2b76-4017-aa9a-50f06892f491', 'admin')
ON CONFLICT DO NOTHING;
