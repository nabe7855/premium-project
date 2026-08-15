async function run() {
  try {
    const kazuyaId = 'e661d9de-92da-4b7f-8f81-56c5476a81bb';
    const res = await fetch(`http://localhost:3000/store/fukuoka/diary/post/${kazuyaId}`);
    const html = await res.text();
    const matches = html.match(/<a [^>]+>.*?<\/a>/g);
    if (matches) {
      matches.forEach(m => {
        if (m.includes('http')) console.log(m);
      });
    }
  } catch(e) {
    console.error(e);
  }
}
run();
