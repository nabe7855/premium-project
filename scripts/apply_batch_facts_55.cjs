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
  // --- Batch 55: Kansai "Resort & Fantasy" Facts ---
  '6a72e8d7-f20f-4a42-83c6-c7f7be28575b': {
    // HOTEL ELDIA 福知山店
    amenities:
      'ビールサーバー, 囲炉裏ルーム(107), プラネタリウム, ウォーターベッド, 吊り下げチェア, マンガルーム',
    reviews:
      '【評判】福知山。ビールサーバーや囲炉裏、プラネタリウムなど、客室ごとの個性が強烈。アミューズメント設備がこれ以上ないほど充実しており、連泊したくなる楽しさ。',
  },
  'b595cf4d-74bc-4e28-8845-b88e0da0bcf8': {
    // SWEETS HOTEL 京都店
    amenities:
      'チョコ風呂, メリーゴーランド(207), 貝殻ベッド, 露天風呂, 100インチプロジェクター, スマートTV',
    reviews:
      '【評判】京都八幡。チョコ風呂やメリーゴーランドなど、甘いファンタジー空間。201号室の露天風呂も人気で、遊び心とSNS映えを両立したユニークな一軒。',
  },
  'f31ef3d0-e9ff-4601-b38b-f3f40ec048ea': {
    // HOTEL SHASHA RESORT (神戸)
    amenities:
      '露天風呂(一部), 岩盤浴/サウナ, 浴室TV, マッサージチェア, 1000タイトルVOD, 8.3/10高評価',
    reviews:
      '【評判】神戸須磨。8.4の清潔度を誇るリゾート空間。露天風呂や岩盤浴などスパ設備が極めて充実しており、フロントの丁寧な対応も相まって満足度が非常に高い。',
  },
  '879c11d3-caff-4347-a898-ee2cfe0c49f9': {
    // FEEL LAKE VIEW (滋賀)
    amenities:
      '琵琶湖ビュー, 24時間無料ドリンクバー(ビール/ワイン等), ウォーターサーバー, 天蓋ベッド, サウナ',
    reviews:
      '【評判】大津。琵琶湖を一望できる絶景が売り。24時間飲み放題のドリンクバーやウォーターサーバー完備など、おもてなしが手厚く、落ち着いた和洋室が好評。',
  },
  'c09ad09e-ef54-417d-8628-a247b08810c4': {
    // HOTEL LOTUS 大津店
    amenities: '琵琶湖ビュー, ビールサーバー, 抹茶セット, 露天風呂/岩盤浴/サウナ, 広い客室',
    reviews:
      '【評判】大津。琵琶湖を眺めながらビールサーバーを楽しめる贅沢。抹茶を点てるセットなど、和の趣も大切にされており、広さと清潔感で高い支持を得ている。',
  },
  '5dc8822b-b517-468a-8d26-8dccd3aed4c7': {
    // HOTEL ZEN 奈良宝来
    amenities: '65インチ以上TV, Airdog空気清浄機, フランスベッド社製, コーマ糸タオル, サウナ(305)',
    reviews:
      '【評判】奈良。見えない部分の質に拘り抜いた隠れ家。高級タオルや空気清浄機、一流ベッドなど、快適な睡眠と滞在への情熱が感じられる、ハイエンドな一軒。',
  },
  'fb7cfa7a-4e5f-43fc-91ef-25dc80c95f4d': {
    // HOTEL AURA RESORT 奈良店
    amenities:
      'アジアンリゾートテーマ, 天蓋ベッド, 浴室TV, プロジェクター, ルームサービス充実, 32室全室異彩',
    reviews:
      '【評判】奈良。32室全てが異なるアジアンデザイン。天蓋ベッドでの非日常体験が人気で、広々とした部屋と充実したアメニティが旅の気分を盛り上げる。',
  },
  'f6e2d7ab-24a2-4f22-81c3-88a7ed7b0312': {
    // HOTEL ELDIA Luxury 神戸店
    amenities:
      'バルコニー, クイーンサイズベッド, 毎日のハウスキーピング, ルームサービス, 無料駐車場',
    reviews:
      '【評判】神戸。スタッフの対応が非常に丁寧で、バルコニー付きの部屋も開放的。毎日清掃が入るなど管理が徹底されており、神戸観光の拠点として信頼が厚い。',
  },
  'e8d3cff2-4aaf-4b59-93c5-95a2acc94d0a': {
    // HOTEL LOTUS Gorgeous Japan 京都店
    amenities: '全室異なるコンセプト, 1000タイトルVOD, 8.0/10評価, 大型液晶TV, デザイナーズ空間',
    reviews:
      '【評判】京都伏見。全部屋が異なるコンセプトで、何度訪れても新しい発見がある。ゴージャスな内装と充実した設備で、京都での特別な夜を演出。',
  },
};

updateMultipleHotelFacts(updates);
