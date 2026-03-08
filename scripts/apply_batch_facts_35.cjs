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
  // --- Batch 35: High Density Entertainment & Unique Concept ---
  'e1df22ec-8ca4-4d1c-9a64-ed604a796ce6': {
    // くちなし城 桃源郷 伊勢原
    amenities:
      '人工温泉, リラクゼーションベッド, ドライサウナ(一部), 50インチ以上大型TV, 加湿空気清浄機',
    reviews:
      '【評判】伊勢原。まさに大人の城。とにかく「風呂が広い」と絶賛されており、人工温泉やサウナで心ゆくまでリラックスできる。凝った内装も非日常を演出。',
  },
  '2a054c84-3680-44c6-b67a-9b73b29beea7': {
    // レステイ 広島
    amenities:
      '広島中心部好立地, セレクトシャンプー, ヘアアイロン貸出, ジェットバス(一部), 無料Wi-Fi',
    reviews:
      '【評判】広島。大手レステイならではの安定した清潔感とサービス。セレクトシャンプーやヘアアイロンなど、女性の「あったら嬉しい」が揃う駅近店。',
  },
  '2a7c541c-bbd7-46fa-b6a7-372f3fab1238': {
    // SWING 神戸
    amenities:
      '24時間対応フロント, デジタル目覚まし時計, コーヒーメーカー, 快適なLCDテレビ, アメニティ充実',
    reviews:
      '【評判】神戸。総合力の高い人気店。細かなアメニティの充実度やスタッフの対応が丁寧で、初めての方でも安心して利用できる清潔な空間。',
  },
  '2b94fa4f-fa3f-4d30-9722-d58b16e7d490': {
    // BLAST (仙台)
    amenities:
      'デザイナーズルーム, ReFaドライヤー完備(一部), セルフサウナ(一部), 勾当台公園駅徒歩圏内',
    reviews:
      '【評判】仙台。洗練されたデザイナーズ空間。一部の部屋にはReFaのドライヤーやサウナなど最新設備を導入。宮城の夜をスマートに過ごしたい時に。',
  },
  '2c49e77e-a6c6-4f37-928f-489f0d2d3a2a': {
    // 銀の塔 (伊勢原)
    amenities: '本格レストラン料理, 人工温泉, ブルーレイプレーヤー, タブレット注文, 伊勢原IC至近',
    reviews:
      '【評判】伊勢原。もはやレストラン。食事が非常に美味しいと長年愛される名店。人工温泉の癒やしと、満足度の高い絶品メニューが最高のペアリング。',
  },
  '2c9a5b6e-fd93-42b9-b5a8-0292a32239a4': {
    // シャッフル＆リフレイン (池袋)
    amenities:
      '有名デザイナー設計, 50インチ大型TV, ジェットバス, 水中照明(一部), 池袋駅西口徒歩5分',
    reviews:
      '【評判】池袋。デザイナーズのおしゃれな雰囲気が光る。駅チカながら広々とした50インチテレビや水中照明付きの風呂で、都会の喧騒を忘れて遊べる。',
  },
  '2cbfe31a-a443-4ffb-8fad-a986caf89638': {
    // Very (松阪)
    amenities:
      '巨大プロジェクター(一部), 露天風呂/岩盤浴(一部), ミストサウナ, 浴室TV全室, 42インチプラズマTV',
    reviews:
      '【評判】松阪。圧倒的な部屋の広さと豪華設備。プロジェクターや露天風呂、岩盤浴など、都会の高級スパに匹敵する体験をお得に楽しめる実力店。',
  },
  '51891aec-5e00-49dd-a53e-e546007716b8': {
    // レステイ 岩槻
    amenities:
      'マッサージチェア全室, 本格サウナ(一部), 食事が絶品, 清潔な広々客室, 各種レンタル充実',
    reviews:
      '【評判】岩槻。広い室内と美味しい食事が評判。マッサージチェアで寛ぎ、サウナで整う「おこもり泊」が人気。レステイブランドの安心感がここにも。',
  },
  'e4b15acd-f39f-4e53-9a9c-0c41e8a7962f': {
    // アルティア ダイナソー 岐阜
    amenities:
      '巨大恐竜ロボット, 本格牢屋/磔台ルーム, ゴルフシミュレーター, 露天風呂, ビリヤード/ダーツ',
    reviews:
      '【評判】岐阜。国内最大級の恐竜テーマパーク。巨大恐竜から特別な「牢屋ルーム」、さらにはゴルフまで。もはや遊園地レベルの非日常が24時間無料。',
  },
  'bce6f995-2ba1-42af-ba3f-9ae6a33605c8': {
    // アイリーン・ドナン町田 (相模原)
    amenities: 'コラーゲン美肌マシン, ブロアーバス, サウナ, 22インチ浴室TV, 町田駅徒歩1分',
    reviews:
      '【評判】相模原。極上の「美」を追求。コラーゲンマシンや美容設備が充実しており、町田駅すぐの好立地で自分磨きとリラックスを同時に叶えられる。',
  },
  'be5b3598-5bd5-4c20-ba0e-5b8eb0ac80f6': {
    // アマン 浜松
    amenities:
      '保健室/教室/電車テーマ部屋, カラオケ全室, コスプレレンタル豊富, 高品質フードメニュー',
    reviews:
      '【評判】浜松。全室異なるテーマの驚きのデザイン。保健室や電車など刺激的な部屋があり、遊び心溢れるカップルに絶対おすすめのエンターテインメント空間。',
  },
  'd266a1b3-84af-4f78-a838-5e74d93da65b': {
    // アテッサガーデン 伊賀
    amenities:
      'ガーデンスパ(露天風呂一部), レインボージャグジー, 格安フードメニュー, VOD映画見放題',
    reviews:
      '【評判】伊賀。開放的なガーデンスパを楽しめる隠れ家。格安のフードサービスもあり、レインボーに光るジャグジーで伊賀の夜をゆったり過ごせる。',
  },
  'c59a1047-fd53-4491-bb3c-7f691323f103': {
    // くるくる倶楽部 (糸島)
    amenities:
      '釜焼き本格ピザ, 映画800タイトル無料, モーニングサービス, 時間制柔軟プラン, 糸島観光至近',
    reviews:
      '【評判】糸島。本格的な釜焼きピザが食べられる異色店。映画も見放題で、糸島ドライブの途中や宿泊に最高に贅沢な「食と住」のサービスを提供。',
  },
  'b0370382-1c76-4756-b339-90886d4f59c0': {
    // 湘南ベイホテル
    amenities: '露天風呂/サウナ(一部), 朝マック無料サービス, ジェットバス, 広大な客室, 134号線至近',
    reviews:
      '【評判】茅ヶ崎。海風を感じる広々とした部屋。一部の露天風呂からは開放感が味わえ、朝マックの無料デリバリーなど、湘南らしい自由な過ごし方が可能。',
  },
};

updateMultipleHotelFacts(updates);
