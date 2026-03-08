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
  '12f2c477-d1e8-471f-97b9-a3dd3c846f51': {
    // 豊中 ホテル サリゴールド
    amenities: 'バリリゾート風内装, 駐車場25台(ハイルーフ可), 清潔な客室, リーズナブルな料金',
    reviews:
      '【評判】豊中エリア。バリ島をイメージしたオシャレなデザインが人気。部屋はコンパクトながら使い勝手が良く、コスパが高い。',
  },
  '64500d34-338d-434d-90ba-b2a8b383c170': {
    // 弘前 ムーンホテル
    amenities:
      '最大6品無料フードサービス, 60インチTV(VIPルーム), 乗馬マシン, コスチューム貸出, Wi-Fi/VOD完備',
    reviews:
      '【評判】弘前。評価4.7の超人気店。無料フードサービスが圧巻の充実度で、至れり尽くせりの「神サービス」が話題。',
  },
  '8c7183c9-82b5-4616-9219-78d77d09df0c': {
    // 弘前 HOTEL ZEN
    amenities:
      '高級旅館風の内装, 駐車場30台(ハイルーフ可), 浴室TV(一部), 朝食スナックサービス, 充実したフードメニュー',
    reviews:
      '【評判】弘前。評価4.7。高級感のある和の空間が落ち着くと大好評。清掃の徹底ぶりとスタッフの親切さが光る名店。',
  },
  '135df3b2-db37-4b28-b2cc-db0943cd9e59': {
    // 大阪 HOTEL MYTH BB
    amenities:
      '大阪・梅田至近(好立地), スタイリッシュ内装, ドリンクサーバー無料(ロビー), マッサージチェア(一部)',
    reviews:
      '【評判】大阪兎我野町。梅田から徒歩圏内で利便性抜群。都会的で洗練されたデザインが、都会派カップルに選ばれている。',
  },
  '13b9adf4-4300-4aad-a96a-613577513262': {
    // 姫路 カルネヴァール
    amenities:
      'Chromecast完備, スマホ動画ミラーリング可, コスプレサービス, 無料Wi-Fi, 駐車場完備, 同性利用可',
    reviews:
      '【評判】姫路。水回りの清潔さとベッドの寝心地が最高評価。LGBTフレンドリーで、誰でも安心して楽しめるモダンな空間。',
  },
  '147eaa37-6a74-402f-aa67-3c7798c95071': {
    // 宇都宮 HOTEL FINE
    amenities:
      'BDSM設備(一部客室), X字固定台/開脚椅子完備, プロジェクター, ソープマット&ローション, 大盛りフードメニュー',
    reviews:
      '【評判】宇都宮。本格的な緊縛・SM設備が整った稀有なホテル。広いバスルームでのローション遊びなども楽しめ、こだわり派に絶大な支持。',
  },
  'd7e13c5a-db46-412a-b967-f56c40befea1': {
    // 新横浜 HOTEL BAMBOO GARDEN
    amenities:
      'ウェルカムアルコール無料(ロビー), 12時レイトチェックアウト, ジェットバス全室, シャンプーバイキング, 無料Wi-Fi',
    reviews:
      '【評判】新横浜。評価8.3の高い満足度。無料ドリンクや豊富なアメニティ、ゆったりした昼過ぎまでの滞在が可能で、贅沢な時間を過ごせる。',
  },
  '63640ed4-a97f-4b09-a3f4-357b3da7af30': {
    // 横浜 Grand Garden
    amenities:
      '元町・中華街駅徒歩5分, バリアフリー設計, ワイングラス/氷無料サービス, 清潔なベッド, 駐車場完備',
    reviews:
      '【評判】横浜寿町。観光拠点として最高の立地。スタッフが非常に丁寧で、清潔感溢れるワンランク上のホテル体験ができる。',
  },
  '36993913-7b8a-4229-8f5a-5ec8d4ac08a9': {
    // 横浜 NUDA by H-SEVEN
    amenities:
      '桜木町・日ノ出町駅近, ReFaドライヤー完備, ドリンクバー/お菓子1品無料, ローションマット, カラオケ',
    reviews:
      '【評判】横浜野毛エリア。オシャレで明るい雰囲気が女性に人気。最新の美容家電も揃っており、デート帰りの宿泊に最適。',
  },
  'f4ecfe58-9cde-4e37-a504-70cbd8b6f792': {
    // 横浜 HOTEL Belta
    amenities:
      'VOD1200タイトル以上, サービス冷蔵庫ドリンク無料, カラオケ/ゲーム完備, 駐車場ハイルーフ対応',
    reviews:
      '【評判】横浜。スタイリッシュで清潔な空間。無料のドリンクサービスや豊富な映画・ゲーム設備で、室内デートが非常に盛り上がる。',
  },
};

updateMultipleHotelFacts(updates);
