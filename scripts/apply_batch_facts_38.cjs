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
  // --- Batch 38: Metropolitan Luxury & Sauna Specialists ---
  'ca29d958-7f04-413e-82d8-43f70ec98d0d': {
    // GRAN. 昭島
    amenities:
      '本格ドライサウナ, ミストサウナ(一部), マイクロバブルバス, 浴室テレビ, nanoケアドライヤー, 無料Wi-Fi',
    reviews:
      '【評判】昭島。サウナ好きも納得の本格ドライサウナ完備。美肌効果のあるマイクロバブルバスや最新のnanoケア家電など、自分磨きも妥協しない大人の空間。',
  },
  'c0255ed1-96ac-4aee-9df8-25ab277fe3af': {
    // WILL 昭島
    amenities:
      '入浴剤バイキング, ウェルカムドリンク, シャンプーバー, ドライサウナ(一部), 通信カラオケ',
    reviews:
      '【評判】昭島。充実のロビーサービスが人気。自分好みの入浴剤やシャンプーを選べる楽しさがあり、ウェルカムドリンクで到着後すぐにリラックスできる。',
  },
  '60e6d863-be8e-41df-ad95-d5eb067e3831': {
    // W-MULIA (横浜/保土ヶ谷)
    amenities:
      '全室ブロアバス完備, 70インチ巨大TV(多数), スチームサウナ, NETFLIX見放題, 浴室テレビ',
    reviews:
      '【評判】横浜。70インチの巨大テレビで楽しむ映画は迫力満点。全室ブロアバスとスチームサウナが備わり、都会で最高のシアター＆スパ体験ができる実力店。',
  },
  'f24b86c8-2d20-4238-ace1-26febeb70d8d': {
    // GOLF 横浜
    amenities: 'ジェットバス, マッサージチェア全室, 電子レンジ/冷蔵庫完備, 駐車場無料, コンビニBOX',
    reviews:
      '【評判】横浜。マッサージチェアでリラックスしながら過ごせる快適な空間。無料駐車場も有りアクセス抜群。ジェットバスの癒やしと安定の設備力が好評。',
  },
  'a308742b-d3cc-49f5-b130-e58455a620bd': {
    // ウォーターゲート 相模原
    amenities:
      '24時間オーダーフード, ウェルカムスイーツ, 豊富な無料アメニティ, VOD映画見放題, 最新美容家電',
    reviews:
      '【評判】相模原。24時間頼める絶品フードとウェルカムスイーツが嬉しい。アメニティの充実度もエリア屈指で、手ぶらでも安心して泊まれるホスピタリティ。',
  },
  'a3324bcd-6732-4eb1-9630-71b1ee0e8ecf': {
    // VARKIN 池袋
    amenities:
      '岩盤浴ルーム, ドライ/スチームサウナ(一部), ネスプレッソ, 天蓋付きベッド, ジェットバス',
    reviews:
      '【評判】池袋。岩盤浴やサウナを備え、都会の喧騒を忘れる究極の癒やしを提供。天蓋ベッドでの眠りと芳醇なコーヒーで、ワンランク上の宿泊体験を約束。',
  },
  'd384188e-7413-421e-8317-cde5e4eb6df0': {
    // KABUKI (歌舞伎町)
    amenities:
      'ロウリュ可能ドライサウナ, ReFaドライヤー/アイロン, 65インチ巨大TV, 全室ジャグジー, 最新サイバーDAM',
    reviews:
      '【評判】歌舞伎町。歌舞伎町初(!?)のロウリュサウナ導入店。ReFaの最新美容家電や超大画面テレビを揃え、美とエンタメを極めたハイエンドな空間。',
  },
  'eeaccd20-5822-40ca-8899-651a6fee3254': {
    // ZERO MARUYAMA (渋谷)
    amenities:
      'レインボーバス/ジェットバス, 豊富なシャンプーバー, 化粧品一式無料, 隠れ家立地, 無料Wi-Fi',
    reviews:
      '【評判】渋谷。円山町の喧騒から少し離れた隠れ家。無料アメニティやシャンプーバーが非常に充実しており、リーズナブルに高品質な滞在を楽しめる穴場。',
  },
  '3cce53e8-34af-4759-a341-a39e4a9a0a10': {
    // Beat WAVE (渋谷)
    amenities: 'デザイナーズルーム全室, ドリンクバー無料, 豊富なアメニティ, 清潔感抜群, VOD見放題',
    reviews:
      '【評判】渋谷。スタイリッシュなデザイナーズ空間と、驚きの「ドリンクバー無料」サービス。アメニティの豊富さと際立つ清潔感で、女性からの支持が絶大。',
  },
  '69682969-5ca6-4903-91f5-f73e20a6c30d': {
    // MYTH-VA (深谷)
    amenities:
      '65インチ大型TV, 浴室テレビ(全室), ブルーレイプレイヤー, USB充電ポート, 2Wayヘアアイロン',
    reviews:
      '【評判】深谷。巨大テレビと浴室テレビを完備したメディア満喫型ホテル。USBポートやヘアアイロンなど、現代のニーズを完璧に把握した設備が快適。',
  },
  '96c9f713-9edf-4894-8c47-00a13b6c7a49': {
    // GOMAX (横浜)
    amenities:
      '関内駅スグ好立地, 落ち着いた大人向け内装, ジェットバス, 豊富な貸出品, 24時間利用可能',
    reviews:
      '【評判】横浜。関内駅至近で夜遊びの拠点に最適。落ち着いたシックな内装と広いバスルームで、都会の真ん中にいることを忘れる静寂と安らぎを提供。',
  },
};

updateMultipleHotelFacts(updates);
