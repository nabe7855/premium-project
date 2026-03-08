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
  'c924025d-bf8a-402c-98a7-1f00c76775f2': {
    // WILL マリンリゾート藤沢
    amenities:
      'サウナ(一部), マッサージチェア, シャンプーBAR, 入浴剤バイキング, 無料Wi-Fi, ハイルーフ車対応駐車場',
    reviews:
      '【評判】藤沢。安くて広くて綺麗と三拍子揃った人気店。ロビーのシャンプー・入浴剤バーが贅沢で、手ぶらでも存分に楽しめる。',
  },
  'e6e75d25-4f90-4220-aab3-9f652c9d2cb1': {
    // ホテル アクアブルー 横須賀
    amenities: 'ウォーターサーバー全室, 無料Wi-Fi, 24hフロント対応, 広々とした客室, 無料大型駐車場',
    reviews:
      '【評判】横須賀。広くて快適な部屋が好評。特に全室にウォーターサーバーが設置されている点が、地味ながら非常にポイント高い。',
  },
  'ea46c651-5bf4-4c08-a75f-17b76f070818': {
    // HOTEL TSUBAKI 大和
    amenities:
      'リニューアル済み和モダン, ウェルカムドリンクバー(酒あり), コーヒーマシン, フランスベッド, 禁煙ルームあり',
    reviews:
      '【評判】大和。和モダンな内装が非常にオシャレで清潔。お酒も選べるドリンクバーや高級ベッドなど、ホスピタリティの塊。',
  },
  '71dfb638-93db-405a-9d7c-54ca08a6c8e7': {
    // COSTA RESORT 茅ヶ崎
    amenities: '露天風呂客室あり, 室内ビールサーバー(一部), シアタールーム, Chromecast, VR設備',
    reviews:
      '【評判】茅ヶ崎。設備が最新かつ超豪華。露天風呂やビールサーバーがある部屋は「最高のご褒美」として圧倒的人気を誇る。',
  },
  'db0321cd-278e-485e-9651-f535c9ee8b70': {
    // HOTEL 現代楽園 伊勢原
    amenities:
      'デザイナーズルーム, 電子レンジ/冷蔵庫, ガーデンパティオ(一部), サイクリング/ハイキング環境, ペット同伴可',
    reviews:
      '【評判】伊勢原。全室異なるオシャレな内装が特徴。フロントの対応が非常に丁寧で、リゾート感溢れる空間で非日常を味わえる。',
  },
  'dd70434b-c2fe-4914-8bdc-212709498e9d': {
    // HOTEL ELDIA 町田店
    amenities:
      '露天風呂(リニューアル新設), 室内水槽, ダーツ, ビールサーバー飲み放題, 豊富な無料フード, ウォーターサーバー',
    reviews:
      '【評判】横浜町田IC。2024年のリニューアルで露天風呂やダーツを新設した「エンタメホテルの極み」。無料サービスも充実し、遊び足りないほど。',
  },
  '31c9f4b2-8af4-43a6-97af-340b7dcff3a2': {
    // WILL RESORT 鎌倉
    amenities:
      '全室リニューアル済み, YouTube視聴可, 24h食事提供, ハイルーフ車対応, VOD最新システム',
    reviews:
      '【評判】鎌倉。観光帰りに最適なオシャレなホテル。24時間体制のフードサービスと、最新の映像体験が若年層に強く支持されている。',
  },
  '77e78593-d95f-4c57-9da1-cf5335fbaac3': {
    // HOTEL RENAISSANCE 仙台店
    amenities:
      'ビールサーバー, カラオケルーム, プラネタリウム(一部), マンガルーム, 全室Chromecast, 季節イベント豊富',
    reviews:
      '【評判】仙台。Best Delight Groupならではの圧倒的エンタメ性。プラネタリウムやビールなど、室内で遊び尽くせるワクワク感が魅力。',
  },
};

updateMultipleHotelFacts(updates);
