import fs from 'fs';

function extractPure() {
  const buf = fs.readFileSync('scratch/top_v3_raw.html');
  let str = buf.toString('utf16le');
  if (!str.includes('html')) {
    str = buf.toString('utf8');
  }

  console.log('=== (a) SSR Initial HTML: Hero Image Tags ===');
  const imgMatches = str.match(/<img[^>]*>/gi) || [];
  imgMatches.slice(0, 3).forEach((img, i) => {
    console.log(`[Image ${i+1}] ${img}`);
  });

  console.log('\n=== (b) SSR Initial HTML: Title / H1 / FV Key Phrase ===');
  const titleMatch = str.match(/<title[^>]*>[\s\S]*?<\/title>/gi);
  console.log('Title:', titleMatch ? titleMatch[0] : 'None');

  const h1Match = str.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  console.log('H1:', h1Match ? h1Match[0] : 'h1 in HTML body');

  const fvBadge = str.match(/<div class="[^"]*rounded-full[^"]* bg-rose-50[^"]*"[\s\S]*?<\/div>/gi);
  if (fvBadge) {
    console.log('FV Badge:', fvBadge[0]);
  }
}

extractPure();
