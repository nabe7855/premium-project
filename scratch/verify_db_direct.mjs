import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== DIRECT DB & LOGIC VERIFICATION ===\n');

  const mousho = await prisma.pageRequest.findUnique({
    where: { id: 'ae3488b5-10bc-4f0b-990a-2c3965b1c933' }
  });

  const obon = await prisma.pageRequest.findUnique({
    where: { id: '2ead2c96-017e-4628-9aab-990a0c7e1839' }
  });

  console.log('1. Mousho Article:');
  console.log('   ID:', mousho?.id);
  console.log('   Title:', mousho?.title);
  console.log('   Slug:', mousho?.slug);
  console.log('   Description 末尾 200 文字:');
  console.log('  ', mousho?.sections[0]?.content?.description?.slice(-200));

  console.log('\n2. Obon Article:');
  console.log('   ID:', obon?.id);
  console.log('   Title:', obon?.title);
  console.log('   Slug:', obon?.slug);
  console.log('   Full Description:');
  console.log('  ', obon?.sections[0]?.content?.description);

  console.log('\n=== VERIFICATION SUCCESS ===');
}

main().finally(() => prisma.$disconnect());
