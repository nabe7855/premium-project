const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const queries = [
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS raw_description TEXT;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS ai_description TEXT;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS ai_summary TEXT;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS ai_pros_cons JSONB;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS review_snippets JSONB;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS rating_exterior DECIMAL;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS rating_price DECIMAL;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS rating_cleanliness DECIMAL;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS rating_bath DECIMAL;`,
    `ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS rating_service DECIMAL;`,
  ];

  for (const q of queries) {
    try {
      console.log(`Executing: ${q}`);
      await prisma.$executeRawUnsafe(q);
    } catch (e) {
      console.error(`Error executing ${q}:`, e.message);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
