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
  // --- Batch 49: Tokyo High-End & Entertainment Enrichment ---
  'bfc598c4-2692-44e5-8f6c-a0c21454680e': {
    // HOTEL PASHA (歌舞伎町)
    amenities:
      'サウナ, 岩盤浴, プライベートガーデン(一部), ナノケアドライヤー全室, 65インチTV, 冷蔵庫無料ドリンク',
    reviews:
      '【評判】歌舞伎町。ラブホールの概念を覆すゴージャスな空間。ナノケア家電全室完備や無料ドリンクなど、高級ホテルに劣らないホスピタリティが圧巻。',
  },
  '3f9b226c-d4fc-45a7-a13c-f8b43a354532': {
    // HOTEL PASHA GRAN (上野)
    amenities:
      '2022年秋オープン, スタイリッシュ/アジアン/モダン客室, 不忍池至近, 最新設備完備, PASHAブランド品質',
    reviews:
      '【評判】上野。不忍池を望む最新のPASHAグループ店。洗練されたデザインと、上野エリア最高峰の設備が、「特別な日の一軒」として高い支持を得ている。',
  },
  '68349160-56a3-4e95-b69f-1c29932d473f': {
    // HOTEL FORSION (歌舞伎町)
    amenities:
      '露天風呂/プライベートガーデン(スイート), 全室サウナ完備, Google TV, 豊富な美容家電レンタル',
    reviews:
      '【評判】歌舞伎町。全室サウナ付きという贅沢設計。最上階スカイガーデンでの露天風呂体験は、都会の喧騒を忘れる最高の「大人の隠れ家」。',
  },
  '14654277-3f8f-4248-a571-e1e7cf860183': {
    // HOTEL ATLAS (歌舞伎町)
    amenities:
      '全室人工温泉完備, カラオケ全室, VOD/Wi-Fi無料, 美容機器レンタル, 24時間ルームサービス',
    reviews:
      '【評判】歌舞伎町。人工温泉で体の芯まで温まれる癒やしの宿。カラオケも全室完備で、歌舞伎町トップクラスの広さと清潔感がリーズナブルに楽しめると話題。',
  },
  'c10aac2c-ff96-4ef5-97f3-d71769a45b93': {
    // ホテルバリアンリゾート新宿グランピング店
    amenities:
      '都会の焚き火「ピングガーデン」, 淹れたてコーヒーセット(全室), テント風インテリア, ハンモック(一部)',
    reviews:
      '【評判】新宿。バリアンのサービスはそのままに、焚き火の音やコーヒーを楽しむ「グランピング」体験が可能。都会のど真ん中でキャンプ気分が味わえる唯一無二の場所。',
  },
  '7ee1f5df-2907-4534-8f22-2c43111318e4': {
    // ホテルプティバリ ガーデン新大久保店
    amenities:
      '貸切露天風呂/岩盤浴/カラオケ無料, デザート/スープバー無料, バリ直輸入家具, 55インチ以上TV',
    reviews:
      '【評判】新大久保。貸切露天などの無料コンテンツが異常なほど充実。デザートやスープも食べ放題で、女子会や推し活の「聖地」として絶大な人気を誇る。',
  },
  '5f7174fc-5335-45b5-bdb2-154731235552': {
    // ホテルプティバリ 東新宿店
    amenities:
      '軟水のお風呂, レインボーバス(一部), 無料ドリンク/デザート/アメニティバー, 24時間フロント',
    reviews:
      '【評判】新宿。肌に優しい「軟水」のお風呂が好評。無料のアメニティバーやスイーツなど、細やかな「心配り」が素晴らしく、手ぶらで泊まれる快適さが評価されている。',
  },
  'd768c3d4-01d8-46c7-9039-30dc32a31af2': {
    // SARA 加平
    amenities:
      '露天風呂/ドライサウナ(一部), プロジェクター(一部), 38室全室異なるコンセプト, ウェルカムサービス充実',
    reviews:
      '【評判】加平。全室デザインが異なり、何度来ても飽きない楽しさ。露天風呂やサウナ完備の部屋もあり、足立区屈指の設備とホスピタリティを誇る優良店。',
  },
  'c027cdde-2899-44b9-b688-7f00c40e0dd5': {
    // SARA sweet 錦糸町
    amenities:
      'アルコール飲み放題コーナー, 泡シャワーKINUAMI U(一部), 全室浴室リニューアル, インスタ映え内装',
    reviews:
      '【評判】錦糸町。アルコール飲み放題や最新の泡シャワーなど、驚きの新サービスを次々導入。ポップで可愛い内装は女子会や記念日を最高に盛り上げてくれる。',
  },
  'a80189f9-12bd-49d2-8318-b2fc9dfaf410': {
    // WATER HOTEL Cy (町田)
    amenities:
      '開放的な半露天風呂, スチームサウナ, 広大なバスルーム, オシャレなデザイン空間, 無料Wi-Fi',
    reviews:
      '【評判】町田。洗練された「水」の演出と広大な空間が自慢。半露天風呂やサウナで過ごす時間はまさにリゾート。町田で最高級の癒やしを求めるならここ。',
  },
  '9c72da16-a6af-441d-b580-7603140b4af5': {
    // HOTEL LOTUS Modern 岩槻店
    amenities:
      '屋上スポーツスペース(バッティング等), 客室内ビールサーバー(樽ごと), プロジェクター100インチ',
    reviews:
      '【評判】岩槻。屋上でスポーツが楽しめる驚愕のエンタメ力。客室ビールサーバーや100インチプロジェクターなど、二人だけの「遊び」を極められる最強リゾート。',
  },
  '48fdb433-fa6d-4420-8450-b909ac3333f0': {
    // HOTEL LOTUS 小岩店
    amenities:
      'プラネタリウム, 客室内ビールサーバー(樽ごと), ネオ・ジャパネスク空間, 最新VOD, 美容家電充実',
    reviews:
      '【評判】小岩。プラネタリウムが煌めく幻想的な夜。客室ビールサーバーでの乾杯や和モダンな空間など、小岩の喧騒を忘れて至福の時を過ごせる贅沢な宿。',
  },
  'fa3dbcfd-b78d-4d76-a456-4523e5fa817d': {
    // ホテル キャッツ (池袋)
    amenities: '露天風呂/岩盤浴(一部), 天蓋付きベッド, 日焼けマシン, プロジェクター, カラオケ',
    reviews:
      '【評判】池袋。露天風呂や岩盤浴、さらには日焼けマシンまで。天蓋ベッドでの非日常と、圧倒的なエンタメ設備で池袋の夜を遊び尽くせる個性派ホテル。',
  },
  'a96dc201-22b3-4d87-8d73-133b0d4c2b55': {
    // ホテル シャーウッド (鶯谷)
    amenities: '鶯谷駅徒歩1分, 32型TV全室, YouTube見放題, ズボンプレッサー, ビジネス利用可',
    reviews:
      '【評判】鶯谷。駅徒歩1分の神立地。YouTube見放題や充実のビジネス設備が整っており、デートの締めくくりから仕事の拠点まで幅広く使える清潔な優良店。',
  },
  '97501b44-eb28-464b-a698-497134481e9a': {
    // Hotel PRINCESS 2世 (鶯谷)
    amenities: 'ドリンクバー無料, 漫画読み放題, サービスタイム最大10時間, ジェットバス, 接客高評価',
    reviews:
      '【評判】鶯谷。最大20時間滞在可能なゆとりと、無料ドリンク・漫画パラダイスが人気。スタッフの対応も極めて丁寧で、鶯谷で「最も安心して過ごせる」との声。',
  },
  'd4720245-fc5a-4b95-aefe-e8f1e6d3757b': {
    // HOTEL EXE ANNEX 鶯谷
    amenities:
      '全室プラズマクラスター完備, コスプレ無料, ブランドコスメレンタル, ミネラルウォーター無料',
    reviews:
      '【評判】鶯谷。驚きの「全室プラズマクラスター」で空気まで清潔。ブランドコスメやコスプレの無料サービスが充実しており、女性目線の満足度が非常に高い。',
  },
  '315e0240-7a00-4d74-900f-918200cdb39c': {
    // HOTEL CARNET (尼崎)
    amenities: '50インチ大型TV, ウォーターサーバー全室, 水中照明ジェットバス, ブルーレイ全室',
    reviews:
      '【評判】尼崎。全室ウォーターサーバー完備の利便性と、水中照明バスの演出が好評。清掃が行き届いた広い室内で、兵庫エリア屈指の快適な夜を。',
  },
  '4bd61197-7fd4-4682-be39-ecda0f8f70f1': {
    // プチ・トランタン (みやま)
    amenities: '60インチV型TV, 美顔器/拡大ミラー, スケベ椅子(一部), プラズマクラスターWi-Fi',
    reviews:
      '【評判】みやま。60インチの大画面と美顔器などの美容設備が充実。おもてなしの心と清潔感が評価されており、地域で愛されるハイクオリティな隠れ家。',
  },
  '07910fa5-250e-4159-be61-3cf94aa788c2': {
    // ホテル おもちゃ箱 (久留米)
    amenities: '4KインターネットTV全室, SMルーム(210/215/216号室), スロットマシン, サウナ(一部)',
    reviews:
      '【評判】久留米。4KテレビでYouTube三昧から、本格的なSMルームまで。まさに「おもちゃ箱」をひっくり返したような、刺激と楽しさが同居する唯一無二の場所。',
  },
  'ca29d958-7f04-413e-82d8-43f70ec98d0d': {
    // HOTEL GRAN. (昭島)
    amenities: 'パーティールーム(ダーツあり), 本格ドライサウナ, マイクロバブルバス, nanoケア家電',
    reviews:
      '【評判】昭島。昭島エリアで圧倒的な設備。本格サウナやマイクロバブルバスで整いの時間を。ダーツも楽しめるパーティールームは大人数や女子会にも。',
  },
  '26fc2a25-b414-45f8-ae8e-cdaa3a1ebd1c': {
    // HOTEL GRANHILL (大塚)
    amenities: '全室All ReFa(ドライヤー/アイロン/シャワー), Chromecast全室, カラオケDAM(スイート)',
    reviews:
      '【評判】大塚。全室にReFaの美容セットを揃えるこだわり。Chromecastで動画遊びも完璧。洗練されたデザインに包まれる、大塚の最高級フォトジェニックホテル。',
  },
  'eb787d66-3ecc-44e0-8932-28be0d74c9b6': {
    // HOTEL BARCH (町田)
    amenities: '全室Chromecast導入, 露天風呂付き客室(一部), 完全禁煙ルームあり, ハイルーフ駐車可',
    reviews:
      '【評判】町田。清潔感重視の完全禁煙ルームや、Chromecast完備が現代ニーズに合致。一部客室の露天風呂も贅沢で、落ち着いた「大人の週末」を約束する。',
  },
};

updateMultipleHotelFacts(updates);
