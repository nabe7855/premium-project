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
  // --- Batch 58: Shikoku & Yamaguchi "Hospitality & Resort" Facts ---
  '7ffd0058-c8b7-423d-9feb-764d2c63b87c': {
    // HOTEL MIST (下関)
    amenities: 'ウェルカムスイーツ, メンバーカード割引, 24hフロント',
    reviews:
      '【評判】下関。リーズナブルな価格とウェルカムスイーツが好評。建物は古めだが、スタッフの対応が柔軟で親切なため、地元での安心感がある。',
  },
  'f65f9f71-1afd-478d-b529-d0dc7aa5974c': {
    // STYLISH RESORT (下松)
    amenities: 'アルコール飲み放題, 朝食ルームサービス, 客室用ウォーターサーバー',
    reviews:
      '【評判】下松。お酒の飲み放題や部屋への朝食デリバリーなど、ビジネス利用でも嬉しい充実のサービス。水サーバー完備も高評価ポイント。',
  },
  '810872d0-a7d2-4994-a565-456f6cb54abe': {
    // SOL 小野田店
    amenities: 'ジェットバス, 50インチ以上大型TV, 豊富なレンタルシャンプー',
    reviews:
      '【評判】小野田。リニューアルを経て清潔感が向上。特に広いお風呂のジェットバスと大型テレビが高評価で、価格以上の満足度が得られる。',
  },
  'b11c6470-8324-4669-96aa-315a59eefaf6': {
    // HOTEL MYTH-777 (徳島)
    amenities: 'レインボーバス, 露天風呂(一部), 岩盤浴, 天蓋ベッド, 美顔器',
    reviews:
      '【評判】徳島。レインボーバスや岩盤浴、さらには露天風呂まで備えた県内屈指の高級設備。天蓋ベッドもあり、記念日デートに最適な豪華空間。',
  },
  'af44774e-65b6-4e02-9d41-8bdf2ef503b4': {
    // レステイ DEE (徳島)
    amenities: 'アイス/ドリンクバー, LIVE DAMカラオケ, 厚切りトースト朝食',
    reviews:
      '【評判】徳島市街。繁華街に近く、スタッフの神対応とボリューム満点の朝食が人気。アイス食べ放題などの無料サービスも女子会に嬉しい。',
  },
  '5ca9468a-ea31-4733-abd6-c4cd8807c9be': {
    // Hotel Vi Style (高松)
    amenities: 'ハート型露天風呂, 本格ロウリュサウナ(TV付), 65インチ液晶TV, アロマ空間演出',
    reviews:
      '【評判】高松。ハート型の露天風呂やTV付きサウナなど、設備の充実度が抜群。館内が良い香りに包まれており、特別な日に選びたい上質感。',
  },
  'c51d1f02-51c9-42ab-a977-e36d85bbc61b': {
    // HOTEL KAYUN (高松)
    amenities: 'ホームシアター, PS2/Wii貸出, 岩盤浴, オゾン脱臭機, 2.1chサラウンド',
    reviews:
      '【評判】高松。広々とした客室に岩盤浴やホームシアターを完備。清掃が行き届いており、最新ゲーム機の貸出など遊び心も満載な空間。',
  },
  '7b2cc913-fd5e-4f4a-acfc-0b762ba99caf': {
    // HOTEL MYTH J (坂出)
    amenities: '高級岩盤浴, 広々浴槽, 24hフードサービス, リクライニングベッド',
    reviews:
      '【評判】坂出。吹き抜けのある開放的な部屋や、広大な浴槽での岩盤浴が人気。24時間提供の食事も質が高く、贅沢な時間を過ごせる隠れ家。',
  },
  'abeda996-ad1e-4a6d-a45f-aff1b4d016bc': {
    // HOTEL SWEETS (松山)
    amenities: 'リニューアルルーム, 豊富なアメニティ, VOD1000タイトル',
    reviews:
      '【評判】松山。旧ラビリンスからリニューアル。特にお風呂の清潔感と設備のメンテナンスが高く評価されており、安定した人気を誇る。',
  },
  'a9bd5311-4463-47e6-b031-13c1c531fd2e': {
    // HOTEL ROSSO (松山)
    amenities: 'ハイルーフ車対応(一部), 5/5設備評価, デザイナーズ空間',
    reviews:
      '【評判】松山。設備満足度5満点の口コミが多数。洗練されたモダンな内装と、駐車のしやすさも含めた利便性の高さがカップルに支持されている。',
  },
  'ec024e2d-f12d-445f-94f8-27c8d3ab03ce': {
    // HOTEL nana (松山)
    amenities: '繁華街立地, 厳選アメニティ, セレクトシャンプーバー',
    reviews:
      '【評判】松山一番町。今までで一番良かったとの声も。繁華街ど真ん中の好立地で、外出も自由なためグルメ観光の拠点としても非常に便利。',
  },
  'e3f39017-af86-4f17-b545-e8ff81a6710f': {
    // HOTEL MYTH NANGOKU (南国)
    amenities: '乾式サウナ(スイート121), 大型液晶TV, リニューアルフードメニュー',
    reviews:
      '【評判】南国。スイートルームにサウナを備えるなど、四国のマイス系列でも特に豪華。最新のフードメニューも美味しく、満足度が非常に高い。',
  },
  '3a223a8f-69e3-484b-adc4-93e52bfc4a4d': {
    // レステイ MOON高知
    amenities: '独立戸建バンガロー, プライベートサウナ, 夜食無料サービス',
    reviews:
      '【評判】高知。独立したコテージ形式で、隣を気にせず過ごせるプライベート感が最高。無料の夜食サービスや丁寧な接客が口コミで高評価。',
  },
};

updateMultipleHotelFacts(updates);
