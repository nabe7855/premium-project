import https from 'https';
import fs from 'fs';
import sharp from 'sharp';

const origUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/gallery/16c1124d-aea9-436d-a517-66f357c54bae/1776751463778_xe84jt.webp';
const renderUrlBase = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/gallery/16c1124d-aea9-436d-a517-66f357c54bae/1776751463778_xe84jt.webp';

function downloadFile(url, dest, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    options.headers = headers;

    https.get(options, (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          resolve({
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            contentLength: res.headers['content-length'] || fs.statSync(dest).size,
            headers: res.headers,
          });
        });
      });
    }).on('error', reject);
  });
}

async function investigate() {
  console.log('=====================================================');
  console.log('=== URGENT INVESTIGATION: SUPABASE IMAGE SIZE & WEBP ===');
  console.log('=====================================================\n');

  // 1. 元画像のダウンロードと実寸確認 (3)
  console.log('--- 1. Investigating Original Image ---');
  const origRes = await downloadFile(origUrl, 'scratch/orig_image.webp');
  const origMeta = await sharp('scratch/orig_image.webp').metadata();
  console.log(`- Status: ${origRes.statusCode}`);
  console.log(`- Format: ${origMeta.format}`);
  console.log(`- Dimensions: ${origMeta.width} x ${origMeta.height} px`);
  console.log(`- Size: ${(origRes.contentLength / 1024 / 1024).toFixed(2)} MB (${origRes.contentLength} bytes)`);

  console.log('\n-----------------------------------------------------\n');

  // 2. Accept: image/webp ヘッダー付きでの計測 (1) & (2)
  console.log('--- 2. Transformed Image WITH "Accept: image/webp" Header ---');
  const renderUrl1 = `${renderUrlBase}?width=800&quality=75`;
  const webpRes1 = await downloadFile(renderUrl1, 'scratch/transformed_accept_webp.webp', {
    'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
  });
  const webpMeta1 = await sharp('scratch/transformed_accept_webp.webp').metadata();
  console.log(`- Status: ${webpRes1.statusCode}`);
  console.log(`- Content-Type: ${webpRes1.contentType}`);
  console.log(`- Actual Format: ${webpMeta1.format}`);
  console.log(`- Actual Dimensions: ${webpMeta1.width} x ${webpMeta1.height} px`);
  console.log(`- Size: ${(webpRes1.contentLength / 1024).toFixed(2)} KB (${webpRes1.contentLength} bytes)`);

  console.log('\n----------------------------------------------------\n');

  // 3. 各種パラメータ（resize=contain, format=origin, quality=75）の組み合わせ比較 (4)
  console.log('--- 3. Testing Parameter Variants for Minimal Size (< 150KB) ---');

  const testCases = [
    { name: 'width=800&quality=75&resize=contain', params: '?width=800&quality=75&resize=contain' },
    { name: 'width=800&quality=70&resize=contain', params: '?width=800&quality=70&resize=contain' },
    { name: 'width=800&quality=75&resize=cover', params: '?width=800&quality=75&resize=cover' },
    { name: 'width=400&quality=75&resize=contain', params: '?width=400&quality=75&resize=contain' },
  ];

  for (const tc of testCases) {
    const url = `${renderUrlBase}${tc.params}`;
    const dest = `scratch/test_${tc.name.replace(/[^a-z0-9]/gi, '_')}.bin`;
    const res = await downloadFile(url, dest, { 'Accept': 'image/webp' });
    const meta = await sharp(dest).metadata();
    console.log(`\nVariant: ${tc.name}`);
    console.log(`  - Format: ${meta.format}, Dimensions: ${meta.width}x${meta.height}`);
    console.log(`  - Size: ${(res.contentLength / 1024).toFixed(2)} KB (${res.contentLength} bytes)`);
  }
}

investigate().catch(console.error);
