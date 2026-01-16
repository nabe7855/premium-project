import { PrismaClient } from '@prisma/client';

const password = 'qH7fqFPYxhvw';
const projectRef = 'vkrztvkpjcpejccyiviw';
const region = 'ap-northeast-1';

const variations = [
  {
    name: 'Pooler Transaction Mode (Standard)',
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`,
  },
  {
    name: 'Pooler Session Mode (Port 5432)',
    url: `postgresql://postgres.${projectRef}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres`,
  },
  {
    name: 'Direct Connection (Port 5432)',
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
  },
  {
    name: 'Direct Connection with SSL require',
    url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`,
  },
];

async function test(variation) {
  console.log(`\nTesting: ${variation.name}`);
  const prisma = new PrismaClient({
    datasources: { db: { url: variation.url } },
  });

  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('✅ Success!');
    return true;
  } catch (error) {
    console.log('❌ Failed');
    console.log(error.message.split('\n')[0]);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  for (const v of variations) {
    const success = await test(v);
    if (success) {
      console.log(`\n🎉 WORKING URL found: ${v.name}`);
      process.exit(0);
    }
  }
  console.log('\n❌ No working connection string found.');
}

main();
village;
