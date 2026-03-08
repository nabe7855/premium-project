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
  // --- Batch 65: Wide Region "Premium Experience" Facts ---
  '08fc9c03-c2fa-4770-ae45-6861dc6d67c3': {
    // HOTEL L'HOTEL(大阪天王寺)
    amenities:
      '70インチ超大画面TV, マイクロバブルバス(全室), ドライ/ミストサウナ(一部), セレクトアメニティ',
    reviews:
      '【評判】天王寺。全室に70インチの大画面と美肌効果のあるマイクロバブルバスを備えた最新鋭ホテル。スタッフのホスピタリティも高く、贅沢な設備で極上の休息を味わえる。',
  },
  '09d5478d-03c3-4657-96f3-a38d655f49e6': {
    // HOTEL WOW (島根出雲)
    amenities: '岩盤浴、本格ドライサウナ, シアタールーム, プロジェクター, 浴室TV(全室)',
    reviews:
      '【評判】出雲。2020年オープンの高級志向ホテル。岩盤浴や本格サウナを備えたVIPルームは4名まで利用可能で、モーニング無料サービスも含め「島根屈指の満足度」と絶賛されている。',
  },
  '09ff1d0a-8590-4b64-ab7d-a45b90ab89c9': {
    // ホテルピアット 名古屋
    amenities:
      '全室ラドン温泉導入, シャンプーバー/入浴剤バイキング, ヘアアイロン全室完備, 無料お菓子サービス',
    reviews:
      '【評判】名古屋新栄。全室でラドン温泉を楽しめる「都会のオアシス」。豊富な無料サービスと駅近の立地、そしてビジネスホテルよりも広々とした空間が、出張者からも高い支持。',
  },
  '0a396fe9-fdeb-41c3-8546-4e5d152c9502': {
    // Hotel C-Gran 心斎橋アメ村
    amenities: 'アメニティバイキング, 無料ケーキ/駄菓子, 最新設備, 観光特化立地, 美容パック',
    reviews:
      '【評判】大阪心斎橋。アメ村に位置し観光に最適。ロビーには選べる入浴剤やケーキ、駄菓子などのバイキングがあり、清潔でスタイリッシュな客室が女性客から「感動レベル」と話題。',
  },
  '0abe48a0-f787-4e54-9f6f-1fcb09e64588': {
    // HOTEL AIR2 (富士河口湖)
    amenities:
      '浴室水中照明, 大画面プロジェクター(一部), マッサージチェア(一部), 富士急ハイランド至近',
    reviews:
      '【評判】河口湖。富士山観光や富士急ハイランドに最適な立地。ラグジュアリーな内装と水中照明付きの浴室が、観光後の疲れを癒してくれると評判のリゾート空間。',
  },
  '08486b46-be69-4960-bfd3-71f77b0305cb': {
    // ホテル ロコガーデン 三重菰野
    amenities: 'ハワイアンリゾートテーマ, 露天風呂ジャグジー, 本格窯焼きピザ提供, Chromecast',
    reviews:
      '【評判】三重。ハワイを感じさせる異国情緒溢れる隠れ家。50種類以上の本格ピザや、水中照明付きの露天ジャグジーなど、リーズナブルながらリゾート気分を存分に味わえる。',
  },
  '084e399e-cba2-4702-9830-aab202b5e442': {
    // ホテル アールプラス日高 (埼玉)
    amenities: '100インチプロジェクター, 5.1chサラウンド、露天風呂/サウナ(一部), Chromecast全室',
    reviews:
      '【評判】埼玉。圧倒的な映像・音響設備が自慢。100インチの巨大画面で映画を楽しめるプレミアムルームは圧巻で、清潔感溢れる空間が多くのリピーターを惹きつけている。',
  },
  '3ff23761-a73a-4041-8157-808a994bfa65': {
    // HOTEL BARON -THE SWEET MODERN- (愛知)
    amenities:
      'ミネラルウォーターサーバー全室, 浴室TV(全室), 岩盤浴/露天風呂(一部), プライバシー配慮ガレージ型',
    reviews:
      '【評判】愛知。プライバシー万全のガレージタイプが人気。全室にウォーターサーバーや浴室テレビを完備し、無料スイーツや高品質アメニティなど、細やかなおもてなしが光る。',
  },
  '07d51bad-2ede-44f7-a920-778447695a28': {
    // ホテル コンフォルト (大阪池田)
    amenities:
      'お姫様ベッド/和室, ドライ/スチームサウナ(一部), 貸出用ブランドシャンプー, 乗馬マシン',
    reviews:
      '【評判】大阪池田。高速出口からすぐの好アクセス。和室やお姫様ベッドなど選べる客室が魅力で、サウナや乗馬マシンなど、リフレッシュのための設備が充実している安定の優良店。',
  },
  '07c2d97f-fd36-4f51-bbe6-698f15f37ac0': {
    // ヴェガシティ ホテル (愛媛松山)
    amenities: '水中照明付ジャグジー, マッサージチェア(一部), 有線LAN/高速Wi-Fi全室',
    reviews:
      '【評判】松山。全室が非常に清潔で管理が行き届いていると評判。水中照明付きのジャグジーや充実した無料アメニティがあり、どの部屋を選んでも外れがない安心感がある。',
  },
};

updateMultipleHotelFacts(updates);
