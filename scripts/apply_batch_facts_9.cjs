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
  '2abff19a-6817-48f7-b20b-e31663ac2a29': {
    // ホテル MOJI
    amenities: '関門海峡一望露天風呂(一部), ジェットバス, マット, 広い駐車場',
    reviews: '【評判】門司港エリア。一部客室から望む夜景が最高。清潔感がありコスパが良いと好評価。',
  },
  '00f8550b-f213-4476-babd-90170228a1c1': {
    // 山王
    amenities: '最新VOD, 広いお風呂, 清潔な客室, Wi-Fi完備',
    reviews:
      '【評判】鶯谷エリア。気さくで丁寧な接客がリピーターに愛される理由。派手さはないが、落ち着いて過ごせる安心感がある。',
  },
  '3f99938e-2424-4edc-8ccf-64c792603502': {
    // ホテル ローリエ
    amenities: '中野駅近(唯一のホテル), 全11室, 無料Wi-Fi, 清潔な室内',
    reviews:
      '【評判】中野エリアでの利用に非常に便利。建物は古めだが、中はしっかり整備されており快適。',
  },
  '417fb089-3d8b-4f47-830e-27748c46647f': {
    // ホテルバリアンリゾート新宿本店
    amenities:
      '豪華無料ビュッフェ(ロビー), 生ビール/ワイン無料, カラオケ/ダーツ, マッサージチェア, 充実アメニティバー',
    reviews:
      '【評判】歌舞伎町。圧倒的な豪華サービスでデイユース・女子会に最適。手ぶらで一日中楽しめる「リゾート空間」として絶大な人気。',
  },
  'd709a997-6a32-4e4c-a048-0adb4eea0dd6': {
    // 小さな恋の物語
    amenities:
      '天蓋付きベッド, 日焼けマシン, ウォーターサーバー, 加湿空気清浄機, 浴室TV, プロジェクター',
    reviews: '【評判】大塚。天蓋ベッドなど内装が可愛らしく、設備も非常に充実しているのが特徴。',
  },
  'fcbb2177-e38a-4ea1-88f3-86cec0ce99de': {
    // ホテル ゼクス
    amenities: '基本設備完備, 電子レンジ, 有線放送, ポット, 駐車場あり',
    reviews:
      '【評判】府中。アットホームで実用的な「わが家」のような落ち着いた雰囲気で利用しやすい。',
  },
  '5a24d0aa-bd8a-45b5-8bfe-7e6159fd29ab': {
    // ホテル アニバーサリー
    amenities: '露天風呂自慢, 広い客室, 駐車場23台(ハイルーフ5台可)',
    reviews: '【評判】八王子。設備に対するコスパが良く、特に広いお風呂と親切な接客が好印象。',
  },
  'ce92964a-a5cc-4dc6-bb23-de8c809d1077': {
    // 錦糸町 ホテル プチテル
    amenities: 'モダン&スタイリッシュな客室, 充実のアメニティ, 一人・同性利用OK',
    reviews:
      '【評判】評価4.6。錦糸町駅近で、清潔感とスタッフの対応が非常に良い。高級ホテルに引けを取らない満足度。',
  },
  '13f2a218-1c97-4ce5-ad09-2d91d57539a0': {
    // ホテル ラパンセ
    amenities: '浦和駅徒歩6分, VOD, ヘアアイロン全室, ウェルカムお水, 清潔でおしゃれな内装',
    reviews:
      '【評判】浦和エリア。2017年オープンの比較的新しい店舗。清潔感とおしゃれな雰囲気が女性に好評。',
  },
  '29896eba-1c50-49d6-9749-4ebc76a38e33': {
    // ホテル アルファ
    amenities: '本格イタリアンルームサービス, BDプレイヤー, マイナスイオンドライヤー, ヘアアイロン',
    reviews: '【評判】歌舞伎町。食事が美味しいと評判。部屋は清潔でスタッフの対応も協力的な老舗店。',
  },
  '2a975115-6f2f-4a88-b2cc-7c0d465e1bb6': {
    // HOTEL ARIEL
    amenities: 'モーテルタイプ(部屋前駐車), 長いフリータイム, 激安料金設定, コスプレ衣装',
    reviews: '【評判】瑞穂町。圧倒的な安さと時間の長さが魅力のコスパ最強モーテル。',
  },
  'ac2b3ae1-58a7-423b-bc1f-f58dfe75211b': {
    // HOTEL PURE81
    amenities: '全面リニューアル済み, 天神・中洲徒歩圏内, 電子レンジ(一部), 充実アメニティ',
    reviews: '【評判】福岡春吉。新しく清潔で、立地の良さが観光や飲み会帰りに最適。',
  },
  'b853c27c-1d45-408f-8782-76f2cded4389': {
    // HOTEL 凛
    amenities: '和モダン内装, 無料生ビール(時間制), 絶品無料朝食(平日), マイクロバブルバス',
    reviews:
      '【評判】福岡春吉。中洲近くの隠れ家。無料ドリンクや朝食などサービス精神旺盛で、オシャレな空間が女性に大人気。',
  },
  '23af1827-bab5-4a84-bff1-6438d4ab5b26': {
    // ホテル リトルチャペルクリスマス
    amenities: '100種パフェ&350種フード, ダーツ搭載コンセプトルーム, VR, ホタルバスルーム',
    reviews:
      '【評判】博多エリア。圧倒的なメニュー数と遊べる設備が自慢。デートが盛り上がるコンセプトルームが豊富。',
  },
  '2aed5fb0-d414-4813-8f90-d539855d4f2e': {
    // HOTEL 03
    amenities: '2024年リニューアル, YouTube/Netflix視聴可, 全室禁煙, 泡風呂',
    reviews:
      '【評判】渋谷円山町。リニューアルしたばかりで非常に清潔。最新の動画サービスが楽しめる快適な空間。',
  },
  '3a094cbc-a5ff-4824-8258-297e7a03bfb0': {
    // HOTEL SKYPARK
    amenities: '100インチプロジェクター(一部), 65インチ液晶TV, マッサージチェア, コーヒーミル',
    reviews:
      '【評判】新座エリア。とにかく設備が豪華で広い。巨大スクリーンで映画を楽しめるなど、おもてなしが手厚い。',
  },
  '1ea94732-dbbf-42e9-acc0-637cd467cead': {
    // ホテル アーカス
    amenities: '立川駅徒歩3分, 銭湯風壁画(浴室), 完全バリアフリー設計, 通信カラオケ',
    reviews:
      '【評判】立川。駅から近く、車椅子でも利用しやすい優しい設計。アメニティも豊富で女性目線の気遣いがある。',
  },
  '4ae8f8ce-0786-4e1b-a102-25be5afd4ec3': {
    // ホテル ハイビスカス 川越
    amenities: '露天風呂(501号室), ハイビスカスモチーフ, 明るい接客',
    reviews: '【評判】川越。露天風呂付きの部屋が人気で、南国気分を味わえる開放的な空間。',
  },
  '4a25c9ac-98a0-40a5-a9c9-1838fb4c8bf8': {
    // シャルム鶯谷ＩＩ
    amenities: 'デザイナーズルーム, 浴室TV, ジェットバス全室, カラオケ完備',
    reviews: '【評判】鶯谷。部屋ごとのカラーがオシャレ。適度な広さと高い清潔感で、安定した人気。',
  },
};

updateMultipleHotelFacts(updates);
