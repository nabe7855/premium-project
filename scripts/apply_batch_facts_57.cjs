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
  // --- Batch 57: Chugoku & Tottori "Ocean View & Beauty" Facts ---
  '02bdaa8e-b3b1-4999-9082-5c35129b6f07': {
    // HOTEL 小粋 広島 (舟入)
    amenities:
      'シャンプーバー, 24hルームサービス, フェイスマスク, マッサージチェア(一部), 全室VOD/Wi-Fi',
    reviews:
      '【評判】舟入。アメニティバイキングやお菓子サービスが手厚く、女性に嬉しい配慮が満載。部屋が広く快適で、接客も丁寧な「外さない」一軒。',
  },
  'c6a887f0-029e-40be-a0ec-3a33a2a845a7': {
    // HOTEL ruang THE SEA (広島)
    amenities:
      '全室オーシャンビュー, パナソニック製美容家電(スチーマー/ナノケア), Bluetoothスピーカー',
    reviews:
      '【評判】広島西区。全室海が見える絶景と高級美容家電。最新設備と清潔感が際立っており、県内でもトップクラスの人気を誇るリゾート空間。',
  },
  'e2d6f61d-71dd-43b0-bd8f-8f3e391cbd38': {
    // HOTEL Kartini (広島)
    amenities: 'バリ風リゾート, ReFa美容家電, 大型TV, 800タイトルVOD, コスプレレンタル',
    reviews:
      '【評判】広島中心部。バリの雰囲気が完璧に再現されており、ReFaの最新美容家電が使えるのが大きな魅力。料理も安くて質が高く満足度が非常に高い。',
  },
  'bf77304d-f1f4-46a0-9f36-d2e0cdbc0c50': {
    // HOTEL FLAN (広島)
    amenities:
      'デザイナー監修, 天蓋ベッド, ウェルカムスイーツ, モーニングサービス, マッサージチェア',
    reviews:
      '【評判】海田市。スタイリッシュなデザイナーズ空間が全項目で高評価。アワードノミネートも納得のクオリティで、特別な夜にぴったりの演出。',
  },
  'c7b1fb4c-06e4-42b6-a470-1a04fa9e1065': {
    // HOTEL QUEEN'S (広島)
    amenities: 'ウェルカムケーキ/ドリンク, 大型TV, ジェットバス, 豊富な無料レンタル品',
    reviews:
      '【評判】広島安佐北。リーズナブルながらケーキのウェルカムサービス等、おもてなしが充実。清潔でコスパが良く、スタッフの対応も温かいと評判。',
  },
  'd47d0e55-b563-4610-8367-7e33129ac329': {
    // HILLS HOTEL EVE (米子)
    amenities: 'ウェルカムドリンク, 朝食サービス, ブラックライト演出, ジェットバス, ハイルーフOK',
    reviews:
      '【評判】米子。清潔感が4.33と高く、無料の飲食サービスが嬉しい。ブラックライトの幻想的な演出など、非日常を楽しめる仕掛けが好評。',
  },
  'bc4e7b4d-cea3-491b-9c53-c2dff1b706d9': {
    // HOTEL AYAM (米子)
    amenities: '24h対応フロント, 皆生温泉街, 清潔感重視のメンテナンス',
    reviews:
      '【評判】米子皆生。満点評価が続出する圧倒的ホスピタリティ。急な問い合わせにも明るく丁寧に対応するフロントは、他店にはない安心感がある。',
  },
  'f890a47a-9ba3-40e4-a3f4-af1406a3871c': {
    // HOTEL OZ 津山
    amenities: '露天風呂(一部), 豪華デザートサービス, モーニング無料, 豊富なアメニティ',
    reviews:
      '【評判】津山。無料デザートやモーニングの質が高く、部屋の広さと設備の豊富さに驚く声が多い。長居したくなるサービス満点な空間。',
  },
  '80e0db0b-cac3-4160-b329-74d19caa7469': {
    // 岡山 agehA (平井)
    amenities: 'LIVE DAM AiR/STADIUM, 雪肌精化粧品, 露天風呂(一部), コスプレ10点',
    reviews:
      '【評判】岡山平井。本格カラオケ「DAM」最新機種導入で高い支持。雪肌精の化粧品完備など、女性が喜ぶブランドへの拘りも光るエンタメホテル。',
  },
  '7c369118-2687-431c-9f6f-d81191028337': {
    // HOTEL MOSS (福山)
    amenities: 'モダンデザイン, 広い浴室, フロント24h, 完全個別清掃',
    reviews:
      '【評判】福山。落ち着いたモダンな内装と、広い浴室でのリフレッシュが魅力。清掃への信頼が厚く、静かに高品質な時間を過ごせる安定のホテル。',
  },
  '9e325d60-ee80-4169-8ce8-3774edaf27e0': {
    // HOTEL L'ECLAIR (福山)
    amenities: '豊富な女子力アップレンタル品, 接客重視, ウェルカムドリンク',
    reviews:
      '【評判】福山。接客が際立って丁寧で、誰にでも勧められる安心感がある。レンタル品がとにかく豊富で、手ぶらでも理想の滞在が叶う。',
  },
  'a5d76cc3-bc93-4f21-aef9-052939fcd23c': {
    // ホテル スタイリッシュリゾート＆天然温泉 (廿日市)
    amenities: '本格天然温泉, オーシャンビュー(一部), 旅館風広々ルーム',
    reviews:
      '【評判】廿日市。天然温泉を部屋で楽しめる贅沢。一部オーシャンビューの部屋もあり、旅館のような寛ぎとホテルの機能性が両立している。',
  },
  '71dc8bf1-bcda-46a0-8ead-c3cdbe807349': {
    // 海岸物語 (鳥取)
    amenities: '鳥取砂丘至近, 日本海展望立地, レトロモダン趣, 広い駐車場',
    reviews:
      '【評判】鳥取砂丘からすぐの好立地。日本海を望める絶景が話題で、レトロな雰囲気を楽しみつつ砂丘観光の拠点として長く愛される定番店。',
  },
  '64737784-7bdb-457e-9c9e-50d2cdb4ca5b': {
    // HOTEL ZEST (皆生)
    amenities: '皆生温泉立地, 大型TV, ジェットバス, VOD最新機種',
    reviews:
      '【評判】米子皆生。最新エンタメ設備と温泉街の風情を同時に楽しめる。コスパが非常に高く、地元客からも観光客からも信頼される優良店。',
  },
};

updateMultipleHotelFacts(updates);
