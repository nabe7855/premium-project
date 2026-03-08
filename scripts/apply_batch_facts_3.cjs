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
  '1182ee67-f713-4079-9b02-f73af8ad914f': {
    // HOTEL COAST HIKE BEACH
    amenities:
      '太平洋一望, レインボーバス, ジェットバス, ブローバス, 100品以上の飲食メニュー, レンタル品200種以上, ウェルカムドリンク',
    reviews:
      '【評判】評価4.3/5。部屋が広くて落ち着ける。九十九里浜へのアクセスが良くサーフィン客にも人気。',
  },
  '0c0964db-7afb-4687-a69a-2ae99c9225cb': {
    // HOTEL FRANCE
    amenities:
      '動く電車型ベッド, ディズニー風の内装, サウナ, マッサージチェア, VOD, カラオケ, 浴室TV, アクアクララ',
    reviews:
      '【評判】評価4.3/5。清潔でラブホ感がない。一部サービスが有料で非会員には割高感があるが、全体的に快適。',
  },
  'ee8d4bb7-61ee-49e0-8732-cbd20a0f442a': {
    // HOTEL CORE池袋
    amenities: '池袋駅徒歩5分, 34室の客室, 全室完備のアメニティ',
    reviews: '【評判】立地が非常に良く、池袋駅周辺での利用に便利。Trip.com等で詳細な口コミあり。',
  },
  '40ebc4c1-d8c5-4d69-8688-0de0b32a0625': {
    // 男塾ホテルグループ 暴れ狸の鬼袋
    amenities: '全室50インチ大型TV, 24時間フロント, 無料駐車場完備, ルームサービス, 無料Wi-Fi',
    reviews:
      '【評判】姫路駅近くで駐車場が先行利用できるのが便利。部屋には満足だが一部清掃(トイレ等)に指摘あり。',
  },
  '7dfaa069-3902-4431-ba29-503f8b71a538': {
    // HOTEL PASEOⅡ
    amenities: '東中野駅から徒歩1-2分, 駐車場あり(2台), 20室の客室',
    reviews: '【評判】中野・東中野エリアで駅からのアクセスが抜群に良い。',
  },
};

updateMultipleHotelFacts(updates);
