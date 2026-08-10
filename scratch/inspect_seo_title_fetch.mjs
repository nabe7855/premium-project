import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testFetch() {
  const record = await prisma.pageRequest.findUnique({
    where: { slug: 'news-20260810-campaign' }
  });

  const misc = record.referenceUrls || {};
  console.log('Record:', {
    title: record.title,
    seoTitle: misc.seoTitle,
    sections: record.sections
  });
}

testFetch().catch(console.error);
