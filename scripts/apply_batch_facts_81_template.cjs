const fs = require('fs');
const path = require('path');

// 既存の hotels_enriched_data.csv の読み込み
const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
const rawDataDir = path.join(process.cwd(), 'data', 'raw_hotel_data');
if (!fs.existsSync(rawDataDir)) {
  fs.mkdirSync(rawDataDir);
}
const rawDataPath = path.join(rawDataDir, 'hotels_raw_data.json');

// 既存のJSONデータがあれば読み込む
let rawData = {};
if (fs.existsSync(rawDataPath)) {
  rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
}

// hotels_enriched_data.csv 更新用の関数
function updateCsvData(updates) {
  if (!fs.existsSync(csvPath)) return;
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const robustParseCsvLine = (line) => {
    const parts = [];
    let part = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          part += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          part += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }
    }
    parts.push(part);
    return parts;
  };

  const formatCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    return `"${String(field).replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = robustParseCsvLine(line);
      const id = parts[0];

      if (updates[id]) {
        // CSV側には、端的な設備キーワードと「JSONに保存したよ」という目印だけを入れておく
        parts[5] = updates[id].amenities || parts[5];
        parts[6] = '【ローデータ取得済】(RAW JSONを参照)';
      }
      return parts.map(formatCsvField).join(',');
    })
    .filter((l) => l.length > 0);

  fs.writeFileSync(csvPath, [header, ...updatedLines].join('\n'), 'utf8');
  console.log(`✅ CSV側の更新完了`);
}

// JSONへ生の口コミや詳細説明を保存する関数
function appendRawData(updates) {
  Object.keys(updates).forEach((id) => {
    rawData[id] = {
      hotel_name: updates[id].hotel_name,
      prefecture: updates[id].prefecture,
      amenities: updates[id].amenities, // 設備キーワード
      raw_reviews: updates[id].raw_reviews, // 生の口コミ配列
      raw_description: updates[id].raw_description, // サイト等にあった紹介文・説明
      last_updated: new Date().toISOString(),
    };
  });
  fs.writeFileSync(rawDataPath, JSON.stringify(rawData, null, 2), 'utf8');
  console.log(`✅ ${Object.keys(updates).length}件のRAWデータをJSONに保存しました。`);
}

// 今回のバッチ（以降は生の全データをここに詰め込む）
const updates = {
  // 例：新しいデータ抽出フォーマット
  // 'hotel-uuid-here': {
  //     hotel_name: 'ホテル〇〇',
  //     prefecture: '新潟',
  //     amenities: '○○, △△',
  //     raw_reviews: [
  //         'ここには生の口コミの1件目が入ります。',
  //         '2件目の口コミテキストがそのまま長文で入ります。'
  //     ],
  //     raw_description: 'ホテルの公式や情報サイトに書かれていたアピールポイントなどをそのまま保持します。'
  // }
};

// 一旦スクリプトのフレームだけ作成し、次のバッチ（Batch 81）から利用します
console.log('Rawデータ蓄積用のスクリプト準備完了');
export {};
