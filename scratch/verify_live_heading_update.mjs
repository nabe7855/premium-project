async function verifyLive() {
  const url = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785718651524';
  try {
    const res = await fetch(url);
    console.log('HTTP Status Code:', res.status);

    const html = await res.text();

    console.log('\n--- 1. H1 Tag Check ---');
    const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
    console.log('H1 Count:', h1Matches.length);
    h1Matches.forEach((h1) => console.log('H1 Content:', h1));

    console.log('\n--- 2. H2 Tags Check ---');
    const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    console.log('H2 Count:', h2Matches.length);
    h2Matches.forEach((h2) => console.log('H2 Content:', h2));

    console.log('\n--- 3. Duplicate H2 Check ---');
    const hasDuplicateTitleH2 = h2Matches.some((h2) => h2.includes('【福岡店】新人セラピスト「りく」「青空（せいら）」が入店しました'));
    console.log('Has duplicate title H2:', hasDuplicateTitleH2);

    console.log('\n--- 4. Keyword Check ("女性用風俗") ---');
    console.log('Contains "女性用風俗":', html.includes('女性用風俗'));

    console.log('\n--- 5. Profile Links Check ---');
    console.log('Riku profile link:', html.match(/href="[^"]*-25469e[^"]*"/g));
    console.log('Seira profile link:', html.match(/href="[^"]*-130642[^"]*"/g));

    console.log('\n--- 6. Internal Links Check ---');
    console.log('Schedule link:', html.match(/href="[^"]*\/store\/fukuoka\/schedule[^"]*"/g));
    console.log('First-time link:', html.match(/href="[^"]*\/store\/fukuoka\/first-time[^"]*"/g));
    console.log('Price link:', html.match(/href="[^"]*\/store\/fukuoka\/price[^"]*"/g));

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

verifyLive();
