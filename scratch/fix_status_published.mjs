import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ids = ['ae3488b5-10bc-4f0b-990a-2c3965b1c933', '2ead2c96-017e-4628-9aab-990a0c7e1839'];

  for (const id of ids) {
    const updated = await prisma.pageRequest.update({
      where: { id },
      data: {
        status: 'published',
      },
    });
    console.log(`✅ Set status='published' for ${updated.slug} (${updated.title})`);
  }
}

main().finally(() => prisma.$disconnect());
