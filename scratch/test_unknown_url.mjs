async function testUnknown() {
  const url1 = 'https://www.sutoroberrys.jp/store/fukuoka/interview/unknown/sai-interview-vol1';
  const url2 = 'https://www.sutoroberrys.jp/store/fukuoka/interview/unknown/kazuya-interview';
  const res1 = await fetch(url1);
  const res2 = await fetch(url2);
  console.log('unknown sai status:', res1.status);
  console.log('unknown kazuya status:', res2.status);
}

testUnknown();
