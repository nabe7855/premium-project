import https from 'https';

const exactOrig = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/gallery/16c1124d-aea9-436d-a517-66f357c54bae/1776751463778_xe84jt.webp';
const exactRender = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/gallery/16c1124d-aea9-436d-a517-66f357c54bae/1776751463778_xe84jt.webp?width=800&quality=75&resize=contain';

function fetchHeader(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'] || body.length,
          bodyLength: body.length
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function runTest() {
  console.log('=== TESTING EXACT 1.74MB SUPABASE IMAGE TRANSFORMATION ===\n');

  console.log('1. Fetching Original Image (1.74MB):');
  const orig = await fetchHeader(exactOrig);
  console.log('Original Status:', orig.statusCode);
  console.log('Original Content-Type:', orig.contentType);
  console.log('Original Size:', (orig.bodyLength / 1024 / 1024).toFixed(2), 'MB (', orig.bodyLength, 'bytes )');

  console.log('\n2. Fetching Render/Transformed Image (width=800, quality=75):');
  const render = await fetchHeader(exactRender);
  console.log('Render Status:', render.statusCode);
  console.log('Render Content-Type:', render.contentType);
  console.log('Render Size:', (render.bodyLength / 1024).toFixed(2), 'KB (', render.bodyLength, 'bytes )');

  if (render.statusCode === 200) {
    const reduction = ((1 - (render.bodyLength / orig.bodyLength)) * 100).toFixed(1);
    console.log(`\n🎉 SUCCESS: Supabase Storage Image Transformation is FULLY SUPPORTED on this project!`);
    console.log(`🚀 Result: 1.74 MB (${orig.bodyLength} bytes) -> ${(render.bodyLength / 1024).toFixed(1)} KB (${render.bodyLength} bytes)`);
    console.log(`✨ Total Reduction: ${reduction}% reduction!`);
  } else {
    console.log(`\n⚠️ Transformation API returned status: ${render.statusCode}`);
  }
}

runTest();
