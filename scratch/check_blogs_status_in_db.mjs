import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkStatus() {
  const testBlogIds = [
    'd8605d6a-7f00-489c-b239-9b4b206f9297',
    'b442cdf7-96bb-427d-a840-757da6608e14',
    '5843e217-c1a0-4a9c-8dd5-cfac9b81f873',
    '574c9b2c-c8f3-4957-a336-7a58c5c6517c',
    '86effd86-cc4a-4e1c-a6eb-6145e7cdf3db'
  ];

  const res = await prisma.$queryRaw`
    SELECT id, title, status FROM blogs WHERE id IN (${testBlogIds[0]}::uuid, ${testBlogIds[1]}::uuid, ${testBlogIds[2]}::uuid, ${testBlogIds[3]}::uuid, ${testBlogIds[4]}::uuid)
  `;

  console.log('--- DB Status Check ---');
  console.log(res);

  await prisma.$disconnect();
}

checkStatus().catch(console.error);
