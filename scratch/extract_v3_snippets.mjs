import fs from 'fs';

function extract() {
  const html = fs.readFileSync('scratch/top_v3_raw.html', 'utf8');

  console.log('=== (a) SEO TEXT & H1 IN SSR INITIAL HTML ===');
  const h1Match = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  console.log(h1Match ? h1Match[0] : 'h1 not found');

  const textMatch = html.match(/<div class="inline-flex items-center[^>]*>[\s\S]*?<\/div>/gi);
  console.log(textMatch ? textMatch[0] : 'FV badge text not found');

  console.log('\n=== (b) SSR STATIC HERO IMAGE TAG IN INITIAL HTML ===');
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const heroImgs = imgMatches.filter(i => i.includes('ゆうと') || i.includes('カズヤ') || i.includes('fetchpriority="high"') || i.includes('fetchPriority="high"'));
  console.log(heroImgs.length > 0 ? heroImgs.join('\n') : 'Hero img tags in HTML:\n' + imgMatches.slice(0, 5).join('\n'));
}

extract();
