import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scratch/sample_numbers_candidates.json', 'utf8'));

const statKeywords = [
  '件', '%', '名', '人', '満足度', 'リピート率', '累計', '実績', '4.8', '4.9', '4,000', '100件', '247', '98%', '89%'
];

const filtered = raw.filter(item => {
  const c = item.content;
  // テキストノードやJSX内の日本語数字表現
  const hasStatWord = statKeywords.some(kw => c.includes(kw));
  const isCodeProp = c.startsWith('const ') || c.startsWith('type ') || c.startsWith('interface ') || c.startsWith('export ');
  return hasStatWord && !isCodeProp;
});

console.log(`Filtered candidates count: ${filtered.length}`);

// Group by file
const grouped = {};
filtered.forEach(item => {
  if (!grouped[item.file]) grouped[item.file] = [];
  grouped[item.file].push(item);
});

console.log('--- SUSPECTED DUMMY STATS / SAMPLE NUMBERS IN SOURCE CODE ---');
Object.keys(grouped).forEach(filePath => {
  console.log(`\n📄 ${filePath}:`);
  grouped[filePath].forEach(l => console.log(`   L${l.lineNum}: ${l.content}`));
});

fs.writeFileSync('scratch/filtered_sample_numbers.json', JSON.stringify(grouped, null, 2));
