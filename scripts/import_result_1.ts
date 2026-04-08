import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), 'import_results/result_1.json');
  console.log(`Reading from: ${jsonPath}`);
  
  if (!fs.existsSync(jsonPath)) {
    console.error('File does not exist: ' + jsonPath);
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Found ${data.length} records to import.`);

  for (const item of data) {
    if (!item.id) {
      console.warn('Skipping item without id:', item);
      continue;
    }

    console.log(`Processing hotel ID: ${item.id}`);

    // Update hotel
    try {
      await prisma.lh_hotels.update({
        where: { id: item.id },
        data: {
          ai_description: item.ai_description,
          ai_summary: item.ai_summary,
          ai_pros_cons: item.ai_pros_cons,
        },
      });
      console.log(`Updated hotel ${item.id} with AI data.`);
    } catch (e: any) {
      if (e.code === 'P2025') { // Record not found
        console.warn(`Hotel with id ${item.id} not found in DB. Skipping.`);
        continue;
      }
      console.error(`Error updating hotel ${item.id}:`, e);
      continue;
    }

    // Insert reviews
    if (item.ai_reviews && Array.isArray(item.ai_reviews)) {
      console.log(`Inserting ${item.ai_reviews.length} reviews for hotel ${item.id}...`);
      for (const rw of item.ai_reviews) {
        // Handle different possible key names from AI output
        const userName = rw.userName || rw.user_name || rw.title || '匿名ゲスト';
        const content = rw.content || rw.body || '';
        const rating = Number(rw.rating || rw.score) || 5;

        if (!content) continue;

        try {
          await prisma.lh_reviews.create({
            data: {
              id: uuidv4(),
              hotel_id: item.id,
              user_name: userName,
              content: content,
              rating: rating,
              is_cast: false, // Default
              is_recommended: rating >= 4,
            },
          });
        } catch (err) {
          console.error(`Failed to insert review for ${item.id}:`, err);
        }
      }
    }
  }

  console.log('Import completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
