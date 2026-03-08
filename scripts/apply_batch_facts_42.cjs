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
  'fef89aae-2856-4c3f-9929-10f1288a7da6': {
    // HOTEL SELEVA (多賀城)
    amenities:
      '75インチ巨大TV, 虹色レインボーバス, SM設備, マッサージチェア(一部), 全室バスローブ完備',
    reviews:
      '【評判】多賀城。75インチの超大画面TVや、SM設備などの特殊機材が揃う。豊富なレンタル品とアメニティで、長時間の滞在も飽きさせない。',
  },
  '590e5c3f-8f29-40bf-b2f6-187625018610': {
    // HOTEL KITTY (名取)
    amenities:
      'シモンズ製ベッド, 本格ドライサウナ(701/702), 強冷水風呂(17度), 露天風呂/外気浴, 4K大型TV',
    reviews:
      '【評判】名取。全室シモンズ製ベッドで極上の眠りを。特に701/702号室は本格サウナと強冷水風呂、外気浴を備えた「サウナ特化型」の聖地。',
  },
  '84fd899a-ffa0-42a1-b16a-d95223762d10': {
    // HOTEL LUNA 川越店
    amenities:
      'メリーゴーランド/チョコのベッド, プラネタリウム, ビリヤード/ダーツ, シーシャ, ビールサーバー',
    reviews:
      '【評判】川越。もはや遊園地。メリーゴーランドやチョコのベッド、ビリヤードなど、日本でも稀なエンタメ設備が集結した「泊まれる遊技場」。',
  },
  '69510451-7177-4077-bb1c-ed5f7a8e7f96': {
    // HOTEL OASIS (深谷)
    amenities: 'レインボージェットバス, スケベイス(一部), 24時間フロント, 豊富なルームサービス朝食',
    reviews:
      '【評判】深谷。レインボーバスや、エリアでは珍しい特殊設備を備える。24時間対応のフロントと充実の朝食サービスで、安定した人気を誇る。',
  },
  '376d5477-4e89-4911-8f63-611308fe9e80': {
    // HOTEL NATURA (志木)
    amenities:
      '60インチ大型TV全室, マイクロバブルバス, ReFaアイロン/ドライヤー貸出, 加湿脱臭機, 浴室TV',
    reviews:
      '【評判】志木。エリア屈指の広い浴槽が自慢。マイクロバブルバスや最新の美容家電貸出など、美容と癒やしに特化した空間。',
  },
  '846beaaf-0e90-4715-b3ee-64aba3bee625': {
    // HOTEL GIG (川越)
    amenities:
      '最高級マッサージチェア「あんま王」, Apple TV, プロジェクター, ウォーターサーバー, 防音ルーム',
    reviews:
      '【評判】川越。多機能マッサージチェア「あんま王」やApple TVを完備。防音性の高い室内で、映画館のような臨場感を独り占めできる隠れ家。',
  },
  'e8f8fc77-bb70-4007-bfa9-ab272c6f4656': {
    // HOTEL RIZE (大宮)
    amenities:
      '全室ミストサウナ完備, 室内PC/Blu-ray, ドライサウナ(一部), 100インチプロジェクター(一部)',
    reviews:
      '【評判】大宮。全ての部屋にミストサウナを標準装備。さらに一部の部屋にはドライサウナや巨大プロジェクターもあり、室内で本格SPA体験。',
  },
  '204a5abe-26a4-4b2c-a5e3-8a0ef0057505': {
    // 六丁の目のTHE HOTELION (仙台)
    amenities:
      '美人の湯(ナノ水), マイクロバブルバス, 豊富なコスプレレンタル, リモートオーダーシステム',
    reviews:
      '【評判】仙台。ナノ水「美人の湯」を全室に導入。スタイリッシュな内装と最新の注文システム、豊富なレンタル品で、遊び心溢れる滞在。',
  },
  '1950b5bd-1b0a-4649-ad7b-5d64e815b0ea': {
    // SARA 五反田
    amenities:
      '65インチ4K-TV, 本格ドライサウナ, 岩盤浴, 露天風呂, SARA特製アメニティセット, ホームシアター',
    reviews:
      '【評判】五反田。SARAグループの旗艦店。65インチ4Kテレビや本格サウナ、露天風呂など、都内最高峰のラグジュアリー。',
  },
  '38c10d51-6c81-4878-999d-374643c4db54': {
    // HOTEL ISOLA (仙台)
    amenities:
      '有名デザイナー設計, 岩盤浴/サウナ(一部), レインボーバス, PC無料レンタル, 36台大型駐車場',
    reviews:
      '【評判】仙台。デザイナーズホテルの洗練された空間。フロアごとにテーマが異なり、岩盤浴やサウナで癒やしの時間を過ごせると高い支持。',
  },
  'a453f959-e72f-46cd-99ce-2b014c5f818c': {
    // HOTEL LULL KOMOREBI (多賀城)
    amenities:
      '全室ジェット&ブロアバス, 浴室TV全室, 2018全面改装, 美顔器レンタル, 無料朝食モーニング',
    reviews:
      '【評判】多賀城。2018年リニューアル。全室に浴室TVとジェットバスを完備。美顔器の無料貸出など、美容への意識も高い注目店。',
  },
  '19248183-654f-4b80-b13b-74fc81fa23c4': {
    // STAR RESORT I (入間)
    amenities:
      'サウナ/スチームサウナ, 虹色レインボーバス(一部), シャンプーバイキング, ドリンクバー無料',
    reviews:
      '【評判】入間。IC近辺のアクセス抜群な立地。サウナやレインボーバスの充実に加え、無料のシャンプーバーがお得感を演出。',
  },
  'ad022555-018e-4fbd-9ed5-59be4f133b5e': {
    // HOTEL SOARE (藤岡)
    amenities: '86度の本格フィンランドサウナ, 18台無料大型駐車場, 静音設計, 徹底した清潔清掃',
    reviews:
      '【評判】群馬藤岡。サウナー絶賛の86度高温サウナを完備。非常に清潔な客室は、誰にも邪魔されたくないリラックスタイムに最適。',
  },
  '19b0a6d5-bfae-4c29-a279-243836e86b3c': {
    // HOTEL LX 諏訪
    amenities: '飲み放題サービス(3時間), 露天風呂/サウナ付き客室, JOYSOUND最新カラオケ, SMルーム',
    reviews:
      '【評判】諏訪。3時間の飲み放題という驚きのサービス。露天風呂やサウナ付きの部屋に加え、最新カラオケなど、遊びの充実度が地域随一。',
  },
  '59462829-b709-4d45-9f62-076dd195dbf6': {
    // HOTEL LUXE 新栄店 (名古屋)
    amenities:
      '118度超高温ロウリュサウナ, 17度強冷水風呂, 炭酸風呂/シルキーバス, ナノケアドライヤー',
    reviews:
      '【評判】名古屋新栄。サウナへのこだわりが異常。118度の灼熱サウナと17度の強冷水風呂、炭酸風呂まで揃う「サウナーの聖地」。',
  },
  '15acb4c8-305c-42a5-b5b3-52425f26a7c7': {
    // La・北物語 (能代)
    amenities:
      '北欧風プライベートコテージ, 美肌の湯「美白泡」, 乗馬マシン, コトブキヤ等アニメグッズ(一部)',
    reviews:
      '【評判】能代。離れコテージ形式。独自の「美白泡」バスや乗馬マシンなど、他にはないユニークな設備とプライベート感が魅力。',
  },
  '9eea03fa-c978-4348-9482-f65c514ec673': {
    // プリンセスプリンセス秋田大町
    amenities:
      '天蓋付きお姫様ベッド, 檜の香り風呂, 24時間フルルームサービス, AtoZグループ高品質アメニティ',
    reviews:
      '【評判】秋田。天蓋ベッドで味わう非日常的なプリンセス体験。檜風呂の香りと充実のルームサービスが、ラグジュアリーな時間を演出。',
  },
  'db624bd6-d627-43ac-9239-0b723836c701': {
    // M'S CACHE (秋田)
    amenities: '全室床暖房(冬期), 本格露天風呂, 天蓋ベッド, スロットマシン, 800タイトルVOD',
    reviews:
      '【評判】秋田。秋田の冬に嬉しい全室床暖房完備。本格的な露天風呂や天蓋ベッドなど、高級感溢れる設備が揃う地域のランドマーク。',
  },
  'f9789812-5547-4a33-ab43-d147bac6ad8a': {
    // ホテル グランリゾート 祇園 (羽生)
    amenities:
      '京都祇園モチーフ離れ形式, プライベートガレージ, 絶品お茶漬けサービス, Bluetooth音楽接続',
    reviews:
      '【評判】羽生。京都の祇園を再現した、風情ある離れ形式。誰にも会わないプライベートガレージ精算と夜食のお茶漬けが情緒たっぷり。',
  },
  '375c1cfb-7b28-466d-a489-d11598ebaa7c': {
    // ホテル 行田アイネ
    amenities: '98度高温本格サウナ, 露天風呂/岩盤浴, 日焼けマシン, 拘束壁椅子(SM), 3ベッドルーム',
    reviews:
      '【評判】行田。98度の本格サウナや岩盤浴、SM設備、3ベッドルームまで揃う情報の宝庫。多様なテーマ部屋で非日常を体験可能。',
  },
  'c8cb7a28-0714-4103-afb8-b2fd76fa7f00': {
    // HOTEL Large (本庄)
    amenities: '24時間対応フロント, 低価格シンプルプラン, 駐車場完備, 大型TV/VOD完備',
    reviews:
      '【評判】本庄。余計なものを削ぎ落とした低価格と、24時間有人対応の安心感。清潔で、急な宿泊にも最適なコスパ抜群のホテル。',
  },
  '1aaae8e8-d4bf-4c5f-a00b-b8c8070d3f3c': {
    // ホテル ナパバレー (越谷)
    amenities:
      'アメリカンスタイルデザイナーズ, ReFaドライヤー/アイロン, 虹色レインボーバス, 初回コスプレ無料',
    reviews:
      '【評判】越谷。アメリカ西海岸をイメージしたお洒落な空間。最新のReFa美容家電と虹色のレインボーバスでドラマチックな滞在。',
  },
  'a50bafe6-a15a-41a5-9f7b-61c36de138a9': {
    // HOTEL a (久喜)
    amenities: '全室ジェット&ブロアバス, 浴室TV完備, ハンドマッサージャー, 42インチ以上大型液晶',
    reviews:
      '【評判】久喜。全室に浴室TVとマッサージ機能付きバスを標準装備。水回りの機能性にこだわった、カップルに安定人気の店。',
  },
  '4a8a3e71-2be3-4f6d-bc56-f1c5fa9a2cd2': {
    // HOTEL RAMSES COTE (川崎)
    amenities: '高級ブランドシャンプーバー, 露天風呂(一部), 4K大型モニター, デザイナーズ家具',
    reviews:
      '【評判】川崎。ラムセスグループならではの高級感。選べるブランドシャンプーや、客室露天風呂が都会の喧騒を忘れさせる。',
  },
  '19beb3e2-e2f2-4638-9c6f-367a9b630379': {
    // LUXE JAPANESQUE MODERN 一宮店
    amenities: '和モダンデザイン, 本格炭酸風呂/岩盤浴, 60インチ4Kテレビ, LIVE DAM STADIUM',
    reviews:
      '【評判】一宮。「和モダン」を極めた上質空間。本格的な炭酸風呂や岩盤浴で体を癒やしながら、大画面でカラオケを楽しめる。',
  },
  'b6cbf564-60eb-4e32-8bab-f8cbc69f824e': {
    // HOTEL ROUTE 08 (利府)
    amenities: '虹色大型ジェットバス, ウェルカムドリンクサービス, 全室Wi-fi, クレジット決済可',
    reviews:
      '【評判】利府。虹色の照明が輝く大型ジェットバスが自慢。ウェルカムドリンクの提供や決済の利便性など、サービスが非常に丁寧。',
  },
};

updateMultipleHotelFacts(updates);
