const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const robustParseCsvLine = (line) => {
    const parts = [];
    let part = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          part += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          part += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }
    }
    parts.push(part);
    return parts;
  };

  const formatCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    return `"${String(field).replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = robustParseCsvLine(line);
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
  // --- Batch 69: Resort & Specialized Facilities ---
  '50b9a42f-2438-4a30-be9c-0e829f6fb902': {
    // HOTEL CUE 厚木
    amenities:
      'キングサイズベッド, 22インチ浴室TV, Nanoeドライヤー, Ionityアイロン, VOD(830タイトル)',
    reviews:
      '【評判】厚木。キングサイズベッドと浴室テレビでゆったり過ごせる。ナノイードライヤーなどの美容家電も完備され、ホテルクオリティのタオルなど細部への拘りが嬉しい。',
  },
  'c8e8cdde-8fc4-4434-98e8-53c07c6bf916': {
    // ホテル コンサートの森 (小郡)
    amenities: 'コテージスタイル, 森林リゾート, メンバー割引, 和室(一部), 駐車場完備',
    reviews:
      '【評判】小郡。森の中にある可愛いコテージ型ホテル。開放感のある自然に囲まれた静かな環境で、誰にも邪魔されずに二人だけの別荘気分を味わえると人気。',
  },
  '34da0b01-abe9-460b-a1f2-222fa69b0d07': {
    // HOTEL ACHT (長崎)
    amenities: 'シャンプーバイキング, ブルーレイプレーヤー, 持込冷蔵庫, 電子レンジ, Wi-Fi',
    reviews:
      '【評判】長崎。シャンプーバイキングが女性に好評。持ち込み冷蔵庫や電子レンジが完備され、快適な「おこもりステイ」が可能。清潔感のある客室で安定した人気を誇る。',
  },
  '4bed63db-3e98-421c-b19b-03ce6b82f830': {
    // HOTEL MUZE (飯塚)
    amenities: '水中照明, 浴室TV, 露天風呂/岩盤浴(一部), 700タイトルVOD, 豊富なアメニティ',
    reviews:
      '【評判】飯塚。水中照明や浴室テレビ、一部の岩盤浴など「癒やしのバスタイム」が最高。最新VODや豊富な無料アメニティも揃っており、エリア屈指の充実度。',
  },
  '475dbdd2-561c-42e1-9311-cd8d6e710975': {
    // ホテルクロス V・I・P (久留米)
    amenities: 'ReFa最高級家電, SMルーム, ミラブルシャワー, 75インチ大型TV(一部), 水サーバー',
    reviews:
      '【評判】久留米。ReFaのドライヤーやミラブルシャワーなど、最新美容家電を惜しみなく投入。SMルームなどの特殊設備もあり、刺激的かつ上質な体験ができる超優良店。',
  },
  'de346ccd-07fc-4e57-83cf-ced7fab6fab9': {
    // Think・Hotel・Think (海老名)
    amenities: 'Chromecast, 振動ラブマットレス, JOYSOUNDカラオケ, 低反発ベッド, 水中照明バス',
    reviews:
      '【評判】海老名。振動ラブマットレスや最新カラオケなど、エンタメ性が非常に高い。低反発の高品質ベッドが快眠をサポートし、遊びと癒やしのバランスが絶妙。',
  },
  '17be51e3-4267-4998-8b32-306949391c80': {
    // HOTEL VICTORIA RESORT (茅ヶ崎)
    amenities: '24h本格サウナ(94度), シルクバス, 浴室TV全室, LEDレインボー照明, 駐車場完備',
    reviews:
      '【評判】茅ヶ崎。特筆すべきは24時間利用可能な94度の本格サウナ。全室にシルクバスと浴室テレビを備え、サウナーや美容意識の高いカップルから圧倒的に支持されている。',
  },
  'c1710432-a1ea-4b9f-9caa-55126b6d7e78': {
    // HOTEL PONY (相模原)
    amenities: 'Chromecast, シャンプーレンタル, 清潔感重視, リーズナブル, Wi-Fi完備',
    reviews:
      '【評判】淵野辺。Chromecast導入でスマホの動画を大画面で楽しめる。リーズナブルながら清掃が行き届いており、手軽に利用できる清潔な空間としてリピーターが多い。',
  },
  '5cfe0583-e6f4-484d-bd05-20763e86dd99': {
    // HOTEL ENZO (豊前)
    amenities: '全室スチームサウナ, シャンプーバイキング, 駐車場完備, 静かな立地',
    reviews:
      '【評判】豊前。全室にスチームサウナを完備しているのが最大の特徴。自分に合ったシャンプーを選べるバイキングもあり、静かな環境で心身ともにリフレッシュできる。',
  },
  '59f3f316-f489-4c92-8629-70fb00a2b5b1': {
    // HOTEL GRAN.相模原店
    amenities: 'ReFa美容機器11種, 浴室YouTube視聴, Chromecast, テレワークデスク(一部), 虹色バス',
    reviews:
      '【評判】相模原。ReFaの美容家電11種が借り放題という美容特化型。浴室でもYouTubeが見られ、バスタイムが最高に楽しい。テレワーク対応の部屋もあり多機能。',
  },
  'c7e8e835-f8bb-42d0-a2d7-886a95300725': {
    // HOTEL ACQUA CITYBOYS (福岡)
    amenities: '無料インターネット, ルームサービス, ウォしレット, 市街地好アクセス, 駐車場あり',
    reviews:
      '【評判】福岡小戸。市街地へのアクセスが良く、観光やレジャーの拠点に最適。清潔な客室と充実したルームサービスにより、快適なシティーリゾートステイが可能。',
  },
  '3a07d299-a628-403d-a7f4-b5ada4b8f476': {
    // HOTEL COSTA RESORT 茅ヶ崎
    amenities: '露天風呂, ビールサーバー, VR体験, 本格ダーツ, ミストサウナ, デザイナーズ客室',
    reviews:
      '【評判】茅ヶ崎。デザイナー監修のスタイリッシュな空間。露天風呂やビールサーバー、ダーツまで揃う遊び心満載の設備が「帰りたくなくなる」ほどの充実感を提供。',
  },
};

updateMultipleHotelFacts(updates);
