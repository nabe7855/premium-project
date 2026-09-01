import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function getFilesRecursively(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

describe('SEO & Quality Static Source Audit (Zero DB / Network)', () => {
  const appDir = path.resolve(__dirname, '../app');
  const sourceFiles = getFilesRecursively(appDir);

  it('should not contain forbidden hype/claim words in source code', () => {
    const forbiddenWords = ['日本最大級', '業界No.1', '業界ナンバーワン'];
    const violations: { file: string; word: string }[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const word of forbiddenWords) {
        if (content.includes(word)) {
          const relativePath = path.relative(process.cwd(), filePath);
          violations.push({ file: relativePath, word });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('should not hardcode multiple <h1> tags in single page component files', () => {
    const h1Violations: string[] = [];

    for (const filePath of sourceFiles) {
      if (filePath.endsWith('page.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const h1Matches = content.match(/<h1[\s>]/g);
        if (h1Matches && h1Matches.length > 1) {
          const relativePath = path.relative(process.cwd(), filePath);
          h1Violations.push(relativePath);
        }
      }
    }

    expect(h1Violations).toEqual([]);
  });

  it('should not contain accidental noindex robots directives in public layout/pages', () => {
    const publicPagesDir = path.resolve(__dirname, '../app');
    const pageFiles = getFilesRecursively(publicPagesDir).filter(
      (f) => f.endsWith('page.tsx') || f.endsWith('layout.tsx'),
    );

    const noindexFiles: string[] = [];
    for (const filePath of pageFiles) {
      // Exclude admin or protected routes
      if (filePath.includes('admin') || filePath.includes('(protected)')) {
        continue;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      // Look for static noindex declarations in metadata
      if (
        /robots:\s*{\s*index:\s*false/i.test(content) ||
        /robots:\s*['"]noindex['"]/i.test(content)
      ) {
        const relativePath = path.relative(process.cwd(), filePath);
        noindexFiles.push(relativePath);
      }
    }

    expect(noindexFiles).toEqual([]);
  });
});
