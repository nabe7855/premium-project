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
  'a06c37c4-0fb0-4138-8b2f-7ebf9db9c0bf': {
    // HOTEL555～Air～山形店
    amenities:
      'ダーツ(全室搭載), Chromecast, 水中照明ブロアバス, ドライサウナ(一部), 低反発ベッド, 和モダン「nagomi」ルーム',
    reviews:
      '【評判】東根。全室にダーツがあるという驚きの設備。清潔感抜群の和モダンな部屋や、動画を楽しめるChromecastなど、室内遊びの質が極めて高い。',
  },
  'b1565206-becf-4a16-80f0-6045abd89e25': {
    // ホテル エリーゼティアラアルファ (酒田)
    amenities:
      'ガレージイン(1室1ガレージ), サウナ付きルーム, Chromecast, 浴室TV, 豊富な無料レンタルコスメ',
    reviews:
      '【評判】酒田。プライバシー万全のガレージ形式。外観以上に内装が洗練されており、サウナや浴室TVで贅沢な時間を過ごせるとリピーター続出。',
  },
  'b31beb49-4b02-478b-9bc1-3f19d30a8a94': {
    // ホテル チャチャ山形店
    amenities:
      '岩盤浴(一部), レインボーバス, 和豚もち豚メニュー, 最新VOD, マッサージチェア, 浴室TV',
    reviews:
      '【評判】山形。ホテルの域を超えた「和豚もち豚」の絶品メニューが隠れた人気。岩盤浴やレインボーバスなど、体の芯から癒やされる設備が充実。',
  },
  '813cb573-fb3f-46e1-a47c-33612cce9248': {
    // ホテル クロス
    amenities:
      '全室フルリニューアル, ウォーターサーバー, 高音質水中照明, iPhone/Android充電器, VOD',
    reviews:
      '【評判】久留米。フルリニューアル直後のため、とにかく新しくて綺麗。接客からお風呂の清潔感まで、全ての項目で満点に近い評価を得ている。',
  },
  '807b7743-65e9-482f-9e57-64370a72e4c7': {
    // HOTEL M
    amenities:
      '美人の湯温泉, 1400タイトルVOD, 65型大型TV(一部), マッサージチェア, クリスマス装飾(季節限定)',
    reviews:
      '【評判】沼田。本格的な「美人の湯」を室内の風呂で楽しめるのが最大の魅力。1400本もの映画と、最新のマッサージチェアで一日中籠もれる。',
  },
  '2a3a799d-ef38-494a-9747-8c562a1cb34a': {
    // ホテル ドラゴンリゾート
    amenities:
      'デザイナーズコンセプト(西海岸/フレンチモロッカン), 70台大型駐車場, 会員ランチ無料, 2022リニューアル',
    reviews:
      '【評判】岐阜。コンセプトの異なるデザイナーズルームがオシャレで女性に人気。会員特典の無料ランチなど、サービス精神に溢れた名店。',
  },
  '32c1cd0d-7645-46ac-a3c8-5c63b5b00201': {
    // HOTEL La SaiSon
    amenities: '高崎問屋町駅近, 無料Wi-Fi, 浴室TV, 豊富なアメニティ, 駐車場完備',
    reviews:
      '【評判】高崎。立地の良さと、細部まで行き届いた清掃が好評。アメニティの種類が多く、急な宿泊でも困らない安心のリゾート。',
  },
  '03b6c093-f7b1-4e82-a437-27941c2480a2': {
    // 多治見ホテルロコガーデン
    amenities: 'プライベート岩盤浴, 160種類無料レンタル, 高級美容家電, 1500タイトルVOD, 浴室TV',
    reviews:
      '【評判】土岐。160種類もの無料レンタル品は圧巻。誕生日のサプライズ演出など、スタッフのホスピタリティが非常に高く、温かい気持ちになれる。',
  },
  'f8c404fa-fc7b-4832-9233-aa61363d5466': {
    // ホテル夕陽
    amenities: '全室オーシャンビュー(日本海), 広いバスルーム, 静かな環境, 駐車場完備',
    reviews:
      '【評判】酒田。その名の通り、日本海に沈む夕陽を眺められる絶景ホテル。静かな環境で、波の音を聞きながらのリラックスタイムは至福。',
  },
};

updateMultipleHotelFacts(updates);
