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
  'f46fb5d2-eded-4632-89ed-377edaf9b928': {
    // HOTEL COLORFUL P&A SHINJUKU
    amenities:
      '露天風呂(VIPルーム), レインボーライト&ジェットバス, 豊富なシャンプーバー, SNS映え内装, ウェルカムドリンク',
    reviews:
      '【評判】歌舞伎町。SNS映え間違いなしのカラフルで清潔な内装が女子会に大人気。VIPルームの露天風呂や充実したアメニティで、非日常のパーティ気分を味わえる。',
  },
  '23b2f184-7952-4b55-a539-7dc550bff034': {
    // HOTEL GRASIA ASIAN RESORT
    amenities:
      '全室マイクロファインバブル導入, 独立ヴィラタイプルーム, 敷地内に池と滝, アジアンリゾート空間',
    reviews:
      '【評判】伊勢崎。心を解放する圧倒的なリゾート感。全室導入のマイクロバブルで肌を整えながら、水辺の隠れ家のような静寂の中で贅沢な時間を過ごせる。',
  },
  'a77fd1ca-b70a-42a2-8ebd-f8b6a507e6a7': {
    // HOTEL Te MOANA OTSUKA
    amenities:
      '大塚駅徒歩すぐ, 広い客室, 衛星チャンネルTV, 浴室TV完備, ミネラルウォーター無料サービス',
    reviews:
      '【評判】大塚。駅近の利便性と、エリア屈指の部屋の広さが魅力。浴室TV付きの広々としたバスルームで、平日の昼間もお得にゆったりとリラックスできる名店。',
  },
  'a274b63f-d616-4a8f-a279-8906e0e0e670': {
    // ホテル DUO-M/DUO-F
    amenities:
      '駐車場60台完備, カラオケ全室, コスプレレンタル, 天神エリア至近, 清潔なデザイナーズ内装',
    reviews:
      '【評判】那の津。天神から車ですぐの好立地ながら、60台の広大な駐車場を完備。全室でのカラオケやコスプレなど、福岡の夜を遊び尽くす拠点として最適。',
  },
  '2617a523-388c-42e7-8432-8cf20beefac4': {
    // HOTEL COSTA RESORT 大宮
    amenities:
      'JOYSOUND最新カラオケ, 水中照明付きバブルバス, マッサージチェア, スタイリッシュデザイナーズ',
    reviews:
      '【評判】大宮。一流デザイナー監修のおしゃれな空間。水中照明が煌めくバブルバスと本格マッサージチェアで、自分へのご褒美タイムを過ごせる一軒。',
  },
  '484f8e71-084f-4a3f-ab6a-e312e7f87b0d': {
    // HOTEL THE HOTEL
    amenities:
      'デザイナーズLED演出ルーム, 50インチ以上大型TV, 低反発マットレス, 2WAYヘアアイロン, 充実のアメニティ',
    reviews:
      '【評判】歌舞伎町。近未来的なデザインとLED演出が刺激的。全室50インチ大画面と低反発ベッドの快適さ、そして女性に配慮した高品質家電の提供が嬉しい。',
  },
  '77f12546-4370-480b-97fd-bb06ea2ee9d4': {
    // ホテル X
    amenities:
      '露天風呂付き客室(一部), 池袋駅徒歩5分, コスプレ豊富, チェックアウト12時, 女子会最適プラン',
    reviews:
      '【評判】池袋。駅から5分の好アクセスと、翌日12時までのゆったり滞在が人気。露天風呂付きの部屋や多彩なコスプレで、思い出に残るひとときを楽しめる。',
  },
  '4b307caf-9c18-4283-aa71-e6fc317643a5': {
    // ホテル ウォーターバリ 伊勢崎
    amenities:
      '全室均一料金, レインボーバス, マイクロバス, 大画面VOD, Chromecast, 車から直接入室可',
    reviews:
      '【評判】境上渕名。12室すべてが均一料金で安心。車から直接部屋へ入れるプライバシー配慮と、マイクロバス等の充実設備が驚きのリーズナブル価格で提供。',
  },
  '26b74546-3f94-4107-8000-f0425ca0a958': {
    // HOTEL ripples
    amenities:
      '飲み放題(時間無制限), 豪華ルームサービス, 岩盤浴/ドライサウナ(一部), オートカールアイロン無料貸出',
    reviews:
      '【評判】函館。リゾートホテルのようなサービス。時間無制限の飲み放題やナノケアスチーマー、さらにはサウナ付き客室など、函館観光の疲れを癒やす最高の宿。',
  },
  '0a0b4cb3-8581-49d1-ba32-e0b1007969f2': {
    // サザンクロス ホテル (シティホテルサザンクロス)
    amenities: '新大久保駅チカ, VOD完備, 周辺飲食店豊富, リーズナブルな休憩プラン',
    reviews:
      '【評判】百人町。駅からのアクセスの良さと、周辺の新大久保グルメを楽しみながら利用できる点がメリット。シンプルな設備で手軽に利用したい時に。',
  },
};

updateMultipleHotelFacts(updates);
