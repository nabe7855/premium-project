const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const robustParseCsvLine = (line) => {
    const parts = [];
    let part = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          part += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          part += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }
    }
    parts.push(part);
    return parts;
  };

  const formatCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    return `"${String(field).replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = robustParseCsvLine(line);
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
  // --- Batch 67: Premium Experience & Beauty Facts ---
  '024bb4a6-1e10-45b5-8475-d51fc69d134e': {
    // HOTEL ZEN 港北
    amenities: '露天風呂, 本格サウナ, レインボーブロアバス, 浴室TV, ナノ水導入, 無料Wi-Fi/VOD',
    reviews:
      '【評判】横浜。充実したサウナや露天風呂で「ととのう」体験ができる貴重な一軒。清潔感のある和モダンな空間とナノ水の肌触りが、美容と癒やしを求めるカップルに絶賛されている。',
  },
  'f0eb0d6e-a7a7-4832-bf8f-8ca8f885f1b0': {
    // BAMBOO GARDEN 新横浜
    amenities:
      'Chromecast全室(Netflix/YouTube), 無料Wi-Fi, 電子レンジ, 持込冷蔵庫, ヘアアイロン完備',
    reviews:
      '【評判】新横浜。都会の隠れ家的な落ち着いた内装が魅力。Chromecastで動画サービスが見放題。最新のデジタル設備と安心のセキュリティで、女子会や長期滞在にも選ばれている。',
  },
  'dc6008b5-0b01-4d81-81a2-6449b13fc196': {
    // ホテル 艶 久留米
    amenities: 'ReFa FINE BUBBLE S shower, ウォーターサーバー, 空気清浄機, ジェットバス',
    reviews:
      '【評判】久留米。ReFaの最新シャワーヘッド導入など美意識の高い設備が光る。広々とした清潔な客室と、全室完備の空気清浄機により、非常にクオリティの高い滞在が可能。',
  },
  '1f793eba-4c26-4ac3-857d-0736530e8d05': {
    // Hotel Dulce 王子
    amenities:
      'スチームミストサウナ, 浴室TV, カラオケ, DAZN/YouTube大画面視聴, ブラックライト(一部)',
    reviews:
      '【評判】王子。スチームミストサウナやブラックライトなど「大人の遊び心」を満たす仕掛けが豊富。DAZNでのスポーツ観戦や映画視聴も快適で、駅から近い利便性も支持されている。',
  },
  '5db3c9ea-8108-4688-815f-793c7b4d2de1': {
    // ホテル クーナ 京都
    amenities: '屋上プール, SMルーム, パーティルーム, ホットタブ, 電子レンジ, 無料駐車場',
    reviews:
      '【評判】京都。屋上プールやSMルームなど、一般的なホテルを遥かに凌駕する「攻めた」設備が圧巻。非日常の極限を楽しみたい層から熱狂的な支持を受けるエンタメ特化型。',
  },
  '1c24e005-d3b2-445d-9cba-585558b802fb': {
    // HOTEL SEEDS 東名店
    amenities: '本格サウナ, ダーツ, 60インチ大型TV, スチーム美顔機(貸出), 無料Wi-Fi/VOD',
    reviews:
      '【評判】横浜。東名川崎ICすぐの好立地。全室完備の最新家電に加え、サウナやダーツなど「一晩中遊べる」設備が充実。豊富な貸出品やアメニティも心強く、満足度が非常に高い。',
  },
  '2253a479-1208-4f79-9d14-ee22dbc70058': {
    // H-SEVEN NISHIKAWAGUCHI
    amenities: '65/55インチ液晶TV, YouTube/Netflix視聴可, Wi-Fi完備, 電子レンジ, ブラックライト',
    reviews:
      '【評判】西川口。大画面TVでのサブスク動画視聴が快適。清潔でシンプルな内装ながら、ブラックライトなどの演出もあり、コスパの良さと居住性のバランスで選ばれている。',
  },
  '229762bd-2e03-4734-9d82-bfba9aeb1d2f': {
    // HOTEL BLACKBOX 岐阜
    amenities:
      '足湯フットリラックス, トレーニングルーム, マッサージチェア, 客室タブレット, エアリーシェイプ',
    reviews:
      '【評判】岐阜。全室に足湯や美容器具を完備した「癒やしと自分磨き」の空間。トレーニング機材や骨盤ケアなど、滞在時間を有効活用できるユニークなコンセプトが支持されている。',
  },
  '3099ac5a-4897-4895-9f1e-e26d59e5d164': {
    // BEAUTY HOTEL BRASSINO 町田
    amenities: '露天風呂, 美容軟水, 人工温泉, VRヘッドセット, ナノスチーマー, 高級マットレス',
    reviews:
      '【評判】町田。2023年改装。「美」を追求した美容軟水やナノスチーマーが女性に大人気。露天風呂やVRなど、美しさと遊びを両立させた「究極のリゾート」として話題。',
  },
  '0ce4084c-bb09-4823-a562-64326306cd04': {
    // The CALM Hotel Tokyo 五反田
    amenities: 'クイーンサイズベッド, 多機能シャワー, 女子会プラン, コスプレ貸出, 無料VOD',
    reviews:
      '【評判】五反田。クイーンサイズベッドと多機能シャワーで上質な癒やしを提供。女子会プランの充実度や、清潔感あふれるシックな内装が「大人の隠れ家」として高い評価を得ている。',
  },
  '0f77c2b9-85e4-466f-bd3c-2c229dc853f2': {
    // HOTEL 555 錦糸町
    amenities:
      'Chromecast, JOYSOUND f1カラオケ, レインボーバス, ナノシャワー, ムービングラブマットレス',
    reviews:
      '【評判】錦糸町。最新カラオケやムービングマットレスなど、刺激的な設備が満載。ナノシャワーやレインボーバスでのバスタイムも贅沢。駅前の利便性と高いエンタメ性が人気。',
  },
  '85fd7404-463d-454a-b63b-04e2f022becf': {
    // HOTEL GRASSINO URBAN RESORT 新横浜
    amenities:
      '露天風呂, 美容軟水, 人工温泉, 客室タブレット, 洗濯機(一部), コインパーキング全額負担',
    reviews:
      '【評判】新横浜。人工温泉や露天風呂、美容軟水など、水への徹底した拘りが凄い。洗濯機付きの部屋もあり、長期滞在や観光の拠点としても非常に使い勝手の良いハイクラスリゾート。',
  },
};

updateMultipleHotelFacts(updates);
