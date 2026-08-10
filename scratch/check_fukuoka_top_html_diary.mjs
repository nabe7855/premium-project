import { execSync } from 'child_process';

function checkDiaryHtml() {
  const html = execSync('curl.exe -s "https://www.sutoroberrys.jp/store/fukuoka"', { encoding: 'utf8' });
  const index = html.indexOf('id="diary"');
  if (index !== -1) {
    console.log('Snippet around id="diary":');
    console.log(html.slice(index, index + 1500));
  } else {
    console.log('id="diary" not found');
  }
}

checkDiaryHtml();
