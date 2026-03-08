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
  '9c06bc33-7cca-49a9-930a-8578eb1e1161': {
    // 所沢 K-VILLAGE
    amenities:
      '無料Wi-Fi, iPodドッキングステーション, 電気ケトル, ルームサービス(朝食提供), 駐車場完備',
    reviews:
      '【評判】所沢。清潔感と広さが特に高く評価されており、リピーターが多い。iPodドックなどの細かな設備も充実しており、快適な滞在が可能。',
  },
  '8c4ccb31-012b-4f53-92d8-cb2520bcd2cc': {
    // 横浜 HEAVEN 鶴見
    amenities: '天蓋ベッド, 水中照明, ジェットバス, シャンプーバー, 均一料金フリータイム',
    reviews:
      '【評判】鶴見。住宅街に佇む隠れ家。天蓋ベッドや水中照明でムード満点。シャンプーバーなどのアメニティも豊富で、均一料金プランが非常にお得。',
  },
  'ec3960b1-460e-40b2-b80c-884f6187a317': {
    // WILL RESORT 鎌倉
    amenities: '全室Wi-Fi完備, VOD全室導入, 大型駐車場(35台), 清潔感重視の設計',
    reviews:
      '【評判】鎌倉。観光の拠点としても利用客が多く、安定した清潔感とサービスで支持されている。全室VOD完備で、室内でのリラックスタイムも充実。',
  },
  '1d75e6a4-6005-4a47-a9fb-b949f1e380ad': {
    // 境港 イタリアンパセリ
    amenities: '露天風呂(101号室等), 無料朝食/デザート, 高コスパプラン, 靜かな環境',
    reviews:
      '【評判】境港。特に露天風呂付きの部屋が綺麗で満足度が高い。無料の朝食やデザートサービスが好評で、価格以上に得した気分になれる有名店。',
  },
  '1e06f203-9741-4d37-af6a-7db1b6e7bfe2': {
    // 姫路 アナージェ
    amenities:
      'ウォーターサーバー, プロジェクター, 天蓋ベッド, 露天風呂/岩盤浴(一部), ミストサウナ, TVゲーム',
    reviews:
      '【評判】姫路。姫路駅近で最高峰の設備。プロジェクターや天蓋ベッドに加え、岩盤浴やサウナまで揃う「遊べるホテル」としてリピーター絶賛。',
  },
  '94e6529d-f759-4ee9-9443-e731b59f20ab': {
    // 郡山 sola CUBE
    amenities:
      'シアタールーム, 岩盤浴, 露天風呂, ミストサウナ, ウォーターサーバー, マッサージチェア',
    reviews:
      '【評判】郡山。デザイン性の高さと充実したリラクゼーション設備が特徴。露天風呂や岩盤浴を独り占めできる贅沢さが、カップルに絶大な人気。',
  },
  'd5d2ec3a-dfe4-46b9-992b-440b312a0d73': {
    // 郡山 Terra CUBE
    amenities: '最新VOD, 浴室テレビ, 特大画面TV, シアター設備, 清潔感抜群の内装',
    reviews:
      '【評判】郡山。sola CUBEの姉妹店で、より洗練された空間。特大画面TVでのVOD鑑賞が最高に快適で、お風呂の広さもエリアトップクラス。',
  },
  'cc8b7f99-03eb-4293-978c-f193da3ea0a5': {
    // 横浜 ZEN RIKYU 横浜町田
    amenities: '全室60インチTV, コンチネンタル朝食無料, スパバス, 禁煙ルーム, 家族利用可',
    reviews:
      '【評判】横浜旭。60インチの巨大TVと徹底した清潔感が自慢。家族利用も歓迎の健全な雰囲気で、朝食サービスの質も高いとBooking.com等で高評価。',
  },
  '49e183e1-5471-4ff2-b883-3f42582b47af': {
    // 大阪 ZEN 平野
    amenities: '高濃度炭酸泉(一部), 大画面テレビ, 無料朝食, おしゃれなデザイナーズ内装, 駐車場完備',
    reviews:
      '【評判】平野。高濃度炭酸泉で体が温まると好評。最新のVOD設備と広々とした浴室、無料の朝食など一歩進んだサービスが心地よい。',
  },
  '88096db2-85ea-41a2-a97b-132aee245609': {
    // 大玉村 MAJESTY Resort
    amenities: '65インチ大型TV(一部), ジェット/ブロアバス, サウナ, マッサージチェア, カラオケ',
    reviews:
      '【評判】大玉。リゾート気分を満喫できる豪華な設備が魅力。65インチの大型TVやサウナ、マッサージチェア完備で、至福の休息を過ごせる。',
  },
};

updateMultipleHotelFacts(updates);
