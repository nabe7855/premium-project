import https from 'https';

const testOriginalUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/gallery/16c112b3-5fa9-43c3-9d04-ba095f4be8c8.jpg';
const testRenderUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/gallery/16c112b3-5fa9-43c3-9d04-ba095f4be8c8.jpg?width=800&quality=75&resize=contain&format=webp';

function fetchHeader(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length'],
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function runTest() {
  console.log('=== TESTING SUPABASE IMAGE TRANSFORMATION PLAN & AVAILABILITY ===\n');

  console.log('1. Fetching Original Image Specs:');
  const orig = await fetchHeader(testOriginalUrl);
  console.log('Original Status:', orig.statusCode);
  console.log('Original Content-Type:', orig.contentType);
  console.log('Original Content-Length:', orig.contentLength, `(${orig.contentLength ? (parseInt(orig.contentLength) / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'})`);

  console.log('\n2. Fetching Render/Transformed Image Specs:');
  const render = await fetchHeader(testRenderUrl);
  console.log('Render Status:', render.statusCode);
  console.log('Render Content-Type:', render.contentType);
  console.log('Render Content-Length:', render.contentLength, `(${render.contentLength ? (parseInt(render.contentLength) / 1024).toFixed(2) + ' KB' : 'N/A'})`);

  if (render.statusCode === 200) {
    console.log('\n🎉 SUCCESS: Supabase Image Transformation is fully supported and ACTIVE!');
    const reduction = ((1 - (parseInt(render.contentLength) / parseInt(orig.contentLength))) * 100).toFixed(1);
    console.log(`🚀 File Size Reduction: ${reduction}% reduction!`);
  } else {
    console.log('\n⚠️ WARNING: Supabase Render URL returned status:', render.statusCode);
  }
}

runTest();
