import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');

async function run() {
  console.log('🔍 2段階目: palette: true による更なるPNG高効率最適化を開始します...');

  async function getAllFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(await getAllFiles(fullPath));
      } else {
        const ext = path.extname(item.name).toLowerCase();
        if (['.png'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  const pngFiles = await getAllFiles(PUBLIC_DIR);
  let totalSavedKB = 0;

  for (const file of pngFiles) {
    try {
      const relativePath = path.relative(PUBLIC_DIR, file);
      const stat = await fs.stat(file);
      if (stat.size > 200 * 1024) { // 200KB以上のPNG
        const buf = await fs.readFile(file);
        const meta = await sharp(buf).metadata();
        const MAX_WIDTH = 1600;

        let pipeline = sharp(buf);
        if (meta.width && meta.width > MAX_WIDTH) {
          pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
        }

        // palette: true でインデックスカラー化し劇的軽量化
        const out = await pipeline.png({ compressionLevel: 9, palette: true, quality: 85 }).toBuffer();

        if (out.length < stat.size) {
          const savedKB = (stat.size - out.length) / 1024;
          totalSavedKB += savedKB;
          await fs.writeFile(file, out);
          console.log(`✨ [追加圧縮成功] ${relativePath}`);
          console.log(`   ${(stat.size / 1024).toFixed(1)} KB  -->  ${(out.length / 1024).toFixed(1)} KB (削減: ${savedKB.toFixed(1)} KB)`);
        }
      }
    } catch (err) {
      console.error(`⚠️ 失敗: ${file}`, err.message);
    }
  }

  console.log(`\n🎉 2段階目完了: 追加で ${(totalSavedKB / 1024).toFixed(2)} MB 削減しました！`);
}

run();
