async function checkRecruitTitle() {
  const url = 'https://www.sutoroberrys.jp/store/yokohama/recruit';
  try {
    const res = await fetch(url);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    console.log('=== LIVE TITLE CHECK ===');
    console.log('URL:', url);
    console.log('Extracted <title>:', titleMatch ? titleMatch[1] : 'Not found');
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

checkRecruitTitle();
