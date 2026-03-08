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
  // --- Batch 50: Kanto High-End & Entertainment Mega Expansion ---
  '72478758-244c-4e17-a242-80f3e011091c': {
    // WILL RESORT 柏沼南
    amenities:
      '全客室リニューアル, カラオケ最新機種(一部), 加湿器, ウェルカムドリンク無料, 清潔感、アメニティ充実',
    reviews:
      '【評判】柏。全室リニューアル済みで清潔感が非常に高い。ウェルカムドリンクや充実のアメニティなど、高い満足度を誇るコスパ最高峰の宿。',
  },
  '3855b80e-1d95-43b6-a658-494e53f4e478': {
    // バニラリゾート 川越
    amenities:
      '65インチTV, ReFaヘアアイロン/ドライヤー常設, LIVEDAMカラオケ, 1000タイトルVOD, ウォーターサーバー',
    reviews:
      '【評判】川越。全室にReFa最新モデルを完備した美容重視のホテル。65インチの大画面で映画やカラオケを存分に楽しめる贅沢な空間。',
  },
  '9d8f9f52-5905-4b37-adee-1ae9825e4ca4': {
    // HOTEL LOTUS 千葉店
    amenities:
      'ウォータースライダー, ビリヤード&ダーツ, 露天風呂, アクアリウム, 室内ビールサーバー, プラネタリウム',
    reviews:
      '【評判】勝田台。もはやアミューズメントパーク。ウォータースライダーやビリヤードなど、二人だけの「遊び」を極めた千葉屈指のエンタメホテル。',
  },
  '8825472e-ab44-4985-8c19-e7a930fef9e7': {
    // ホテル ウォーターゲート成田
    amenities: 'サウナ(一部), レインボーバス, 無料Wi-Fi, VOD, 和室(一部), ティーサービス',
    reviews:
      '【評判】成田。広々とした客室と充実のサウナ・レインボーバスで、空港近くとは思えない極上の癒やし。和室でのんびり過ごすのもおすすめ。',
  },
  'cba4f0dd-4a5c-4f92-805a-bd3ea3c6b618': {
    // HOTEL RIMBA (千葉)
    amenities:
      '露天風呂付き客室(一部), バリ風リゾート, 空気清浄機, ジェットバス, 各種アメニティ完備',
    reviews:
      '【評判】千葉。本場バリから直輸入された家具に囲まれる、千葉市内のリゾートホテル。一部客室の露天風呂は、贅沢なプライベートタイムを演出する。',
  },
  'd7575b07-852a-465e-8452-9a294d96d378': {
    // HOTEL COSTA RESORT 千葉北
    amenities:
      '生ビールサーバー, プラネタリウム, 露天風呂(5部屋), VR/シアタールーム, Netflix, アクアリウム',
    reviews:
      '【評判】千葉。プラネタリウムの煌めきや、部屋での生ビール、最新のVR体験まで。全室異なるコンセプトで、何度訪れても新しい発見がある超人気店。',
  },
  'd9c62026-8936-463d-a2ed-7b9a7d47914a': {
    // Pasha de Resort (白岡)
    amenities:
      '42インチプラズマTV, 露天風呂(一部), ウォーターサーバー, ドクターシーラボ/オーガニックアメニティ',
    reviews:
      '【評判】白岡。厳選されたスキンケア用品や広々とした露天風呂が自慢。白岡エリアで最高級のアメニティと設備を誇り、女性からの支持が非常に高い。',
  },
  '0f015fd1-bd14-4d04-ae7f-523e915a898e': {
    // バニラリゾート ちゅら (三芳)
    amenities:
      '120インチプロジェクター, ビューバス, 岩盤浴(一部), 70インチTV, LIVEDAM Ai, 無料DAZN',
    reviews:
      '【評判】三芳。120インチの超巨大プロジェクターでの映画鑑賞は圧巻。岩盤浴や絶景ビューバスなど、五感を刺激する極上のリラックス体験ができる。',
  },
  '8f458a9c-a485-4462-84a7-1e8e0f7cb506': {
    // Hotel ALAUDA 新座
    amenities:
      '水中照明付きブロアバス, 露天風呂/岩盤浴(一部), 日焼けマシン, 天蓋付きベッド, アジアンリゾート内装',
    reviews:
      '【評判】新座。水中照明バスや日焼けマシンなど、他にはない個性的設備。天蓋ベッドで眠るアジアンリゾートな夜は、都心近くとは思えない解放感。',
  },
  'bc905065-8b51-43f3-ab06-377ab60bff0e': {
    // HOTEL BANJAR (所沢)
    amenities:
      '屋上貸切露天風呂(埼玉県最大級), 個室ドライサウナ, 100種以上フード, ウェルカムビール/デザート',
    reviews:
      '【評判】所沢。県内最大級の屋上貸切露天が圧倒的。100種超のフードやビール無料サービスなど、「帰りたくなくなる」ほどの充実したおもてなし。',
  },
  '15e01ce0-d197-4bd6-b40d-e6d739390505': {
    // HOTEL C. 小倉エスト
    amenities:
      '全室マイクロバブルバス(ナノウォーター), ロウリュサウナ(ロイヤル/スイート), 60インチTV, フランスベッド',
    reviews:
      '【評判】小倉。全室導入のマイクロバブルバスで美肌に。ロウリュサウナ完備の客室もあり、福岡エリア最高峰の「整い」と快眠を約束する。',
  },
  '2d31cd13-6cf6-49af-b4ea-ee5ce45d7e97': {
    // HOTEL LA FESTAE 国立 (ラフェスタ国立)
    amenities:
      'レインボージェットバス, マッサージチェア, 天蓋付きベッド, 通信カラオケ, 豊富なアメニティ, 大型液晶TV',
    reviews:
      '【評判】国立。幻想的なレインボーバスと、マッサージチェアでリラックス。天蓋ベッドでの優雅な時間は、記念日や自分へのご褒美に最適。',
  },
  '9103ffef-5dc1-480b-888d-3f69b16edbf7': {
    // HOTEL 御殿山 (八王子)
    amenities:
      '全室レインボーバス, 乗馬マシン(一部), 42インチ以上TV, くるくりドライヤー, 豊富なレンタル品',
    reviews:
      '【評判】八王子。全室に導入された七色のレインボーバスが美しく、ユニークな乗馬マシンも楽しめる。豊富なアメニティで手ぶら利用も安心。',
  },
  'cb768dbc-795e-4d80-9300-c9d251e8d983': {
    // ザ・アメリカン (葛西)
    amenities:
      'レインボーバス(一部), ハイルーフ車可, 空気清浄機, 有線放送, 大型TV, 豊富なアメニティ',
    reviews:
      '【評判】葛西。ガレージ式駐車場でプライバシーも安心。一部客室のレインボーバスや、ゆったりとした客室サイズが、心安らぐひとときを提供。',
  },
  '3213fdaa-d4a0-4d91-9a39-5799729bce6a': {
    // hotel min. (五反田)
    amenities:
      'ミニマルモダンデザイン, リクライニングベッド, 清潔感抜群, 充実のアメニティ, 無料Wi-Fi',
    reviews:
      '【評判】五反田。無駄を省いた洗練されたミニマルなデザイン。リクライニングベッドでの映画鑑賞など、清潔でスマートな「大人の休息」に。',
  },
  'b117dd94-786f-440f-99b9-38e0122db648': {
    // HOTEL IG ANNEX (足立)
    amenities:
      '地域唯一の露天風呂付き客室(4部屋), 5.1chサウンド, 水中照明, お子様同伴可, 豊富なお酒類',
    reviews:
      '【評判】足立。地域で唯一の露天風呂付き客室を備える。5.1chの迫力サウンドや豊富な酒類、子連れ利用も可能という懐の深さが魅力。',
  },
  'e9774a92-d9ae-41f4-b272-651d9cda99f9': {
    // 紗羅 柏しょうなん
    amenities:
      'レインボージェットバス, 65インチ以上TV, ゴルフシミュレーター(一部), ムービングラブソファ, 各室VOD',
    reviews:
      '【評判】柏。ゴルフシミュレーターや動くラブソファなど、充実の室内コンテンツが自慢。大型TVとVODで二人だけの映画館気分を満喫できる。',
  },
  '78ba6638-0c65-4d93-818a-bdbe54ee42eb': {
    // HOTEL BRUGGE (柏)
    amenities:
      '天蓋ベッド, サウナ/プール/マッサージチェア(一部), ロロコ様式家具, 1000ch以上VOD, Wi-Fi',
    reviews:
      '【評判】柏。まるでお城のようなロココ調の内装。天蓋ベッドやスイートのプールなど、日常を完全に忘れさせてくれる柏の隠れ家的「宮殿」。',
  },
  '44fc2182-4104-4d04-8ca2-51ef1a9928e9': {
    // HOTEL & SPA AMPIO
    amenities:
      'プライベートプール, 露天風呂, VIPルーム豪華設備(KINUJO), ロココ調内装, シャンデリア',
    reviews:
      '【評判】水戸。プライベートプールや露天風呂を備え、「極上のおもてなし」を具現化。ロココ調の煌びやかな内装は、水戸で最も豪華な夜を演出。',
  },
  '94e68c6e-ba6a-4037-8970-0d19e61a50a5': {
    // HOTEL SEEDS 土浦店
    amenities:
      '豪華シティホテル風, 全室ジェットバス, 美容/スチーム美顔器無料レンタル, 1000タイトルVOD',
    reviews:
      '【評判】土浦。シティホテルのような気品ある外装。ジェットバス完備の広い客室と、無料レンタルの美顔器で過ごす、心もお肌も潤うひととき。',
  },
  '35afb08d-2d16-4b5d-8050-a0fca0a4b78f': {
    // HOTEL ACQUA Espacio (土浦)
    amenities:
      '駅徒歩1分, ウェルカムハーゲンダッツ(日〜金), 霞ヶ浦展望, JOYSOUND F1(一部), デザイナーズ',
    reviews:
      '【評判】土浦。駅から徒歩1分の好立地。夜景や霞ヶ浦を望む展望と、ウェルカムハーゲンダッツのサービスが、特別な日の気分をさらに高めてくれる。',
  },
  '5f26163b-6423-48f4-94ef-36009afb1273': {
    // HOTEL LATTICE つくば
    amenities:
      '75インチ動画対応TV, ReFaファインバブルピュア/ドライヤー(一部), ムーンライトバス, YouTube対応',
    reviews:
      '【評判】つくば。75インチの超大画面TVやReFaの最新美容設備が充実。ムーンライトバスの幻想的な光の中で、最高にリフレッシュできる名店。',
  },
  '76037cfa-f809-44cc-9f88-193c86a3fd48': {
    // アミューズメントホテル 水戸ヒルズ
    amenities:
      '28種の多彩なコンセプト(電車/宇宙/エジプト/バリ), 酸素カプセル, 露天風呂, 各室サウナ, 100着コスプレ',
    reviews:
      '【評判】水戸。28種類もの「選べる楽しさ」が最大の魅力。酸素カプセル付の部屋や電車ルームなど、水戸で最も遊び心に溢れたアブノーマルな癒やし。',
  },
  'fe730c94-94ea-4c86-9e96-3e6e1a5c96d9': {
    // HOTEL TEX & NEX (栃木)
    amenities:
      '岩盤浴/露天風呂(一部), コンタクトレンズ保存液完備, ハニートースト無料, 各種アメニティ充実',
    reviews:
      '【評判】栃木。ハニートースト無料などの豊富なサービス。コンタクト液まで備える細やかな配慮が嬉しく、静かな環境で広々とした風呂を満喫できる。',
  },
  '8ea27d4c-5bb8-4b3d-b18e-3aa3d9ab4412': {
    // HOTEL MYTH Story (益子)
    amenities:
      '全室益子温泉, バリ風和室, 50インチ以上TV, ブルーレイ, 2WAYヘアアイロン, 美容アメニティ充実',
    reviews:
      '【評判】益子。全室で「温泉」が楽しめる贅沢。バリのリゾート感と和の心が融合した客室で、日々の疲れを熱い湯が芯から解きほぐしてくれる。',
  },
};

updateMultipleHotelFacts(updates);
