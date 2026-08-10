import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scratch', 'ikeo_db_raw.json'), 'utf8'));

console.log('=== ALL MEDIA ARTICLES IN DB ===\n');

rawData.forEach((a, i) => {
  console.log(`[${i + 1}] ID: ${a.id}`);
  console.log(`     Slug: ${a.slug}`);
  console.log(`     Category: ${a.category}`);
  console.log(`     Status: ${a.status}`);
  console.log(`     Title: ${a.title}`);
  console.log(`     Published At: ${a.published_at || a.created_at}`);
  console.log('---');
});
