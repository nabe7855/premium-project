async function checkUrl(url: string, checks: (html: string) => void) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[FAIL] ${url} - Status: ${res.status}`);
      return;
    }
    const html = await res.text();
    checks(html);
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
  }
}

async function main() {
  console.log('--- 1. Ikeolab title/description & Nav ---');
  await checkUrl('http://localhost:3000/ikeo', (html) => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('Has "働く人の記録" nav link?', html.includes('働く人の記録'));
    console.log('Has "適性診断" in nav?', html.includes('適性診断'));
    console.log('Has Seira article in 働く人の記録 section?', html.includes('seira-35-recruit-story'));
  });

  console.log('\n--- 2. Amolab Jiten Hub ---');
  await checkUrl('http://localhost:3000/amolab/jiten', (html) => {
    console.log('Has Index section?', html.includes('Index'));
    console.log('Has Gojyuon chars (e.g. あ)?', html.includes('char-あ'));
  });

  console.log('\n--- 3. AI articles 404 check ---');
  for (const slug of ['success-for-50s', 'nightwork-comparison', 'income-model-and-experience']) {
    try {
      const res = await fetch(`http://localhost:3000/ikeo/${slug}`);
      console.log(`${slug}: Status ${res.status}`);
    } catch (e) {
      console.error(e);
    }
  }

  console.log('\n--- 4. SSR HTML H1 check (Flagship article) ---');
  // Amolab guide article or any article
  await checkUrl('http://localhost:3000/amolab/jyosei-fuzoku-guide', (html) => {
    const h1Count = (html.match(/<h1[\s>]/g) || []).length;
    console.log('Number of <h1> tags in amolab guide:', h1Count);
  });
}

main();
