import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixSeiraCastLinkSupabase() {
  console.log('=== UPDATING SEIRA CAST LINK NAMES IN SUPABASE ===\n');

  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'seira-interview-vol4');
  if (!articles || articles.length === 0) return;

  const { data: meta } = await supabase.from('interview_meta').select('*').eq('article_id', articles[0].id);
  if (!meta || meta.length === 0) return;

  const { data: casts } = await supabase.from('casts').select('*').ilike('name', '%せいら%');
  const seiraCast = casts && casts.length > 0 ? casts[0] : null;

  const { data: links } = await supabase.from('interview_cast_links').select('*').eq('interview_meta_id', meta[0].id);

  if (links && links.length > 0) {
    for (const l of links) {
      const { error } = await supabase.from('interview_cast_links').update({
        cast_name: '青空（せいら）',
        cast_name_romaji: '-130642',
        cast_id: seiraCast ? seiraCast.id : l.cast_id
      }).eq('id', l.id);
      if (error) console.error('Error updating link:', error);
      else console.log('✅ Updated link in Supabase:', l.id);
    }
  }
}

fixSeiraCastLinkSupabase().catch(console.error);
