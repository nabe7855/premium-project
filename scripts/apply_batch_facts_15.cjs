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
  'c558990d-ece8-4cb1-a7c5-cb775059762c': {
    // HOTEL VERONA 横浜青葉
    amenities:
      '女子会プラン充実, 32台無料駐車場, 浴室TV, Blu-ray全室, ドリンクバー(フロント), 豊富なフードメニュー',
    reviews:
      '【評判】横浜青葉。広くて清潔な空間が好評。「オシャレなマンション」のような居心地で、女子会や長期滞在にも選ばれている。',
  },
  '6e3cca37-2524-43bb-92ee-fa443d46b2df': {
    // ホテル トリアノン 横浜港南
    amenities: '駅近アクセス良好, 無料Wi-Fi, 充実のアメニティ空間, 冷蔵庫/電子レンジ完備',
    reviews:
      '【評判】横浜港南。建物は年季が入っているが、清掃が行き届いており安定感がある。駅近の利便性を重視する層に支持。',
  },
  'f15b85aa-f6e7-4017-ac9c-7bc97bf3935f': {
    // ゼン横浜町田
    amenities: '無料Wi-Fi, 大型無料駐車場, ルームサービス充実, 24hチェックイン可能, 禁煙ルームあり',
    reviews:
      '【評判】横浜旭。かつてのシードットからリニューアル。非常に広く開放的な部屋と、丁寧な接客がリピーターを呼んでいる。',
  },
  '38541af9-c3d6-412d-8082-fc14acf80501': {
    // ホテルバリアンリゾート東名川崎
    amenities:
      '岩盤浴付き客室, スチームサウナ, 無料ドリンクバー(酒類あり), 貸切露天風呂, 夜泣きラーメン無料',
    reviews:
      '【評判】川崎。もはや「バリ島」。至れり尽くせりの無料サービス（酒、ラーメン、朝食）が圧巻。満足度が非常に高いリゾート空間。',
  },
  'f555651f-ccf9-4405-b2ef-63a9a7f884bc': {
    // ホテル ザ ロータスバリ
    amenities:
      '天蓋付きベッド, 岩盤浴(一部), フラワーバス対応, 深めの大型浴槽, 充実の女性用アメニティ',
    reviews:
      '【評判】川崎。オシャレで豪華な「ワンランク上」の体験ができる。清潔感と風呂のクオリティが特に高く、女性受けが抜群。',
  },
  '4e16c525-62b1-4aec-837f-b024d57b29ed': {
    // HOTEL BAMBOO GARDEN 相模原
    amenities:
      'プライベートサウナ客室, 巨大ジャグジー, 飲み放題ビールサーバー, 浴室TV, 外観は高級マンション風',
    reviews:
      '【評判】相模原。評価4.64の化け物。ラグジュアリーの極みで、自分専用サウナやビールサーバー付きの部屋があり最高に贅沢。',
  },
  '1eea3d3f-c11d-4293-867e-c99ace6034c0': {
    // ホテル ミンク 相模原
    amenities:
      'セレクトシャンプー, 5.1chサラウンド(一部), マッサージチェア, 持ち込み用DVDプレイヤー, Wi-Fi完備',
    reviews:
      '【評判】相模原。町田駅から徒歩圏内で使いやすい。無料レンタル品が豊富で、自分らしくカスタマイズして過ごせる。',
  },
  '84e8031c-8726-4990-bb4f-b5b2acef8c90': {
    // ホテル 西欧館 盛岡
    amenities:
      '駐車場29台(ハイルーフ可), 無料コスプレ, 美味しい挽きたてコーヒー, キャッシュレス決済対応',
    reviews:
      '【評判】盛岡。広くて清潔な部屋が魅力。無料のコスプレや本格的なコーヒーサービスなど、細かなおもてなしが光る。',
  },
};

updateMultipleHotelFacts(updates);
