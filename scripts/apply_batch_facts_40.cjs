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
  // --- Batch 40: Miyagi, Aichi, & Shizuoka Precision ---
  '1c61cec5-f214-443d-8056-65fe590e0906': {
    // ホテル Mikado (北上)
    amenities:
      'ミストシャワー, 50インチ液晶TV, 有線放送440ch, マイナスイオンハンドドライヤー, 加湿空気清浄機',
    reviews:
      '【評判】北上。大人らしく品の良さを追求したデザイン。ミストシャワーや大型TVなどの基本設備が充実しており、落ち着いた滞在を約束。',
  },
  'f5bc45cd-0c60-4dba-a9d1-c29880e734bd': {
    // アジアンリゾート 仙台
    amenities: 'バリ風デザイナーズ空間, 荷物預かり無料, 24時間フロント, カラオケ, 共用Wi-Fi',
    reviews:
      '【評判】仙台。国分町近くでバリのリゾート気分を味わえる癒やし空間。立地が良く、清潔感とスタッフの対応が非常に高いレベルで評価されている。',
  },
  '60bb4b90-510c-4532-a904-9ad04c53cbcd': {
    // フェアリー ウィンク (横浜/野毛)
    amenities:
      'ReFa(ドライヤーPRO/カール/ストレート/シャワーヘッド), JOYSOUND MAX(全室), Chromecast, ウォーターサーバー',
    reviews:
      '【評判】横浜野毛。ReFaの最新美容家電が全室使い放題という驚異の女子力。最新カラオケやウォーターサーバー完備など、設備面ではエリア最高峰。',
  },
  'a8f11529-f8ac-4cc2-9504-166e3022df2c': {
    // コスタリゾート 飯能
    amenities:
      '露天風呂(202), スチームサウナ(603/703), 本格ダーツ/ビールサーバー(703), VRルーム, プラネタリウム',
    reviews:
      '【評判】飯能。露天風呂からビールサーバー、プラネタリウムまで、部屋ごとに異なる「超弩級」のエンタメ設備が揃う話題のスパリゾート。',
  },
  '8005424f-afa5-4577-8f9e-439e862203c8': {
    // HOTEL JAZZ名東 (名古屋)
    amenities: 'LIVEDAMカラオケ, Chromecast, 浴室TV, 水中照明, ウェルカムスイーツフェア',
    reviews:
      '【評判】名古屋。JAZZが流れる洗練された大人空間。最新のカラオケや映像設備に加え、季節のスイーツサービスなど細かなホスピタリティが光る。',
  },
  '8e0c126e-623a-4c5e-aca3-ab10aad6368c': {
    // HOTEL K\'s MINE (豊田)
    amenities:
      '全室ジェットバス, レインボーバス, 2Wayヘアアイロン完備, 本格朝食サービス, 42インチ以上TV',
    reviews:
      '【評判】豊田。水回りの清潔感とオシャレな内装が自慢。手間暇かけた本格的な朝食が絶品で、女性客からの支持が非常に高い実力派。',
  },
  'fbbe1424-e34b-4f7a-a88d-52d985a99e4c': {
    // HOTEL ZERO (静岡)
    amenities:
      '50インチ以上TV, くるくる&ヘアアイロン全室, レインボーバス, 岩盤浴(一部), 洗濯・乾燥機(一部)',
    reviews:
      '【評判】静岡。モダンで爽やかな内装は、女子会やビジネス出張にも使える万能さ。防音性と清潔感が際立ち、価格以上の満足感を得られる。',
  },
  'c44165de-2455-4815-957d-5849433252e9': {
    // ファリーナドルチェ (鹿沼)
    amenities:
      'スイーツ風コンセプト, パナソニック最新ドライヤー, 広いバスタブ, 朝食無料(絶評), ガレージ式駐車場',
    reviews:
      '【評判】鹿沼。「スイーツのような甘い空間」の名の通り、清潔で広々とした部屋が最高に快適。特にスタッフの接客と朝食のクオリティは県内随一。',
  },
  'edbb4bee-43f6-44b0-b0a5-bd318eb34702': {
    // ウォーターリゾート仙台
    amenities:
      '24時間セキュリティ/フロント, ルームサービス朝食, 大型専用駐車場, カラオケ, 全室Wi-Fi',
    reviews:
      '【評判】仙台。究極のリゾート体験を掲げる広大な空間。ルームサービスの朝食や24時間体制のセキュリティなど、ホテルとしての基本性能が非常に高い。',
  },
  'f49c379b-a540-4944-ad7f-9a1a125bc117': {
    // LUCE REGALO (利府)
    amenities:
      '2025年オープン最新設備, ミラーリング対応24型浴室TV, HDMIパネル, ドライサウナ, 65型TV',
    reviews:
      '【評判】利府。2025年グランドオープンの最新鋭。サウナや露天風呂、ミラーリング対応の浴室TVなど、現代のニーズを全て満たした豪華設備が揃う。',
  },
  'd042c105-f31a-426f-bd56-15a094bf024f': {
    // プレリュードルナシス (仙台)
    amenities:
      '5.1chサラウンド, ブラックライト(一部), マッサージローション, ガレージ式駐車場(プライバシー)',
    reviews:
      '【評判】仙台。プライバシーを重視したガレージ式。5.1chサラウンドやブラックライトなど、ドラマチックな演出にこだわった設備が特徴。',
  },
};

updateMultipleHotelFacts(updates);
