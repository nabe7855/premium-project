import { createPage, updatePage, deletePage } from '../src/lib/actions/news-pages';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== STARTING PUBLISH-TIME SLUG GENERATION TEST ===');
  let testPageId: string | null = null;

  try {
    // 1. Create a draft page (status: private)
    console.log('\n--- 1. Creating Draft Page ---');
    const draftPage = await createPage({
      title: '[TEST] 公開時スラッグ検証用ドラフト',
      category: 'promo',
      status: 'private',
      targetStoreSlugs: ['fukuoka'],
    });

    if (!draftPage) throw new Error('Failed to create draft page');
    testPageId = draftPage.id;
    console.log(`✅ Draft Created: ID=${draftPage.id} | Initial Slug=${draftPage.slug} | Status=${draftPage.status}`);

    // 2. Change Category while still private (promo -> campaign)
    console.log('\n--- 2. Updating Category to "campaign" while Draft ---');
    const updatedDraft = await updatePage(draftPage.id, {
      category: 'campaign',
    });
    console.log(`✅ Draft Updated Category: Category=${updatedDraft?.category} | Slug=${updatedDraft?.slug}`);

    // 3. Click Publish (change store status to published)
    console.log('\n--- 3. Publishing Article (First-Time Publish) ---');
    const publishedPage = await updatePage(draftPage.id, {
      storeSettings: {
        fukuoka: {
          status: 'published',
          publishedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`🚀 Published Page: Slug=${publishedPage?.slug} | Category=${publishedPage?.category}`);
    if (publishedPage?.slug.includes('campaign')) {
      console.log('✅ SUCCESS: Slug was dynamically re-generated upon publication using the latest category "campaign"!');
    } else {
      console.error('❌ FAIL: Slug was not re-generated based on published category!');
    }

  } finally {
    if (testPageId) {
      await deletePage(testPageId);
      console.log(`\n🗑️ Cleaned up test page ID: ${testPageId}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
