import { execSync } from 'child_process';

function inspectProdPages() {
  console.log('=== FETCHING PRODUCTION HTML FOR FUKUOKA REVIEWS & TOP PAGE ===\n');

  // 1. Fukuoka Reviews Page
  const reviewsUrl = 'https://www.sutoroberrys.jp/store/fukuoka/reviews';
  console.log(`1. Fetching ${reviewsUrl}...`);
  const reviewsHtml = execSync(`curl.exe -s "${reviewsUrl}"`, { encoding: 'utf8' });

  // Search for review elements or count
  const countMatch = reviewsHtml.match(/口コミ一覧\s*\([^)]+\)/i) || reviewsHtml.match(/\d+\s*\/\s*\d+件/i);
  console.log('   Count Match:', countMatch ? countMatch[0] : 'NOT FOUND');

  const cardMatches = reviewsHtml.match(/ReviewCard|匿名希望|ススム|しょうへい/g);
  console.log('   Review Text Matches count:', cardMatches?.length);

  // Check if "0件" or "投稿された口コミがありません" is present
  if (reviewsHtml.includes('投稿された口コミがありません') || reviewsHtml.includes('(0件)')) {
    console.log('   ⚠️ WARNING: "0件" or "投稿された口コミがありません" IS FOUND IN REVIEWS PAGE HTML!');
  } else {
    console.log('   ✅ Reviews content IS PRESENT in HTML!');
  }

  // 2. Fukuoka Top Page Review Section
  const topUrl = 'https://www.sutoroberrys.jp/store/fukuoka';
  console.log(`\n2. Fetching ${topUrl}...`);
  const topHtml = execSync(`curl.exe -s "${topUrl}"`, { encoding: 'utf8' });

  if (topHtml.includes('お客様の声') || topHtml.includes('reviews')) {
    console.log('   ✅ ReviewSection heading IS PRESENT in Top Page HTML!');
  } else {
    console.log('   ⚠️ WARNING: ReviewSection IS MISSING from Top Page HTML!');
  }
}

inspectProdPages();
