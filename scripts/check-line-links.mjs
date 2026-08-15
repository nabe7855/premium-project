async function run() {
  for (const city of ['fukuoka', 'yokohama']) {
    try {
      const res = await fetch(`http://localhost:3000/store/${city}/recruit`);
      const html = await res.text();
      const matches = html.match(/href=["'](https:\/\/(?:line\.me|lin\.ee)[^"']*)["']/g);
      
      console.log(`--- ${city.toUpperCase()} ---`);
      if (matches) {
        console.log([...new Set(matches)]);
      } else {
        console.log('No LINE links found');
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

run();
