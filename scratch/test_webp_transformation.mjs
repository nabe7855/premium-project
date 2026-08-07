import https from 'https';

const webpRenderUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/gallery/16c1124d-aea9-436d-a517-66f357c54bae/1776751463778_xe84jt.webp?width=800&quality=75&resize=contain&format=origin';

function fetchHeader(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let body = [];
      res.on('data', chunk => body.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(body);
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: buf.length
        });
      });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function runTest() {
  console.log('Fetching Transformed Image with format=origin:');
  const res = await fetchHeader(webpRenderUrl);
  console.log('Status:', res.statusCode);
  console.log('Type:', res.contentType);
  console.log('Size:', (res.contentLength / 1024).toFixed(1), 'KB (', res.contentLength, 'bytes )');
}

runTest();
