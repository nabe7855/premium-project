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
  'cba9b830-b0f8-48e8-85e9-d2c54f091aa5': {
    // LUSSO CROCE 横浜南区
    amenities:
      'フラワーセラピーバス, 美顔器全室, ダーツルーム(一部), 各種ドライヤー完備, スパ体験コンセプト, コスプレ',
    reviews:
      '【評判】横浜南区。もはやラブホテルの枠を超えた本格スパリゾート。ダーツや大型TV付きの浴室など、充実の設備で「また来たい」と思わせる魅力が満載。',
  },
  'e597303b-9630-4bc9-84fe-d1b5ce9252bb': {
    // HOTEL Dior7 郡山
    amenities:
      'ロウリュ対応サウナ, 60インチ客室TV, 40インチ浴室TV, ダイソンドライヤー(一部), ヘアビューロン, ウォーターサーバー',
    reviews:
      '【評判】郡山。プロフェッショナルな清掃と管理体制で総合4.9の高評価。ロウリュを楽しめる本格サウナや、最新美容家電が女性に大好評。',
  },
  '46b3f26b-854e-42bb-8112-853c3a24b9e0': {
    // レステイ 郡山
    amenities:
      'ホームサウナ(一部), マッサージチェア, 水中照明, 外出自由, 無料Wi-Fi, 屋根付き駐車場',
    reviews:
      '【評判】郡山。インター近くの好立地でアクセス抜群。一部の部屋にあるプライベートサウナが非常に快適で、リピーターに強く支持されている。',
  },
  '1c3a6fe9-7f51-4f67-a8b2-aa265291e3e7': {
    // aqua vitae 那須
    amenities: 'コンセプト別14室, 全室無線LAN, 湯沸かしポット, 無料駐車場完備, 清潔なインテリア',
    reviews:
      '【評判】那須。那須旅行の拠点に最適な、清潔感溢れるコンセプトホテル。各部屋のデザインが異なり、何度泊まっても新しい発見がある癒しの空間。',
  },
  '1c8dc271-52c1-4a07-ab85-94cb0b932df4': {
    // HOTEL MYTH F-1 諫早
    amenities:
      'コテージ形式, シャッター付き車庫, USBコンセント完備, セパレートトイレ/バス, ウェルカムアルコール無料',
    reviews:
      '【評判】諫早。1階が車庫で2階が客室の独立したコテージタイプ。プライバシーが完全に守られ、清潔でおしゃれな内装が「マイス」クオリティ。',
  },
  '951ecbcd-133b-4011-86e7-952f432cf57a': {
    // KAZAN いわき
    amenities:
      '天蓋ベッド, 露天風呂(一部), 着物コスプレ付き和室, ウォーターサーバー, マッサージチェア',
    reviews:
      '【評判】いわき。天蓋ベッドやお姫様気分を味わえる豪華な内装が人気。絶景を楽しめる露天風呂付きの部屋もあり、特別な一夜を演出できる。',
  },
  '449f5b60-1547-4bbe-b624-35def14d62fd': {
    // ホテル ごっこ 横須賀
    amenities:
      '平日無料3食サービス(選べるランチ/夕食等), アイス/アルコール無料, ウォーターサーバー全室, LUXシャンプー常備',
    reviews:
      '【評判】横須賀。信じられないほどの無料フードサービスが話題。ランチから夜食まで無料で提供され、部屋も広くて清潔。コスパ最強の呼び声高い。',
  },
  'b0ab91d9-2eb9-4089-86f9-bcf56a6e1fb3': {
    // ホテル エムズ 会津若松
    amenities:
      '美人の湯(各室導入), ウェルカムスープ, ヘアビューロン(カール&ストレート), ビューバス/テラス(一部), 高級バスローブ',
    reviews:
      '【評判】会津若松。ウェルカムスープの温かいおもてなしが心に響く一軒。全室に導入された「美人の湯」と最高級美容家電で、心身ともに整う。',
  },
  'dcc9a0b4-1e65-407b-a204-b8230a3d6673': {
    // ホテル キララ 郡山
    amenities:
      '露天風呂(客室), 岩盤浴, マッサージチェア, 無料朝食, 24hルームサービス, ガーデン完備',
    reviews:
      '【評判】郡山。露天風呂や岩盤浴を備えた豪華設備が自慢。ウェルカムドリンクと無料朝食のサービスが充実しており、至れり尽くせりの内容。',
  },
};

updateMultipleHotelFacts(updates);
