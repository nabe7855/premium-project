import { execSync } from 'child_process';

function inspectFullLiveHtml() {
  console.log('=== INSPECTING FULL LIVE HTML FOR NEWS DETAIL ===\n');

  const html = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka/news/news-20260810-campaign"', { encoding: 'utf8' });

  console.log('--- Head section snippet ---');
  const headIdx = html.indexOf('<head>');
  const headEndIdx = html.indexOf('</head>');
  if (headIdx !== -1 && headEndIdx !== -1) {
    console.log(html.slice(headIdx, headIdx + 1000));
  }

  console.log('\n--- Title tag ---');
  const titleMatch = html.match(/<title[\s\S]*?<\/title>/gi);
  console.log(titleMatch);

  console.log('\n--- H1 and H2 tags ---');
  const h1Match = html.match(/<h1[\s\S]*?<\/h1>/gi);
  const h2Match = html.match(/<h2[\s\S]*?<\/h2>/gi);
  console.log('H1:', h1Match);
  console.log('H2:', h2Match);
}

inspectFullLiveHtml();
