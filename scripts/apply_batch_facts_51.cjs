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
  // --- Batch 51: Koshinetsu & Northern Kanto Verified Facts ---
  '8c6d8133-db79-4974-9fad-4a8b544209f9': {
    // K RESORT (栃木)
    amenities:
      'レインボーバス, ジェットバス, 50インチ以上TV, VOD, 持ち込み用冷蔵庫, ハイルーフ車可駐車場',
    reviews:
      '【評判】那須塩原。全室専用駐車場完備でプライバシー重視。レインボーバスと清潔感のある客室で、那須の静かな夜をゆったり過ごせる。',
  },
  'b7b876e5-4198-480d-940d-e43f0768a914': {
    // Hotel FOO FOO (栃木)
    amenities:
      '天蓋付きベッド, デザイナーズルーム(モロッコ風等), VOD無料, 無料Wi-Fi, 充実のアメニティ',
    reviews:
      '【評判】足利。天蓋ベッドやモロッコ風など、非日常なデザイナーズ空間。早めのチェックインが可能で、価格満足度が非常に高い。',
  },
  'fccf4a8d-892a-47e0-9d6f-e75815d28bf0': {
    // AtoZ一宮インター店
    amenities:
      'サウナ(90℃/水風呂あり), 50インチ以上TV, ウェルカムドリンク, プラズマクラスター(一部)',
    reviews:
      '【評判】笛吹。本格的な高温サウナと水風呂で「整う」体験ができる。広い客室とウェルカムドリンクのサービスがビジネス・観光共に好評。',
  },
  'f660c662-c119-46f1-ac01-08b977ccd986': {
    // Hotel Double-D (山梨)
    amenities: '全室ゲルマニウム人工温泉, 防音仕様, 会員割引, 長時間滞在プラン, 特大バスタブ',
    reviews:
      '【評判】笛吹。全室に導入されたゲルマニウム人工温泉と特大バスタブが人気。防音も万全で、時間を忘れて寛げる大人の隠れ家。',
  },
  'a0b7a51f-5be5-4164-b035-f3c2dd79d1dc': {
    // ホテル ゴルフ 甲府昭和
    amenities:
      'ビジネスプラン対応, 充実のルームサービス, 無料Wi-Fi, 電子レンジ, くるくるドライヤー(レンタル)',
    reviews:
      '【評判】昭和町。ビジネスホテルを凌駕する広さと設備。コスパが非常に良く、出張や観光の拠点としてリピーターが多い。',
  },
  '72a5a381-799c-4759-9ff7-d8d8226ee86b': {
    // Hotel CREA DEUX (山梨)
    amenities:
      'レインボーバス, ジェットバス, 1500タイトル無料VOD, ウェルカムサービス, 充実のレンタル品',
    reviews:
      '【評判】甲斐。幻想的なレインボーバスと充実したレンタル品が自慢。清潔感のある空間で、映画三昧の夜を快適に楽しめる。',
  },
  '60b8045e-ea09-4c8d-9197-e839e86138b3': {
    // HOTEL Melia RESORT (山梨)
    amenities:
      '防音仕様, ミストサウナ/浴室TV(一部), 無料朝食サービス, ReFaアイロン(レンタル), 男性用/女性用化粧品',
    reviews:
      '【評判】境川。リゾート感溢れる防音客室と無料朝食が嬉しい。ReFaのレンタルや各種アメニティも揃い、女性目線のサービスが光る。',
  },
  'dbd8042e-44aa-4b91-b520-f36622b5ab1a': {
    // AtoZ諏訪インター店
    amenities: '女子会プラン, 浴室TV(一部), 無料Wi-Fi, 外出可能, 自動オーダリング, 駐車場2台可',
    reviews:
      '【評判】諏訪。女子会プランの無料ケーキやピザが豪華。清潔で広い客室は使い勝手が良く、諏訪湖観光の拠点としても最適。',
  },
  '7826fa7b-f981-4af2-87dc-a53186aac3a1': {
    // 天然温泉ホテル COCORO (新潟)
    amenities:
      '全室天然温泉, マッサージチェア, オーロラバス, ガレージ直結(プライベート重視), 打たせ湯(一部)',
    reviews:
      '【評判】刈羽。全室で本物の天然温泉を楽しめる贅沢。ガレージ直結で誰にも会わずに入室でき、オーロラバスの癒やしも格別。',
  },
  '337fb896-e343-4df5-8d9a-86ddbb1143a5': {
    // SUITE BLANCO (新潟)
    amenities:
      '全室スイートルーム, 全室完全禁煙, レインボーバス, 50インチ以上TV, ブルーレイプレーヤー',
    reviews:
      '【評判】長岡。全室スイートかつ完全禁煙というクリーンな高級感が魅力。最新のAV設備とレインボーバスで、上質な「静寂」を楽しめる。',
  },
};

updateMultipleHotelFacts(updates);
