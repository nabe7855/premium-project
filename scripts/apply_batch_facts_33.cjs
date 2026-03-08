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
  // --- Batch 33: Multi-Region High Impact ---
  '27adfb56-de24-43ca-920c-2a7a96b8fad4': {
    // ホテル ゆめや (京都)
    amenities:
      '岩盤浴&ミストサウナ(VIP), 無料カレーサービス, ウォーターサーバー全室, ワンガレージ式, 飲料水使用',
    reviews:
      '【評判】京都南。圧倒的なコスパと接客。VIPルームの贅沢な岩盤浴設備に加え、無料のカレーが絶品。スタッフの教育が行き届いた超優良店。',
  },
  '41ff6964-1d45-430e-9ac8-cc65e4915b88': {
    // バリアンリゾート東名川崎
    amenities: 'BBQ設備(一部), 庭園, 宝石箱スイーツ, 深夜まで飲み放題, 異国情緒バリ仕様',
    reviews:
      '【評判】川崎。もはやホテルの枠を超えたレジャー施設。無料のスイーツやドリンク、BBQまで楽しめる圧倒的なサービス精神が若者に絶大な支持。',
  },
  '7b9e1025-9cdb-4481-ad3a-66170561dc85': {
    // ロータスバリ (川崎)
    amenities: '天蓋付きベッド, フラワーバス(人気), 岩盤浴, 充実のアメニティ, 川崎駅近',
    reviews:
      '【評判】川崎。駅近でバリ島へトリップ。天蓋付きベッドや本物のフラワーバスを楽しめる「映え」の宝庫。女性が喜ぶ清潔感とアメニティが完璧。',
  },
  'c44cbaaa-5de0-49ab-963c-305b14ef67c4': {
    // スターリゾート ハーズ (相模原)
    amenities:
      'ウォーターサーバー&ネスプレッソ全室, Netflix/YouTube見放題, サウナ完備, 豊富なアメニティ',
    reviews:
      '【評判】相模原。全室にサーバーとコーヒーマシンがある「至れり尽くせり」の宿。動画配信サービスの充実度と、サウナ付き客室での整い体験が最高。',
  },
  'aeda569a-7bde-4465-8a4e-8aea81e36199': {
    // シャール (上野)
    amenities: '上野駅至近, 昭和レトロな趣, リーズナブル, 広い浴室, 昔ながらの安心感',
    reviews:
      '【評判】根岸。上野エリアでのコスパ重視ならここ。建物は古いが清掃が行き届いており、広い風呂と親しみやすいサービスでリピーターが多い。',
  },
  'a1e43157-f073-4c7a-8f97-0e939e850c6b': {
    // エルディアモダン 神戸
    amenities: '室内ボルダリング(一部), 24時間フロント, ルームサービス豊富, デザイン性の高い内装',
    reviews:
      '【評判】神戸。遊び心満載のデザイナーズホテル。室内ボルダリングなど他にはない設備があり、アクティブなデートを楽しみたいカップルに最適。',
  },
  'a56ee3b0-ac92-4489-b097-e3834429b013': {
    // 現代楽園 伊勢原 (1024)
    amenities:
      '全室電子レンジ&冷蔵庫, 個性的インテリア, 家具付きパティオ(一部), 無料Wi-Fi, 広い駐車場',
    reviews:
      '【評判】伊勢原。名前の通り大人のパラダイス。パティオ付きの部屋など開放感あふれる空間が自慢。スタッフの対応も非常に親切で安心感がある。',
  },
  '60324427-02bb-417f-90ac-93305ac14654': {
    // 現代楽園 伊勢原 (1043)
    amenities: '全室電子レンジ&冷蔵庫, 個性的インテリア, 家具付きパティオ(一部), 無料Wi-Fi',
    reviews:
      '【評判】伊勢原。246号沿いのアクセス至便な楽園。清潔感あふれる広い室内と、プライバシーが守られた空間で、二人だけの静かな時間を楽しめる。',
  },
  'df837f5f-9de3-4344-805e-db925d8fd14a': {
    // EXY (海老名)
    amenities: '天蓋ベッド, ブラックライト, 浴室TV全室, 露天風呂(一部), Chromecast導入',
    reviews:
      '【評判】海老名。天蓋ベッドと水中照明でロマンチックな演出が抜群。最新の動画配信サービスやマッサージチェアもあり、おこもりデートにぴったり。',
  },
  '8029f9f4-fed3-477e-a4f8-0e1b7fdc14c8': {
    // シャンティ 赤坂
    amenities:
      '回転ベッド(一部), 60インチ大型TV, ドライサウナ全室(一部), 赤坂駅徒歩1分, レインボーブロアバス',
    reviews:
      '【評判】赤坂。都心の一等地にありながら、回転ベッドやサウナを備えた「まさにラブホテル」の贅沢を楽しめる。最新家電も揃っておりラグジュアリー。',
  },
  '99751773-5748-4854-b783-9f395b50ab5c': {
    // ジャガーホテル明石
    amenities: 'スチームサウナ, マイクロバブルバス, 3D対応大画面TV, 豪華AV設備, 明石駅近',
    reviews:
      '【評判】明石。設備クオリティが非常に高い。特にスチームサウナとマイクロバブルバスのセットは、美容に関心の高い女性客から絶賛されている。',
  },
  '283567c1-94ee-4f5e-85cf-e8730a5be7f4': {
    // カプロ (熊本) - (推測含む)
    amenities: '水前寺エリア, ウェルカムフード, 広い駐車場, 清潔な客室, モダンインテリア',
    reviews:
      '【評判】熊本。水前寺近くの立地で、落ち着いたモダンな内装が大人に人気。手頃な価格設定と、深夜まで利用できる利便性が重宝されている。',
  },
};

updateMultipleHotelFacts(updates);
