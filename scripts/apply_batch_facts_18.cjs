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
  '38c10d51-6c81-4878-999d-374643c4db54': {
    // HOTEL ISOLA 仙台
    amenities:
      '有名デザイナー設計, 岩盤浴(一部), サウナ, レインボーバス, パソコン無料レンタル, 36台駐車場',
    reviews:
      '【評判】仙台。フロアごとにテーマが異なるスタイリッシュな空間。サウナや岩盤浴で体を芯から温めてゆっくり過ごせると高評価。',
  },
  'a453f959-e72f-46cd-99ce-2b014c5f818c': {
    // HOTEL LULL KOMOREBI 仙台
    amenities:
      '2018リニューアル, 全室ジェット&ブロアバス, 浴室TV全室, モーニングサービス, 美顔器レンタル',
    reviews:
      '【評判】多賀城。インテリアと照明にこだわった綺麗な室内が印象的。全室に浴室TVが完備され、フードメニューも豊富で隙がない。',
  },
  'a3c411c8-3b7f-48fa-a417-5c50108b1b87': {
    // HOTEL PASAR 三郷
    amenities:
      '戸建形式(全10室), 駐車場13台(ハイルーフ可), トロピカル/ジャングル風内装, プライバシー重視',
    reviews:
      '【評判】三郷。「日常を忘れる隠れ家」的な雰囲気が人気。戸建形式で人目を気にせず、平日限定の割引サービスなども充実している。',
  },
  '2bff71bd-5bae-42a7-a189-145ec028cf31': {
    // ホテル クイーンズタウン 横浜緑区
    amenities: '圧倒的広さの客室, 長津田駅近, 充実のアメニティ, 長時間ステイ可能, ハイルーフ車対応',
    reviews:
      '【評判】横浜緑区。とにかく部屋が広いことで有名。リラックスして長時間過ごすのに最適で、アメニティの質も高く満足度が高い。',
  },
  '19248183-654f-4b80-b13b-74fc81fa23c4': {
    // STAR RESORT I 入間
    amenities:
      'レインボーバス(一部), サウナ/スチームサウナ, シャンプーバイキング, 入間IC車2分, ドリンク無料',
    reviews:
      '【評判】入間。IC近くでアクセス抜群。清潔感のある広い浴室と、豊富な無料のシャンプーやドリンクサービスが女性に大人気。',
  },
  'ad022555-018e-4fbd-9ed5-59be4f133b5e': {
    // HOTEL SOARE 藤岡
    amenities: '本格サウナ(86度), 18台無料駐車場(ハイルーフ可), 全18室, 清潔な客室, 静かな環境',
    reviews:
      '【評判】群馬藤岡。サウナ好きの間で密かに話題。室内も非常に清潔で、静かな環境でサウナを楽しみながらリラックスできる。',
  },
  'ff3e19d9-83e6-4c16-88a2-d287c329d4ae': {
    // プレリュードキティーネ 仙台
    amenities:
      '大型TV(一部), Livedamカラオケ, ジェットバス, ウォーターサーバー, 加湿空気清浄機, 29台駐車場',
    reviews:
      '【評判】仙台。設備が非常に充実しており、カラオケや大型TVで室内遊びが充実。コストパフォーマンスの良さがリピーターの決め手。',
  },
  '0c3f90a1-17f7-4e55-b208-77a22daec9a3': {
    // ホテル艶 横浜町田店
    amenities: '横浜町田IC至近, スタイリッシュ内装, VOD完備, 駐車場完備, 3つ星クラスの清掃',
    reviews:
      '【評判】横浜町田。IC近くの利便性と、安定した清掃クオリティが魅力。スタイリッシュな空間で、デート帰りの宿泊に重宝されている。',
  },
};

updateMultipleHotelFacts(updates);
