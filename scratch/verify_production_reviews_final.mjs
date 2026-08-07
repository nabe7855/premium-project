import { execSync } from 'child_process';

async function verifyReviewsPage() {
  console.log('======================================================');
  console.log('=== VERIFYING PRODUCTION REVIEWS PAGE TOTAL COUNTS ===');
  console.log('======================================================\n');

  for (const slug of ['fukuoka', 'yokohama']) {
    const url = `https://www.sutoroberrys.jp/store/${slug}/reviews?v=${Date.now()}`;
    console.log(`Checking URL: ${url}`);
    
    // Retry up to 5 times for Vercel SSR deployment propagation
    let success = false;
    for (let i = 0; i < 6; i++) {
      const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
      const countMatch = html.match(/口コミ一覧\s*\([^)]+\)/i) || html.match(/\d+\s*\/\s*\d+件/i);
      
      if (countMatch) {
        console.log(`   Attempt ${i + 1}: Found Count Header in HTML: "${countMatch[0]}"`);
        if (!countMatch[0].includes('1933')) {
          success = true;
          break;
        }
      } else {
        console.log(`   Attempt ${i + 1}: Count header match pending...`);
      }
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}

verifyReviewsPage().catch(console.error);
