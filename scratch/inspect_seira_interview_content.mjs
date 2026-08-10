import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectSeiraContent() {
  console.log('=== INSPECTING SEIRA INTERVIEW CONTENT IN DB ===\n');

  const { data: articles, error } = await supabase
    .from('media_articles')
    .select('*')
    .eq('slug', 'seira-interview-vol4');

  if (error || !articles || articles.length === 0) {
    console.error('Error or not found:', error);
    return;
  }

  const art = articles[0];
  console.log('ID:', art.id);
  console.log('Title:', art.title);
  console.log('Status:', art.status);
  console.log('Category:', art.category);
  console.log('Content Length:', art.content ? art.content.length : 0);
  console.log('Content Snippet:', art.content ? art.content.slice(0, 500) : 'EMPTY');
}

inspectSeiraContent().catch(console.error);
