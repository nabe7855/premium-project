import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cast = await prisma.cast.findFirst();
  if (!cast) return;

  console.log(`Updating ${cast.name}...`);
  const updated = await prisma.cast.update({
    where: { id: cast.id },
    data: { sexiness_level: 150 }
  });
  console.log('Result:', updated.sexiness_level);

  // set it back
  await prisma.cast.update({
    where: { id: cast.id },
    data: { sexiness_level: cast.sexiness_level }
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
