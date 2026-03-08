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
  // --- Batch 61: Nationwide "Premium & Entertainment" Facts ---
  '8e7f5ccb-c7b6-416e-941a-4a13adc2a21e': {
    // HOTEL SHASHA tiara (大阪阿倍野)
    amenities:
      '46型以上3D大画面TV, マイクロバブルバス/ブロアーバス, 浴室TV, マッサージチェア(一部)',
    reviews:
      '【評判】大阪阿倍野。全室に大画面3Dテレビと高性能なお風呂を完備。100円で楽しめる本格的な食事やスイーツが「コスパ最強」と大人気。',
  },
  'd6f939b7-dca5-4101-8e4c-46f00cdca230': {
    // HOTEL PALM GATE (福岡那の津)
    amenities: 'オーシャンビューベランダ, 本格岩盤浴, 70インチ液晶TV, ジャグジー付き大型バスタブ',
    reviews:
      '【評判】福岡。バリ風のリゾート空間から博多湾を一望。浴室内に岩盤浴や大型テレビを備えた部屋もあり、非日常を味わえる最高級リゾート。',
  },
  'd1a545e3-b742-40b3-a057-24f95660e75d': {
    // HOTEL GRASSINO URBAN RESORT (栃木宇都宮)
    amenities: '本格ドライサウナ/スチームサウナ, 露天風呂, 岩盤浴, 高級マッサージチェア',
    reviews:
      '【評判】宇都宮。エリア屈指の最新設備を誇るラグジュアリー店。特に本格的なサウナと露天風呂のクオリティが、サウナーからも高く評価されている。',
  },
  '7496fa68-42a1-4c5b-993b-f9a985a8557d': {
    // ホテルバリアンリゾート千葉中央店
    amenities: 'ビリヤード/ダーツ, 濡れない足湯, 本格カラオケ/卓球, 岩盤浴/露天風呂(一部)',
    reviews:
      '【評判】千葉中央。無料で遊べる娯楽施設がとにかく豊富。アメニティバイキングや朝食サービスも手厚く、「1日中遊べる」体験型ホテルの代表格。',
  },
  'e99a1820-7c0c-419f-9abb-aec5f5924096': {
    // HOTEL PAL (山口岩国)
    amenities: '全室ジャグジー完備, 本格サウナ(一部), マッサージチェア, SMルーム(一部)',
    reviews:
      '【評判】岩国。錦帯橋近くの好立地。全室ジャグジー完備で、豊富なレンタル品やおもてなしが好評。多様なコンセプトの部屋があり、誰でも楽しめる。',
  },
  '4f71104d-7380-4571-856d-ee5c66842ab7': {
    // HOTEL MYTH KOUCHI (高知)
    amenities: '2WAYヘアアイロン, 空気脱臭器, マイナスイオンドライヤー, 浴室TV, 禁煙ルーム',
    reviews:
      '【評判】高知。清潔感のある広々とした客室が特徴。女性に嬉しい2WAYヘアアイロンなどの美容家電が充実しており、出張や観光の拠点としても優秀。',
  },
  'ad8df3fa-6196-483a-9773-b796031a11e6': {
    // HOTEL LITZ 広島店
    amenities: 'リゾート風インテリア, 大型VODシステム, 最新美容家電, ウェルカムスイーツ',
    reviews:
      '【評判】広島。比治山エリアで高い満足度を誇るリゾート空間。清潔感とお風呂の広さが特に評価されており、丁寧な接客も含め安定した人気を誇る。',
  },
  'ddc7a08f-68cf-4618-a3b1-561bd7fb2327': {
    // HOTEL amana (千葉)
    amenities: 'バルコニー付き客室, 貸切露天風呂(系列店利用可), ジャグジー, 豪華食材ルームサービス',
    reviews:
      '【評判】千葉睦沢。バルコニーやジャグジーからの絶景が自慢。冷蔵庫内の無料食材や系列店の貸切温泉など、至れり尽くせりの高級おもてなしが話題。',
  },
  'a0b67e8e-e089-438f-bacc-900072304387': {
    // HOTEL VINO (広島福山)
    amenities:
      'プライベートロウリュサウナ(一部), ホリスティックキュアドライヤー, 露天風呂, 水中照明ジェットバス',
    reviews:
      '【評判】福山。全室に最新のホリスティックキュアドライヤーを設置。本格的なロウリュサウナや露天風呂を独り占めできる、贅沢を極めた大人の隠れ家。',
  },
  '9a1ca589-d847-4258-8ef7-f880dce3aa37': {
    // HOTEL CINDERELLA PALACE (福岡博多)
    amenities: 'ムービングラブソファ, モーニング無料, セレクトシャンプーバイキング, 浴室TV',
    reviews:
      '【評判】博多。リーズナブルながら清潔感が高く、女性専用アメニティも豊富。一部の部屋にある「ムービングラブソファ」など、遊び心のある設備も人気。',
  },
};

updateMultipleHotelFacts(updates);
