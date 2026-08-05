async function revalidate() {
  try {
    const res1 = await fetch('https://www.sutoroberrys.jp/api/revalidate?path=/store/fukuoka/news/news-1785718651524&secret=strawberry-secret-revalidate-2026');
    console.log('Revalidate article:', await res1.text());

    const res2 = await fetch('https://www.sutoroberrys.jp/api/revalidate?path=/store/fukuoka/news&secret=strawberry-secret-revalidate-2026');
    console.log('Revalidate news list:', await res2.text());
  } catch (e) {
    console.error('Revalidate error:', e);
  }
}

revalidate();
