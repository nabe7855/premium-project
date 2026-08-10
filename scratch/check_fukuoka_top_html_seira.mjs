import { execSync } from 'child_process';

function checkSeiraHtml() {
  const html = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka"', { encoding: 'utf8' });
  const index = html.indexOf('青空');
  if (index !== -1) {
    console.log('Snippet around 青空:');
    console.log(html.slice(index - 100, index + 300));
  } else {
    console.log('青空 not found in HTML');
  }
}

checkSeiraHtml();
