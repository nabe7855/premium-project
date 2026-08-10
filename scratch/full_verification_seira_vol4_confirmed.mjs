import { execSync } from 'child_process';

function verifySeiraConfirmedLive() {
  console.log('================================================================');
  console.log('=== FULL LIVE VERIFICATION: SEIRA VOL.4 CONFIRMED PACKAGE ===');
  console.log('================================================================\n');

  const canonicalUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const uuidUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/8df77013-ed2c-435f-8f9e-83f1cb60f41f/seira-interview-vol4';

  // Clear cache first
  try {
    execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "{\\"path\\":\\"/store/fukuoka/interview/-130642/seira-interview-vol4\\"}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
  } catch (e) {}

  // 1. URL 301 Redirect Check
  console.log('--- 1. URL 301 REDIRECT & STATUS CHECK ---');
  const uuidHeader = execSync(`curl.exe -i -s "${uuidUrl}"`, { encoding: 'utf8' }).slice(0, 400);
  console.log('UUID URL Raw Response Header Snippet:\n' + uuidHeader.split('\n').slice(0, 5).join('\n'));

  const canonicalHtml = execSync(`curl.exe -s "${canonicalUrl}"`, { encoding: 'utf8' });

  // 2. Key phrases grep check
  console.log('\n--- 2. CONFIRMED KEY PHRASES GREP CHECK ---');
  const phrases = [
    '前の職場の後輩の名前',
    '一双',
    'しんしん',
    'ふくちゃんラーメン',
    '好きになった人には好かれないんですよ',
    '朝8時から飲んだり'
  ];

  for (const p of phrases) {
    const hits = canonicalHtml.split('\n').filter(l => l.includes(p));
    console.log(`Phrase "${p}": Hits=${hits.length} -> Line snippet:`, hits[0] ? hits[0].trim().slice(0, 150) : 'None');
  }

  const gorigoriHits = canonicalHtml.split('\n').filter(l => l.includes('ゴリゴリで'));
  console.log('Phrase "ゴリゴリで" Hits (Expected: 0):', gorigoriHits.length);

  // 3. H2 headings check (6 sections)
  console.log('\n--- 3. H2 HEADINGS CHECK (ALL 6 CONFIRMED SECTIONS) ---');
  const h2Matches = canonicalHtml.match(/<h2[\s\S]*?<\/h2>/gi) || [];
  console.log('H2 Headings found in HTML:');
  h2Matches.forEach((h, i) => console.log(`  H2 #${i + 1}: ${h.replace(/<[^>]+>/g, '').trim()}`));

  // 4. Canonical & Sitemap Check
  console.log('\n--- 4. CANONICAL & SITEMAP CHECK ---');
  const canonicalMatch = canonicalHtml.match(/<link rel="canonical"[\s\S]*?>/gi);
  console.log('Canonical Tag:', canonicalMatch ? canonicalMatch[0] : 'None');

  const sitemapHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/sitemap.xml"', { encoding: 'utf8' });
  const sitemapLines = sitemapHtml.split('\n').filter(l => l.includes('seira-interview-vol4'));
  console.log('Sitemap Line:', sitemapLines[0] ? sitemapLines[0].trim() : 'None');

  // 5. JSON-LD Check (Article, FAQPage, BreadcrumbList)
  console.log('\n--- 5. JSON-LD 3 TYPES CHECK ---');
  const jsonLdMatch = canonicalHtml.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi) || [];
  console.log('JSON-LD Count:', jsonLdMatch.length);
  jsonLdMatch.forEach((ld, i) => {
    console.log(`JSON-LD #${i + 1} Snippet:`, ld.slice(0, 200).replace(/\n/g, ' '));
  });

  // 6. Casual Loading Text Check ("ちょっと待ってね")
  console.log('\n--- 6. PAGE LOADING CASUAL TEXT CHECK ("ちょっと待ってね") ---');
  const loadingHits = canonicalHtml.split('\n').filter(l => l.includes('ちょっと待ってね'));
  console.log('"ちょっと待ってね" Hits (Expected: 0):', loadingHits.length);

  // 7. Forbidden 5 words check
  console.log('\n--- 7. FORBIDDEN 5 WORDS CHECK ---');
  const forbiddenRegex = /保証|確実に|絶対|必ず|安定して稼げる/g;
  const forbiddenMatches = canonicalHtml.match(forbiddenRegex) || [];
  console.log('Forbidden Words Count (Expected: 0):', forbiddenMatches.length);

  // 8. Other 3 Interview Articles Health Check
  console.log('\n--- 8. EXISTING 3 INTERVIEW ARTICLES HEALTH CHECK ---');
  const otherUrls = [
    'https://www.sutoroberrys.jp/store/fukuoka/interview/sai/sai-interview-vol1',
    'https://www.sutoroberrys.jp/store/fukuoka/interview/kazuya/kazuya-interview',
    'https://www.sutoroberrys.jp/store/fukuoka/interview/yuuhi/yuuhi-interview-vol2'
  ];

  for (const u of otherUrls) {
    const status = execSync(`curl.exe -o /dev/null -s -w "%{http_code}" "${u}"`, { encoding: 'utf8' });
    console.log(`Article "${u.split('/').slice(-1)[0]}": HTTP ${status}`);
  }
}

verifySeiraConfirmedLive();
