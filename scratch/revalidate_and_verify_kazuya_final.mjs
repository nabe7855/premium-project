import { execSync } from 'child_process';

function revalidateAndVerifyKazuyaFinal() {
  console.log('=== REVALIDATING & VERIFYING ALL KAZUYA IMAGES LIVE ===\n');

  const paths = [
    '/store/fukuoka/interview/c142b304-e53b-45e0-a5d1-fe51c3977814/kazuya-interview',
    '/store/fukuoka/interview/kazuya/kazuya-interview',
    '/store/fukuoka/interview'
  ];

  for (const p of paths) {
    try {
      const payload = JSON.stringify({ path: p });
      execSync(`curl.exe -X POST -H "Content-Type: application/json" -d "${payload.replace(/"/g, '\\"')}" "https://www.sutoroberrys.jp/api/revalidate"`, { encoding: 'utf8' });
    } catch (e) {}
  }

  const detailUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/kazuya/kazuya-interview';
  const html = execSync(`curl.exe -s "${detailUrl}"`, { encoding: 'utf8' });

  const hasThumb = html.includes('kazuya_thumb_');
  const hasDome = html.includes('kazuya_dome_');
  const hasHand = html.includes('kazuya_hand_');

  console.log('1. WebP Thumbnail URL in HTML (Expected: true):', hasThumb);
  console.log('2. PayPay Dome WebP Photo in Article (Expected: true):', hasDome);
  console.log('3. Starbucks Hand WebP Photo in Article (Expected: true):', hasHand);
}

revalidateAndVerifyKazuyaFinal();
