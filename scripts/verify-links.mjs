async function run() {
  const kazuyaId = 'e661d9de-92da-4b7f-8f81-56c5476a81bb';
  const res = await fetch(`http://localhost:3000/store/fukuoka/diary/post/${kazuyaId}`);
  const html = await res.text();
  console.log(res.status, res.url);
  const index = html.indexOf('news-202608');
  if (index !== -1) {
    console.log(html.slice(index - 50, index + 100));
  } else {
    console.log(html.slice(0, 300));
  }
}
run();
