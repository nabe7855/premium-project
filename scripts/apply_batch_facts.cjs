const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  // CSV parsing that handles quotes
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
        parts[5] = updates[id].amenities;
        parts[6] = updates[id].reviews;
      }

      return parts.map(formatCsvField).join(',');
    })
    .filter((l) => l.length > 0);

  fs.writeFileSync(csvPath, [header, ...updatedLines].join('\n'), 'utf8');
  console.log(`✅ ${Object.keys(updates).length}件のデータをCSVに書き込みました！`);
}

const updates = {
  '0ba2438e-0129-4265-844f-de971a04c3d1': {
    // HOTEL SUIEN
    amenities:
      '全室同一料金, DVDデッキ, 電気ポット, 有線放送, 和室あり, ヘアアイロン, クルクルドライヤー, シャンプー複数, 無料Wi-Fi, シャワートイレ, マッサージ器',
    reviews:
      '【評判】女性に大人気の豪華な内装でとても綺麗でくつろげる。地域で一番新しく綺麗なホテル。誰にも会わずに済むワンガレージタイプ。料金が均一で分かりやすい。(4.11点/5点)',
  },
  'a620720e-ac8e-4463-b0f0-4fad33ffb1b8': {
    // HOTEL CORE
    amenities: '全室VOD見放題, 露天風呂(401号室), カラオケ(401号室), 渋谷から好アクセス',
    reviews:
      '【評判】口コミスコア4.3点(5点満点)。渋谷の円山町エリアで駅からも近く、露天風呂付きの部屋が人気。',
  },
  'a9ee7186-ea2f-4492-bf08-b0a85ba9220b': {
    // HOTEL MORE
    amenities:
      '駐車場割引あり, ウェルカムサービス, 宿泊時ビールサービス, 高濃度炭酸泉, POLAエステロワイエ, ヒーテネージシャンプー',
    reviews:
      '【評判】口コミスコア4.64点。スタイリッシュで清潔感があり寛げるホテル。コスパが良い。部屋が広くアメニティが豊富で満足度が高い。',
  },
  'b1e402e8-4985-4c23-8403-9441658e7488': {
    // ホテル モンタナ
    amenities:
      '窓の開閉可能, 喫煙可, 荷物預かり機能, 無料Wi-Fi, こだわりの寝具(フカフカの枕や温かい毛布)',
    reviews:
      '【評判】評点8.0/10点。従来のファッションホテルとは違うシンプルでモダンな大人空間。接客サービスが良く、快適に過ごせるコスパ抜群のホテル。',
  },
  'b119f702-5493-4266-98e1-9dc700fb2213': {
    // ハートランドイモン
    amenities:
      '無料Wi-Fi, 無料駐車場, 24時間フロント, 朝食サービス, ランドリー, エレベーター完備, 各種アメニティ',
    reviews:
      '【評判】小岩エリアにあるリーズナブルで実用的なカップルズホテル。連泊や拠点にするのにも便利。',
  },
};

updateMultipleHotelFacts(updates);
