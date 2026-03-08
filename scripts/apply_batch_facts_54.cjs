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
  // --- Batch 54: Osaka "Super Premium & Amusement" Facts ---
  '2296c005-950c-4395-8895-32bdc2559427': {
    // ※ID確認が必要: CSV 2296 は Dinosaur
    // 実際には CSV 2296: d99bf37c-e884-4ef1-a1be-919da3e95971 (HOTEL ARTIA DINOSAUR 枚方店)
  },
  'd99bf37c-e884-4ef1-a1be-919da3e95971': {
    // HOTEL ARTIA DINOSAUR 枚方店
    amenities:
      '可動式恐竜(客室内), 恐竜ライド, 屋上露天風呂, アーケードゲーム, ダーツ, カラオケシアター',
    reviews:
      '【評判】枚方。世界初？の恐竜ホテル。動く恐竜や恐竜ライドなど、大人も子供心に帰れる圧倒的アミューズメント性。露天風呂やダーツも完備。',
  },
  'd6fcfe44-6938-4073-897c-24385a9395df': {
    // HOTEL LOTUS 東大阪店
    amenities:
      'プラネタリウム, カラオケステージ, 殿様/花魁ルーム, 貝殻/竹林ベッド, アクアリウム, 庭園',
    reviews:
      '【評判】東大阪。「ネオジャパネスク」がテーマ。プラネタリウムや貝殻ベッドなど、非日常の極み。日本文化を遊び尽くした豪華絢爛な客室。',
  },
  '5afec214-aa29-4f9a-8d0d-e645d9f59e2f': {
    // HOTEL ALPS (難波)
    amenities:
      '50インチ以上TV, 高品質朝食(絶賛), 禁煙フロア(7-11階), ツインルーム, 岩盤浴(一部), 駐車場無料',
    reviews:
      '【評判】難波。楽天やAgodaでも評価爆高の超有名店。朝食の質、接客の丁寧さ、清潔感、全てが最高水準。観光拠点としても完璧な「外さない」一軒。',
  },
  'd267272d-83da-490b-86cf-680f3a91da9c': {
    // HOTEL LOTUS 茨木店
    amenities:
      'アクアリウム, 暖炉, ビールサーバー, 露天風呂, バリ風エステ, 大型車対応駐車場, 禁煙ルーム',
    reviews:
      '【評判】茨木。バリのリゾートを完全再現。アクアリウムや暖炉など、落ち着いた大人の癒やし空間。ビールサーバー完備の部屋は特に至福。',
  },
  '8593d78b-d717-474e-94e6-a375fbbcdc10': {
    // HOTEL Sala del rey 難波店
    amenities:
      'プライベートプール(一部), 岩盤浴/ミストサウナ, レインシャワー, ジェット・バブルバス, 豪華パジャマ',
    reviews:
      '【評判】難波。プール付きの部屋がある超豪華ホテル。清潔感が非常に高く、タオルやローブの質まで拘り抜かれている。贅沢の限りを尽くした空間。',
  },
  '66c105fe-3c33-4521-b1ea-523f77068cc9': {
    // WATER HOTEL CC (道頓堀)
    amenities:
      '1000タイトルVOD, 5.1chサラウンド, 8段階ライト演出, ミストサウナ(一部), 水をテーマにした芸術的空間',
    reviews:
      '【評判】道頓堀。その名の通り「水の楽園」。照明と音響、水のせせらぎが織りなす空間演出は芸術的。デザインホテルアワード受賞も納得のクオリティ。',
  },
  '306ac478-4d41-4578-a8af-0f2e5ade9698': {
    // ホテル ローズリップス 鶴橋店
    amenities:
      'プリンセスルーム, 豊富なヘアケア用品, 豪華ジャグジー, ウェルカムドリンク, 軽朝食無料',
    reviews:
      '【評判】鶴橋。女性人気が圧倒的な薔薇とピンクのプリンセス空間。9.1の高清潔度、揃いすぎたアメニティ、丁寧な接客と、女子の理想が詰まっている。',
  },
  '9e1c3bef-318b-4cd6-be2f-f08ffa5ae1f3': {
    // もしもしピエロ 泉大津新館
    amenities: '露天風呂(401/405), SMルーム, サウナ, マッサージチェア, 1000タイトルVOD',
    reviews:
      '【評判】泉大津。露天風呂付きの部屋やSMルームなど、用途に合わせた選択肢が広い。清潔感が4.5と高く、安心して「非日常」を楽しめる穴場。',
  },
  '715de157-d679-4643-9680-24bad872d98b': {
    // HOTEL MYTH DX 梅田
    amenities:
      'ウェルカムドリンク, ジュースサーバー(ロビー), 全室電動マッサージャー, 清潔感重視のデザイン',
    reviews:
      '【評判】梅田。立地が良いのに低価格で非常に綺麗。豊富なアメニティと無料ドリンクサービスが充実。コスパと質のバランスが絶妙な都会のオアシス。',
  },
  '3168e093-c4e9-4286-961e-aec03d75a4ca': {
    // HOTEL ATLANTIS 東大阪店
    amenities:
      '日本酒/温冷水サーバー(一部), 大画面カラオケ/VOD, 広いジャグジー, 充実のアメニティ, ルームサービス',
    reviews:
      '【評判】東大阪。広々とした部屋に、日本酒サーバーなどのユニークな設備も。アメニティがこれ以上ないほど揃っており、手ぶらで泊まれる快適さ。',
  },
};

updateMultipleHotelFacts(updates);
