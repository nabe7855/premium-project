import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkCategory() {
  const { data } = await supabase.from('media_articles').select('slug, category, title, status').in('slug', ['fukuoka-recruit-guide', 'yokohama-recruit-guide']);
  console.log('Category check:', data);
}

checkCategory();
