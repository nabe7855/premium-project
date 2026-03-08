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
  // --- Batch 56: Nara, Wakayama & Chugoku "Premium & Guest-First" Facts ---
  'c53d6108-b8fa-48c7-aa59-d51eb8b8f45a': {
    // HOTEL VANQUISH (奈良)
    amenities: '大画面TV, ジャグジー, 浴室テレビ, 2人掛けソファ, ガラストップテーブル',
    reviews:
      '【評判】橿原。平均4.8の高スコア。清潔感と接客が素晴らしく、広々としたお風呂でのテレビ鑑賞が至福。リピーターが絶えない安定の名店。',
  },
  '7d26f4c1-4914-4d5b-a088-5c83e1a2425b': {
    // WA HOTEL TIMELESS RESORT (和歌山)
    amenities:
      'キングサイズベッド(2×2.5m以上), 8K70インチTV(スイート), ロクシタン/イソップ/SK-IIアメニティ, 無料ドリンクバー',
    reviews:
      '【評判】和歌山。2017年オープンの和モダンリゾート。規格外の巨大ベッドと、SK-II等の高級ブランドアメニティが無料で使える贅沢の極み。',
  },
  'c1a44452-c7e7-4d8b-85ba-67f26baf9293': {
    // HOTEL MYTH -WA- (和歌山)
    amenities:
      '露天風呂(TV付), ドライサウナ, 65インチTV, マイナスイオンドライヤー, ローションマット',
    reviews:
      '【評判】和歌山。露天風呂やサウナ完備の客室があり、設備・アメニティの充実度は県内屈指。清潔で何から何まで満足できる高品質な滞在。',
  },
  '8e8008b7-9ed7-4234-87f6-2c99cd349c50': {
    // HOTEL VITA (倉敷)
    amenities:
      'プライベートサウナ, 岩盤浴, 大画面デュアルスクリーンカラオケ, ウェルカムスイーツ(非会員可)',
    reviews:
      '【評判】倉敷。サウナや岩盤浴を備えた部屋が人気で清潔。会員以外にもスイーツ提供があるなど、細やかなおもてなしがカップルに大好評。',
  },
  'b84bb83c-711b-437a-990b-8f06a2d5050b': {
    // HOTEL LOTUS 岡山店
    amenities: '24時間貸切露天風呂, ビリヤード/ダーツ/卓球, 焼きたてパン朝食, ウォーターサーバー',
    reviews:
      '【評判】岡山中心部。もはやアミューズメント施設。24時間入れる貸切露天やビリヤード等の遊びが充実。期待を裏切らないリゾート体験。',
  },
  '83723ca0-4a7b-4538-8237-e19cf412aaa9': {
    // agehA cinq boutique hotel (岡山)
    amenities: 'マッサージチェア, ジェットバス(水中照明), サウナ, 防音客室, ハイヒール用チェアー',
    reviews:
      '【評判】岡山。8.7の高スコア。清潔さと広さ、そしてハイヒールを履きやすくする椅子などの細かい気配りが嬉しいブティックホテル。',
  },
  '4fd3d72a-c82e-4c78-8d6c-237c542cfbeb': {
    // HOTEL SECILLE (岩国)
    amenities:
      'ドリンクバー, 無料スイーツ/モーニング, ホームシアター, くるくるドライヤー, ハイルーフ車対応',
    reviews:
      '【評判】岩国。4.3の高評価。部屋やお風呂が広く清潔感がある。フロントの対応も非常に丁寧で、平日無料のスイーツやモーニングが好評。',
  },
  '24a4ab32-b9a4-4d01-92fa-62f256246abc': {
    // ファインザタイム 玉造
    amenities:
      'カフェ風リニューアルルーム, 5.1chサラウンド, WiiU/PS3完備, 浄水器ボトル, 天蓋ベッド',
    reviews:
      '【評判】玉造。リニューアル後のカフェ風ルームが明るくお洒落。ゲーム機や浄水器まで完備されており、女子会やデートに最適な至れり尽くせりな空間。',
  },
  'bc4e7b4d-cea3-491b-9c53-c2dff1b706d9': {
    // HOTEL AYAM (米子)
    amenities: '24時間対応フロント, 皆生温泉街立地, 清潔感重視',
    reviews:
      '【評判】米子。5.0満点の絶賛レビュー。電話対応やフロントの丁寧さが際立っており、忙しい時間でも親切な接客に安心感がある高品質ホテル。',
  },
  '37858670-efde-4ea6-8663-869ed3a7ddca': {
    // HOTEL AURA RESORT 香芝店
    amenities:
      'ブラインドカーテンガレージ(人目防止), 誕生日特典, 美容セットアメニティ, 各室異なるデザイン',
    reviews:
      '【評判】香芝。人目を気にせず入室できるガレージの配慮や、お洒落な内装、誕生日割引などのサービスが充実しており、女性人気が高い。',
  },
  'e47e1458-b9d1-47e0-8509-6e0dcd44bdb1': {
    // ホテル チョコレ御所
    amenities: '落ち着いたインテリア, ハイルーフ車対応',
    reviews:
      '【評判】御所。「最高のお部屋」と評されるほど満足度が高い。静かな環境で広々としており、価格以上の高級感を感じられる隠れた名店。',
  },
  'd47d0e55-b563-4610-8367-7e33129ac329': {
    // HILLS HOTEL EVE (米子)
    amenities: 'ウェルカムドリンク, 朝食サービス, ジェットバス, ハイルーフ車対応',
    reviews:
      '【評判】米子。清潔感が4.33と高く、お風呂も広くて快適。無料の飲食サービスも充実しており、観光の拠点としてのコスパも良い。',
  },
};

updateMultipleHotelFacts(updates);
