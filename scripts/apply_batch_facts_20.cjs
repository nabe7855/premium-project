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
  '57765a59-efed-47f6-b883-ce5e1abb9f58': {
    // エルミタージュ 相模原
    amenities:
      '無料モーニング, ウェルカムフード, カラオケ(一部), 大きなソファ, 駐車場28台(ハイルーフ可)',
    reviews:
      '【評判】相模原。朝食が無料で美味しいと非常に好評。フロントスタッフの丁寧な対応と、ゆったり寛げる大きなソファが人気の秘密。',
  },
  '70338471-f172-4d29-91be-b8a15437eea6': {
    // acotte 福岡
    amenities:
      '「別邸」コンセプト, 電子レンジ, 24hフロント, キャッシュレス決済対応, 清潔感重視の設計',
    reviews:
      '【評判】福岡平尾。ラブホテル初心者でも安心して利用できる「別邸」のような落ち着いた空間。清潔感においてトップクラスの評価。',
  },
  '48ef29fd-d115-4910-aa68-602d472253b3': {
    // SIGNAL 秋田
    amenities: '最新バスルーム, ジェットバス(一部), 浴室TV, ウェルカムスイーツ, メンバー特典充実',
    reviews:
      '【評判】秋田。総合評価4.9を誇る超人気店。最新のバスルームと充実したウェルカムサービスが、若い層から絶大な支持。',
  },
  'd66b9604-88df-47de-b848-912b2dfd0314': {
    // HAYAN 秋田
    amenities:
      '最新VOD, オーバーヘッドシャワー, サウナ(一部), 無料食事2品サービス, アダルトグッズ無料レンタル',
    reviews:
      '【評判】秋田大町。1組2品まで無料の食事が「ファミレス並み」に美味しいと話題。サウナ付きの部屋もあり、コスパが非常に高い。',
  },
  'd5c6c2ec-db74-46f4-ab6b-f063088bbf47': {
    // ちょっと美郷
    amenities:
      '100インチプロジェクター, 75インチ大型TV, ウォーターサーバー, カラオケ(JOYSOUND f1), 浴室TV/水中照明',
    reviews:
      '【評判】美郷。設備の豪華さが圧巻。100インチの大画面で映画や動画を楽しめる点や、最新カラオケ完備でグループ利用も盛り上がる。',
  },
  '7e35fac5-0dae-43d7-9100-373ff14d73ff': {
    // IKINA HOTEL 秋田
    amenities: 'Chromecast全室, スマートTV, ナノ水導入, 24h食事オーダー, 浴室TV, USBポート完備',
    reviews:
      '【評判】秋田。YouTube等を大画面で楽しめるChromecastが全室にあり、ナノ水でお肌にも優しい。食事が美味しく、長居したくなる一軒。',
  },
  '753e0ba1-d937-4501-8d89-80a729a9dc90': {
    // ホテル ジャルダン 秋田
    amenities: 'サウナ(一部), 浴室TV, 広々とした浴室, メンバー割引, キャッシュレス決済完備',
    reviews:
      '【評判】秋田浜田。少し歴史を感じる外観だが、中は非常に広くて清潔。従業員の対応が温かく、サウナ付きの広い風呂でリフレッシュできる。',
  },
  '0ba64cf2-72fd-48a5-b947-7b76e7d54793': {
    // キャロルはうす 仙北
    amenities: '55型4Kテレビ, JOYSOUNDカラオケ, マッサージチェア(14室), 浴室テレビ, 32台大型駐車場',
    reviews:
      '【評判】横手。広大な駐車場と、55型の大画面TVが自慢。部屋の暖房がしっかり効いて冬でも快適、清潔感溢れる空間でリピーターが多い。',
  },
  '2c387785-5a02-4a33-8fb1-9e7c87c4a4f2': {
    // ピアロード 米沢
    amenities: '800タイトルVOD, マッサージチェア(一部), カラオケ(一部), ハイルーフ駐車場全室対応',
    reviews:
      '【評判】米沢。山間部の静かな環境で、誰にも邪魔されず過ごせる。リーズナブルな料金と豊富な映画タイトルが魅力の隠れ家的ホテル。',
  },
  'eb1f03ea-ce90-429f-b0a8-ea89f9448175': {
    // リビエラ 横手
    amenities: '全室天然温泉付き, 和風客室, プライバシー重視, ハイルーフ駐車場完備, 15室限定隠れ家',
    reviews:
      '【評判】横手。全室に天然温泉が引かれている贅沢な仕様。和の趣を感じる静かな客室で、温泉三昧の宿泊が楽しめると温泉好きに人気。',
  },
  'c6b99796-fe27-4782-8b4a-9fe5bb2f9068': {
    // ドルチェ 横手
    amenities: '全室ハイルーフ駐車場対応, 広々とした客室, 清潔感重視のメンテナンス, 24h受付',
    reviews:
      '【評判】横手。部屋の広さと清潔さにおいて安定した高評価。特に車での利用がスムーズなガレージタイプで、プライバシーが守られ快適。',
  },
  'fcbca3c7-fd3d-4211-b4a0-5cab59d61ffd': {
    // ピンクのおもち 秋田
    amenities: '水中照明, 可愛いパステルカラー内装, マッサージチェア(一部), キャッシュレス決済対応',
    reviews:
      '【評判】秋田市。パステルカラーの可愛い内装が特徴。水中照明のあるお風呂など、視覚的に楽しめる工夫があり、価格もリーズナブル。',
  },
  'f4161bc4-e1c0-4b06-94bb-1bbe87e97daf': {
    // ホテル 林檎帝 鹿角
    amenities: 'プール付きルーム(一部), リンゴ園に囲まれた立地, 静かな環境, 最新レジャー設備',
    reviews:
      '【評判】鹿角。リンゴ園の中に佇む静かなロケーションが最高。一部の豪華な部屋にはプールもあり、リゾート気分を存分に味わえる。',
  },
};

updateMultipleHotelFacts(updates);
