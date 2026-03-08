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
  // --- Batch 63: Urban Beauty & Design Facts ---
  '7b50039c-8248-4181-8e29-d4d6fa75d333': {
    // HOTEL CITY (川崎)
    amenities:
      'Refa理美容家電全室(シャワー/ドライヤー/アイロン), Chromecast(YouTube/Netflix可), 浴室TV',
    reviews:
      '【評判】川崎。全室にReFaの最高級シリーズを完備。Chromecastでの動画視聴やウォーターサーバーなど、ユーザーの利便性を追求した設備が「至れり尽くせり」と高評価。',
  },
  'd3c753d4-a8d4-4663-a694-d10e51b95291': {
    // HOTEL AROMA BOWERY (横浜)
    amenities:
      'レインボー照明ブロアバス, 浴室TV, マッサージ機(一部), VOD/Wi-Fi完備, 清潔感重視設計',
    reviews:
      '【評判】横浜。ラブホテルらしさを抑えた洗練された外観と、新しく清潔な設備が話題。浴室テレビやレインボー照明で、落ち着いた大人の時間を過ごせると評判の一軒。',
  },
  '9dfd77f6-75af-4fde-8ae2-5e6d5bfdb3ab': {
    // HOTEL ri-Co (越谷)
    amenities: '本格露天風呂(一部), リクライニングチェア, ダイエットマシン, 防音強化設計',
    reviews:
      '【評判】越谷。エリア最高級の清潔感と広さを誇る。特に4階の露天風呂付き客室は「贅沢すぎる」とリピーターが絶えず、丁寧なサービスも含め総合満足度が極めて高い。',
  },
  '1aebb2b3-886e-46a7-9bd5-dd8087dcc6ed': {
    // HOTEL Room 龍ケ崎
    amenities: 'プライベートテントサウナ(一部), 岩盤浴, マイクロバブルバス, 電子雑誌・漫画読み放題',
    reviews:
      '【評判】龍ケ崎。貸切テントサウナや岩盤浴など、この地域では珍しい本格スパ設備が充実。清潔さとスタッフの温かい対応が評判で、遠方から訪れるファンも多い。',
  },
  'f75fc166-3cff-4a1c-976b-36f66256e966': {
    // HOTEL LAND LAND (大和高田)
    amenities: 'ファラオコンセプト等ユニーク内装, 冷蔵庫無料ドリンク, 1hレイトチェックアウト特典',
    reviews:
      '【評判】大和高田。エジプト風など独特のコンセプトが楽しい一軒。部屋が広く清潔で、無料ドリンクやレイトチェックアウトなど、独自のサービスによる満足度が非常に高い。',
  },
  '22102d1e-ef0b-46a5-bfe5-8b2081467cf7': {
    // CROWN MOTEL (横浜)
    amenities: 'アメリカンヴィンテージデザイン、メゾネットタイプ(一部), 水中照明ジェットバス',
    reviews:
      '【評判】横浜。アメリカンな雰囲気にリニューアルされ、SNS映えするデザインが特徴。各部屋で異なる世界観を楽しめ、遊び心のある大人たちの隠れ家として人気。',
  },
  'd568daa5-0255-48cd-8801-0dc7d3c54ee6': {
    // HOTEL OPERA Resort 海神店 (船橋)
    amenities:
      '50型テレビ, 浴室水中照明, シャンプーバー, メンバー限定無料コスプレ, 充実のフードメニュー',
    reviews:
      '【評判】船橋。豊富なアメニティとルームサービスの質が自慢。水中照明付きの浴室や大型テレビなど、価格以上の設備充実度で安定した支持を得ている。',
  },
  '99642f43-9d49-4ad6-b5df-8355ec0d51bc': {
    // HOTEL SEEDS 北土浦店
    amenities:
      '全室ジェットバス, 安眠パイプ枕, 無料レンタルコスプレ, サウナ(限定プラン), 女子会特化サービス',
    reviews:
      '【評判】土浦。女性目線のサービスが徹底されており、アメニティや美容家電の充実度がピカイチ。安眠への拘りや女子会プランの評価も高く、清潔感溢れる空間が魅力。',
  },
  'e422a1c9-6f1e-4d19-ab14-9c5131a0d2b6': {
    // HOTEL NEW PARCO (横浜)
    amenities: '広々ルーム, ジャグジー, レボリューションライト, ウェルカムドリンク/ドリンクバー',
    reviews:
      '【評判】横浜。建物に歴史はあるものの、圧倒的な部屋の広さと手厚いウェルカムサービスで根強い人気。ジャグジーバスでのリラックスタイムが高評価。',
  },
  'c30455e8-aecc-4f36-8697-759c8828ea20': {
    // HOTEL AURA PREMIUM RESORT (御代田)
    amenities: '浅間山ビュー客室, デザイナーズ家具, セレクトワインバー, プレミアムアメニティ',
    reviews:
      '【評判】軽井沢/御代田。浅間山を望む絶景ロケーションに位置する大人のリゾート。洗練されたインテリアと厳選されたアメニティが、静かで贅沢な休息を演出する。',
  },
};

updateMultipleHotelFacts(updates);
