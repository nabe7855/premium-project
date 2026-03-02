import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const casts = await prisma.cast.findMany({
    where: {
      OR: [{ name: 'エイタ' }, { email: { contains: 'eita@gmail.com' } }],
    },
    include: {
      statuses: {
        include: {
          status_master: true,
        },
      },
    },
  });

  console.log('Casts found:', JSON.stringify(casts, null, 2));

  if (casts.length > 0) {
    const email = casts[0].email;
    if (email) {
      // Check for other casts with the same email
      const duplicates = await prisma.cast.findMany({
        where: {
          email: email,
          id: { not: casts[0].id },
        },
      });
      console.log('Duplicate emails found:', JSON.stringify(duplicates, null, 2));
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
