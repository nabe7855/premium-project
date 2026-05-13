import fs from 'fs';
const t = fs.readFileSync('page.html', 'utf8');
const regex = /images\.unsplash\.com[^&"'\\]+/g;
console.log([...new Set(t.match(regex))]);
