import fetch from 'node-fetch';

async function main() {
  const guideUrl = `https://www.sutoroberrys.jp/guide?_t=${Date.now()}`;
  const planUrl = `https://www.sutoroberrys.jp/plan?_t=${Date.now()}`;

  const guideRes = await fetch(guideUrl, { headers: { 'Cache-Control': 'no-cache' } });
  const guideHtml = await guideRes.text();

  const planRes = await fetch(planUrl, { headers: { 'Cache-Control': 'no-cache' } });
  const planHtml = await planRes.text();

  const guideCanonical = guideHtml.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
  const planCanonical = planHtml.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);

  console.log('/guide Canonical Tag:', guideCanonical ? guideCanonical[0] : 'NOT FOUND');
  console.log('/plan Canonical Tag:', planCanonical ? planCanonical[0] : 'NOT FOUND');
}

main();
