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
  // --- Batch 73: Urban Comfort & Amenity-Rich Facts ---
  '433f2326-5df8-47d1-b0fb-b0ea843dd9e8': {
    // HOTEL Rupo (錦糸町)
    amenities:
      '電子レンジ/冷蔵庫全室完備, ジェットバス/ブロアバス全室, ドリンクバー無料, 入浴剤バイキング, 各種美容家電貸出',
    reviews:
      '【評判】錦糸町。無料のドリンクバーや入浴剤バイキングが嬉しい。充実した美容家電のレンタルなどアメニティに隙がなく、錦糸町デートの拠点にぴったり。',
  },
  '5fb60e8f-a31d-4210-88ab-198d0f11c4bc': {
    // ホテル マリンブルー (池袋)
    amenities:
      'VODシステム全室, 浴室テレビ(一部), Dysonドライヤー(貸出), アメニティ豊富, ブラックライト(一部)',
    reviews:
      '【評判】池袋。手ぶらで泊まれるほどアメニティとレンタル品が充実。Dysonドライヤーでのお手入れや、VODでの映画鑑賞で、快適なステイを満喫できる。',
  },
  '9716152c-21a7-46f9-a289-026a37877a31': {
    // HOTEL 8 (歌舞伎町)
    amenities:
      'ジェットバス全室, VODシステム全室完備, レインボーバス(一部), 薄型テレビ全室, コスプレ/美容家電貸出',
    reviews:
      '【評判】歌舞伎町。全室にジェットバスとVODを完備した快適空間。各種美容機器やコスプレのレンタルが充実しており、手ぶらでも存分に滞在を楽しめる。',
  },
  'bd4833f8-3305-4fa1-b139-4054c4432251': {
    // HOTEL DEN (足立区)
    amenities:
      '全室VOD完備, ナノケアドライヤー全室, ルームサービス, ホットタブ全館, 浴室テレビ/ブラックライト(303号)',
    reviews:
      '【評判】入谷。全室にナノケア機器とVODを備え、美とエンタメを両立。手厚いルームサービスと清潔な室内で、のんびりとおこもりデートを楽しむのに最適。',
  },
  'a5e57d2b-7b7c-4c9d-ae39-11d220d82b88': {
    // HOTEL the Lip (蒲田)
    amenities:
      'ウェルカムドリンクバー, シャンプーバー, 50インチ以上TV(一部), ナノケアスチーマー(一部), マッサージチェア(一部)',
    reviews:
      '【評判】蒲田。ロビーでのウェルカムドリンクとシャンプーバーが好評。各種美容家電やマッサージチェアのある部屋もあり、日常の疲れをしっかりと癒やせる。',
  },
  '9483e1dc-d202-4668-8404-d71943912ca0': {
    // Hotel AQUA OASIS (高井戸)
    amenities:
      'プロジェクター＆5.1ch(一部), レインボーバス全室, スチームサウナ(一部), 露天風呂/岩盤浴(一部), 貸出豊富',
    reviews:
      '【評判】高井戸。露天風呂や岩盤浴を備え、まるでリゾートオアシス。プロジェクターや5.1chサラウンド音響での映画鑑賞など、驚きの設備力が支持されている。',
  },
  'f85f66c0-e886-4b0a-b942-6ce1d578d442': {
    // ホテル イーアイ (五反田)
    amenities:
      '60インチ大型液晶TV(一部), 600タイトルVOD, 水中照明ブローバス(一部), ナノケアスチーマー貸出, マッサージチェア(一部)',
    reviews:
      '【評判】五反田。60インチの大画面TVと水中照明バスで豪華なひとときを。充実のナノケアレンタルや無料アメニティが揃い、五反田エリアで高い満足度を誇る。',
  },
  '638cf2e9-4c12-4e62-9b52-4bb6beefa2bd': {
    // ホテル クレスト平井 (江戸川区)
    amenities:
      '水中照明付ブロアバス全室, ドリンク＆シャンプーバー, 加湿空気清浄機全室, ナノケア家電貸出, モダン内装',
    reviews:
      '【評判】平井。女性デザイナーが監修したシックな「大人の隠れ家」。ロビーの無料ドリンクバーと充実のレンタルアメニティで、快適で綺麗な空間を満喫できる。',
  },
  '02a9ed94-169c-4f2e-8b3c-25d777ffd303': {
    // HOTEL KATSURA (鶯谷)
    amenities:
      'DVDプレイヤー全室, フリーWi-Fi, ブラックライト(一部), レンタルシャンプー, 電子レンジ/冷蔵庫',
    reviews:
      '【評判】鶯谷。手頃な価格帯ながら必要な設備やアメニティがしっかりと揃う。清掃が行き届いた室内で、鶯谷の夜遊び帰りに賢く使える良コスパホテル。',
  },
  '721ba8d6-6ebd-4f81-adfe-1ccfba3c5b53': {
    // HOTEL ENJU 別邸万華 (鶯谷)
    amenities:
      '和モダン内装コンセプト, ジェットバス全室, 50インチ以上TV, 豊富なコスプレレンタル, 鶯谷駅徒歩1分',
    reviews:
      '【評判】鶯谷。駅から徒歩1分という極上のアクセスを誇る和モダン空間。「金魚」など可愛い趣向の部屋や細やかな清掃が、特に女性客から高く評価されている。',
  },
  'a946b11e-3488-444b-99b6-646f792d6d65': {
    // ホテル ムーンパティオ (池袋)
    amenities:
      '天蓋ベッド(一部), 露天風呂/岩盤浴(一部), 各種サウナ(一部), プロジェクター/ホームシアター(一部), 豊富な貸出品',
    reviews:
      '【評判】池袋。天蓋付きベッドや露天風呂、岩盤浴など「憧れ」が詰まったホテル。豊富な設備と多彩なアメニティで、池袋での記念日や特別な夜の定番。',
  },
  '6ba689f2-4515-474a-b411-c0f4ba8cfa93': {
    // ホテル ビアンカ ドゥエ (大塚)
    amenities:
      'イオンドライヤー全室, 11種類の充実アメニティ, ロケーション良し, ルームサービス, 加湿器/空気清浄機(一部)',
    reviews:
      '【評判】大塚。全室にイオンドライヤーと11種のアメニティを揃えた気配りが光る。24時間対応のフロントやルームサービスがあり、いつでも安心・快適に過ごせる。',
  },
};

updateMultipleHotelFacts(updates);
