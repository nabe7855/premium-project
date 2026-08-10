import { execSync } from 'child_process';

function verifySeiraPhotosHtml() {
  console.log('=== VERIFYING SEIRA INTERVIEW PHOTO URLS LIVE ===\n');

  const url = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';
  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const hasPhoto1 = html.includes('seira_portrait_1786320401253.jpg');
  const hasPhoto2 = html.includes('seira_fullbody_1786320401253.jpg');

  console.log('Has Portrait Photo URL (Expected: true):', hasPhoto1);
  console.log('Has Fullbody Photo URL (Expected: true):', hasPhoto2);

  const imgTags = html.match(/<img[\s\S]*?>/gi);
  console.log('Sample Live <img> tags:', imgTags ? imgTags.filter(img => img.includes('seira_')) : []);
}

verifySeiraPhotosHtml();
