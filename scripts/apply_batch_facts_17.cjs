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
  'be6a590e-1102-402a-80a0-2087e7385990': {
    // GRASSINO 浦和
    amenities:
      '天然温泉(美肌の湯), 岩盤浴ベッド, シミュレーションゴルフ, 50インチ浴室シアター, ダーツ, 65インチTV, 露天風呂(一部)',
    reviews:
      '【評判】さいたま。天然温泉と岩盤浴、さらにはゴルフやダーツまで。もはや宿泊の域を超えたエンタメ温泉リゾートとして最高評価。',
  },
  'c95c7356-be23-4f82-806b-395efde4f393': {
    // ELDIA LUXURY 仙台
    amenities:
      '露天風呂, 岩盤浴, ダーツ, カラオケ, 大型プロジェクター, 100種類以上の無料アメニティ, 女子会限定サービス',
    reviews:
      '【評判】仙台。Best Delight Groupの「非日常」を追求した旗艦店。設備の種類が異常なほど多く、県内最高の評価を得ている。',
  },
  '08644dc2-7f14-4401-a551-3c894e5bda5e': {
    // ELDIA MODERN 仙台
    amenities:
      '本格プラネタリウム, 室内水槽, 足湯, マンガルーム, ビールサーバー, VR設備, 最新カラオケ',
    reviews:
      '【評判】仙台。各部屋にプラネタリウムや水槽など、驚きの仕掛けが満載。遊び心に溢れたモダンな空間が、若いカップルを魅了。',
  },
  'c91f2524-51e0-4d5f-9fc7-8973707211d8': {
    // HOTEL ARIA 横浜関内
    amenities: '関内駅徒歩圏内, 露天風呂(一部), サウナ(一部), 全室コーヒー/紅茶完備, 24hフロント',
    reviews:
      '【評判】横浜関内。立地が非常に良く、清潔感溢れる空間。一部の部屋には露天風呂もあり、都会の真ん中で贅沢なひとときを過ごせる。',
  },
  '8005424f-afa5-4577-8f9e-439e862203c8': {
    // HOTEL JAZZ 名東
    amenities:
      'LIVEDAMカラオケ, Chromecast, 浴室TV, 水中照明, ウェルカムスイーツフェア, 最新VOD/Wi-Fi',
    reviews:
      '【評判】名古屋名東。JAZZが流れる落ち着いた空間。最新カラオケや美容家電も充実しており、スイーツサービスなどの細かな気遣いも好評。',
  },
  '8e0c126e-623a-4c5e-aca3-ab10aad6368c': {
    // HOTEL K's MINE 豊田
    amenities:
      'レインボーバス, ジェットバス全室, ヘアアイロン(カール&ストレート両方), 42インチ↑TV, 本格朝食サービス',
    reviews:
      '【評判】豊田。水回りが非常に綺麗で、使い勝手の良いオシャレな内装。最新の美容家電や豪華な朝食が、女性から高く支持されている。',
  },
  'de96d626-cc91-4a85-a7a1-260fa654929a': {
    // HOTEL AROMA GATE 岡崎
    amenities:
      '60インチ大型TV全室, BOSEカラオケ, ジャグジー, アロマ加湿器, 40台屋根付き駐車場, 会員限定食事割引',
    reviews:
      '【評判】岡崎。外観からは想像できないほど内装が新しくてオシャレ。BOSEの響きが良いカラオケや、充実のアロマ設備で満足度大。',
  },
  '7b63caee-0661-4098-bcce-872b62107ffc': {
    // ホテル アン 福井
    amenities:
      '豊富な無料アメニティ, バスローブ, くるくるドライヤー, 電子レンジ/ポット, コンビニBOX',
    reviews:
      '【評判】福井市。「Gorgeous & Classy」をテーマにした上品な空間。手ぶらでOKなほどアメニティが揃っており、優雅な滞在が可能。',
  },
};

updateMultipleHotelFacts(updates);
