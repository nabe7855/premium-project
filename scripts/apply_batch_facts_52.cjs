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
  // --- Batch 52: Central Japan (Hokuriku & Tokai) Premium Facts ---
  '3573139e-7f03-4f00-864e-8285ce662a11': {
    // レステイ 新潟
    amenities: '24時間ルームサービス, 無料Wi-Fi, 充実のアメニティ, 大型TV, 冷蔵庫, 電気ケトル',
    reviews:
      '【評判】新潟。24時間対応のルームサービスと安定した設備で、観光・ビジネス共に評価が高い。充実のアメニティで手ぶら利用も安心。',
  },
  '95e465b5-30ac-41a8-bbd1-ca0dbead5150': {
    // ウォーターゲート富山
    amenities: '全室無料Wi-Fi, 無料駐車場, ルームサービス, コーヒーサービス, 充実の基本設備',
    reviews:
      '【評判】富山。リーズナブルながら安定した設備とサービス。無料Wi-Fiや駐車場完備で、移動の多い旅行者にも選ばれている。',
  },
  'f9a39ae7-080d-46fb-a565-133078c6c28d': {
    // H-SEVEN TOYAMA
    amenities:
      '70インチTV(一部), Chromecast, レインボーブロアバス, ウォーターサーバー, ナノケアヘアドライヤー',
    reviews:
      '【評判】高岡。70インチの巨大TVやChromecast、レインボーバスなど、北陸エリア屈指の「室内エンタメ」充実度を誇る人気店。',
  },
  'afcd55ec-eecb-480b-ad38-0d57bd8903d4': {
    // THE TOWER HOTEL 金沢
    amenities:
      'マッサージチェア/ジェットバス(一部), 大型TV, 電子レンジ, 空気清浄機, VOD, デザイナーズ空間',
    reviews:
      '【評判】金沢。タワーならではの開放感と、マッサージチェア完備の客室が魅力。清潔でモダンな空間は、金沢観光の疲れを癒やすのに最適。',
  },
  '18517f70-823f-4ed7-90ea-4cf95a69bb7d': {
    // Regina Kanazawa (レジナ カナザワ)
    amenities: '水中照明付きジェットバス, 全室浴室TV, カラオケ, 無料Wi-Fi, スタイリッシュ内装',
    reviews:
      '【評判】金沢。水中照明に照らされるジェットバスと浴室TVで、贅沢なバスタイムを楽しめる。スタイリッシュな内装も好印象。',
  },
  '1c5e9a83-446b-4303-9f12-92cfafda0b1f': {
    // Regina River Side (金沢)
    amenities:
      'マイクロバブルバス(201号室), 露天風呂付き客室(一部), ジャグジー, 大型プラズマTV, DVD/BDプレーヤー',
    reviews:
      '【評判】金沢。美肌効果のマイクロバブルバスや露天風呂、大型プラズマTVなど、設備へのこだわりが光る金沢のリバーサイド拠点。',
  },
  'cf7b12b0-4d76-4eae-bcef-6f2c6f288782': {
    // NEXT X (福井)
    amenities:
      'モダンゴシックデザイナーズ, ウォーターサーバー, 空気清浄機, 浴室TV, ヘアアイロン, セレクトシャンプー',
    reviews:
      '【評判】福井。有名デザイナーが手掛けるモダンゴシックな別世界。充実の美容家電とウォーターサーバー完備で、女性支持が極めて高い。',
  },
  '6e91a110-e6bf-4c4c-b803-63090713bc63': {
    // NEXT BROS (福井)
    amenities:
      'ヨーロピアンモダン, 大型浴室TV, マッサージチェア(一部), ウェルカムドリンク, 豊富なレンタル化粧品',
    reviews:
      '【評判】福井。ヨーロピアンな気品漂う内装。大型の浴室TVや豊富なレンタル化粧品など、至れり尽くせりのサービスがカップルに好評。',
  },
  '323fe170-fa1a-401f-b03e-e37eccf33e37': {
    // バニラ 小牧
    amenities:
      '全室人工温泉, 露天風呂(8室), ダーツ/カラオケAi, コンセプトルーム(電車/貝殻ベッド等), 無料ソフトクリーム',
    reviews:
      '【評判】小牧。人工温泉や露天風呂、さらに電車や貝殻ベッドといったユニークなコンセプトルーム。遊び心が詰まった愛知屈指のパラダイス。',
  },
  '92e19c51-e826-449a-8c0a-540bbc2a61ef': {
    // DESIGN HOTEL W ZIP CLUB
    amenities:
      'Netflix/Amazon Prime視聴可, 24時間フードサービス, 耳栓/紙コップ完備, 高い清潔感, 駐車場完備',
    reviews:
      '【評判】名古屋。Netflix完備や細やかな気配り（耳栓等）が嬉しいデザイナーズ。名駅近くで清潔感と利便性を両立した、ハズレのない名店。',
  },
  'd0805245-e0ce-449c-bfeb-4d79b520546e': {
    // HOTEL WiLL一宮店
    amenities:
      '全室ReFa/マイナスイオンドライヤー完備, サウナ(一部), 400タイトルVOD, 禁煙ルームあり',
    reviews:
      '【評判】一宮。全室にReFaなどの高級美容家電を完備。シンプルで清潔なデザイナーズ空間と、サウナ付き客室が、最高の癒やしを提供。',
  },
  'a7eb6dea-9f2c-43c7-9f4a-6e8467716e1e': {
    // HOTEL JIN (浜松)
    amenities:
      'オーシャンビュー/シティビュー, 広々とした客室, バスローブ, 電子レンジ, ストリーミングサービス',
    reviews:
      '【評判】浜松。海や街を一望できるパノラマビューが圧巻。バスローブ完備の広い客室と高い清潔感で、浜松での特別な一夜を演出する。',
  },
};

updateMultipleHotelFacts(updates);
