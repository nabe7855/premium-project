import fs from 'fs';
import path from 'path';

const rawPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/data/raw_hotel_data/hotels_raw_data.json';
const accessPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/data/raw_hotel_data/hotels_access_info.json';
const processedPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/data/processed_hotel_data/hotels_processed_data.json';
const outputPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/data/integrated_hotel_data.json';

try {
  console.log('Reading files...');
  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const accessData = JSON.parse(fs.readFileSync(accessPath, 'utf8'));
  const processedData = JSON.parse(fs.readFileSync(processedPath, 'utf8'));

  console.log('Integrating data...');
  const integratedData = {};

  // We use processedData as the base because it usually has the most recent/enriched info.
  // Then we merge in the access data which is unique.
  
  // All hotel IDs across files should be consistent.
  const allIds = new Set([
    ...Object.keys(rawData),
    ...Object.keys(accessData),
    ...Object.keys(processedData)
  ]);

  for (const id of allIds) {
    const rawEntry = rawData[id] || {};
    const accessEntry = accessData[id] || {};
    const processedEntry = processedData[id] || {};

    // Combine them. Processed takes priority for common fields like description/reviews.
    integratedData[id] = {
      ...rawEntry,
      ...processedEntry,
      ...accessEntry
    };
  }

  console.log(`Writing integrated data to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(integratedData, null, 2), 'utf8');
  console.log('Success!');
} catch (error) {
  console.error('Error during integration:', error);
  process.exit(1);
}
