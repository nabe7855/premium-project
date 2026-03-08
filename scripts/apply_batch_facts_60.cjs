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
  // --- Batch 60: Kyushu & Okinawa "Resort & Urban Luxury" Facts ---
  'ef7c04a2-b525-4400-8ed8-5d7e8d90d0b4': {
    // ホテル&MAX (福岡春吉)
    amenities: 'リバービュー/夜景、ドライサウナ、フラワーバス、ブラックライトバス、大型ジャグジー',
    reviews:
      '【評判】福岡春吉。那珂川の美しい夜景を望む絶景ロケーション。本格ドライサウナやフラワーバスなど、記念日利用に最適な贅沢設備が満載。',
  },
  '79277bae-5227-48ae-a6d7-96565eace1a4': {
    // ホテル ウォーターゲート 鹿児島
    amenities: '桜島パノラマビュー、プライベートプール、本格サウナ、マッサージチェア、最新カラオケ',
    reviews:
      '【評判】鹿児島。窓一面に広がる桜島の眺望が圧倒的。プールやサウナ完備のスイートもあり、リゾートホテル以上の満足度が得られる最高級店。',
  },
  'c9d0f6fc-4bf6-4fbd-85d3-d2a1f07be0e8': {
    // ホテル ココナッツリゾート マリーナ 鹿児島
    amenities:
      '2Mキングサイズベッド, EV充電スポット, 露天風呂(一部), ソフトドリンク/お酒バーサービス',
    reviews:
      '【評判】鹿児島。2メートルの超巨大ベッドでの寝心地が抜群。ドリンクバーや充実した食事など、無料サービスの手厚さがユーザーから高評価。',
  },
  'ee8050d5-58ee-4e8b-bf5d-23e8f331d084': {
    // SPICE MOTEL OKINAWA
    amenities: 'アメリカンヴィンテージデザイン、ミニキッチン、共有ラウンジ、バー併設',
    reviews:
      '【評判】沖縄北中城。1970年代のモーテルを再生したハイセンスな空間。ヴィンテージな雰囲気が最高におしゃれで、感度の高い層から熱烈な支持。',
  },
  'a2b6ab7e-381b-4a12-854d-635d6aa30c77': {
    // WATER HOTEL Ry (宜野湾)
    amenities: '全室ウォーターサーバー完備, ヘアアイロン貸出, 空気清浄機, 充実のフードメニュー',
    reviews:
      '【評判】宜野湾。部屋の広さと設備の充実度が県内随一。アメニティの質が非常に良く、女性目線のきめ細やかなサービスが徹底されている。',
  },
  '5ddc0048-cb3f-4334-90a2-a2eab5b8f9d1': {
    // HOTEL XYZ (鹿児島)
    amenities: '室内PC完備, マッサージチェア, 広々ルーム, 最新ルームサービス仕様',
    reviews:
      '【評判】鹿児島。全室15台以上のハイルーフ対応駐車場を完備。部屋が広く、PCやマッサージ機など「籠もって」楽しめる設備が充実している。',
  },
  'd90699aa-c51f-4b31-999c-b063804fd87b': {
    // ホテル CUBE (小倉)
    amenities: 'モダンデザイン、24hフロント、ハイルーフ駐車場(5台), 女子会プラン',
    reviews:
      '【評判】小倉。洗練されたモダンな内装が特徴。コンパクトながら清潔感があり、ビジネスや女子会など多様な用途に対応できる使い勝手の良さが売り。',
  },
  'fad0dbd8-3c4e-4749-a2d5-443d4b9d8353': {
    // HOTEL majoram (那覇)
    amenities: 'ハイルーフ対応駐車場(9台), 充実のアメニティ, フロント24h',
    reviews:
      '【評判】那覇。那覇市内の中心部にありながら、大型車でも安心して停められる。スタッフの対応が非常に丁寧で、リピーターの多い安心の宿。',
  },
  '51f9164e-2ab0-49c6-9152-32941e1f5998': {
    // HOTEL 2ing (宮崎)
    amenities: '繁華街至近(徒歩圏内), 24h入出庫自由, ウェルカムドリンク',
    reviews:
      '【評判】宮崎。繁華街「ニシタチ」のすぐそばに位置し、観光や飲み会後の利用に最適。立地の良さが最大の魅力で、価格もリーズナブル。',
  },
  '0bf979ba-e3a5-4f76-932a-fed42ff1de4e': {
    // Uno TWINS (宮崎)
    amenities: '全室広々浴室、自動会計システム、24hフード',
    reviews:
      '【評判】宮崎。一ツ葉エリアで安定の人気。どの部屋も浴室が広く、ハズレがないのが特徴。自動会計でプライバシーが守られる点も好評。',
  },
};

updateMultipleHotelFacts(updates);
