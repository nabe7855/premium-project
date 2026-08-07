import { execSync } from 'child_process';

const url = 'https://www.sutoroberrys.jp/';
console.log(`Extracting exact HTML snippet from ${url}`);
const html = execSync(`curl.exe -s "${url}"`, { encoding: 'utf8' });

const pcMatch = html.match(/⭐[^\n<]+/g);
console.log('Found ⭐ Badge Snippets in HTML:');
console.log(pcMatch);

const sinceMatch = html.match(/Since 2018[^\n<]*/g);
console.log('Found Since 2018 Snippets in HTML:');
console.log(sinceMatch);
