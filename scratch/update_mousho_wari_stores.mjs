import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateMoushoWari() {
  console.log('--- Updating mousho-wari-2026 targetStoreSlugs to ["fukuoka", "yokohama"] ---');

  const rec = await prisma.pageRequest.findFirst({
    where: { slug: 'mousho-wari-2026' }
  });

  if (!rec) {
    console.error('mousho-wari-2026 record not found!');
    return;
  }

  const updated = await prisma.pageRequest.update({
    where: { id: rec.id },
    data: {
      targetStoreSlugs: ['fukuoka', 'yokohama']
    }
  });

  console.log('✅ Successfully updated mousho-wari-2026:');
  console.log({ id: updated.id, slug: updated.slug, targetStoreSlugs: updated.targetStoreSlugs, status: updated.status });

  await prisma.$disconnect();
}

updateMoushoWari().catch(console.error);
