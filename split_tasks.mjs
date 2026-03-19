import fs from 'fs';
import path from 'path';

const inputPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/data/integrated_hotel_data.json';
const outputDir = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/rewrite_tasks';

try {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  } else {
    // 既存のファイルがある場合は一旦クリアするか、上書きする運用にします。
    // 今回はディレクトリの中身を確認せず、直接上書き保存します。
  }

  console.log('統合データを読み込んでいます...');
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const keys = Object.keys(data);
  const totalItems = keys.length;
  const numParts = 75;
  const chunkSize = Math.ceil(totalItems / numParts);

  console.log(`全 ${totalItems} 件を ${numParts} 分割（1ファイル最大約 ${chunkSize} 件）で出力します。`);

  for (let i = 0; i < numParts; i++) {
    const partKeys = keys.slice(i * chunkSize, (i + 1) * chunkSize);
    if (partKeys.length === 0) break;

    const partData = {};
    partKeys.forEach(key => {
      partData[key] = data[key];
    });

    const fileName = `hotel_data_part_${i + 1}.json`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(partData, null, 2), 'utf8');
  }

  console.log('分割作業が完了しました。');
} catch (error) {
  console.error('エラーが発生しました:', error);
  process.exit(1);
}
