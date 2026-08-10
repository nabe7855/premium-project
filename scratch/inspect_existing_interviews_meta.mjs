import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectExistingInterviewsMeta() {
  console.log('=== INSPECTING EXISTING INTERVIEWS META ===\n');

  const { data: articles } = await supabase.from('media_articles').select('*').eq('category', 'interview');

  for (const a of articles || []) {
    console.log(`ID: ${a.id}`);
    console.log(`Slug: ${a.slug}`);
    console.log(`Title: ${a.title}`);
    console.log(`Status: ${a.status}`);
    
    const { data: meta } = await supabase.from('interview_meta').select('*').eq('article_id', a.id).maybeSingle();
    console.log(`Area: ${meta?.area}`);

    const { data: links } = await supabase.from('interview_cast_links').select('*').eq('article_id', a.id);
    console.log(`Cast Links:`, JSON.stringify(links));
    console.log('---');
  }
}

inspectExistingInterviewsMeta().catch(console.error);
