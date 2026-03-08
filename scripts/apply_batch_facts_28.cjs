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
  'b18e4e9c-28ef-4c59-b7bf-15f968b0f8ae': {
    // 西葛西 WILL BAY CITY
    amenities:
      '2階フリースペースラウンジ, ウェルカムドリンクバー, シャンプーバー, 洗濯機/乾燥機完備, ブルックリン風客室(一部)',
    reviews:
      '【評判】西葛西。TDRへのアクセスが良く、充実したラウンジと豊富なアメニティバイキングが魅力。家族連れやビジネス利用にも最適で、手厚い無料サービスが嬉しい。',
  },
  '81f2365a-5d65-47cc-98a0-f1cca28cd942': {
    // 赤坂 HOTEL KARUTA
    amenities:
      '本格檜風呂, 露天風呂(一部), 和モダンデザイナーズ内装, アメニティバイキング(高品質), カラオケ',
    reviews:
      '【評判】赤坂。都会の喧騒を忘れる高級和モダン空間。檜の香りに癒やされるバスタイムと、選び抜かれたアメニティが「カルタ」ならではの贅沢を演出。',
  },
  'c0101503-1afe-4a19-9aa0-6a17b98a39b6': {
    // 池袋 HOTEL SPERANZA
    amenities:
      'ミストサウナ(一部), リクライニングベッド(一部), デザイナーズルーム, セレクトシャンプー, 大型TV',
    reviews:
      '【評判】池袋。リーズナブルな料金で利用できる多彩なコンセプトの部屋が自慢。ミストサウナ付きの部屋など、こだわり設備でお得にリフレッシュできる。',
  },
  '8c62727b-d089-4f2e-875d-667fdeaccef6': {
    // 渋谷 HOTEL if
    amenities:
      'ミストサウナ全室, カラオケ全室完備, レインボーバス, VOD映画見放題, 充実の女子会プラン',
    reviews:
      '【評判】渋谷。ミストサウナとカラオケが全室に備わる充実ぶり。渋谷駅からすぐの好立地で、手ぶらで最高のエンターテインメント空間を満喫できる。',
  },
  'bb125391-8941-46b4-8eea-8352835dc03e': {
    // 横浜 LUSSO CROCE URBAN
    amenities:
      '地域最多級露天風呂, レインボーバス, 専用サウナ(一部), 天然温泉(一部), 空気清浄機完備',
    reviews:
      '【評判】横浜中区。本格的な露天風呂を楽しめる「クローチェ」の都市型モデル。充実のスパ設備と清潔な室内で、長時間滞在も飽きさせない。',
  },
  '453a6eed-1949-46ae-ac1f-fb39a0ea356b': {
    // 高崎 ホテル ターザン
    amenities:
      '格安ルームサービス(手作り料理), アニマル柄デザインルーム, レインボーバス, 各種電子マネー対応',
    reviews:
      '【評判】高崎。手作りの美味しい料理が格安で楽しめるルームサービスが絶品。独創的なインテリアと充実の浴室設備で、楽しい一夜を過ごせる。',
  },
  '046be3f9-8f35-4c8a-8272-1c88ce613563': {
    // 町田 HOTEL ATLANTIS
    amenities:
      '強力ドライサウナ(110℃超), 貝殻ベッド, 露天風呂, YouTube/クロームキャスト対応, 各種マッサージ機',
    reviews:
      '【評判】町田。サウナ愛好家も唸る110℃超の高温サウナが圧巻。貝殻ベッドなどの非日常演出と、最新のネット動画対応で一歩先を行く満足度。',
  },
  'ecd706a7-5de2-43b2-b6f4-08e4c68c7c1f': {
    // 浅草 HOTEL EDOYADO
    amenities:
      '天蓋ベッド, 岩盤浴/ミストサウナ, 日焼けマシン, 24室全室異なるデザイン, プロジェクターシアター',
    reviews:
      '【評判】浅草。浅草駅徒歩1分の好立地にありながら、岩盤浴や日焼けマシンまで備える充実度。全室デザインが異なり、来るたびに鮮やかな刺激をくれる。',
  },
  'ba5f2c86-ce06-4517-8ebe-e350e48dc84e': {
    // 渋谷 VILLA GIULIA 道玄坂
    amenities:
      '選べる入浴剤3種, ウェルカムブラウニー/ドリンク無料, ジェットバス, 最新美容家電, オシャレな北欧風内装',
    reviews:
      '【評判】渋谷。可愛らしい北欧風の内装と、充実の無料スイーツ・ドリンクサービスが女性に大人気。広いジェットバスで渋谷の夜を贅沢に締めくくれる。',
  },
  '0d925e2c-53d0-4f5e-ba12-7ba2dd3ccca8': {
    // 小平 HOTEL deLALA
    amenities:
      '和室タイプ(一部), 24hロングステイプラン, 清潔感あふれる広々客室, セレクトシャンプー, Wi-Fi完備',
    reviews:
      '【評判】小平。エリア屈指の清潔感と広さを誇る。24時間滞在可能なロングプランが人気で、和やかな雰囲気の中で心ゆくまでリラックスできる名店。',
  },
};

updateMultipleHotelFacts(updates);
