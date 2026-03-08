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
  '4e41a37f-7599-482c-b859-72500225c687': {
    // ふたりの夢を叶えましょう 南陽
    amenities:
      '100インチプロジェクター, 天蓋ベッド, 50インチ大型TV, レインボーバス, くるくるドライヤー, バリアフリー対応',
    reviews:
      '【評判】南陽。名前の通り「夢を叶える」豪華設備が魅力。プロジェクターでの大迫力映画鑑賞やお姫様気分の天蓋ベッドが、特別な日の利用に最適。',
  },
  '4892f51c-a205-45c4-a4f1-3eea05997a3a': {
    // ホテル オーパ 鹿児島
    amenities:
      '世界都市テーマ客室, 広いベッド, 女子会プラン, 充実のアメニティセット, ルームサービス',
    reviews:
      '【評判】鹿児島。世界の国や都市を旅しているようなユニークな内装が楽しい。ベッドが広くて寝心地が良く、アメニティも豊富で女性に大人気。',
  },
  '1ae3e237-d0cd-47d0-962e-2142fcd3622a': {
    // ホテル レッドキャンディ 神戸
    amenities: 'マッサージチェア(一部), 浴室テレビ, 和室あり(3名以上可), 全室Wi-Fi, コンビニBOX',
    reviews:
      '【評判】神戸。Aランクの広々とした部屋に設置されたマッサージチェアが最高。3名以上で泊まれる和室もあり、多様なニーズに応えてくれる。',
  },
  '975e2fbe-b07d-4abf-ab69-7d253bc3960d': {
    // ホテル シンドバッド 東根
    amenities: '衛星放送, 有線LAN, 駐車場完備, 湯沸かしポット, 加湿器(一部)',
    reviews:
      '【評判】東根。安定した設備と丁寧なサービスで、Agoda等の予約サイトでも高評価。静かな環境でゆっくりと旅の疲れを癒やせる。',
  },
  'f1ad1af7-a469-4c27-a405-9c1a57140f26': {
    // ボニータ 山形空港店
    amenities:
      '空港ビュー客室, 3種類の選べる部屋着, 駐車場全室ハイルーフ対応, 清潔なルームウェア, 24hプランあり',
    reviews:
      '【評判】東根。山形空港の滑走路が見える景色が格別。数枚の予備タオルや選べる部屋着など、細かなホスピタリティが光る一軒。',
  },
  '681cfd1f-3d0b-4314-9f47-e24a941410f9': {
    // HOTEL CHA.CHA Y2 酒田
    amenities: '酒田エリア最大級客室, 最新VOD, 浴室TV, ウェルカムスイーツ, 広々バスルーム',
    reviews:
      '【評判】酒田。広々とした部屋と、充実した最新設備が自慢。特に浴室TVで映画を楽しみながらのバスタイムが至福と評判。',
  },
  'a3c2f75d-7985-4f8e-a35d-c6b9e83c8f21': {
    // ホテル i 高畠
    amenities: 'リーズナブルな料金, 駐車場完備, 清潔な客室, Wi-Fi完備, 静かな立地',
    reviews:
      '【評判】高畠。コスパの良さと、静かな環境でリラックスできる点が評価。派手さはないが、清掃が行き届いた清潔な空間が心地よい。',
  },
  '6dae7c4c-3ed1-4f15-8b52-eb70316673d5': {
    // HOTEL JP 東根
    amenities: '全室最新VOD, 浴室テレビ, ルームサービス, 駐車場完備, スタイリッシュ内装',
    reviews:
      '【評判】東根。スタイリッシュで落ち着いた内装が大人の隠れ家に最適。充実のVODと浴室テレビで、二人だけのプライベート空間を満喫できる。',
  },
};

updateMultipleHotelFacts(updates);
