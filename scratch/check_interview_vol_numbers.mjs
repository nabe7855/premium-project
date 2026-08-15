import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkInterviewVolNumbers() {
  const { data: articles } = await supabase
    .from('media_articles')
    .select('id, slug, title')
    .eq('category', 'interview')
    .eq('status', 'published');

  if (!articles) return;

  for (const art of articles) {
    const { data: metas } = await supabase
      .from('interview_meta')
      .select('vol_number, series_slug')
      .eq('article_id', art.id);
    const meta = metas?.[0];
    console.log(`slug: ${art.slug} | vol_number: ${meta?.vol_number} | series: ${meta?.series_slug}`);
  }
}

checkInterviewVolNumbers().catch(console.error);
