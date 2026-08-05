import fs from 'fs';
import path from 'path';

const tempDir = 'C:/Users/nabe7/.gemini/antigravity/brain/9804d248-35b5-4ea0-a18f-858b26cfd928/.tempmediaStorage';
if (fs.existsSync(tempDir)) {
  const files = fs.readdirSync(tempDir);
  console.log('=== TEMP MEDIA STORAGE FILES ===');
  for (const f of files) {
    const full = path.join(tempDir, f);
    const stat = fs.statSync(full);
    console.log(`${f} (${Math.round(stat.size / 1024)} KB, modified: ${stat.mtime.toISOString()})`);
  }
} else {
  console.log('Temp media dir not found');
}
