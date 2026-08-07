import https from 'https';
import fs from 'fs';

function fetchRaw(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(filename, data, 'utf8');
        console.log(`✅ Saved raw HTML from ${url} to ${filename} (${data.length} bytes)`);
        resolve(data);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('=== DOWNLOADING RAW HTMLS FROM PRODUCTION ===\n');
  await fetchRaw('https://www.sutoroberrys.jp/', 'scratch/top_raw.html');
  await fetchRaw('https://www.sutoroberrys.jp/store/fukuoka/price', 'scratch/fukuoka_price_raw.html');
  await fetchRaw('https://www.sutoroberrys.jp/store/yokohama/price', 'scratch/yokohama_price_raw.html');
}

main().catch(console.error);
