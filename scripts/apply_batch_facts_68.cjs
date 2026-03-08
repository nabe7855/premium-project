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
  // --- Batch 68: Urban Luxury & Unique Themes ---
  '35398eae-f4f9-4515-b32f-8da489c00922': {
    // HOTEL J-mex (歌舞伎町)
    amenities:
      '4K液晶TV, 通信カラオケ, ジェット＆ブロアーバス, ドライ/ミストサウナ(一部), Dysonドライヤー(貸出), 無料モーニング',
    reviews:
      '【評判】新宿歌舞伎町。全室4Kテレビやカラオケ完備。ダイソンドライヤーやナノケアスチーマーの無料貸出など、美容への配慮が非常に高く、宿泊時の無料モーニングも人気。',
  },
  '4b094250-dc4a-4a12-9ef8-8e125ef7e5cb': {
    // HOTEL ZAFIRO RESORT (横浜)
    amenities:
      '50インチ大型TV, レインボーバス, 露天風呂(一部), ウォーターサーバー(一部), 空気清浄機, 豊富なアメニティ',
    reviews:
      '【評判】横浜。大画面テレビとレインボーバスで贅沢なバスタイムを楽しめる。一部客室には露天風呂もあり、横浜観光の後にリゾート気分でリラックスできる優良店。',
  },
  'ed08ad95-f998-4a8e-b96c-612e1f2f3139': {
    // HOTEL MYTH YAMASHITA KOEN (横浜)
    amenities:
      'ドライサウナ(一部), 天蓋ベッド, マッサージチェア, 65インチ4Kテレビ, プラズマクラスタードライヤー',
    reviews:
      '【評判】横浜。山下公園近くの好立地。サウナや天蓋ベッドを備えた客室があり、非日常な「お姫様気分」を味わえる。最新の4Kテレビや美容ドライヤーなど設備も一級品。',
  },
  '5bff1cbe-2e9d-44a4-9b5f-f6d0e89751c4': {
    // ホテル ファースト (池袋)
    amenities: '池袋駅近(徒歩5分), 清潔感重視, 持ち込み冷蔵庫, ヘアアイロン, ウーバーイーツ利用可',
    reviews:
      '【評判】池袋。駅東口からすぐの好立地で、とにかく「新しくて綺麗」と評判。シンプルながら必要な設備が揃い、デリバリー利用も可能。コスパと清潔さ重視ならここ。',
  },
  '049f1494-96da-4b4d-9d94-158868cd98c4': {
    // HOTEL FIVE (大阪 日本橋)
    amenities: '光るお風呂「HOTARU」, SMルーム, 85インチ大型TV, ReFaドライヤー, カラオケルーム',
    reviews:
      '【評判】大阪。日本橋駅近。「光るお風呂」や85インチの超巨大TVなど、驚きのエンタメ設備が満載。SMルームや和室もあり、多様なニーズに応える刺激的な最新ホテル。',
  },
  '45e4900b-c85d-470b-88f4-c37a58376dfa': {
    // HOTEL さんまりの Nagoya
    amenities: '全室ウォーターサーバー, ゲーム機完備, アメニティバイキング, 和室あり, 無料Wi-Fi',
    reviews:
      '【評判】名古屋伏見。全室にウォーターサーバーやゲーム機を完備。和室もあり、アメニティバイキングの充実度が凄い。リーズナブルな料金で若年カップルに絶大な人気。',
  },
  '030dcb2d-d801-4cf9-9e32-cec895c4f3f7': {
    // HOTEL SAVOY 鶯谷
    amenities: '無料ドリンクバー, 100種類以上のコスプレ, シャンプーバイキング, VOD, 空気清浄機',
    reviews:
      '【評判】鶯谷。無料ドリンクバーや膨大な種類のコスプレレンタルが最大の特徴。アメニティやシャンプーの貸出も充実しており、手ぶらで長時間楽しめるエンタメ空間。',
  },
  '092d45be-75e2-45cb-8b48-5b4d8e8d396d': {
    // EXECUTIVE HOTEL GRAND GARDEN (横浜)
    amenities:
      '3点独立バスルーム, Google TV, Bluetoothスピーカー, サウナ/露天風呂(一部), 無料駐車場',
    reviews:
      '【評判】横浜。3点独立の使いやすい水回りとGoogle TV完備で自宅のように寛げる。一部のサウナや露天風呂付き客室は、横浜での贅沢な「おこもりステイ」に最適。',
  },
  '0a4232dd-a459-4489-9f60-0bf020538713': {
    // HOTEL IRIS (藤沢)
    amenities:
      '65型TV, カラオケ(DAM), スチームサウナ(一部), 円形露天ジャグジー(一部), 無料ランチサービス',
    reviews:
      '【評判】藤沢。全室に65インチTVとDAMカラオケを完備。ランチやスイーツの無料サービスが非常に手厚く、豪華な露天ジャグジー付きの部屋はエリア最高級の満足度を誇る。',
  },
  '5b084974-1516-4713-9a67-0f1afc82845e': {
    // ホテル 3ねん2くみ (石川)
    amenities: 'SMルームあり, シャンプーバイキング, コスプレレンタル, 静かな森の中の立地',
    reviews:
      '【評判】石川加賀。森の中に佇む隠れ家的なホテル。清潔感が非常に高く、SMルームやコスプレなど「攻めた」設備も完備。オーナーのこだわりが詰まった高評価な穴場店。',
  },
  '3157a35f-c89b-440e-8351-705271284f6a': {
    // HOTEL THE VENTURA (博多)
    amenities:
      '露天風呂(一部), 天蓋ベッド/ブラックライト(一部), ミラーウォール, 無料駐車場(ハイルーフ可)',
    reviews:
      '【評判】博多。ラグジュアリーな雰囲気が漂うHAYAMAグループの旗艦店。一部客室の露天風呂や天蓋ベッドが人気で、ハイルーフ対応駐車場もあり車でのアクセスも抜群。',
  },
  '594b1273-0979-4868-8984-dc8a6b8e389a': {
    // ホテルディアプレス 京橋 (大阪)
    amenities: '駅近(京橋駅すぐ), 24hルームサービス, ホットタブ, ブラックライト(一部), 無料Wi-Fi',
    reviews:
      '【評判】大阪京橋。駅から徒歩圏内の利便性が魅力。24時間対応のルームサービスや清潔なホットタブがあり、ビジネスからレジャーまで幅広く活用できる安定の都市型ホテル。',
  },
};

updateMultipleHotelFacts(updates);
