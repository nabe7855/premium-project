import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const storesData = [
  { id: 'tokyo', name: 'ストロベリーボーイズ東京', slug: 'tokyo', address: '東京都' },
  { id: 'osaka', name: 'ストロベリーボーイズ大阪', slug: 'osaka', address: '大阪府' },
  { id: 'nagoya', name: 'ストロベリーボーイズ名古屋', slug: 'nagoya', address: '愛知県' },
  { id: 'fukuoka', name: 'ストロベリーボーイズ福岡', slug: 'fukuoka', address: '福岡県' },
  { id: 'yokohama', name: 'ストロベリーボーイズ横浜', slug: 'yokohama', address: '神奈川県' },
];

async function main() {
  console.log('Seeding stores...');
  for (const store of storesData) {
    await prisma.store.upsert({
      where: { slug: store.slug },
      update: { name: store.name, address: store.address },
      create: store,
    });
    console.log(`- Seeded store: ${store.name}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
