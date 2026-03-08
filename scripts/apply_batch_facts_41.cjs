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
  // --- Batch 41: Kanagawa, Miyagi, & Gifu Precision ---
  'c91f2524-51e0-4d5f-9fc7-8973707211d8': {
    // ARIA横浜関内
    amenities:
      '露天風呂(一部), サウナ(一部), 全室VOD/Wi-Fi, マルチ携帯充電器, 紅茶/コーヒー全室サービス',
    reviews:
      '【評判】横浜関内。関内駅徒歩圏内の好立地。一部の客室に備えられた露天風呂やサウナが人気で、清潔感溢れる空間と細やかな備品サービスが好評。',
  },
  '923bc555-5237-4ad7-8976-ebf226a51add': {
    // ホテル リスタ (石巻)
    amenities:
      '浴室TV全室, スケベイス/ラブマット完備, Chromecast, 業務用ぶるぶるマシン(一部), スロットマシン',
    reviews:
      '【評判】石巻。全室浴室TV完備に加え、業務用マシンや特殊設備が充実した遊び心満載の店。アメニティも異様に豊富で、退屈しない滞在ができる。',
  },
  '47ba53a6-a159-4d1d-b820-539d87305df7': {
    // Le’PALIO (仙台)
    amenities:
      '全室ミストサウナ&ジェットバス, 通信カラオケ(LIVEDAM), デザイン洗面台, 有線放送440ch',
    reviews:
      '【評判】仙台。全ての部屋にミストサウナとジェットバスを標準装備した「スパ特化」ホテル。洗練されたデザイン洗面台など、内装のセンスも光る。',
  },
  'be48e359-db2d-4d81-b567-6215bf27d14e': {
    // キャロルリゾート (大崎)
    amenities:
      'ヴィラタイプ客室, 露天風呂(一部), 65型巨大TV(一部), 180cm幅ワイドベッド, ナノケア全室',
    reviews:
      '【評判】大崎。ヴィラタイプの離れや露天風呂、65型TVなど、エリア最高級の贅沢設備が揃う。180cm幅の巨大ベッドで味わう開放感は格別。',
  },
  '318499af-410f-4074-9f48-913d818dc889': {
    // H GALLERY HOTEL (仙台)
    amenities:
      'マイクロバブルバス(一部), 美人の湯(ナノ水), 5.1chサラウンド, ウォーターサーバー全室, SM設備(一部)',
    reviews:
      '【評判】仙台。ナノ水「美人の湯」やマイクロバブルなど美容に強い。5.1chサラウンドや一部のSMルームなど、多種多様なニーズに応える実力店。',
  },
  '52b5be7d-912a-463c-ad92-9bdb0f28faae': {
    // ホテル わたしの部屋 (名取)
    amenities:
      'nanoe搭載加湿空気清浄機, スロットマシン, ジェットバス, ブルーレイプレイヤー, 有線放送',
    reviews:
      '【評判】名取。全室に最新のナノイー空気清浄機を導入した清潔空間。スロットマシンなどの遊び要素もあり、リラックスと楽しみを両立させている。',
  },
  'ba3abbcb-646a-4d68-be0d-c5ad6011bba7': {
    // シルビア5150 (仙台)
    amenities: '浴室TV, 全室ブルーレイ, ハンドマッサージャー, 豊富なアメニティ, 和室(一部)',
    reviews:
      '【評判】仙台。お風呂でTVを楽しめるリラックス仕様。ブルーレイ全室完備やアメニティの充実度が高く、盛岡・仙台観光の拠点として非常に優秀。',
  },
  '99a2c3d8-1085-4d3c-923d-a36601ea96c4': {
    // ハイビスカス (川口)
    amenities:
      '24種セレクトシャンプー, 5.1chサラウンド, 岩盤浴(一部), スチームサウナ(一部), 美容家電レンタル',
    reviews:
      '【評判】川口。24種類のシャンプーバーと本格的な美容家電レンタルが女子に大人気。一部客室の岩盤浴やサウナ、5.1chサラウンドも満足度が高い。',
  },
  '249e9437-ad07-4a1e-92d6-932a8ac4e3a1': {
    // ヴィラジュリア・ナガラ (岐阜)
    amenities:
      'SMルーム/特殊設備(一部), 乗馬マシン, マイクロバブルバス(一部), マイナスイオンドライヤー, 全室Wi-Fi',
    reviews:
      '【評判】岐阜。本格的なSM設備や乗馬マシンなど、ユニークな機材が揃う。マイクロバブルバスでの癒やしもあり、刺激とリラックスが同居する個性派。',
  },
  'c4ef7456-7544-4a73-9475-ee1981db81e0': {
    // ファリーナドルチェ (鹿沼/再掲・強化)
    amenities: '客室精算機完備, YouTube視聴可, ストレートアイロン, ナノケアドライヤー, 広い浴室',
    reviews:
      '【評判】鹿沼。誰にも会わず精算できるシステムと、最新のYouTube対応TVが快適。ナノケア家電など女性への配慮が行き届いた清潔な室内が好評。',
  },
};

updateMultipleHotelFacts(updates);
