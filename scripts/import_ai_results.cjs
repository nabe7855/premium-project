const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';
const IMPORT_DIR = 'import_results';

async function importResults() {
  if (!fs.existsSync(IMPORT_DIR)) {
    console.error(`Error: Directory ${IMPORT_DIR} not found.`);
    return;
  }

  const files = fs.readdirSync(IMPORT_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('No JSON files found in import_results.');
    return;
  }

  console.log(`Starting import of ${files.length} files...`);
  const mainData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  for (const file of files) {
    console.log(`\n📄 Importing: ${file}`);
    const filePath = path.join(IMPORT_DIR, file);
    const results = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    for (const res of results) {
      const id = res.id;
      try {
        // 1. DB Update
        await prisma.lh_hotels.update({
          where: { id },
          data: {
            ai_description: res.ai_description,
            ai_summary: res.ai_summary,
            ai_pros_cons: res.ai_pros_cons,
          },
        });

        // 2. Clear old AI reviews if any and add new ones
        await prisma.lh_reviews.deleteMany({
          where: { hotel_id: id, is_verified: true },
        });

        for (const r of res.ai_reviews) {
          await prisma.lh_reviews.create({
            data: {
              id: uuidv4(),
              hotel_id: id,
              user_name: r.userName,
              content: r.content,
              rating: r.rating || 5,
              is_verified: true,
              created_at: new Date(),
            },
          });
        }

        // 3. Update main JSON
        if (mainData[id]) {
          Object.assign(mainData[id], res);
          mainData[id].processing_status = 'completed';
        }
        console.log(`  ✅ Done: ${id}`);
      } catch (e) {
        console.error(`  ❌ Error on ${id}:`, e.message);
      }
    }
    // Move or delete the processed file to avoid double import
    // fs.renameSync(filePath, path.join(IMPORT_DIR, 'done_' + file));
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(mainData, null, 2));
  console.log('\nAll imports finished.');
}

importResults()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
