import { createPage, deletePage } from '../src/lib/actions/news-pages';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== STARTING IMAGE ALT ATTRIBUTE FEATURE TESTS ===');
  const createdTestPageIds: string[] = [];

  try {
    // 1. Create Test Article with Custom Alt (Input Case)
    console.log('\n--- 1. Testing Custom Alt Input ---');
    const customAltPage = await createPage({
      title: '[TEST] カスタムaltテスト記事',
      category: 'newcast',
      status: 'private',
      targetStoreSlugs: ['fukuoka'],
      sections: [
        {
          id: 'test-sec-1',
          type: 'hero',
          content: {
            imageUrl: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/test.webp',
            alt: '福岡店セラピストのりく',
            description: 'テスト本文',
          },
        },
      ],
    });

    if (!customAltPage) throw new Error('Failed to create custom alt test page');
    createdTestPageIds.push(customAltPage.id);
    console.log(`✅ Created Custom Alt Page ID: ${customAltPage.id} | Slug: ${customAltPage.slug}`);

    // 2. Create Test Article with Multiple Images (Sequential Fallback Case)
    console.log('\n--- 2. Testing Multiple Images Sequential Fallback ---');
    const multiImagePage = await createPage({
      title: '[TEST] 複数画像alt連番テスト記事',
      category: 'campaign',
      status: 'private',
      targetStoreSlugs: ['fukuoka'],
      sections: [
        {
          id: 'test-sec-hero',
          type: 'hero',
          content: {
            imageUrl: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/test1.webp',
            // alt left empty for fallback to title
          },
        },
        {
          id: 'test-sec-campaign',
          type: 'campaign',
          content: {
            imageUrl: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/test2.webp',
            // alt left empty for fallback to title (2)
          },
        },
        {
          id: 'test-sec-gallery',
          type: 'gallery',
          content: {
            items: [
              { imageUrl: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/test3.webp' },
            ],
          },
        },
      ],
    });

    if (!multiImagePage) throw new Error('Failed to create multi image test page');
    createdTestPageIds.push(multiImagePage.id);
    console.log(`✅ Created Multi Image Page ID: ${multiImagePage.id} | Slug: ${multiImagePage.slug}`);

  } finally {
    // 3. MANDATORY CLEANUP: Delete ALL test pages
    console.log('\n=== MANDATORY CLEANUP OF TEST ARTICLES ===');
    for (const id of createdTestPageIds) {
      const res = await deletePage(id);
      console.log(`🗑️ Deleted test article ID ${id}: ${res ? 'SUCCESS' : 'FAILED'}`);
    }

    const remainingTestPages = await prisma.pageRequest.findMany({
      where: { title: { startsWith: '[TEST]' } },
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
