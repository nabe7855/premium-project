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
  // --- Batch 47: Kanagawa Premium & Chiba Enrichment ---
  '19b20547-7377-4ee5-9704-9068edaf801a': {
    // HOTEL AZ 木更津
    amenities: '広大な客室/浴室, マッサージ機器充実, ゴルフ帰り推奨, ルームサービス可, 駐車場完備',
    reviews:
      '【評判】木更津。とにかく「広さ」が自慢。ゴルフ帰りに疲れを癒やせるマッサージ設備と、誰にも邪魔されない隠れ家的な空間が、余裕のある大人に支持されている。',
  },
  '20cce94e-3760-4069-904e-01b812f5e5dd': {
    // HOTEL COCO RESORT 厚木
    amenities:
      'ミストサウナ, レインボー照明ジェットバス, 60インチ以上大型TV(一部), LIVE DAMカラオケ, ミラーリング可',
    reviews:
      '【評判】厚木。最新エンタメの宝庫。ミストサウナや光るジェットバスに加え、ミラーリング対応の大画面TVで、自分たちの好きなコンテンツを最高環境で楽しめる。',
  },
  '060d8547-58e8-428f-aa57-cdb854211cce': {
    // HOTEL BAMBOO GARDEN 相模原
    amenities:
      'ビールサーバー/ウイスキー/ジン常設, 2022年8月リノベ, プライベートサウナ(スイート), ドリンクバー無料',
    reviews:
      '【評判】相模原。お酒好きにはたまらない「客室ビールサーバー」を完備。2022年のリノベで洗練された高級感ある内装になり、まさに大人のためのリゾート。',
  },
  '84dc1223-fe97-4e85-9051-418e75812a07': {
    // フェスタ 横須賀
    amenities:
      '地中海風の外観, ウォーターサーバー全室, 水中照明ジェットバス, 5.1chサラウンド, 無料デザートサービス',
    reviews:
      '【評判】横須賀。地中海リゾートを彷彿とさせる外観が非日常を演出。全室ウォーターサーバー完備や高品質な音響設備など、コスパと満足度が極めて高い優良店。',
  },
  '5854c92f-a63a-452f-afb0-13d87be28b4a': {
    // HOTEL Dispa Resort 横浜
    amenities:
      '横浜みなとみらい一望、展望露天風呂(一部)、岩盤浴(一部)、ウォーターサーバー全室、アロマ加湿器レンタル',
    reviews:
      '【評判】横浜。みなとみらいの夜景を独り占めできる展望露天風呂は圧巻。岩盤浴やアロマ加湿器など、女性が喜ぶ「癒やし」の設備が非常に充実している。',
  },
  'b59f98de-1ddc-42dc-90a1-48698a6fd511': {
    // セッティングザシーン厚木
    amenities:
      '2020年10月グランドリニューアル, Chromecast全室, 高品質無料フード(一部), 3種ドライヤー完備',
    reviews:
      '【評判】厚木。インターすぐの好立地。リニューアル後の清潔感はもちろん、驚くほどクオリティの高い食事が自慢。Chromecastで動画三昧の夜を過ごせる。',
  },
  'e1a02993-255a-4fa2-aded-cd4c1150216e': {
    // HOTEL COSTA RESORT 茅ヶ崎
    amenities:
      '富士山展望露天風呂(スイート), 室内ビールサーバー, VR設備, シアタールーム, 2023年12月リニューアル',
    reviews:
      '【評判】茅ヶ崎。2023年末の大規模リニューアルでさらに豪華に。富士山を望む露天風呂での贅沢なひとときや、VR・ビールサーバーなどの最新遊び設備が満載。',
  },
  'f34af5d2-9736-4f42-9e74-43a84b3b582d': {
    // HOTEL TSUBAKI 大和
    amenities:
      '特注キングサイズフランスベッド, カクテルウェルカムドリンク(1人1杯), アメニティバイキング, 禁煙ルーム',
    reviews:
      '【評判】大和。最高級フランスベッドでの極上の寝心地を約束。和モダンな空間でカクテルを楽しみながら、充実のアメニティバイキングで自分流にカスタムできる。',
  },
  'f2e0a9be-f1be-4f32-a979-c6e805f78eed': {
    // HOTEL ZAFIRO RESORT 横浜
    amenities: '横浜駅徒歩5分, EV充電完備, 全室50インチ以上TV, 露天風呂(一部), 豪華バイキング朝食',
    reviews:
      '【評判】横浜。駅近の超好立地にEV充電まで完備する現代派。50インチ超の大画面と、宿泊客に提供される豪華な朝食バイキングが「ホテル以上の満足感」と大好評。',
  },
  'd7dc84ca-f93f-49ff-b6d2-18d9c057a201': {
    // HOTEL CUE 厚木
    amenities:
      '全室ナノケアドライヤー/スチーマー, キングサイズベッド, 830タイトル以上VOD, サウナ(一部)',
    reviews:
      '【評判】厚木。全室にナノケア美容家電を完備し、女性の美を徹底サポート。広々としたキングベッドで800本以上の映画を楽しみながら、日常を忘れて籠もれる名店。',
  },
};

updateMultipleHotelFacts(updates);
