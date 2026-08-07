import fs from 'fs';

function inspect() {
  const buf = fs.readFileSync('scratch/top_v3_raw.html');
  // utf-16le or utf8
  let str = buf.toString('utf16le');
  if (!str.includes('html')) {
    str = buf.toString('utf8');
  }

  console.log('File Size:', buf.length, 'bytes');

  // Search for h1
  const h1Match = str.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi);
  console.log('\n--- H1 Snippet ---');
  console.log(h1Match ? h1Match[0] : 'No H1 match');

  // Search for img
  const imgMatches = str.match(/<img[^>]*>/gi) || [];
  console.log('\n--- First 5 Img Tags in HTML ---');
  imgMatches.slice(0, 5).forEach((img, i) => console.log(`${i+1}: ${img}`));
}

inspect();
