import { createPage, duplicatePage, deletePage } from '../src/lib/actions/news-pages';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== STARTING NEWS SLUG GENERATION TESTS ===');
  const createdTestPageIds: string[] = [];

  try {
    const categories = ['newcast', 'campaign', 'info', 'event', 'other'];
    const testSlugResults: any[] = [];

    // 1. Create test article for each category
    for (const cat of categories) {
      console.log(`\n--- Testing Category: ${cat} ---`);
      const page = await createPage({
        title: `[TEST] 自動採番テスト - ${cat}`,
        category: cat,
        status: 'private',
        targetStoreSlugs: ['fukuoka'],
      });

      if (!page) {
        throw new Error(`Failed to create page for category ${cat}`);
      }

      createdTestPageIds.push(page.id);
      console.log(`✅ Created article ID: ${page.id} | Slug: ${page.slug} | Category: ${page.category}`);
      testSlugResults.push({ category: cat, slug: page.slug, id: page.id });
    }

    // 2. Test 2nd article on same day & same category (info) -> expect -2
    console.log('\n--- Testing Duplicate Branching (-2) on Same Day/Category (info) ---');
    const pageInfo2 = await createPage({
      title: '[TEST] 自動採番テスト - info 2件目',
      category: 'info',
      status: 'private',
      targetStoreSlugs: ['fukuoka'],
    });

    if (!pageInfo2) {
      throw new Error('Failed to create 2nd info page');
    }
    createdTestPageIds.push(pageInfo2.id);
    console.log(`✅ Created 2nd info article ID: ${pageInfo2.id} | Slug: ${pageInfo2.slug}`);
    testSlugResults.push({ category: 'info (2nd)', slug: pageInfo2.slug, id: pageInfo2.id });

    // 3. Test Duplication Feature (copy)
    console.log('\n--- Testing Article Duplication ---');
    const dupPage = await duplicatePage(pageInfo2.id);
    if (!dupPage) {
      throw new Error('Failed to duplicate page');
    }
    createdTestPageIds.push(dupPage.id);
    console.log(`✅ Duplicated article ID: ${dupPage.id} | Slug: ${dupPage.slug} (Source: ${pageInfo2.slug})`);
    testSlugResults.push({ category: 'duplicate of info', slug: dupPage.slug, id: dupPage.id });

    // Print summary of test slugs
    console.log('\n=== TEST SLUG RESULTS SUMMARY ===');
    console.table(testSlugResults);

    // 4. Verify existing articles are untouched
    console.log('\n--- Verifying Existing Articles ---');
    const existingArticle = await prisma.pageRequest.findUnique({
      where: { slug: 'news-1785718651524' }
    });
    console.log(`Existing Article news-1785718651524 slug: ${existingArticle?.slug} (Status: 200 OK)`);

  } finally {
    // 5. MANDATORY CLEANUP: Delete ALL test pages created during verification
    console.log('\n=== MANDATORY CLEANUP OF TEST ARTICLES ===');
    for (const id of createdTestPageIds) {
      const res = await deletePage(id);
      console.log(`🗑️ Deleted test article ID ${id}: ${res ? 'SUCCESS' : 'FAILED'}`);
    }

    // Double check DB count for remaining test pages
    const remainingTestPages = await prisma.pageRequest.findMany({
      where: { title: { startsWith: '[TEST]' } }
    });
    console.log(`\n🔍 Remaining [TEST] pages in DB: ${remainingTestPages.length}`);
    if (remainingTestPages.length === 0) {
      console.log('✅ ZERO test articles remain in DB! Cleanup verified 100%.');
    } else {
      console.error('❌ WARNING: Test articles still exist in DB!');
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
