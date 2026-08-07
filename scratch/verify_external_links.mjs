import https from 'https';

const urls = [
  'https://sutoroberrys.com/main/',
  'https://sutoroberrys-osaka.com/main.html',
  'https://sutoroberrys-aichi.com/main.html',
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function verifyAll() {
  console.log('=== CHECKING EXTERNAL STORE LINKS HTTP STATUS ===\n');
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`- URL: ${res.url} -> Status Code: ${res.status || res.error}`);
  }
}

verifyAll();
