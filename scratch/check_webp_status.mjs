import fs from 'fs';
import path from 'path';

const dir = 'public/images/amolab/aya';
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  console.log('=== FILES IN public/images/amolab/aya ===');
  for (const f of files) {
    const ext = path.extname(f);
    const stat = fs.statSync(path.join(dir, f));
    console.log(`${f} -> Extension: ${ext} (${Math.round(stat.size / 1024)} KB)`);
  }
} else {
  console.log('Directory not found:', dir);
}
