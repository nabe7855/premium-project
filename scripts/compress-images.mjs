import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// 1. バックアップ先の作成とコピー関数
const PUBLIC_DIR = path.resolve('public');
const BACKUP_DIR = path.resolve('.backup_public_images');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  console.log('📦 1. public ディレクトリの完全バックアップを開始します...');
  await copyDir(PUBLIC_DIR, BACKUP_DIR);
  console.log(`✅ バックアップ完了: ${BACKUP_DIR}\n`);

  console.log('🔍 2. 圧縮対象画像の調査と圧縮処理を開始します...');

  async function getAllFiles(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const item of list) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        results = results.concat(await getAllFiles(fullPath));
      } else {
        const ext = path.extname(item.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  const allImages = await getAllFiles(PUBLIC_DIR);
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  for (const file of allImages) {
    try {
      const relativePath = path.relative(PUBLIC_DIR, file);
      const stat = await fs.stat(file);
      const beforeSizeMB = stat.size / (1024 * 1024);
      totalBeforeBytes += stat.size;

      // 500KB 以上の画像、あるいは favicon.png を優先的に圧縮・リサイズ
      const isFavicon = path.basename(file).toLowerCase() === 'favicon.png';

      if (stat.size > 300 * 1024 || isFavicon) {
        const buf = await fs.readFile(file);
        const meta = await sharp(buf).metadata();
        const ext = path.extname(file).toLowerCase();

        let pipeline = sharp(buf);

        if (isFavicon) {
          // favicon.png は 48x48 に縮小
          pipeline = pipeline.resize(48, 48, { fit: 'contain' });
        } else {
          // 一般画像は最大幅 1600px にリサイズ（拡大はしない）
          const MAX_WIDTH = 1600;
          if (meta.width && meta.width > MAX_WIDTH) {
            pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
          }
        }

        let out;
        if (ext === '.png') {
          // PNG最適化: 画質を損なわない設定（quality: 90）
          out = await pipeline.png({ compressionLevel: 9, quality: 90, palette: false }).toBuffer();
        } else if (ext === '.jpg' || ext === '.jpeg') {
          out = await pipeline.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
        } else if (ext === '.webp') {
          out = await pipeline.webp({ quality: 85 }).toBuffer();
        }

        if (out && out.length < stat.size) {
          await fs.writeFile(file, out);
          const afterSizeKB = out.length / 1024;
          totalAfterBytes += out.length;
          console.log(`✨ [圧縮成功] ${relativePath}`);
          console.log(`   Before: ${beforeSizeMB.toFixed(2)} MB  -->  After: ${afterSizeKB.toFixed(1)} KB`);
        } else {
          totalAfterBytes += stat.size;
          console.log(`ℹ️ [スキップ（現状が最善）] ${relativePath} (${(stat.size / 1024).toFixed(1)} KB)`);
        }
      } else {
        totalAfterBytes += stat.size;
      }
    } catch (err) {
      console.error(`⚠️ 処理失敗: ${file}`, err.message);
    }
  }

  console.log('\n==================================================');
  console.log(`📊 圧縮結果サマリー:`);
  console.log(`    Before : ${(totalBeforeBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`    After  : ${(totalAfterBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`    削減量 : ${((totalBeforeBytes - totalAfterBytes) / (1024 * 1024)).toFixed(2)} MB (${((1 - totalAfterBytes / totalBeforeBytes) * 100).toFixed(1)}% 削減)`);
  console.log('==================================================\n');
}

run();
