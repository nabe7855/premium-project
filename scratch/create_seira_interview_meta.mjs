import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function createSeiraInterviewMeta() {
  console.log('=== CREATING SEIRA INTERVIEW META & CAST LINK ===\n');

  // 1. Get Seira article
  const { data: articles } = await supabase.from('media_articles').select('*').eq('slug', 'seira-interview-vol4');
  if (!articles || articles.length === 0) {
    console.error('Article seira-interview-vol4 not found!');
    return;
  }
  const article = articles[0];
  console.log('Found Article:', article.id, article.title);

  // 2. Get Seira cast record
  const { data: casts } = await supabase.from('casts').select('*').ilike('name', '%せいら%');
  console.log('Found Casts:', casts);

  const castId = casts && casts.length > 0 ? casts[0].id : '-130642';
  const castName = casts && casts.length > 0 ? casts[0].name : '青空（せいら）';

  // 3. Upsert interview_meta
  const { data: existingMeta } = await supabase.from('interview_meta').select('*').eq('article_id', article.id);

  let metaId = existingMeta && existingMeta.length > 0 ? existingMeta[0].id : null;

  if (!metaId) {
    const { data: newMeta, error: metaErr } = await supabase.from('interview_meta').insert({
      article_id: article.id,
      article_type: 'solo_interview',
      series_slug: 'seira-interview',
      vol_number: 4,
      area: 'fukuoka'
    }).select();

    if (metaErr) {
      console.error('Error inserting interview_meta:', metaErr);
      return;
    }
    metaId = newMeta[0].id;
    console.log('Inserted interview_meta:', metaId);
  } else {
    console.log('interview_meta already exists:', metaId);
  }

  // 4. Upsert interview_cast_links
  const { data: existingLinks } = await supabase.from('interview_cast_links').select('*').eq('interview_meta_id', metaId);

  if (!existingLinks || existingLinks.length === 0) {
    const { data: newLink, error: linkErr } = await supabase.from('interview_cast_links').insert([
      {
        interview_meta_id: metaId,
        cast_id: castId,
        cast_name: castName,
        cast_name_romaji: '-130642',
        role: 'interviewee',
        display_order: 0
      }
    ]).select();

    if (linkErr) {
      console.error('Error inserting interview_cast_links:', linkErr);
      return;
    }
    console.log('Inserted interview_cast_links:', newLink);
  } else {
    console.log('interview_cast_links already exists:', existingLinks);
  }
}

createSeiraInterviewMeta().catch(console.error);
