import { execSync } from 'child_process';
import fs from 'fs';
import https from 'https';

const url = 'https://www.sutoroberrys.jp/amolab/jyosei-fuzoku-guide';

function checkUrlStatusCode(targetUrl) {
  return new Promise((resolve) => {
    https.get(targetUrl, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
}

async function verify() {
  console.log('===========================================================');
  console.log('=== FLAGSHIP ARTICLE VERIFICATION & AUDIT (jyosei-fuzoku-guide) ===');
  console.log('===========================================================\n');

  // 1. Fetch raw HTML
  console.log('1. Fetching Production Raw HTML...');
  const htmlFile = 'scratch/guide_raw.html';
  execSync(`curl -s ${url} > ${htmlFile}`);

  const html = fs.readFileSync(htmlFile, 'utf8');

  // 2. Title & Description
  console.log('\n2. Checking Title & Description:');
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');

  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
  console.log('Description:', descMatch ? descMatch[1] : 'NOT FOUND');

  // 3. Heading Structure (H1 and H2s)
  console.log('\n3. Checking Headings (H1 & H2s):');
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  console.log('H1 Count:', h1Matches.length);
  h1Matches.forEach((h1, i) => console.log(`  H1 [${i+1}]:`, h1.replace(/<[^>]+>/g, '').trim()));

  const h2Matches = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
  console.log(`H2 Count: ${h2Matches.length}`);
  h2Matches.forEach((h2, i) => console.log(`  H2 [${i+1}]:`, h2.replace(/<[^>]+>/g, '').trim()));

  // 4. Check Operator Note
  console.log('\n4. Checking Operator Note:');
  const hasOperatorNote = html.includes('本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています');
  console.log('Operator Note Present:', hasOperatorNote ? '✅ YES' : '❌ NO');

  // 5. Check Aya Testimonial Quote & Blockquote
  console.log('\n5. Checking Aya Testimonial Quote (blockquote):');
  const hasBlockquote = html.includes('<blockquote') && html.includes('/amolab/voice-aya');
  console.log('Aya Quote Present:', hasBlockquote ? '✅ YES' : '❌ NO');

  // 6. Check Dictionary Links in FAQ (8/8)
  console.log('\n6. Checking Dictionary Links in FAQ:');
  const jitenLinks = [
    '/amolab/jiten/words/privacy-protection',
    '/amolab/jiten/words/first-time-nervous',
    '/amolab/jiten/words/menstruation-usage',
    '/amolab/jiten/words/if-you-are-shy',
    '/amolab/jiten/words/about-tip',
    '/amolab/jiten/words/prohibited-actions',
    '/amolab/jiten/words/where-to-consult'
  ];

  for (const l of jitenLinks) {
    const present = html.includes(l);
    console.log(`- ${l}: ${present ? '✅ Present' : '❌ Missing'}`);
  }

  // 7. Area Block Links (Internal & External)
  console.log('\n7. Checking Area Block Links & Status Codes:');
  const areaLinks = [
    'https://www.sutoroberrys.jp/store/fukuoka',
    'https://www.sutoroberrys.jp/store/yokohama',
    'https://sutoroberrys.com/main/',
    'https://sutoroberrys-osaka.com/main.html',
    'https://sutoroberrys-aichi.com/main.html'
  ];

  for (const al of areaLinks) {
    const status = await checkUrlStatusCode(al);
    console.log(`- ${al} -> Status: ${status}`);
  }

  // 8. href="#" Check
  console.log('\n8. Checking href="#" occurrences:');
  const hashMatches = html.match(/href=["']#["']/g) || [];
  console.log('href="#" Count:', hashMatches.length, hashMatches.length === 0 ? '✅ 0' : '❌ FOUND');

  // 9. FAQPage Schema Check
  console.log('\n9. Checking FAQPage Schema:');
  const hasFAQSchema = html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"');
  console.log('FAQPage Schema Present:', hasFAQSchema ? '✅ YES' : '❌ NO');
}

verify().catch(console.error);
