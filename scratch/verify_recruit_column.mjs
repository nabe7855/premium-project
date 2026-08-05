import { prisma } from '../src/lib/prisma.ts';
import { getPublishedRecruitColumns, getRecruitColumnBySlug } from '../src/lib/actions/recruit-column.ts';
import { getPublishedPagesByStore, getPublishedPageBySlug } from '../src/lib/actions/news-pages.ts';

async function testRecruitColumnIsolation() {
  console.log('========================================');
  console.log('VERIFYING RECRUIT COLUMN ISOLATION');
  console.log('========================================');

  const testSlug = `test-column-${Date.now()}`;
  console.log(`\n1. Creating test recruit-column article with slug: ${testSlug}`);

  const testRecord = await prisma.pageRequest.create({
    data: {
      title: 'テスト採用コラム：セラピストになるには',
      slug: testSlug,
      status: 'published',
      referenceUrls: {
        category: 'recruit-column',
        shortDescription: 'セラピストになるための完全ステップ解説コラムテスト。',
        tags: ['求人', '未経験'],
      },
      targetStoreSlugs: [],
    },
  });

  try {
    // 2. Fetch via getPublishedRecruitColumns
    const recruitColumns = await getPublishedRecruitColumns();
    const foundInColumns = recruitColumns.find((c) => c.slug === testSlug);
    console.log(`\n2. Found in getPublishedRecruitColumns(): ${Boolean(foundInColumns)}`);

    // 3. Fetch via getRecruitColumnBySlug
    const columnDetail = await getRecruitColumnBySlug(testSlug);
    console.log(`3. Found in getRecruitColumnBySlug("${testSlug}"): ${Boolean(columnDetail)}`);

    // 4. Verify CUSTOMER news list does NOT contain recruit-column
    const fukuokaNews = await getPublishedPagesByStore('fukuoka');
    const foundInFukuokaNews = fukuokaNews.find((n) => n.slug === testSlug);
    console.log(`4. Found in Fukuoka customer news list: ${Boolean(foundInFukuokaNews)} (Expected: FALSE)`);

    // 5. Verify CUSTOMER news detail route returns NULL for recruit-column
    const customerNewsDetail = await getPublishedPageBySlug(testSlug);
    console.log(`5. Found in customer news detail route: ${Boolean(customerNewsDetail)} (Expected: NULL / FALSE)`);

    if (foundInColumns && columnDetail && !foundInFukuokaNews && customerNewsDetail === null) {
      console.log('\n✅ VERIFICATION PASSED: Recruit Column is 100% isolated from customer news!');
    } else {
      console.error('\n❌ VERIFICATION FAILED: Isolation check failed!');
    }
  } finally {
    // Clean up test record
    await prisma.pageRequest.delete({ where: { id: testRecord.id } });
    console.log('\n🧹 Test record deleted successfully.');
  }
}

testRecruitColumnIsolation().catch(console.error);
