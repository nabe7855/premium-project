import fetch from 'node-fetch';

async function check() {
  const urls = [
    'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/store-top/fukuoka/header_1777264921146.webp',
    'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/banners/store-top/fukuoka/header_1777264921146.webp?width=400&quality=70'
  ];

  for (const url of urls) {
    try {
      console.log(`Fetching: ${url}`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      if (res.status !== 200) {
        const text = await res.text();
        console.log(`Body: ${text}`);
      } else {
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        console.log(`Content-Length: ${res.headers.get('content-length')}`);
      }
      console.log('---');
    } catch (e) {
      console.error(e);
    }
  }
}

check();
