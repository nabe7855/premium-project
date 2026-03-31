
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const casts = await prisma.cast.findMany({
    select: {
      sexiness_level: true
    },
    where: {
      sexiness_level: {
        not: null
      }
    },
    take: 10
  });
  console.log('Existing sexiness levels:', casts.map(c => c.sexiness_level));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
