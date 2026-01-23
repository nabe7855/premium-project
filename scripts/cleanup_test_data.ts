import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up test data...');

  try {
    // Get all recruit pages
    const pages = await prisma.recruitPage.findMany({
      include: {
        store: true,
      },
    });

    console.log(`Found ${pages.length} pages:`);
    pages.forEach((p) => {
      console.log(`  - Store: ${p.store.name}, Section: ${p.section_key}`);
      console.log(`    Content:`, JSON.stringify(p.content).substring(0, 100) + '...');
    });

    // Delete test data (hero section with Test Heading)
    const deleted = await prisma.recruitPage.deleteMany({
      where: {
        section_key: 'hero',
        content: {
          path: ['mainHeading'],
          equals: 'Test Heading',
        },
      },
    });

    console.log(`✅ Deleted ${deleted.count} test records`);

    // Verify
    const remaining = await prisma.recruitPage.count();
    console.log(`📄 Remaining pages: ${remaining}`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
