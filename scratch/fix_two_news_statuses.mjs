import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixTwoNewsStatuses() {
  console.log('=== FIXING TWO NEWS ARTICLES IN DB FOR IMMEDIATE PUBLICATION ===\n');

  // 1. Article 1: 【福岡店限定】気温35℃以上で2,000円OFF！ (ID: ae3488b5-10bc-4f0b-990a-2c3965b1c933)
  const art1 = await prisma.pageRequest.findUnique({ where: { id: 'ae3488b5-10bc-4f0b-990a-2c3965b1c933' } });
  if (art1) {
    const slugs = art1.targetStoreSlugs || [];
    if (!slugs.includes('fukuoka')) slugs.push('fukuoka');
    await prisma.pageRequest.update({
      where: { id: art1.id },
      data: {
        status: 'published',
        targetStoreSlugs: slugs
      }
    });
    console.log('✅ Article 1 updated: targetStoreSlugs includes fukuoka & status=published');
  }

  // 2. Article 2: 「今年いちばんの夏の思い出を、セラピストと。」 (ID: 3697fe49-978a-4646-99cd-d19e8ca6f009)
  const art2 = await prisma.pageRequest.findUnique({ where: { id: '3697fe49-978a-4646-99cd-d19e8ca6f009' } });
  if (art2) {
    const slugs = art2.targetStoreSlugs || [];
    if (!slugs.includes('fukuoka')) slugs.push('fukuoka');
    await prisma.pageRequest.update({
      where: { id: art2.id },
      data: {
        status: 'published',
        targetStoreSlugs: slugs
      }
    });
    console.log('✅ Article 2 updated: status=published & targetStoreSlugs includes fukuoka');
  }
}

fixTwoNewsStatuses().catch(console.error);
