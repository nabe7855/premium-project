import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Creating recruit_pages table...');

  try {
    // Drop if exists to start fresh
    await prisma.$executeRaw`DROP TABLE IF EXISTS recruit_pages CASCADE`;
    console.log('🗑️ Dropped existing table if any');

    // Create table with UUID
    await prisma.$executeRaw`
      CREATE TABLE recruit_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        section_key TEXT NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(store_id, section_key)
      )
    `;
    console.log('✅ Table created');

    // Create index
    await prisma.$executeRaw`
      CREATE INDEX recruit_pages_store_id_idx ON recruit_pages(store_id)
    `;
    console.log('✅ Index created');

    // Verify
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM recruit_pages`;
    console.log('✅ Table verified:', result);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
