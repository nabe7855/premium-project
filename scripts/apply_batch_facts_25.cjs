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
  'a5da6931-24c8-4036-9180-d592ec91fef1': {
    // ホテル 愛花夢 小田原
    amenities: '無料駐車場, 禁煙ルーム, モーニングルームサービス, 広々とした客室, 各種アメニティ',
    reviews:
      '【評判】小田原。清潔感とスタッフの温かい接客が非常に高く評価されている。お部屋で頂ける朝食サービスが人気で、価格以上の満足感を得られる一軒。',
  },
  '671eb566-990e-4329-b77a-fd8a1c352d7e': {
    // ホテル バリバリ 岩槻
    amenities:
      'ReFa製品全室完備(シャワーヘッド等), 浴室テレビ, ジェットバス, 美容グッズ無料レンタル, 駐車場完備',
    reviews:
      '【評判】岩槻。ReFaの最新美容アイテムを全室で試せる美容特化型ホテル。清潔でオシャレな内装と、充実の浴室設備が女性から圧倒的支持。',
  },
  '1ccb33fa-e48d-475a-b13f-f98694223346': {
    // HOTEL Rainbow 足立区
    amenities:
      'ジェット/ブロアバス, 持ち込みDVD/VTRデッキ, アミューズメント設備, 竹ノ塚駅徒歩圏内, コンビニ至近',
    reviews:
      '【評判】竹の塚。駅から近くアクセス抜群。ジェットバスや豊富な映像設備が揃っており、終電を逃した際や都内でのリラックスタイムに重宝する。',
  },
  '1d85dac0-41d1-40a3-b447-da1636f187b0': {
    // HOTEL AND. 福島
    amenities: '広々駐車スペース, エレベーター完備, 24hフロント, 無料Wi-Fi, ルームサービス',
    reviews:
      '【評判】福島。広くて停めやすい駐車場と、スタッフのプロフェッショナルな対応が好評。設備の充実度と清潔感のバランスが良く、安定した人気。',
  },
  '8948e77f-e171-4cca-acee-ae7bef398663': {
    // HOTEL Blossom＆Bee 福島
    amenities: '2013リニューアル, 浴室タイマー(便利), 大型TV, 浴室TV, ジェットバス, 空気清浄機',
    reviews:
      '【評判】福島。リニューアル済みの清潔な空間。お風呂のタイマー機能など「あったら嬉しい」細かい設備が整っており、快適な滞在を約束。',
  },
  'f9011611-dc3f-40c1-85e4-fd4dca49f276': {
    // HOTEL JULIAN 座間
    amenities:
      '露天風呂風ジャグジー, バスタオル4枚完備, シャンプーバー(種類豊富), サウナ(一部), カラオケ',
    reviews:
      '【評判】座間。バスタオルの4枚用意や豊富な貸出シャンプーなど、至れり尽くせりのサービス。露天風のジャグジーで贅沢な気分になれる。',
  },
  'bb3b3ceb-b374-418c-80ae-b66d2f3facbc': {
    // ホテル シンプロン 柏
    amenities:
      'シャンプーバー, ブックスタンド(雑誌持込可), デザイナーズマンション風内装, JAZZ放送, デリバリー提携',
    reviews:
      '【評判】柏。デザイナーズマンションのような上品でゴージャスな空間。ジャズが流れる室内にシャンプーバーから選んだ香りが漂う大人の隠れ家。',
  },
  '6f51490d-ec10-460e-a3a2-62ed6ab05881': {
    // ホテルオーゼ 福岡
    amenities: 'VOD(映画見放題), 最新VODシステム, リーズナブル料金, 西鉄平尾駅徒歩圏内',
    reviews:
      '【評判】福岡平尾。手頃な価格設定ながら、充実したVODや清潔な室内でコスパが高いと評判。静かな住宅街にあり、落ち着いて過ごせる。',
  },
};

updateMultipleHotelFacts(updates);
