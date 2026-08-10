import { execSync } from 'child_process';

async function verifyFixedProductionReviews() {
  console.log('========================================================');
  console.log('=== VERIFYING FIXED PRODUCTION REVIEWS FOR BOTH STORES ===');
  console.log('========================================================\n');

  for (const slug of ['fukuoka', 'yokohama']) {
    const url = `https://www.sutoroberrys.jp/store/${slug}/reviews?v=${Date.now()}`;
    console.log(`Checking URL: ${url}`);

    for (let i = 0; i < 5; i++) {
      const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
      const countMatch = html.match(/口コミ一覧\s*\([^)]+\)/i) || html.match(/\d+\s*\/\s*\d+件/i);

      if (countMatch) {
        console.log(`   Attempt ${i + 1}: Found Count Header in HTML: "${countMatch[0]}"`);
        if (!countMatch[0].includes('1933') && !countMatch[0].includes('0件')) {
          console.log(`   ✅ SUCCESS: Store ${slug} correctly returned exact count: ${countMatch[0]}`);
          break;
        }
      } else {
        console.log(`   Attempt ${i + 1}: Count header pending...`);
      }
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

verifyFixedProductionReviews().catch(console.error);
