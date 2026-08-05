import fs from 'fs';

const htmlPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット/index.html';

const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract title
const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
console.log('TITLE:', titleMatch ? titleMatch[1] : 'NONE');

// Extract description
const descMatch = html.match(/<meta name="description" content="([\s\S]*?)">/);
console.log('DESC:', descMatch ? descMatch[1] : 'NONE');

// Extract body between <article ...> and </article> or <body> and </body>
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  let bodyContent = bodyMatch[1];
  console.log('BODY LENGTH:', bodyContent.length);
  // Check image src paths in body
  const imgMatches = bodyContent.match(/src="([^"]+)"/g);
  console.log('IMAGE SRCS IN HTML:', imgMatches);
}
