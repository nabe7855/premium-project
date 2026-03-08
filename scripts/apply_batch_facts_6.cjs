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
  'e756c982-11ff-45c5-bac4-1a633bad2886': {
    // ホテル レジェンド
    amenities: '駐車場10台(ハイルーフ可), フェイスタオル/バスタオル各室完備, バスローブ',
    reviews: '【評判】葛西エリア。清掃が行き届いており、最低限のアメニティは揃っている。',
  },
  '88389135-2440-4d06-acb6-6d193004555e': {
    // Hotel Time's
    amenities: '池袋駅西口至近, 基本設備完備',
    reviews: '【評判】池袋駅からのアクセスが良く、ショートタイムから宿泊まで幅広く利用可能。',
  },
  'e828c73c-5050-4059-b8c1-9dfba30faec9': {
    // HOTEL LEHUA
    amenities: '下北沢駅近, 禁煙ルームあり, 持ち込み用冷蔵庫, 電気ポット, 外出可能, 一部電子レンジ',
    reviews:
      '【評判】下北沢エリア。部屋の広さと綺麗さが好評。設備の充実度に対してコスパが非常に良い。',
  },
  '0c864939-b316-43da-b0bc-a22306f82e1d': {
    // ホテル ロイヤル
    amenities:
      '戸建て・タウンハウス形式, 部屋直結車庫, プライバシー重視, 42インチ以上TV, カラオケ, ジェットバス',
    reviews:
      '【評判】評点5/5。他の客と顔を合わせない設計が絶評。飯田エリアで最高クラスの清潔感と広さを誇る。',
  },
  'c0857207-1e22-4192-8ef1-c525c13be4c1': {
    // ブロンモード 新宿
    amenities:
      '60インチ大型TV多数, ハート型浴槽(一部), イルミネーションジェットバス, サウナ完備, 豊富な化粧品レンタル',
    reviews:
      '【評判】歌舞伎町。圧倒的な音響・映像設備と広々とした空間が魅力。外出可能で観光拠点としても優秀。',
  },
  'dc6211d5-57b0-485d-b2ef-02a0beb21b17': {
    // アランド目黒
    amenities:
      '最大12時間サービスタイム, 50型プラズマTV, メンバー無料モーニング(好評), 加湿空気清浄機',
    reviews: '【評判】目黒。サービスタイムの長さが魅力で、メンバー向けの食事が美味しいと人気。',
  },
  '5e1c32f1-c000-43b6-9d33-58fb4b56a3cb': {
    // レステイ小倉
    amenities:
      '露天風呂, 岩盤浴, サウナ, マッサージチェア(一部), 小倉駅徒歩圏内, 24時間フロント, 駐車場無料',
    reviews:
      '【評判】スタッフの接客レベルが高く、清潔。露天風呂や岩盤浴など豪華設備があり満足度が高い。',
  },
  '0db8d397-0ff8-4da8-a51a-d0d42c43dcf6': {
    // ホテル ビーナスガーデン
    amenities: '2020年全室改装, 60インチ以上TV全室, 浴室TV, 水中照明, 飲食品充実, 無料Wi-Fi',
    reviews:
      '【評判】名古屋名東区。広々としたお風呂と美味しい食事が好評。リニューアルしたばかりで非常に綺麗。',
  },
  '0e003922-1ce1-4715-9244-95bfb7015070': {
    // ホテル 姫路 アイアン
    amenities: 'カラオケ完備, DVDプレーヤー, 落ち着いた内装',
    reviews: '【評判】総合3.7点。清潔感があり安定したクオリティのホテル。',
  },
  '998b4765-dd53-497f-86c0-5ff9bde27ea7': {
    // LAGUNA INN
    amenities: '八王子駅近(徒歩圏内), 飲食店多数の好立地, 綺麗な内装, 無料Wi-Fi, 豊富なアメニティ',
    reviews: '【評判】入りやすい雰囲気で女性にも人気。駅近でフロントの対応が良く、清潔。',
  },
};

updateMultipleHotelFacts(updates);
