async function revalidate() {
  try {
    const res1 = await fetch('https://www.sutoroberrys.jp/api/revalidate?path=/store/fukuoka/reviews&secret=strawberry-secret-revalidate-2026');
    console.log('Revalidate fukuoka reviews:', await res1.text());

    const res2 = await fetch('https://www.sutoroberrys.jp/api/revalidate?path=/store/yokohama/reviews&secret=strawberry-secret-revalidate-2026');
    console.log('Revalidate yokohama reviews:', await res2.text());
  } catch (e) {
    console.error('Revalidate error:', e);
  }
}

revalidate();
