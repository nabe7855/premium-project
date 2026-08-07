import { execSync } from 'child_process';

const html = execSync(`curl.exe -s "https://www.sutoroberrys.jp/?nocache=${Date.now()}"`, { encoding: 'utf8' });

const matches = html.match(/<span[^>]*>[^<]*⭐[^<]*<\/span>/g);
console.log('Matches:', matches);

// Check if file content is actually used
const wholeBlock = html.match(/<div[^>]*class="[^"]*pt-2 flex flex-wrap gap-2[^"]*"[^>]*>[\s\S]*?<\/div>/);
console.log('Block:', wholeBlock ? wholeBlock[0] : 'Block Not Found');
