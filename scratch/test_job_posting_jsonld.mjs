async function checkJobPosting() {
  const stores = ['fukuoka', 'yokohama'];
  for (const slug of stores) {
    const url = `https://www.sutoroberrys.jp/store/${slug}/recruit`;
    console.log(`\n========================================`);
    console.log(`STORE: ${slug.toUpperCase()} (${url})`);
    console.log(`========================================`);
    try {
      const res = await fetch(url);
      const html = await res.text();
      const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
      let foundJobPosting = false;
      for (const m of matches) {
        if (m[1].includes('JobPosting')) {
          foundJobPosting = true;
          const parsed = JSON.parse(m[1]);
          console.log(JSON.stringify(parsed, null, 2));
        }
      }
      if (!foundJobPosting) {
        console.log('❌ JobPosting JSON-LD not found in HTML');
      }
    } catch (e) {
      console.error(`Fetch error for ${slug}:`, e);
    }
  }
}

checkJobPosting();
