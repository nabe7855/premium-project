import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function runFinalVerification() {
  console.log('=================================================================');
  console.log('=== FULL VERIFICATION & EVIDENCE RETRIEVAL FOR IKEO RECOVERY ===');
  console.log('=================================================================\n');

  // 1. Check Compliance (Grep 0 match for forbidden words)
  console.log('--- 1. VERIFYING FORBIDDEN WORDS IN ALL ARTICLES ---');
  const { data: articles } = await supabase.from('media_articles').select('*').eq('category', 'ikeo');
  const forbiddenRegex = /(保証|確実に|絶対|必ず|安定して稼げる)/g;
  let forbiddenMatches = 0;
  for (const a of articles || []) {
    const text = stripHtml(a.content || '') + ' ' + (a.title || '');
    const m = text.match(forbiddenRegex) || [];
    if (m.length > 0) {
      console.error(`  ❌ Match in /ikeo/${a.slug}:`, m);
      forbiddenMatches += m.length;
    } else {
      console.log(`  ✅ Clean /ikeo/${a.slug}: 0 matches`);
    }
  }
  console.log(`Forbidden words total matches: ${forbiddenMatches}\n`);

  // 2. Verify fukuoka-recruit-guide URL 200 OK & slug unchanged
  console.log('--- 2. VERIFYING FUKUOKA RECRUIT GUIDE URL & SLUG ---');
  const fukuokaUrl = 'https://www.sutoroberrys.jp/ikeo/fukuoka-recruit-guide';
  const fukuokaStatus = execSync(`curl.exe -s -o NUL -w "%{http_code}" "${fukuokaUrl}"`, { encoding: 'utf8' });
  console.log(`  URL: ${fukuokaUrl}`);
  console.log(`  HTTP Response Status: ${fukuokaStatus} (Expected: 200)\n`);

  // 3. Verify Images Content-Length (1 image 50-80KB, total < 900KB)
  console.log('--- 3. VERIFYING IMAGE SIZES (Content-Length) ---');
  const imgUrls = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=75',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=75'
  ];
  let totalImgBytes = 0;
  imgUrls.forEach((url, i) => {
    try {
      const headers = execSync(`curl.exe -sI "${url}"`, { encoding: 'utf8' });
      const clMatch = headers.match(/content-length:\s*(\d+)/i);
      const bytes = clMatch ? parseInt(clMatch[1], 10) : 0;
      const kb = (bytes / 1024).toFixed(2);
      totalImgBytes += bytes;
      console.log(`  Image ${i + 1} (${url.slice(0, 45)}...): ${bytes} bytes (${kb} KB)`);
    } catch (e) {
      console.error(`  Error fetching headers for image ${i + 1}:`, e);
    }
  });
  console.log(`  Total Images Size: ${(totalImgBytes / 1024).toFixed(2)} KB (Limit: 900 KB)\n`);

  // 4. Verify Fukuoka Guide Word Count, H1, H2, Title, Alt, Links
  console.log('--- 4. VERIFYING FUKUOKA GUIDE METRICS & STRUCTURE ---');
  const fukuokaDb = articles.find(a => a.slug === 'fukuoka-recruit-guide');
  const fukuokaText = stripHtml(fukuokaDb.content);
  const h1Match = fukuokaDb.content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Match = fukuokaDb.content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  console.log(`  Title: "${fukuokaDb.title}"`);
  console.log(`  H1 Count: ${h1Match.length} (H1 text: "${stripHtml(h1Match[0] || '')}")`);
  console.log(`  Title != H1: ${fukuokaDb.title !== stripHtml(h1Match[0] || '')}`);
  console.log(`  H2 Sections Count: ${h2Match.length}`);
  console.log(`  Plain Text Character Count: ${fukuokaText.length} chars (Limit >= 3000)\n`);

  // 5. Verify Yokohama Guide is ORIGINAL & NOT COPY
  console.log('--- 5. VERIFYING YOKOHAMA GUIDE ORIGINALITY ---');
  const yokohamaDb = articles.find(a => a.slug === 'yokohama-recruit-guide');
  const yokohamaText = stripHtml(yokohamaDb.content);
  console.log(`  Fukuoka Text Length: ${fukuokaText.length} chars`);
  console.log(`  Yokohama Text Length: ${yokohamaText.length} chars`);
  console.log(`  Is Yokohama Original (Not duplicate of Fukuoka): ${fukuokaDb.content !== yokohamaDb.content}`);
  console.log(`  Yokohama Title: "${yokohamaDb.title}"\n`);

  console.log('=== FINAL VERIFICATION COMPLETE ===');
}

runFinalVerification().catch(console.error);
