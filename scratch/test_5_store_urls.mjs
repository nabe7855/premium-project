async function testStoreUrls() {
  const urls = [
    { store: '福岡店', url: 'https://www.sutoroberrys.jp/store/fukuoka', type: 'internal' },
    { store: '横浜店', url: 'https://www.sutoroberrys.jp/store/yokohama', type: 'internal' },
    { store: '東京店', url: 'https://sutoroberrys.com/main/', type: 'external' },
    { store: '名古屋店', url: 'https://sutoroberrys-aichi.com/main.html', type: 'external' },
    { store: '大阪店', url: 'https://sutoroberrys-osaka.com/main.html', type: 'external' },
  ];

  console.log('=== TESTING ALL 5 STORE URLS ===');
  for (const item of urls) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      console.log(`[${item.store}] (${item.type}) ${item.url} -> HTTP ${res.status}`);
    } catch (e) {
      console.error(`[${item.store}] Error fetching ${item.url}:`, e.message);
    }
  }
}

testStoreUrls().catch(console.error);
