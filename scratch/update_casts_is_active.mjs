import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateCasts() {
  const testCastIds = [
    '21e6000b-4d89-43e4-8fb5-ac9c583b1df6', // koko
    '013cd4f7-bc4f-4ce2-a956-4b942444ce4c'  // 田中 テスト用
  ];

  const result = await prisma.$executeRaw`
    UPDATE casts SET is_active = false WHERE id IN (${testCastIds[0]}::uuid, ${testCastIds[1]}::uuid)
  `;

  console.log(`✅ ${result} cast records updated to is_active=false`);
  await prisma.$disconnect();
}

updateCasts().catch(console.error);
