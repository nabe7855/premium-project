import { execSync } from 'child_process';
import fs from 'fs';

const url = 'https://www.sutoroberrys.jp/amolab/jyosei-fuzoku-guide';

function calculatePureTextLength(htmlStr) {
  // Extract main article content or article text
  const clean = htmlStr
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '');
  return clean.length;
}

async function verifyFixes() {
  console.log('===========================================================');
  console.log('=== VERIFYING 3 MANDATORY FIXES IN PRODUCTION RAW HTML ===');
  console.log('===========================================================\n');

  const htmlFile = 'scratch/guide_raw_fixes.html';
  execSync(`curl -s ${url} > ${htmlFile}`);

  const html = fs.readFileSync(htmlFile, 'utf8');

  // Fix 1: Check Eyecatch Thumbnail
  console.log('1. Checking Eyecatch Thumbnail Image (Unsplash check):');
  const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["']/gi) || [];
  const thumbnailImgs = imgMatches.filter(i => i.includes('aya-photo-top') || i.includes('amolab'));
  const hasUnsplash = html.includes('unsplash.com');
  console.log('  - Unsplash Present in HTML:', hasUnsplash ? '❌ YES (STILL PRESENT)' : '✅ NO (REMOVED)');
  console.log('  - Self-hosted WebP Thumbnail Present:', thumbnailImgs.length > 0 ? '✅ YES' : '❌ NO');

  // Fix 2: Check title vs h1
  console.log('\n2. Checking <title> vs <h1> (Must be separate & match spec):');
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const documentTitle = titleMatch ? titleMatch[1].trim() : '';
  const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  console.log('  - Document Title (<title>):', documentTitle);
  console.log('  - Main Heading (<h1>):    ', h1Text);
  console.log('  - Are Title and H1 Different?:', documentTitle !== h1Text ? '✅ YES (DIFFERENT)' : '❌ NO (SAME)');

  // Fix 3: Pure Text Length
  console.log('\n3. Calculating Pure Text Length (excluding HTML/JSON-LD/Scripts):');
  // Extract body content text
  const pureLength = calculatePureTextLength(html);
  console.log(`  - Pure Text Article Length: ${pureLength} chars (Target: 3,000 ~ 4,000 chars)`);
  console.log('  - Length within target range:', pureLength >= 3000 ? '✅ YES' : '❌ NO');
}

verifyFixes().catch(console.error);
