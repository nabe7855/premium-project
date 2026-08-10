import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function runReport() {
  const { data: articles } = await supabase
    .from('media_articles')
    .select('*')
    .eq('category', 'ikeo')
    .order('published_at', { ascending: false });

  console.log('=== IKEO ARTICLES FINAL AUDIT SUMMARY ===\n');

  for (const a of articles || []) {
    const raw = a.content || '';
    const text = stripHtml(raw);

    const h1Match = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1Match ? stripHtml(h1Match[1]) : a.title;

    console.log(`URL/slug: /ikeo/${a.slug}`);
    console.log(`Title: ${a.title}`);
    console.log(`H1: ${h1}`);
    console.log(`Status: ${a.status}`);
    console.log(`Published At: ${a.published_at || a.created_at}`);
    console.log(`Updated At: ${a.updated_at}`);
    console.log(`Text Length: ${text.length}`);
    console.log(`Summary: ${text.slice(0, 150)}...`);
    console.log(`Raw Snippet:\n${raw.slice(0, 300)}...\n`);
    console.log('-----------------------------------------------------\n');
  }
}

runReport().catch(console.error);
