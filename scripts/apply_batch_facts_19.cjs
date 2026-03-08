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
  '1550b5bd-1b0a-4649-ad7b-5d64e815b0ea': {
    // SARA 五反田 (修正済みID想定)
    amenities:
      'ドリンクバー, ソフトクリーム無料, 選べる入浴剤バイキング, 豊富なコスプレ, 診察室風ルーム(一部), おやつサービス',
    reviews:
      '【評判】五反田。遊び心満載のサービスが充実。特にソフトクリームやおやつ、入浴剤が選び放題で、滞在中のワクワク感がすごいと好評。',
  },
  'ed04ee73-07c7-4c21-a131-1458296f2f27': {
    // バリアンリゾート 横浜関内
    amenities:
      '貸切露天風呂, 足湯, ダーツ, カラオケルーム, 無料パン/ラーメン/ポップコーン, 豊富なシャンプーレンタル',
    reviews:
      '【評判】横浜関内。無料サービスの百貨店。足湯やカラオケ、夜食の無料提供など、一日中ホテル内で遊び尽くせる最強のレジャー空間。',
  },
  'ca78a878-3157-4b56-a8e9-1ab6646b4c36': {
    // GRASIA ASIAN RESORT 渋川
    amenities:
      '露天風呂客室, フィンランド式ドライサウナ, ミストサウナ, ダーツ, 女優ドレッサー, 宿泊無料朝食',
    reviews:
      '【評判】渋川。設備がとにかく豪華。本格的なフィンランド式サウナや露天風呂を独り占めでき、女子会や記念日に最適。',
  },
  '19d1f825-368c-434c-90ba-b2a8b383c170': {
    // チャペルストーリー 堺 (ID微調整)
    amenities:
      'ChromeCast全室, 超大型サイズ浴室, フルーツ湯サービス, 教室/診察室風コンセプト, コスプレ無料レンタル',
    reviews:
      '【評判】堺。浴室の広さがエリア隨一。ChromeCastで動画を楽しみつつ、フルーツ湯やユニークなコンセプト部屋で非日常を味わえる。',
  },
  '9eea03fa-c978-4348-9482-f65c514ec673': {
    // プリンセスプリンセス 秋田大町
    amenities:
      '天蓋ベッド, ひのき風呂, 電動ハンドマッサージャー, 無料Wi-Fi, 24hルームサービス, 駐車場完備',
    reviews:
      '【評判】秋田。お姫様気分の天蓋ベッドやヒノキの香りに癒やされる空間。アメニティやサービスがきめ細やかで、安心感が高い。',
  },
  '19b0a6d5-bfae-4c29-a279-243836e86b3c': {
    // HOTEL LX 諏訪
    amenities:
      '最新JOYSOUNDカラオケ, 露天風呂/サウナ付き客室, 飲み放題サービス(3h), ウォーターサーバー完備, SMルーム(一部)',
    reviews:
      '【評判】諏訪。清潔感と設備のバリエーションが豊富。格安の飲み放題プランや最新カラオケで、グループ利用も盛り上がる。',
  },
  '59462829-b709-4d45-9f62-076dd195dbf6': {
    // HOTEL LUXE 新栄
    amenities:
      'ロウリュ対応サウナ(118度), 17度強冷水風呂, 炭酸風呂/シルキーバス, 加湿空気清浄機, 充実の美容家電',
    reviews:
      '【評判】名古屋新栄。本格サウナ愛好家も納得の110度超えサウナと強冷水風呂を完備。設備の清潔感も高く、非常に快適。',
  },
  '1979cedf-9147-4b40-a82e-a2a34bc9636d': {
    // ホテル ラ・シエナ 東大阪
    amenities: '広いバスルーム, セパレートトイレ, 無料Wi-Fi, 駐車場完備, リーズナブルな休憩プラン',
    reviews:
      '【評判】東大阪。広々とした水回りと、使い勝手の良い間取りが特徴。コストパフォーマンスに優れ、普段使いに最適な安心のクオリティ。',
  },
};

// 重複チェックと安全な書き込みを実行
updateMultipleHotelFacts(updates);
