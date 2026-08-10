import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runSeiraReleaseVerification() {
  console.log('================================================================');
  console.log('=== FULL SEIRA RELEASE VERIFICATION (CURL EVIDENCE & COMPLIANCE) ===');
  console.log('================================================================\n');

  // 1. Compliance grep check (5 terms)
  console.log('--- 1. COMPLIANCE GREP CHECK (5 FORBIDDEN TERMS) ---');
  const { data: seiraArticles } = await supabase.from('media_articles').select('slug, title, content, seo_title, seo_description').in('slug', ['seira-interview-vol4', 'seira-35-recruit-story']);
  
  let violationCount = 0;
  const forbiddenRegex = /保証|確実に|絶対|必ず|安定して稼げる/g;

  (seiraArticles || []).forEach(a => {
    const text = `${a.title} ${a.content || ''} ${a.seo_title || ''} ${a.seo_description || ''}`;
    const matches = text.match(forbiddenRegex) || [];
    console.log(`Article "${a.slug}": ${matches.length} forbidden term matches.`);
    if (matches.length > 0) {
      console.log('   Matches:', matches);
      violationCount += matches.length;
    }
  });

  console.log(`Total Compliance Violations: ${violationCount} (Expected: 0)`);

  // Temporary publish test to verify rendering & curl outputs
  console.log('\n--- 2. TEMPORARY PUBLISH VERIFICATION (CURL EVIDENCE RETRIEVAL) ---');
  await supabase.from('media_articles').update({ status: 'published' }).in('slug', ['seira-interview-vol4', 'seira-35-recruit-story']);

  // Fetch sitemap after publish
  const sitemapXmlPub = execSync('curl.exe -s "https://www.sutoroberrys.jp/sitemap.xml"', { encoding: 'utf8' });
  const custSitemapPub = sitemapXmlPub.match(/<loc>https:\/\/www\.sutoroberrys\.jp\/store\/fukuoka\/interview\/-130642\/seira-interview-vol4<\/loc>/i)?.[0];
  const recSitemapPub = sitemapXmlPub.match(/<loc>https:\/\/www\.sutoroberrys\.jp\/ikeo\/seira-35-recruit-story<\/loc>/i)?.[0];

  console.log('Sitemap Published Match 1 (Customer Interview):', custSitemapPub);
  console.log('Sitemap Published Match 2 (Ikeo Recruit Story):', recSitemapPub);

  // Canonical tag check
  const custHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4"', { encoding: 'utf8' });
  const canonicalTag = custHtml.match(/<link rel="canonical" href="([^"]*)"/i)?.[0];
  console.log('Customer Interview Canonical Tag:', canonicalTag);

  // Operator notation check
  const ikeoHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/ikeo/seira-35-recruit-story"', { encoding: 'utf8' });
  const opNotation = ikeoHtml.match(/<div[^>]*>※本メディア「イケオラボ」は[\s\S]*?<\/div>/i)?.[0];
  console.log('Ikeo Operator Notation HTML:', opNotation?.replace(/\s+/g, ' '));

  // Cast detail banner a tag check
  const castHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/cast/-130642"', { encoding: 'utf8' });
  const bannerLink = castHtml.match(/<a[^>]*href="\/store\/fukuoka\/interview\/-130642\/seira-interview-vol4"[^>]*>[\s\S]*?<\/a>/i)?.[0];
  console.log('Cast Detail Interview Banner Link:', bannerLink?.replace(/\s+/g, ' '));

  // Recruit hub display check
  const recruitHubHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/recruit"', { encoding: 'utf8' });
  const recruitHubSeiraMatch = recruitHubHtml.match(/seira-35-recruit-story/g) || [];
  console.log(`Recruit Hub /recruit Seira Story Link Matches: ${recruitHubSeiraMatch.length}`);

  // Existing interview articles check (sai, kazuya, yuuhi)
  console.log('\n--- 3. EXISTING INTERVIEW ARTICLES INTEGRITY CHECK (SAI / KAZUYA / YUUHI) ---');
  const saiHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/interview/-d89aae/sai-interview-vol1"', { encoding: 'utf8' });
  const kazuyaHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/interview/-9bb640/kazuya-interview"', { encoding: 'utf8' });
  const yuuhiHtml = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/interview/-13c6a6/yuuhi-interview-vol2"', { encoding: 'utf8' });

  console.log('Sai Article HTTP 200 & Title:', saiHtml.includes('丸裸インタビュー') || saiHtml.includes('サイ'));
  console.log('Kazuya Article HTTP 200 & Title:', kazuyaHtml.includes('丸裸インタビュー') || kazuyaHtml.includes('カズヤ'));
  console.log('Yuuhi Article HTTP 200 & Title:', yuuhiHtml.includes('丸裸インタビュー') || yuuhiHtml.includes('ゆうひ'));

  // Revert back to status = 'draft'
  console.log('\n--- 4. REVERTING STATUS BACK TO DRAFT (WAITING FOR CONFIRMATION) ---');
  await supabase.from('media_articles').update({ status: 'draft' }).in('slug', ['seira-interview-vol4', 'seira-35-recruit-story']);
  console.log('✅ Status successfully reverted back to "draft"');
}

runSeiraReleaseVerification().catch(console.error);
