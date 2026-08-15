async function run() {
  try {
    const kazuyaId = 'e661d9de-92da-4b7f-8f81-56c5476a81bb';
    const res = await fetch(`http://localhost:3000/store/fukuoka/diary/post/${kazuyaId}`);
    const html = await res.text();
    console.log('Kazuya has <a href=...news...>?', html.includes('<a '));
    console.log('Match:', html.match(/<a[^>]*href=["'][^"']*news-20260810-campaign[^"']*["'][^>]*>/));
  } catch(e) {
    console.error(e);
  }
}
run();
