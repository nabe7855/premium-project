import { execSync } from 'child_process';

const testImages = [
  {
    name: '福岡日記1 (カズヤ)',
    url: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/diary/28a3d81e-6a89-4667-80e2-e273bdc9872a-1000008856.jpg?width=800&quality=75&resize=contain&format=webp'
  },
  {
    name: '福岡日記2 (koko)',
    url: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/diary/1757309085956-favicon.png?width=800&quality=75&resize=contain&format=webp'
  },
  {
    name: '横浜日記1 (huhu)',
    url: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/diary/fd81b677-a0d0-40c5-ac4c-cc5b6590f49f-Generated%20Image%20September%2002,%202025%20-%204_15PM.jpeg?width=800&quality=75&resize=contain&format=webp'
  },
  {
    name: '横浜日記2 (no-image)',
    url: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/diary/d8300b7f-a7c6-4415-bf00-f3dab85e1d2a-no-image.png?width=800&quality=75&resize=contain&format=webp'
  }
];

function getExactImageHeaders(imgUrl) {
  try {
    const cmd = `curl.exe -sI -H "Accept: image/webp" "${imgUrl}"`;
    const out = execSync(cmd, { encoding: 'utf8' });
    const statusMatch = out.match(/HTTP\/[\d\.]+\s+(\d+)/i);
    const typeMatch = out.match(/Content-Type:\s*([^\r\n]+)/i);
    const lengthMatch = out.match(/Content-Length:\s*(\d+)/i);

    return {
      status: statusMatch ? statusMatch[1] : 'Unknown',
      contentType: typeMatch ? typeMatch[1].trim() : 'Unknown',
      contentLengthBytes: lengthMatch ? parseInt(lengthMatch[1], 10) : 0,
      rawOutput: out
    };
  } catch (err) {
    return { status: 'Error', error: err.message };
  }
}

console.log('================================================================');
console.log('=== EXACT IMAGE SINGLE CONTENT-LENGTH MEASUREMENT (Accept: webp) ===');
console.log('================================================================\n');

testImages.forEach(img => {
  console.log(`🔍 [Target: ${img.name}]`);
  console.log(`   URL: ${img.url}`);
  const result = getExactImageHeaders(img.url);
  console.log(`   - HTTP Status: ${result.status}`);
  console.log(`   - Content-Type: ${result.contentType}`);
  console.log(`   - Content-Length: ${result.contentLengthBytes} bytes (${(result.contentLengthBytes / 1024).toFixed(2)} KB)`);
  console.log('----------------------------------------------------------------');
});
