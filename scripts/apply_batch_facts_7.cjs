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
  '08783703-2865-417b-81f3-86a33aea24ad': {
    // HOTEL New MIE
    amenities:
      'ジャグジーバス全室, U-SEN, DVDプレイヤー, クローゼット完備, 無料Wi-Fi, 豊富な客室アメニティ',
    reviews:
      '【評判】マンション改造型で、まるで自宅のようにリラックスできる空間。全室均一料金プランがあり、広々としたお風呂が好評。',
  },
  'c45a4dc3-4a77-4d85-8296-0a76d710e3fc': {
    // Hotel OAK
    amenities:
      '蒲田駅徒歩3分, 最新VOD, ミネラルウォーター無料サービス, 24時間フロント, 清潔なバスルーム',
    reviews:
      '【評判】高級シティホテルのような落ち着いた内装。掃除が非常に丁寧で清潔感があり、静かに過ごせるとビジネス層にも人気。',
  },
  'e48b4c29-ba69-458e-8b1c-34e574030be5': {
    // HOTEL LIXIA
    amenities:
      '露天風呂付き客室あり, 部屋風呂に大型TV完備, ゴージャスなデザイナーズ内装, 池袋No.1認定PR店',
    reviews:
      '【評判】池袋屈指のゴージャスホテル。露天風呂と大型TVの組み合わせが最高。非日常的な記念日利用にも最適。',
  },
  '25a73f75-fd55-4a07-b5f0-9c9ef1d0acab': {
    // レステイ ラグーン
    amenities: '駐車場予約可, 禁煙ルーム, くるくるドライヤーレンタル, ロビー電子レンジ',
    reviews:
      '【評判】スタッフの神対応が口コミで話題。駐車場が予約できるため遠方からの利用も安心。リーズナブルで快適。',
  },
  '357bc8a1-93fa-47ca-8cd7-3068f5c9b81f': {
    // ホテル かじか
    amenities: '新大久保駅徒歩3分, QRコード/交通系IC決済対応, 最大4名1室利用可',
    reviews:
      '【評判】圧倒的な立地の良さと安さ。男性一人や家族連れなど、誰でも気軽に泊まれる使い勝手の良さが魅力。',
  },
  '8a972d94-9bff-43d4-8806-6e5024e4a69d': {
    // Hotel Labio
    amenities: '全室ジェットバス&浴室TV完備, 歌舞伎町徒歩2分',
    reviews:
      '【評判】立地重視派に最適。建物は年季が入っているが、毎日丁寧に清掃されておりお風呂の設備は充実。',
  },
  '5d6b0bb7-0d48-426d-b9dc-381ec075113f': {
    // ホテル カサンドラ
    amenities: 'ウェルカムお菓子/美容品プレゼント, 多チャンネルVOD, 渋谷道玄坂エリア',
    reviews:
      '【評判】フロントが非常に親切でアットホーム。アメニティのプレゼントなど細かい配慮が嬉しく、リピーターが多い。',
  },
  'bd4083f9-d22b-4d00-b1b1-29b81af8040f': {
    // ホテル メトロ 新横浜
    amenities: 'サウナ付き客室あり, 広々バスタブ, 朝食サービス, 24時間フロント',
    reviews:
      '【評判】新横浜駅から徒歩圏内でイベント拠点に便利。清掃が行き届いた広いお風呂が特に好評で、ビジネスホテル以上の快適さ。',
  },
  'b1214720-5e82-405d-be64-3129ed4b3422': {
    // ホテル ルージュ
    amenities:
      '全室リニューアル済み, 豊富なブランドアメニティ貸出, ヘアアイロン, セパレートバス・トイレ',
    reviews:
      '【評判】池袋駅C1出口すぐ。リニューアルしたばかりで非常に綺麗。大人の落ち着いたデートに最適な清潔感あふれる空間。',
  },
};

updateMultipleHotelFacts(updates);
