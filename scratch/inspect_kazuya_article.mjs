import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectKazuyaArticle() {
  console.log('=== INSPECTING KAZUYA INTERVIEW ARTICLE & META ===\n');

  const { data: articles } = await supabase
    .from('media_articles')
    .select('*')
    .eq('slug', 'kazuya-interview');

  if (!articles || articles.length === 0) {
    console.error('Kazuya article not found!');
    return;
  }

  const art = articles[0];
  console.log('Article ID:', art.id);
  console.log('Title:', art.title);

  const { data: meta } = await supabase
    .from('interview_meta')
    .select('*')
    .eq('article_id', art.id);

  if (meta && meta.length > 0) {
    console.log('Meta ID:', meta[0].id);
    console.log('Photos Data:', JSON.stringify(meta[0].photos, null, 2));
    console.log('Dialogue Data Sections:', JSON.stringify(meta[0].dialogue_data, null, 2));
  }
}

inspectKazuyaArticle().catch(console.error);
