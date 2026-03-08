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
  // --- Batch 59: Kyushu "Entertainment & Aesthetic" Facts ---
  '53699442-b322-4568-aaff-7dfac5c27e5b': {
    // HOTEL SKY PARADISE RAKUEN (大分)
    amenities:
      'ゴンドラチェックイン, Dysonドライヤー, エンタメバルコニー, 露天風呂(一部), コスプレレンタル',
    reviews:
      '【評判】大分。ゴンドラでの入場やテーマパークのような演出にワクワクする一軒。Dysonなど質の高い備品に加え、スタッフの神対応が県内最高評価。',
  },
  '176a4467-2d75-4342-8837-46a165e978c4': {
    // Bali Style 別府
    amenities:
      '全室オーシャンビュー, ReFa/Bollna美容シャワー, 復元ドライヤー(一部), 無料ドリンクバー',
    reviews:
      '【評判】別府。全室から海を一望できる絶景と、ReFaなどの高級美容家電が魅力。ロケーション・清潔感ともに「すばらしい」評価を受ける人気店。',
  },
  'e08112cc-b679-4ab0-9883-6106159127f7': {
    // HOTEL KUMAMOTO PACELA
    amenities:
      '王室風豪華ルーム, レンタルシャンプーバー, 全室高速Wi-Fi, 通信カラオケ, ウェルカムサービス',
    reviews:
      '【評判】熊本市。王室のような豪華な造りで満足度が非常に高い。設備評価5満点の常連で、フロントの親切な対応と非日常的な空間が支持されている。',
  },
  'b5f10174-d696-4db2-9ded-431fbfc97f13': {
    // ホテル クリスマス 熊本
    amenities: 'EV充電設備(4台), 24h本格オーダーレストラン, 無料モーニング, 個別Wi-Fi',
    reviews:
      '【評判】阿蘇西原。EV充電完備の現代的設備と、24時間注文可能な美味しい料理が自慢。清潔で管理が行き届いており、リピーターが絶えない優良店。',
  },
  '69526cad-b740-4bd9-8c00-9a6201ba1a9c': {
    // HOTEL ZOOM (別府)
    amenities: '全室ウォーターサーバー完備, 美肌照明演出, VOD900タイトル, マッサージ機(一部)',
    reviews:
      '【評判】別府。全部屋にウォーターサーバーがある利便性が好評。女性を美しく見せる照明など拘りが強く、リニューアル後の清潔感も高く評価されている。',
  },
  '090c1193-0c06-48bb-b38a-d55840ad214e': {
    // HOTEL LEXIA (伊万里)
    amenities: 'スロットマシン2台導入ルーム, 最新VOD, 個室清掃徹底',
    reviews:
      '【評判】伊万里。スタイリッシュな内装と充実した食事メニューが人気。コストパフォーマンスが良く、2部制フリータイムでの長時間滞在も快適。',
  },
  '2ca45f80-6d42-4a95-abdb-3245724500c1': {
    // J ZAURUSS (別府)
    amenities: '恐竜オブジェ、24hフロント, 朝食ルームサービス, ジャグジーバス',
    reviews:
      '【評判】別府。恐竜のオブジェが目を引く外観。Booking.comで8.3以上の高い快適性評価。広々としたジャグジーと丁寧なフロント対応が好評。',
  },
  '38c16aae-73cf-4259-89f4-733ba5bc48e0': {
    // HOTEL SKY5 (大分)
    amenities: '全室リニューアルルーム, デザイナーズ家具, 大型浴室TV',
    reviews:
      '【評判】大分。スカイグループの安定した品質。全部屋が新しくモダンなデザインで統一されており、清潔感において安心感がある優良店。',
  },
  'c5bf560b-55a6-4078-bbae-ab85f9baf038': {
    // Villa Sweet 7 (別府)
    amenities: 'スイーツウェルカムサービス, マイクロバブルバス, 豊富なアメニティ',
    reviews:
      '【評判】別府。女性に嬉しいスイーツのサービスと、肌に優しいバブルバスが人気。アメニティがとにかく豊富で、手ぶらで泊まれる快適さが売り。',
  },
  'c91ff312-e5c0-4242-a8be-e981dce4dabc': {
    // HOTEL Uno drop (別府)
    amenities: 'SMルーム(一部), レインボーバス, 浴室TV, バスローブ完備',
    reviews:
      '【評判】別府。レインボーバスやSMルームなど、遊び心のある多様な部屋設定が魅力。マニアックな要望にも応える充実の設備が揃っている。',
  },
};

updateMultipleHotelFacts(updates);
