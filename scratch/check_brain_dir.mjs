import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/nabe7/.gemini/antigravity/brain/9804d248-35b5-4ea0-a18f-858b26cfd928';
if (fs.existsSync(brainDir)) {
  const files = fs.readdirSync(brainDir);
  console.log('=== BRAIN DIR FILES ===');
  for (const f of files) {
    if (f.startsWith('media')) {
      const full = path.join(brainDir, f);
      const stat = fs.statSync(full);
      console.log(`${f} (${Math.round(stat.size / 1024)} KB, modified: ${stat.mtime.toISOString()})`);
    }
  }
}
