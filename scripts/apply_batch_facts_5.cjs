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
  'accab9fe-7636-4e1a-8f83-8607096ef606': {
    // ホテル 貮番館
    amenities:
      '1300タイトルVOD, アプリdeタッチ端末, ウェルカムコーヒー/ティー, 大型ソファ, 駐車場ハイルーフ可',
    reviews:
      '【評判】評価4.6/5。錦糸町から少し離れた穴場で、広い部屋と浴室、大きなベッドが快適と高評価。',
  },
  '17f76169-3183-4631-bc63-99517d7fdda1': {
    // yayaya 弐番館
    amenities: '基本設備完備, 鶯谷駅至近',
    reviews: '【評判】鶯谷エリアの定番。',
  },
  'ee5ea87e-faca-4565-b2cb-30e025c3aa0e': {
    // HOTEL ZHIPAGO
    amenities: 'ReFaシャワーヘッド全室, 花魁コンセプトの内装, 2022年11月オープン, 加湿空気清浄機',
    reviews:
      '【評判】評価4.7/5。清潔感、サービス、設備全てにおいて五反田エリア最高クラスの満足度。非日常空間が人気。',
  },
  '87eaaf3c-23bf-47d1-b11e-41b2231d0f67': {
    // ホテル セリーズ
    amenities: '全室異なる内装, 7台分駐車場(ハイルーフ可), パワフル空調, 個別脱衣所',
    reviews:
      '【評判】低価格で広いお風呂が魅力。対面なしの受付で安心。一部設備に年季を感じるがコスパは良い。',
  },
  '0cd2c7c8-5b68-4827-8811-6928ea692867': {
    // ホテル フランセ
    amenities: '八王子エリア広々ルーム, 大型浴室, 格安自販機完備, 広大駐車場',
    reviews:
      '【評判】評価4.4/5。とにかく安くて広いのが最大の特徴。古い設備もあるが、この価格なら納得の快適さ。',
  },
  'b24c5d9c-5bdd-4a61-ac17-61cd9a0c8195': {
    // HOTEL CHERENA
    amenities: '深めの浴槽, 液晶TV, 24時間ルームサービス, 無料Wi-Fi',
    reviews: '【評判】評価8.0/10。おもてなしが手厚く女子会利用にも適した綺麗なホテル。',
  },
  '9c79c542-c6b7-4d2d-8d08-89a495f19d89': {
    // ホテル ニューぼたん
    amenities:
      'ナノイー加湿空気清浄機, ウォーターサーバー全室, レインボーバス, ジェットバス, 浴室TV(一部)',
    reviews:
      '【評判】評価4/5。部屋の清潔さが際立つ。フリータイム料金が安く、長時間ゆっくり過ごすのに最適。',
  },
  '9a49f438-1f02-4dbd-9c1f-c854930c6ec3': {
    // ニュー大柿
    amenities: '鶯谷駅徒歩2分',
    reviews: '【評判】立地は良いがサービス面での改善を望む声あり。',
  },
  '6f297919-663b-44c1-a787-0f203f4d0aba': {
    // HOTEL GREEN PALACE
    amenities: 'こだわり音響, 3名以上宿泊可, ハイルーフ駐車場対応, 広々客室',
    reviews:
      '【評判】評価4/5。部屋が非常に広く、丁寧な接客が好印象。音響にこだわりたい層にも人気。',
  },
  'e53dbb22-5061-46c4-ae75-aebb634589eb': {
    // HOTEL ALLURE
    amenities: 'パリ風デザイン, 円形レインボージャグジー, 美容器具無料貸出, 女子会プラン',
    reviews:
      '【評判】渋谷円山町のオシャレな隠れ家。大型ジャグジーや充実の美容器具など、女性向けの配慮が随所にある。',
  },
};

updateMultipleHotelFacts(updates);
