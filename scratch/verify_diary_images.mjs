import { execSync } from 'child_process';
import https from 'https';

const postsToTest = [
  { store: 'fukuoka', id: '26b90d63-4f34-4bb9-8af7-6c37f1e9f6ad' },
  { store: 'fukuoka', id: '574c9b2c-c8f3-4957-a336-7a58c5c6517c' },
  { store: 'yokohama', id: 'f5775d28-6dcb-4e44-9e5f-dd628e824075' },
  { store: 'yokohama', id: 'd8605d6a-7f00-489c-b239-9b4b206f9297' }
];

function fetchImageHeader(imgUrl) {
  return new Promise((resolve) => {
    https.get(imgUrl, (res) => {
      resolve({
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    }).on('error', () => resolve({ statusCode: 500 }));
  });
}

async function verify() {
  console.log('===========================================================');
  console.log('=== DIARY IMAGE RENDERING & CONTENT-LENGTH VERIFICATION ===');
  console.log('===========================================================\n');

  for (const item of postsToTest) {
    const pageUrl = `https://www.sutoroberrys.jp/store/${item.store}/diary/post/${item.id}`;
    console.log(`\n🔍 Testing Diary Post [${item.store}]: ${pageUrl}`);

    const html = execSync(`curl.exe -s "${pageUrl}"`, { encoding: 'utf8' });

    // Extract img tags inside article
    const imgMatches = html.match(/<img[^>]*>/gi) || [];
    console.log(`  - Total <img> tags found on page: ${imgMatches.length}`);

    // Find main diary image
    const mainImgMatch = imgMatches.find(img => img.includes('supabase.co') || img.includes('28a3d81e') || img.includes('blog_images') || img.includes('object-contain'));
    if (mainImgMatch) {
      console.log('  - Main Image Tag:', mainImgMatch);

      // Check attributes
      const hasLoading = mainImgMatch.includes('loading="eager"') || mainImgMatch.includes('loading="lazy"');
      const hasDecoding = mainImgMatch.includes('decoding="async"');
      const hasWidthHeight = mainImgMatch.includes('width=') && mainImgMatch.includes('height=');

      console.log('  - loading attribute:', hasLoading ? '✅ Present' : '❌ Missing');
      console.log('  - decoding attribute:', hasDecoding ? '✅ Present' : '❌ Missing');
      console.log('  - width/height attributes:', hasWidthHeight ? '✅ Present' : '❌ Missing');

      // Extract src
      const srcMatch = mainImgMatch.match(/src=["']([^"']+)["']/i);
      if (srcMatch) {
        const imgSrc = srcMatch[1];
        console.log('  - Image Src:', imgSrc);

        const imgHeader = await fetchImageHeader(imgSrc);
        console.log(`  - Image HTTP Status: ${imgHeader.statusCode}`);
        console.log(`  - Content-Type: ${imgHeader.contentType}`);
        console.log(`  - Content-Length: ${imgHeader.contentLength} bytes (${(imgHeader.contentLength / 1024).toFixed(1)} KB)`);
      }
    } else {
      console.log('  - No specific diary image tag matched, listing first 3 images:');
      imgMatches.slice(0, 3).forEach((img, i) => console.log(`    [${i+1}] ${img}`));
    }
  }
}

verify().catch(console.error);
