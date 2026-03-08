const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const parseCsvLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const formatCsvField = (field) => {
    if (!field) return '""';
    return `"${field.replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = parseCsvLine(line);
      const id = parts[0];

      if (updates[id]) {
        parts[5] = updates[id].amenities || parts[5];
        parts[6] = updates[id].reviews || parts[6];
      }

      return parts.map(formatCsvField).join(',');
    })
    .filter((l) => l.length > 0);

  fs.writeFileSync(csvPath, [header, ...updatedLines].join('\n'), 'utf8');
  console.log(`✅ ${Object.keys(updates).length}件のデータを追加・更新しました。`);
}

const updates = {
  '9277003e-376a-4f47-bc8c-ed300fc644e3': {
    // ホテル プラージュ
    amenities:
      'VOD(1000タイトル以上), 電子レンジ, 持込用冷蔵庫, 無料Wi-Fi, 防音ルーム, 一部サウナあり, 24時間フロント',
    reviews:
      '【評判】費用対効果が高い。外観は古いが、お風呂と部屋は広くて快適。接客も良いとの声。一部で電波が弱い指摘あり。',
  },
  '0bd153f3-01f4-4d6e-9617-e54b1545fd38': {
    // ホテル AI (Anytime Inn)
    amenities:
      'SMルームあり, 多彩な部屋タイプ, ブランドアメニティ無料貸出, 無料コスチューム(会員制)',
    reviews: '【評判】評価2.5/5。大和高田エリアでSMルーム等の特殊な設備があるのが特徴。',
  },
  '63c1c99a-1758-4e90-a243-ed3f011ea07c': {
    // Hotel Sun (ホテル サン)
    amenities:
      '和室あり(人気), 全室ネット動画配信, 大型TV(一部42インチ以上), ゲーム貸出, コスプレ貸出, 空気清浄機',
    reviews:
      '【評判】歌舞伎町エリア。1人〜3名利用、男性同士・女性同士も可。和室が人気でサービスが多様。',
  },
};

updateMultipleHotelFacts(updates);
