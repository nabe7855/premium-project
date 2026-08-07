import https from 'https';

const realOriginalUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/gallery/16c112b3-5fa9-43c3-9d04-ba095f4be8c8.webp';
const realRenderUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/gallery/16c112b3-5fa9-43c3-9d04-ba095f4be8c8.webp?width=800&quality=75&resize=contain';

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
          body: body.length < 200 ? body : 'Data binary'
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function runTest() {
  console.log('=== TESTING REAL SUPABASE IMAGE TRANSFORMATION API ===\n');

  console.log('1. Fetching Original Image Specs:');
  const orig = await fetchHeader(realOriginalUrl);
  console.log('Original Status:', orig.statusCode);
  console.log('Original Content-Type:', orig.contentType);
  console.log('Original Size:', orig.contentLength, `bytes (${(parseInt(orig.contentLength) / 1024 / 1024).toFixed(2)} MB)`);

  console.log('\n2. Fetching Render/Transformed Image Specs:');
  const render = await fetchHeader(realRenderUrl);
  console.log('Render Status:', render.statusCode);
  console.log('Render Content-Type:', render.contentType);
  console.log('Render Size:', render.contentLength, `bytes (${(parseInt(render.contentLength) / 1024).toFixed(2)} KB)`);

  if (render.statusCode === 200) {
    console.log('\n🎉 SUCCESS: Supabase Image Transformation is fully supported and ACTIVE!');
    const reduction = ((1 - (parseInt(render.contentLength) / parseInt(orig.contentLength))) * 100).toFixed(1);
    console.log(`🚀 File Size Reduction: 1.74 MB -> ${(parseInt(render.contentLength) / 1024).toFixed(1)} KB (${reduction}% reduction!)`);
  } else {
    console.log('\n⚠️ Render response:', render.body);
  }
}

runTest();
