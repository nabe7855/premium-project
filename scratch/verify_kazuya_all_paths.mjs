import { execSync } from 'child_process';

function verifyKazuyaAllPaths() {
  const urls = [
    'https://www.sutoroberrys.jp/store/fukuoka/interview/c142b304-e53b-45e0-a5d1-fe51c3977814/kazuya-interview',
    'https://www.sutoroberrys.jp/store/fukuoka/interview/kazuya/kazuya-interview'
  ];

  for (const url of urls) {
    const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });
    const hasThumb = html.includes('kazuya_thumb_');
    const hasDome = html.includes('kazuya_dome_');
    const hasHand = html.includes('kazuya_hand_');
    console.log(`URL: ${url.replace('https://www.sutoroberrys.jp', '')}`);
    console.log(`  thumb: ${hasThumb}, dome: ${hasDome}, hand: ${hasHand}`);
    // Also check if photos objects have the correct keys
    const domeIdx = html.indexOf('kazuya_dome_');
    const handIdx = html.indexOf('kazuya_hand_');
    if (!hasDome) {
      // Look for the old path
      const oldDome = html.includes('/images/casts/kazuya/dome.jpg');
      console.log(`  OLD dome path present: ${oldDome}`);
      // look for any reference to photo_key
      const photoSample = html.match(/kazuya[^"]{1,60}\.webp/g)?.[0] || 'none';
      console.log(`  Sample kazuya webp ref: ${photoSample}`);
    }
  }
}

verifyKazuyaAllPaths();
