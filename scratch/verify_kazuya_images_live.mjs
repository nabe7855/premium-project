import { execSync } from 'child_process';

function verifyKazuyaImagesLive() {
  console.log('=== VERIFYING KAZUYA IMAGES LIVE IN HTML ===\n');

  const url = 'https://www.sutoroberrys.jp/store/fukuoka/interview/kazuya/kazuya-interview';
  const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

  const hasThumb = html.includes('kazuya_thumb_');
  const hasDome = html.includes('kazuya_dome_');
  const hasHand = html.includes('kazuya_hand_');

  console.log('Has New WebP Thumbnail (Expected: true):', hasThumb);
  console.log('Has PayPay Dome Photo (Expected: true):', hasDome);
  console.log('Has Starbucks Hand Photo (Expected: true):', hasHand);
}

verifyKazuyaImagesLive();
