import fs from 'fs';
import path from 'path';

function searchFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next') && !filePath.includes('.git') && !filePath.includes('scratch') && !filePath.includes('tmp')) {
        searchFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const allFiles = searchFiles('./src');
console.log(`Searching through ${allFiles.length} files in src...`);

const matches = [];
const patterns = [/(\d+[\+\%件名名名名名名名名名名名名名名名名名名名名名名名名名人歳代万割位倍]|満足度|リピート率|グループ累計|口コミ\d+)/g];

allFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // 排除: css, tailwind, ts type
    if (line.includes('className') && (line.includes('w-') || line.includes('h-') || line.includes('p-') || line.includes('m-') || line.includes('gap-') || line.includes('text-'))) {
      // css utility lines
    }
    
    if (
      line.includes('件') ||
      line.includes('%') ||
      line.includes('名') ||
      line.includes('人') ||
      line.includes('＋') ||
      line.includes('+') ||
      line.includes('累計') ||
      line.includes('満足度') ||
      line.includes('リピート率') ||
      line.includes('実力派') ||
      line.includes('実績')
    ) {
      if (
        !line.trim().startsWith('import') &&
        !line.trim().startsWith('//') &&
        !line.trim().startsWith('/*') &&
        !line.includes('px') &&
        !line.includes('rem') &&
        !line.includes('width') &&
        !line.includes('height') &&
        !line.includes('max-w-') &&
        !line.includes('min-h-') &&
        !line.includes('duration-') &&
        !line.includes('delay-') &&
        !line.includes('z-') &&
        !line.includes('grid-cols-')
      ) {
        matches.push({
          file: file.replace(/\\/g, '/'),
          lineNum: idx + 1,
          content: line.trim()
        });
      }
    }
  });
});

console.log(`Found ${matches.length} candidate lines.`);

fs.writeFileSync('scratch/sample_numbers_candidates.json', JSON.stringify(matches, null, 2));
