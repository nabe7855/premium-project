import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany({
    include: {
      images: true,
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 5
  });
  console.log(JSON.stringify(blogs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
