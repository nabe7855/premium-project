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
  // --- Batch 53: Tokai & Shizuoka "Unique & Legend" Facts ---
  'dd743d0a-6871-4b35-b124-69168d1fb5f1': {
    // HOTEL ATLANTIS 沼津店
    amenities:
      '貝殻ベッド/白鳥ベッド, 露天風呂(一部), 65インチスマートTV, Netlfix/Youtube, ハンモック, 無料モーニング',
    reviews:
      '【評判】沼津。貝殻ベッドや露天風呂、ハンモックなど南国リゾート感が凄い。65インチ大画面で動画三昧も可能。満足度が極めて高い一軒。',
  },
  'f142ce03-61cf-4f5d-b48d-47b9a0e4f153': {
    // HOTEL 555 伊豆長岡
    amenities:
      'ヒップエクササイズマシン, JOYSOUND f1, 水中照明付きブロアバス, マウンテンビュー, 各種サウナ完備',
    reviews:
      '【評判】伊豆の国。ヒップエクササイズマシンやJOYSOUNDなど、遊び心が満載。山を望む絶景と清潔な客室で、リフレッシュに最適。',
  },
  '978c39d3-3477-4365-aa90-ac68fbe60387': {
    // HOTEL VOGUE (桑名)
    amenities:
      '空間除菌puripot(NASA採用技術), 高反発マットレス, 露天風呂/サウナ/岩盤浴(一部), 全室ウルトラファインバブル',
    reviews:
      '【評判】桑名。NASA採用の除菌技術やウルトラファインバブルなど、目に見えない「究極の清潔と健康」への拘りが光る、受賞歴多数の名店。',
  },
  '205edd8f-d3e9-4e6d-9f60-c863c179491a': {
    // ホテル ファンタジア 熱海
    amenities:
      'シンデレラベッド/UFO型ベッド, ボックスサウナ, 昭和レトロ空間, 無料Wi-Fi, 飲食物持ち込み可',
    reviews:
      '【評判】熱海。シンデレラやUFOといった伝説のベッドが残る「昭和遺産」的ホテル。店主の人柄も良く、ノスタルジーに浸れる唯一無二の場所。',
  },
  'addb4ac7-5f03-47f4-ae00-2b6a05d6498d': {
    // 555MOTEL -GOTEMBA-
    amenities:
      'キッチン付き客室, ミニキッチン, バー/レストラン, マッサージチェア, サウナ(一部), 高い清潔感',
    reviews:
      '【評判】御殿場。清潔感の評価が非常に高い。キッチン完備の部屋もあり、食材を持ち込んでの「おこもり」滞在がカップルに大人気。',
  },
  '8f80ce8a-dde9-48bb-b857-55d258dc07d5': {
    // プレゼントホテル ChuChu浜松
    amenities: '回転ベッド(一部), SMルーム, コスプレルーム, avexチャンネル, 無料ビール(期間限定等)',
    reviews:
      '【評判】浜松。回転ベッドやSMルームなど、アグレッシブな設備が揃う。刺激を求めるカップルに最適で、部屋の広さと安さも魅力。',
  },
  'a6c6c7a8-4455-4c0a-935b-32ddc2559427': {
    // HOTEL ARTIA 大垣店
    amenities:
      '牢屋コンセプト, コスプレルーム, 50インチ以上TV, 本格ピザ(焼成サービス), ダーツ, 豊富な美容家電',
    reviews:
      '【評判】大垣。牢屋部屋などの過激なコンセプトルームと、本格的なピザが有名。ハイグレードな設備と驚きの体験ができるアミューズメント拠点。',
  },
  'bb911133-1590-48b2-b264-432cdf236161': {
    // タイガー・アンド・ドラゴン (岐阜)
    amenities: '50インチ以上TV, VOD, 各種コスチューム, 美顔器(レンタル), ルームウェア, 駐車場完備',
    reviews:
      '【評判】岐阜。大画面TVとVODで映画鑑賞に最適。ビジネスやグループ利用の評価も高く、清潔で安定したサービスが受けられる良店。',
  },
  'f86ce12a-89cf-45e6-be23-3cf4eb159a8c': {
    // ホテル 隠宿 凛 ～Rin～ (大垣)
    amenities:
      '冷蔵庫内飲料無料, 50インチ以上TV, 通信カラオケ, サウナ(一部), 無料モーニング, 浴室TV',
    reviews:
      '【評判】大垣。冷蔵庫の飲み物無料サービスや浴室TV、カラオケなど、おもてなしが手厚い。静かな環境で、無料モーニングも絶品と評判。',
  },
  'bee76817-dea5-4c03-931d-a681461e4959': {
    // 隠家 (ajito) HOTEL 555 御殿場 2
    amenities: '24時間対応フロント, 衛星放送無料, 広いバスルーム, カラオケ, 衛星・有料放送無料',
    reviews:
      '【評判】御殿場。御殿場IC近くでアクセス抜群。客室が広く開放的で、特に浴室の清潔感と設備の使いやすさが、旅の疲れを忘れさせてくれる。',
  },
  '1cbc4ef8-a81a-4d2c-acbe-91b13507e535': {
    // ホテル ベストイン (静岡)
    amenities: '静岡駅至近, 40インチTV, VOD無料, 無料Wi-Fi, 充実のアメニティ, 清潔感重視',
    reviews:
      '【評判】静岡。駅から徒歩圏内で、ビジネス利用にも圧倒的に便利。無料VODと充実のアメニティで、コンパクトながら機能的な滞在が可能。',
  },
  '6486bb6c-bd0a-4d95-97b6-e79b4436ef30': {
    // GLAM ROSE 御殿場 (推定)
    amenities: '御殿場エリア優良店, 無料Wi-Fi, 駐車場送迎(一部), 充実の基本アメニティ',
    reviews:
      '【評判】御殿場。隠れ家的な立地でプライバシーが守られる。清潔感があり、観光の拠点や休憩に気軽に利用できる安定の一軒。',
  },
};

updateMultipleHotelFacts(updates);
