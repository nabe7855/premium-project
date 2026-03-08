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
  // --- Batch 37: Nationwide High-Value & Concept ---
  'a6a543b9-e0f9-4483-8916-1af70c48a493': {
    // ホテル 遊Lab (小倉北)
    amenities:
      '無料朝食サービス, ウェルカムドリンク, 激安コスプレ(100円), 豊富な無料レンタル, 20台駐車場',
    reviews:
      '【評判】小倉北。サービス精神の塊。無料の朝食やドリンクに加え、100円のコスプレや豊富なレンタル品が充実。コスパと楽しさを追求するならここ。',
  },
  '283567c1-94ee-4f5e-85cf-e8730a5be7f4': {
    // カプロ (熊本) - 再掲・強化
    amenities:
      'THEATRE VOD(見放題), ジェット＆ブロアバス, 業界最大級のアニメ作品数, 22室/20台駐車場',
    reviews:
      '【評判】熊本。最新のVODシステムで映画やアニメが完全見放題。ジェットバス完備の広い浴室で、ゆったりと最新コンテンツに浸れる極上のおこもり空間。',
  },
  '2789dd95-5c67-4b49-8460-319b28396ca4': {
    // Five Stars (高松)
    amenities: 'Booking.com評価8.1, 清潔感抜群, ルームサービス豊富, 無料Wi-Fi, 朝食利用可能',
    reviews:
      '【評判】高松。大手予約サイトでも高評価を得る清潔さが自慢。丁寧なルームサービスと美味しい朝食で、ビジネスからデートまで外さない安定感。',
  },
  '91dfe269-a483-4148-9508-34d31596d112': {
    // SARA 錦糸町
    amenities: '3種のコンセプトルーム, ReFa全室完備, 65インチ巨大TV, デザイナーズ空間, 錦糸町駅近',
    reviews:
      '【評判】錦糸町。コンセプトごとに異なるラグジュアリーな内装が圧巻。全室ReFa完備や巨大テレビなど、都会の夜を彩る贅沢な設備が勢揃い。',
  },
  '4253ac4c-5ce1-482b-b976-891d82c85bf5': {
    // LOTUS 渋谷
    amenities: 'バリ島リゾート内装, 全室浴室テレビ, 最新VOD, 蓮の花モチーフ, 道玄坂好立地',
    reviews:
      '【評判】渋谷。道玄坂でバリ島リゾートを体感。浴室テレビでくつろぎながらのバスタイムは至高。洗練されたアジアンスタイルが都会の喧騒を忘れさせる。',
  },
  '87a59f90-383e-47f1-9fab-b0394fbdf386': {
    // AROMA BARU (池袋)
    amenities: 'アロマの香り演出, デザイナーズ家具, 大型プロジェクター(一部), 池袋駅北口スグ',
    reviews:
      '【評判】池袋。館内に漂う心地よいアロマがリラックスを誘う。プロジェクター完備の部屋もあり、都会の隠れ家で非日常的な香りと映像に包まれる体験。',
  },
  'b28d05bb-3ca9-47c9-89f8-62920f94338c': {
    // SWEETS HOTEL 池袋
    amenities: 'スイーツビュッフェ(一部), パステルカラー内装, 女子会プラン充実, 豊富なレンタル',
    reviews:
      '【評判】池袋。とにかく「可愛い」が詰まったホテル。スイーツ好きにはたまらないサービスや、明るい内装、豊富なアメニティが女子会や記念日に大人気。',
  },
  '28c8129c-51a1-4823-aacb-8609bef3a5ba': {
    // LUNA 町田
    amenities: 'Best Delight品質, 癒やしの空間設計, 浴室テレビ, 豊富なルームサービス, 駐車場完備',
    reviews:
      '【評判】町田。高級感のある落ち着いた空間で「癒やし」を提供。充実の設備と丁寧なサービスで、日常の疲れを忘れさせてくれる町田エリアの優良店。',
  },
  'c4ef7456-7544-4a73-9475-ee1981db81e0': {
    // SWEETS HOTEL 町田
    amenities: 'スイーツ専門店級メニュー, ポップな内装, 最新VOD, 豊富なアメニティ, 大型駐車場',
    reviews:
      '【評判】町田。遊び心あふれるポップな空間。専門店のようなスイーツメニューが楽しめ、最新の映画見放題も。明るく楽しいデートをしたい時に最適。',
  },
  '8a30b824-0713-4632-8b83-f907ebf2d79d': {
    // CAS VI ROYEL (今泉)
    amenities: '天神・今泉好立地, 落ち着いた大人向け内装, 広い浴室, 充実したアメニティ',
    reviews:
      '【評判】福岡。天神・今泉の飲屋街に近く、アクセスの良さと落ち着いた雰囲気が両立。広い浴室でゆっくり休め、中洲や天神での遊びの拠点に最高。',
  },
  '5240e517-487a-4b16-93aa-36915ccefea7': {
    // スターダスト (池袋)
    amenities: '池袋西口すぐ, リーズナブルな料金, 清潔な客室, 24時間利用可能',
    reviews:
      '【評判】池袋。駅チカの利便性が最大。手頃な価格設定ながら、清掃が行き届いた清潔な室内で、都会の夜を賢く、かつ快適に過ごせる定番の宿。',
  },
  'b18f4f0b-829a-4978-9ae0-aec2cd109cc5': {
    // HOTEL SALA (新横浜)
    amenities: '新横浜駅近, デザイナーズ空間, 全室VOD完備, リニューアル済, 駐車場有',
    reviews:
      '【評判】新横浜。スタイリッシュで清潔感のある室内が人気。コンサート帰りの利用にも最適で、充実したVODと広い風呂でイベント後の余韻を楽しめる。',
  },
};

updateMultipleHotelFacts(updates);
