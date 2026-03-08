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
  'e2ae03b0-ce71-47cd-9b6a-6162f42d69f6': {
    // 拾番館 横浜
    amenities:
      '全16室, 駐車場16台(ハイルーフ可), 全室VOD完備, コンビニBOX, ナノウォーター導入, 豊富なアメニティ',
    reviews:
      '【評判】横浜宮川町。リーズナブルながら広い浴室と、季節ごとの無料入浴剤サービスが地味に嬉しいと好評。',
  },
  '2e03e1e3-d1f6-47da-8881-3033add5e8af': {
    // Will Base 鶴見
    amenities:
      'キングサイズベッド全室, 浴室TV完備, 広いバスルーム, 無料朝食(パン・コーヒー), 無料Wi-Fi',
    reviews:
      '【評判】横浜鶴見。評価8.0。とにかくベッドが巨大で寝心地が良い。清潔感があり、朝食サービスも満足度が高い人気店。',
  },
  '15f9c940-41de-41fd-bd00-913fdbf5c702': {
    // 男塾 メイフェア 滋賀
    amenities:
      '露天風呂客室あり, 天蓋ベッド, ReFaドライヤー/アイロン, カラオケ全室, 電子レンジ, 私有地駐車場',
    reviews:
      '【評判】滋賀。圧倒的な「非日常感」。ReFaなどの高級美容家電が揃い、広くて豪華な露天風呂で贅沢な時間を過ごせる。',
  },
  '0ee69a83-c671-444b-a70b-29eb3199cb07': {
    // HOTEL ZEN 港北
    amenities:
      '65インチ↑大型TV, サウンドバー完備, 本格ロウリュサウナ(一部), 水風呂完備, 800タイトルVOD',
    reviews:
      '【評判】横浜都筑。最新デジタル設備と本格サウナが圧巻。ロウリュを楽しめる数少ないホテルとしてサウナーにも人気。',
  },
  '85c8c011-5212-48b6-a95a-657b654e2312': {
    // HOTEL C. 港北
    amenities:
      '全館ナノウォーター導入, 美肌効果バス, 60インチ↑TV, 無料ドリンクバー(ロビー), 24hルームサービス',
    reviews:
      '【評判】横浜都筑。お肌がツルツルになるナノウォーターと、巨大画面の迫力が人気。アメニティも横浜屈指の充実度。',
  },
  '44e67a22-4675-4b71-acb4-016a37818746': {
    // HOTEL HEAVEN 鶴見
    amenities:
      'バリリゾート風内装, 全室ジェットバス, 無料レンタルシャンプー豊富, 駐車場完備, 出前対応',
    reviews:
      '【評判】横浜鶴見。アットホームな接客と、バリのリゾートを思わせる癒やしの空間が特徴。お菓子のサービスも好評。',
  },
  'd7f3adca-eaf7-4b6c-bddc-f36b1f960841': {
    // HOTEL ALLY 港北
    amenities: '広々とした清潔な室内, 強いシャワー水圧, 駐車場25台(ハイルーフ可), 全室無料Wi-Fi',
    reviews:
      '【評判】横浜都筑。無駄のない広々とした設計で、特に水回りの綺麗さとシャワーの勢いが「使いやすい」と評判。',
  },
  '152d2998-2021-4f66-9a07-ef4bb561e535': {
    // ホテルNaNa 和歌山
    amenities:
      '全室カラオケ&浴室TV完備, 露天風呂(一部), スチームサウナ(一部), マッサージチェア, 除菌徹底清掃',
    reviews:
      '【評判】和歌山。紀の川を一望できる好立地。設備水準がエリア隨一で、清潔感と充実の娯楽設備で安定した人気。',
  },
};

updateMultipleHotelFacts(updates);
