import http from 'http';

async function checkLocal() {
  // Check Product schema in local build if running or fetch remote page
  try {
    const res = await fetch('https://www.sutoroberrys.jp/store/fukuoka/reviews');
    const html = await res.text();
    
    const productMatches = html.match(/"@type"\s*:\s*"Product"/g) || [];
    const orgMatches = html.match(/"@type"\s*:\s*"Organization"/g) || [];

    console.log('🔍 Remote /store/fukuoka/reviews check:');
    console.log('   - Product schema matches (target 0):', productMatches.length);
    console.log('   - Organization schema matches:', orgMatches.length);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

checkLocal();
