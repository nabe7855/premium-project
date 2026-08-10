import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectOtherInterviews() {
  console.log('=== INSPECTING OTHER INTERVIEW ARTICLES (SAI, YUUHI, KAZUYA) ===\n');

  const { data: articles } = await supabase
    .from('media_articles')
    .select('*')
    .eq('category', 'interview');

  for (const art of (articles || [])) {
    console.log('Slug:', art.slug);
    console.log('Title:', art.title);
    console.log('Content Length:', art.content?.length);
    console.log('Content Snippet:', art.content?.slice(0, 300));

    const { data: meta } = await supabase.from('interview_meta').select('*').eq('article_id', art.id);
    console.log('Meta:', meta ? JSON.stringify(meta[0], null, 2).slice(0, 500) : 'NO META');
    console.log('--------------------------------------------------\n');
  }
}

inspectOtherInterviews().catch(console.error);
