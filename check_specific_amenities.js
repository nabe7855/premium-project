import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const targetNames = [
    'くるくるドライヤー',
    'コスプレ',
    'ヘアアイロン',
    'マッサージチェア',
    'マッサージローション',
    'ルームウェア',
    '各種シャンプー',
  ];

  const amenities = await prisma.lh_amenities.findMany({
    where: { name: { in: targetNames } },
  });

  console.log('Found amenities:', JSON.stringify(amenities, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
