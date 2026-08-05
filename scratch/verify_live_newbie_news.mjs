async function verifyLive() {
  const url = 'https://www.sutoroberrys.jp/store/fukuoka/news/news-1785718651524';
  try {
    const res = await fetch(url);
    console.log('HTTP Status Code:', res.status);

    const html = await res.text();

    console.log('\n--- Title Tag Match ---');
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    console.log(titleMatch ? titleMatch[0] : 'NOT FOUND');

    console.log('\n--- H1 Tag Match ---');
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    console.log(h1Match ? h1Match[0] : 'NOT FOUND');

    console.log('\n--- Seira Link Check ---');
    const seiraLinkMatches = html.match(/href="[^"]*-130642[^"]*"/g);
    console.log(seiraLinkMatches);

    console.log('\n--- Riku Link Check ---');
    const rikuLinkMatches = html.match(/href="[^"]*-25469e[^"]*"/g);
    console.log(rikuLinkMatches);

    console.log('\n--- Internal Links Check ---');
    const scheduleMatch = html.match(/href="[^"]*\/store\/fukuoka\/schedule[^"]*"/g);
    const firstTimeMatch = html.match(/href="[^"]*\/store\/fukuoka\/first-time[^"]*"/g);
    const priceMatch = html.match(/href="[^"]*\/store\/fukuoka\/price[^"]*"/g);
    console.log('Schedule link:', scheduleMatch);
    console.log('First-time link:', firstTimeMatch);
    console.log('Price link:', priceMatch);

    console.log('\n--- Area Keywords Check ---');
    console.log('Contains 博多・天神・中洲:', html.includes('博多・天神・中洲'));

    console.log('\n--- Unparsed Raw Markdown Link Check ---');
    console.log('Raw markdown links found:', html.match(/\[[^\]]+\]\([^)]+\)/g));

  } catch (err) {
    console.error('Fetch error:', err);
  }
}

verifyLive();
