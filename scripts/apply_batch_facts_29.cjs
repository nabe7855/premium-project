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
  'ce1b6450-181b-441b-b3c4-b3f9c14f3705': {
    // SARA 八潮南インター
    amenities:
      '65インチ大型TV(一部), マッサージチェア(一部), サロニア製美容家電(全室), レインボーベッドパネル, 無料朝食',
    reviews:
      '【評判】八潮。SARAグループらしい充実の無料サービスと最新設備が魅力。サロニア製品が全室完備されており、手ぶらで最高のデトックス体験ができる。',
  },
  '20f8ea71-a310-4443-ae3f-9698b160c532': {
    // HOTEL ELDIA 行田
    amenities:
      'モダン和風露天風呂(一部), レインアロマバス, 清潔感あふれる内装, フロント対応定評, 広い駐車場',
    reviews:
      '【評判】行田。エリアトップクラスの清潔さと、和を基調とした落ち着いた空間が人気。アロマ香るバスタイムが、日常の疲れを優しく癒やしてくれる。',
  },
  '552d95f1-b254-4b41-a0fd-e85e8923306f': {
    // WATER HOTEL S 国立
    amenities:
      '全室水中照明ジェットバス, 露天風呂スイート, スチームサウナ, 浴室22インチTV, シャンプーバー',
    reviews:
      '【評判】国立。ラグジュアリーの極致。水中照明にきらめくジェットバスと、専用の露天風呂テラスで、二人だけの極上リゾート気分に浸れる。',
  },
  'b8167e6d-575a-4816-a62e-371e8bb28042': {
    // HOTEL BAMBOO GARDEN 錦糸町
    amenities:
      '2020全面改装, 無料ドリンク冷蔵庫, フルーツサービス, レインバス, 65インチ大型TV, マッサージチェア',
    reviews:
      '【評判】錦糸町。2020年のリニューアルでさらに洗練された都会のオアシス。バスタオルの多さや無料ドリンクなど、細やかなおもてなしに感動する声多数。',
  },
  '9bc23557-cc34-479f-ad88-91fb78cb0b22': {
    // HOTEL LOTUS 池袋
    amenities:
      '室内ビールサーバー(全室), カラオケルーム, 貸切露天風呂(屋上), 金魚水槽ルーム, プロジェクター',
    reviews:
      '【評判】池袋。部屋で生ビールが楽しめるビールサーバーが愛好家に大人気。屋上の開放的な露天風呂や金魚が泳ぐ幻想的な部屋など、遊び心が満載。',
  },
  '8f3d005e-1dd2-456f-9603-3c1b86e56ea0': {
    // HOTEL XYZ福岡
    amenities:
      '2つのシャワー付きWバスルーム, アルファサウナ, エアブローバス, 5つの国別テーマフロア, コスプレ600種',
    reviews:
      '【評判】福岡今泉。フロアごとに北欧やアジアンなど世界旅行を楽しめる内装。二人で並んで浴びれるダブルシャワーなど、距離が縮まる仕掛けが充実。',
  },
  '21f45998-e91e-486f-b99f-0ebefc4d08a4': {
    // HOTEL LUNA 香芝
    amenities:
      'イオンナノケア全室, 女優ミラー, 浴室液晶TV, 水中照明ブロアバス, 100種類以上のアメニティ',
    reviews:
      '【評判】香芝。2018年リニューアル後のヨーロピアンな内装が圧巻。ナノケア製品や女優ミラーなど、女性の「綺麗になりたい」を叶える設備は奈良随一。',
  },
  'd612816b-f35f-4d42-bbdd-4d153f8968a7': {
    // HOTEL SPA-Mu Riverside 深谷
    amenities:
      '岩盤浴(ホットストーンSPA), ラコニウム微温浴室, 大型水槽, スペースプレイヤー, 露天TV, プロジェクター',
    reviews:
      '【評判】深谷。岩盤浴から本格サウナまで揃う、まさに「スパ」の名に恥じない充実度。リバーサイドの開放感と、光の演出が二人の時間をドラマチックに。',
  },
  'aa7b0a8a-3af9-4e21-bbbc-405ff3cef3ab': {
    // etoe sauna 新宿
    amenities:
      '120度超激熱サウナ, 12度シングル水風呂, セルフロウリュ, プライベートテラス, プロジェクター',
    reviews:
      '【評判】新大久保。サウナ愛好家（サウナー）の聖地。120度の超高温サウナとシングル水風呂で、都心随一の「ととのい」体験ができる唯一無二の場所。',
  },
  '80bffbc4-18fa-4ce6-8c05-345574311b39': {
    // HOTEL Mitos 厚木
    amenities:
      'LIVE DAMカラオケ全室, ミストサウナ, エステウォーター, 5.1chサラウンド, レインボー照明',
    reviews:
      '【評判】厚木。圧倒的な音響を誇る5.1chサラウンドとLIVE DAMでカラオケ好きに支持。徹底した清掃と、肌に優しいエステウォーターの導入が親切。',
  },
};

updateMultipleHotelFacts(updates);
