import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function investigateAmolabVsIkeo() {
  console.log('================================================================');
  console.log('=== INVESTIGATING AMOLAB VS IKEO DUPLICATION & ISSUES ===');
  console.log('================================================================\n');

  // 1. Check HTTP Status, Title, H1, Canonical for both routes
  const urls = [
    'https://www.sutoroberrys.jp/ikeo/fukuoka-recruit-guide',
    'https://www.sutoroberrys.jp/amolab/fukuoka-recruit-guide',
    'https://www.sutoroberrys.jp/ikeo/yokohama-recruit-guide',
    'https://www.sutoroberrys.jp/amolab/yokohama-recruit-guide',
  ];

  console.log('--- 1. HTTP RESPONSE & METADATA CHECK ---');
  for (const u of urls) {
    try {
      const code = execSync(`curl.exe -o NUL -s -w "%{http_code}" "${u}"`, { encoding: 'utf8' }).trim();
      const html = execSync(`curl.exe -s "${u}"`, { encoding: 'utf8' });
      const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'None';
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'None';
      const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[0] || 'None';

      console.log(`URL: ${u}`);
      console.log(`  HTTP Code: ${code}`);
      console.log(`  Title:     ${title}`);
      console.log(`  H1:        ${h1.replace(/\s+/g, ' ')}`);
      console.log(`  Canonical: ${canonical}`);
      console.log('---');
    } catch (e) {
      console.error(`Error checking ${u}:`, e.message);
    }
  }

  // 2. Fetch all media_articles in DB
  console.log('\n--- 2. ALL DB ARTICLES IN MEDIA_ARTICLES ---');
  const { data: articles } = await supabase
    .from('media_articles')
    .select('id, slug, title, category, target_audience, status, published_at')
    .order('published_at', { ascending: false });

  console.log(`Total Articles in DB: ${articles?.length || 0}`);
  (articles || []).forEach((a, idx) => {
    console.log(`[${idx + 1}] Slug: "${a.slug}"`);
    console.log(`     Category: ${a.category} | Target Audience: ${a.target_audience} | Status: ${a.status}`);
    console.log(`     Title: ${a.title}`);
    console.log('---');
  });
}

investigateAmolabVsIkeo().catch(console.error);
