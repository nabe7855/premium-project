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
  'f9722cfa-cf65-4553-b20f-ccd12e5a2d3e': {
    // HOTEL ABnormal 泉大津
    amenities: '本格SM器具, 牢屋ルーム, 公開便器ルーム, ウォーターサーバー, 無料フード/ドリンク',
    reviews:
      '【評判】泉大津。Best Delight Groupが贈る究極の非日常。牢屋やSM設備など、他では味わえない「アブノーマル」な体験が驚きと興奮を呼ぶ。',
  },
  '730ac88d-e7a0-49c8-9c4b-96585d5b236d': {
    // HOTEL ARTIA 泉大津
    amenities:
      '24h貸切ダーツ/ビリヤード/カラオケ, プロジェクションマッピング, シーシャバー, 露天風呂, 岩盤浴',
    reviews:
      '【評判】泉大津。24時間無料で遊べるダーツやシアター設備が圧巻。シーシャバーや露天風呂もあり、もはやホテルの域を超えた楽園。',
  },
  'e7bf3b0b-3ed1-4b52-8b4b-7778a3eb63d2': {
    // HOTEL LOTUS Modern 堺
    amenities:
      'スタイリッシュ和モダン, アメニティTVオーダー, ウォーターサーバー, バスローブ, 豊富なレンタル品',
    reviews:
      '【評判】堺。都会的で洗練されたモダンな空間。TVリモコン一つでアメニティやフードを注文できるシステムが非常に便利で快適。',
  },
  '19a0853d-5f4d-40c7-b41e-e5bbb231cc77': {
    // HOTEL CUE PLUS 厚木
    amenities:
      '65インチ大型TV(一部), レインボーブロアバス, プラズマクラスター加湿器, 女子会プラン(ケーキ付), Wi-Fi完備',
    reviews:
      '【評判】厚木。65インチの大画面で楽しむ映画は格別。女子会プランではシャンパンやケーキが付き、贅沢なパーティーが楽しめると人気。',
  },
  'af6c886d-08d4-4b82-820a-1dddce29c5d1': {
    // Queens Town Part I 厚木
    amenities:
      'ブラックライト演出, 無料ドリンクバー, ガレージタイプ, 広々ブロアバス, 多彩なコンセプト',
    reviews:
      '【評判】厚木。ブラックライトで幻想的に光る部屋がオシャレ。無料ドリンクバーやスタッフの丁寧な接客が心地よく、安心感がある。',
  },
  '6a8d1b5c-cf12-47aa-874c-2e6268fcc2e5': {
    // HAYAN山形
    amenities:
      'プレミアムウォーターサーバー全室, 本格手作りフード, 浴室TV, 日焼けマシン(一部), ジャグジー',
    reviews:
      '【評判】山形。手作りのフードが本格的で美味しいと絶賛。全室にプレミアムウォーターが完備され、清潔感も完璧な癒しの空間。',
  },
  '7d0fffea-aac0-412d-9136-d18b92c584bd': {
    // ホテル 24 大阪道頓堀
    amenities:
      'なんば駅徒歩5分, YouTube/Netflix視聴可, 2016リニューアル, パーティールーム(20名可), 外出自由',
    reviews:
      '【評判】道頓堀。観光の中心地にあり、外出も自由なのが最大のメリット。TVでYouTubeが視聴でき、チェックアウトも15時と非常にゆったり。',
  },
  'f3f2e416-a7b4-4204-b91f-a0a6b876544d': {
    // PRESENT HOTEL STYLISH 岐阜
    amenities:
      '昭和レトロコンセプト, 2024年7月リニューアル, ドライブイン形式, 全室異なるデザイン, 広々ルーム',
    reviews:
      '【評判】岐阜。2024年リニューアルで生まれ変わったオシャレ空間。特に昭和レトロな部屋が可愛く、写真映えするとSNSでも話題。',
  },
  '1ae169c2-b2c9-4b3b-b3d9-8534cc04922c': {
    // Hotel Charbon 大阪摂津
    amenities: 'ジャグジー風呂, 無料Wi-Fi, 駐車場完備, リーズナブルな休憩プラン, 各種アメニティ',
    reviews:
      '【評判】摂津。シンプルながら清潔で使い勝手の良いホテル。ジャグジー風呂でゆっくり旅の疲れを癒やせる、コスパ良好な一軒。',
  },
};

updateMultipleHotelFacts(updates);
