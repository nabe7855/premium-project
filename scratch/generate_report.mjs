import fs from 'fs';

async function generate() {
  const data = JSON.parse(fs.readFileSync('scratch/audit_parsed.json', 'utf8'));

  console.log('=== CATEGORY SUMMARY ===');
  console.log(data.categoryCounts);

  console.log('\n=== AMOLAB ARTICLES (category=amolab) ===');
  const amolabOnly = data.articleDetails.filter(a => a.category === 'amolab');
  console.log(`Count: ${amolabOnly.length}`);
  for (const a of amolabOnly) {
    console.log(`\n- SLUG: ${a.slug}`);
    console.log(`  TITLE: ${a.title}`);
    console.log(`  STATUS: ${a.status}`);
    console.log(`  CREATED: ${a.created_at}, PUBLISHED: ${a.published_at}, UPDATED: ${a.updated_at}`);
    console.log(`  CHARS: ${a.charCount}`);
    console.log(`  TAGS: ${a.tags.join(', ')}`);
    console.log(`  HEALTH CLAIMS: ${a.healthClaims.length > 0 ? a.healthClaims.join(' / ') : 'なし'}`);
    console.log(`  HAS SOURCE: ${a.hasSource}, OPERATOR NOTE: ${a.hasOperatorNote}`);
    console.log(`  DUMMY LINKS: ${a.dummyLinkCount}, IMAGES: ${a.imageCount} (alt: ${a.imgWithAltCount}), INTERNAL LINKS: ${a.internalLinkCount}`);
  }

  console.log('\n=== AMOLAB-JITEN ARTICLES (category=amolab-jiten) ===');
  const jitenOnly = data.articleDetails.filter(a => a.category === 'amolab-jiten');
  console.log(`Count: ${jitenOnly.length}`);
  for (const a of jitenOnly) {
    console.log(`\n- SLUG: ${a.slug}`);
    console.log(`  TITLE: ${a.title}`);
    console.log(`  STATUS: ${a.status}`);
    console.log(`  CHARS: ${a.charCount}`);
    console.log(`  HEALTH CLAIMS: ${a.healthClaims.length > 0 ? a.healthClaims.join(' / ') : 'なし'}`);
    console.log(`  DUMMY LINKS: ${a.dummyLinkCount}, IMAGES: ${a.imageCount}, INTERNAL LINKS: ${a.internalLinkCount}`);
  }

  console.log('\n=== TAG MAPPING ===');
  for (const t of data.tagDetails) {
    console.log(`Tag [${t.name}]: total=${t.total}, published=${t.published}`);
    for (const art of t.articles) {
      console.log(`  - ${art.slug} (${art.category}, ${art.status})`);
    }
  }
}

generate().catch(console.error);
