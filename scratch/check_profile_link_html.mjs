async function checkProfileLinkHtml() {
  const url = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785718651524';
  const res = await fetch(url);
  const html = await res.text();

  console.log('--- SEARCHING RIKU IN HTML ---');
  const rikuIdx = html.indexOf('りくのプロフィール');
  if (rikuIdx !== -1) {
    console.log(html.substring(rikuIdx - 50, rikuIdx + 150));
  } else {
    console.log('NOT FOUND');
  }

  console.log('\n--- SEARCHING SEIRA IN HTML ---');
  const seiraIdx = html.indexOf('青空（せいら）のプロフィール');
  if (seiraIdx !== -1) {
    console.log(html.substring(seiraIdx - 50, seiraIdx + 150));
  } else {
    console.log('NOT FOUND');
  }
}

checkProfileLinkHtml();
