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
  'fb029d08-488e-4d35-8652-ccbdd82c3ba6': {
    // シャルム鶯谷Ｉ
    amenities: 'ハイルーフ駐車場(2台), JR鶯谷駅近, 20室の客室, バスルームサイズ選択可(一部)',
    reviews: '【評判】評価4/5。駅近で利便性が高く、部屋のバリエーションが豊富で使い勝手が良い。',
  },
  'ece30225-11ab-4146-a500-e7e4f901a2e7': {
    // HOTEL roppongi
    amenities:
      'レンガ造りデザイナーズ外観, 広々石造りお風呂, レインボー/ジェットバス, ウェルカムシャンパン, 加湿空気清浄機, 無料Wi-Fi',
    reviews:
      '【評判】設備評価5/5。六本木の隠れ家リゾートのような雰囲気。天井が高く非日常感を味わえる。ウェルカムドリンク等サービスが充実。',
  },
  '25278db8-6638-4cd9-9d95-2c772c754074': {
    // HOTEL M・Gate DREAM
    amenities:
      'バレルサウナ, 露天風呂, 貸切部屋サウナ, ウォーターサーバー, 浴室TV, VOD, コスプレレンタル豊富',
    reviews:
      '【評判】福岡エリアで本格的なサウナ設備が楽しめる。設備評価が非常に高く、リピーターが多い。',
  },
  'da400a90-9956-4981-b9ce-229a6c604a35': {
    // HOTEL ZEBRA
    amenities:
      'シャンプーバー(ロビー), 高機能ドライヤー3種レンタル, 大型プラズマTV, マッサージチェア(一部), 充実のアメニティ',
    reviews:
      '【評判】池袋駅近。部屋が非常に広くゆったり過ごせる。アメニティがブランド物を含め充実しているのが女性に好評。',
  },
  'd7ab7397-fdcd-4600-8201-9dd6eeffc25a': {
    // Be-Zone
    amenities: '基本設備完備, 立川駅近アクセス',
    reviews: '【評判】立川エリアの人気店。安定したサービスと設備が特徴。',
  },
  '878b8e7f-a63f-43f7-9966-05fc17e6d7b6': {
    // HOTEL SK PLAZA 2
    amenities:
      '全室異なるデザイナーズ, プール(901号室), スチームサウナ(501号室), イルミネーションバス, 美容家電レンタル',
    reviews:
      '【評判】渋谷道玄坂のパレットをモチーフにした空間。ポップな内装が女性に人気で、無料貸出アイテムが豊富。',
  },
  '9cb217fa-e62c-4f80-8f62-a3ab8d7fbd9e': {
    // ホテル おひるねラッコ 八幡
    amenities:
      '大型TV(42インチ〜), VOD, 豊富な化粧品アメニティ, ルームウェア, 各種スマホ充電器, 電子レンジ, 加湿器',
    reviews:
      '【評判】バスタオル2枚ずつの気配りが高評価。設備が充実しており、北九州エリアで快適に過ごせる。',
  },
  '0d48f53e-08ca-4d92-8d89-54b4a3701456': {
    // HOTEL LOTUS 水戸店
    amenities: '露天風呂(大人気), 貸切プレイルーム(カラオケ/ダーツ/卓球), 特大お風呂',
    reviews:
      '【評判】水戸エリアの人気No.1候補。露天風呂の開放感が絶評。一日中遊べるプレイルームが特徴。',
  },
  'aa6135ea-b529-4637-878e-fc3ac49380c5': {
    // ホテル THE Mooon
    amenities:
      '最上階露天風呂, VIPルーム(8名女子会可), 飲放ドリンクバー, ビールサーバー, ロクシタンアメニティ',
    reviews:
      '【評判】メタリックで近未来的デザイン。女子会プランが人気で、無料ビールや高級アメニティなど贅沢な体験ができる。',
  },
};

updateMultipleHotelFacts(updates);
