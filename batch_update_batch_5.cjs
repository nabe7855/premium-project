const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const batch5Data = {
  '897dc364-b495-423a-bfaf-44219823d465': {
    hotel_name: 'HOTEL HAYAMA (ホテル 葉山)',
    url: 'https://www.hayama-hotels.com/hayama/',
    description:
      '新宮町の「和」をテーマにしたお城のような外観が特徴のホテル。ワンルーム・ワンガレージ形式でプライバシーを完全確保。全室に大型スマートTVを完備し、YouTubeやVODが見放題。スタイリッシュでモダンな空間でくつろぎのひとときを提供します。',
    amenities: [
      'スマートTV',
      'VOD',
      'YouTube視聴',
      '無料Wi-Fi',
      'ワンガレージタイプ',
      'ジェットバス',
      '浴室テレビ',
      '加湿空気清浄機',
      'ウォーターサーバー',
      '電子レンジ',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥3,980～', time: '6:00～24:00' }],
      宿泊: [
        { title: '日～木曜', price: '¥5,980～', time: '20:00～翌12:00' },
        { title: '土・祝前', price: '¥9,980', time: '20:00～' },
      ],
    },
    reviews: [
      {
        title: '和モダンで綺麗',
        body: '外観が凄くて驚きましたが、中はとても綺麗で落ち着く和モダンの部屋でした。ガレージから直接入れるのが安心です。',
        score: '4.1',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '6832d112-1234-4a0c-92db-d90a4405a439': {
    hotel_name: 'HOTEL COCO RESORT (ホテル ココリゾート)',
    url: 'https://www.couples.jp/hotel-details/52174',
    description:
      '厚木インターより3分。アクアリウムのある幻想的なロビーが迎えるデザイナーズホテル。本格的なドライサウナやミストサウナ、55インチ以上の大型TV、LIVE DAMカラオケなど、圧倒的な設備クオリティで「ととのう」体験を提供します。',
    amenities: [
      'ドライサウナ (一部)',
      'ミストサウナ (全室)',
      'ジェットバス (レインボー照明)',
      'LIVE DAMカラオケ',
      'VOD (800タイトル)',
      '55インチ以上大型TV',
      '無料Wi-Fi',
      '浴室テレビ',
      'アクアリウムロビー',
    ],
    prices: {
      休憩: [{ title: '4時間', price: '¥4,180～', time: '24時間' }],
      宿泊: [{ title: '日～木曜', price: '¥7,590～', time: '18:00～翌10:00など' }],
    },
    reviews: [
      {
        title: 'サウナが最高',
        body: 'サウナの温度がしっかり高くて水風呂も良かったです。ベッドもふかふかで、まさにリゾート気分でした。',
        score: '4.6',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  'ae5ab4d8-ee07-4c96-b5b7-1d068596fa3c': {
    hotel_name: 'HOTEL SUNSET INN (ホテル サンセットイン)',
    url: 'https://stay-lovely.jp/hotels/3688',
    description:
      '京急堀ノ内駅から徒歩5分。横須賀エリアでトップクラスの長時間フリータイムが自慢のホテル。エレガントから和風まで多彩なコンセプトの客室に、ジェットバスやVOD約1,000chを完備。年中無休でリーズナブルに楽しめます。',
    amenities: [
      'ジェットバス (一部)',
      '水中照明 (一部)',
      'VOD (1000ch)',
      '無料Wi-Fi',
      'VRレンタル',
      '電子レンジ',
      'ウォシュレット',
      '無料駐車場',
    ],
    prices: {
      ショートタイム: [{ title: '平日 (2時間)', price: '¥3,280～', time: '5:00～24:00' }],
      フリータイム: [{ title: '月～金 (最大15時間)', price: '¥4,980～', time: '5:00～20:00' }],
      宿泊: [{ title: '月～金', price: '¥6,980～', time: '19:00～翌11:00' }],
    },
    reviews: [
      {
        title: '長時間いられる',
        body: 'フリータイムがとにかく長くてお得。部屋のデザインも凝っていて、ジェットバスでゆっくり疲れを癒せました。',
        score: '3.6',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  '9541d9bf-6bea-4316-b742-bd90cd943da0': {
    hotel_name: 'HOTEL TSUBAKI 大和 (ツバキ大和)',
    url: 'https://www.jm-group.jp/tsubaki-yamato/',
    description:
      '大和駅から徒歩圏内。「和モダンリゾート」を極めた落ち着きのある空間。65インチ大型TVでのChromecast対応やマイクロバブルバス、最新カラオケなど、ワンランク上の設備を完備。無料朝食やドリンクバーなど、サービスも充実しています。',
    amenities: [
      'マイクロバブルバス（一部）',
      '65型大型TV',
      'Chromecast',
      'JOY SOUNDカラオケMAX（一部）',
      '無料Wi-Fi',
      '無料朝食サービス',
      'ウェルカムドリンクバー',
      'アメニティバイキング',
    ],
    prices: {
      休憩: [{ title: '平日 (2時間)', price: '¥3,980～', time: '24時間' }],
      宿泊: [{ title: '平日', price: '¥5,480～', time: '最大14時間保証プランあり' }],
    },
    reviews: [
      {
        title: '和モダンでオシャレ',
        body: 'リニューアルされていて凄く綺麗。大型テレビで動画も見れるし、朝食が無料で付いてくるのが嬉しいですね。',
        score: '4.1',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '9a1ca589-d847-4258-8ef7-f880dce3aa37': {
    hotel_name: 'HOTEL CINDERELLA PALACE (シンデレラパレス)',
    url: 'https://www.hayama-hotels.com/city-palace-group/cinderella/',
    description:
      '博多区西月隈。上品でシンプルな内装の客室に、全室Wi-Fiと充実のアメニティを完備。一部客室には「ムービングラブソファ」を設置するなど、遊び心も忘れない空間です。空港や博多駅からのアクセスも抜群です。',
    amenities: [
      '無料Wi-Fi',
      'ムービングラブソファ（一部）',
      'VOD',
      '電子レンジ',
      '電気ポット',
      'ヘアアイロン完備',
      '無料アメニティ一式',
      '自動精算機',
    ],
    prices: {
      休憩: [{ title: '目安', price: '¥4,000～', time: '3時間など' }],
      宿泊: [{ title: '目安', price: '¥7,000～', time: '19:00～など' }],
    },
    reviews: [
      {
        title: '清潔で使いやすい',
        body: '掃除が行き届いていて気持ちよく使えました。アメニティが豊富で、ドライヤーだけでなくアイロンがあるのが良いです。',
        score: '4.0',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '5f4b08eb-5212-4db2-9da7-935ea156fb61': {
    hotel_name: 'HOTEL CINDERELLA PALACE (シンデレラパレス)',
    url: 'https://www.hayama-hotels.com/city-palace-group/cinderella/',
    description:
      '博多区西月隈。上品でシンプルな内装の客室に、全室Wi-Fiと充実のアメニティを完備。一部客室には「ムービングラブソファ」を設置するなど、遊び心も忘れない空間です。空港や博多駅からのアクセスも抜群です。',
    amenities: [
      '無料Wi-Fi',
      'ムービングラブソファ（一部）',
      'VOD',
      '電子レンジ',
      '電気ポット',
      'ヘアアイロン完備',
      '無料アメニティ一式',
      '自動精算機',
    ],
    prices: {
      休憩: [{ title: '目安', price: '¥4,000～', time: '3時間など' }],
      宿泊: [{ title: '目安', price: '¥7,000～', time: '19:00～など' }],
    },
    reviews: [
      {
        title: '清潔で使いやすい',
        body: '掃除が行き届いていて気持ちよく使えました。アメニティが豊富で、ドライヤーだけでなくアイロンがあるのが良いです。',
        score: '4.0',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  'b797aded-3bf2-41fe-b660-6d6e65091770': {
    hotel_name: '江の島 ホテル ノアリゾート',
    url: 'http://m-hotels.jp/noahresort/',
    description:
      '江の島ビーチ目の前のオーシャンリゾート。インテリアにこだわった清潔な客室には、オーシャンビューの部屋や天蓋付きベッドルームも。無料レンタサイクルや種類豊富なシャンプーバー、美容水シャワーなど、湘南を満喫するためのサービスが満載です。',
    amenities: [
      'オーシャンビュー（一部）',
      '天蓋付きベッド（一部）',
      '無料Wi-Fi',
      '無料レンタサイクル',
      'シャンプーバー',
      '美容器具レンタル',
      'VOD',
      '電子レンジ',
      '無料モーニングサービス',
    ],
    prices: {
      ショートステイ: [{ title: '平日 (2時間)', price: '¥2,980～', time: '24時間' }],
      宿泊: [{ title: '平日', price: '¥5,980～', time: '15:00～翌11:00' }],
    },
    reviews: [
      {
        title: '江の島観光に最適',
        body: '海が目の前で景色が最高。レンタサイクルで海岸を走れるのが楽しかったです。部屋もアメニティも綺麗でした。',
        score: '4.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '62886b9b-43ed-4fd0-8133-e546aa8a1540': {
    hotel_name: 'HOTEL Aria (ホテル アリア)',
    url: 'https://couples.jp/hotel-details/54123',
    description:
      '中洲から徒歩7分の好立地に2021年全面リニューアルオープン。シックでモダンな客室にはDAMカラオケやダーツ、SMルームなど多様な設備を設置。20種類以上のコスプレ無料レンタルなど、圧倒的なエンタメ性とコスパを両立しています。',
    amenities: [
      'DAMカラオケ（一部）',
      'ダーツルーム（一部）',
      'SMルーム（一部）',
      '無料コスプレレンタル (20種)',
      '無料Wi-Fi',
      '各種シャンプーレンタル',
      '電子レンジ',
      '大型TV',
      '駐車場10台',
    ],
    prices: {
      休憩: [{ title: '月～木 (3時間)', price: '¥3,800～', time: '24時間' }],
      宿泊: [{ title: '日～木曜', price: '¥6,800～', time: '18:00～翌12:00' }],
    },
    reviews: [
      {
        title: '中洲近くで便利',
        body: 'リニューアルされていて部屋が凄くおしゃれ。コスプレの無料レンタルが多くて驚きました。中洲で飲んだ後に最適です。',
        score: '3.9',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '5f06efbb-0fce-4b8b-b0a8-9ce5a4726a61': {
    hotel_name: 'HOTEL MODENA (ホテル モデナ)',
    url: 'https://www.hayama-hotels.com/city-palace-group/modena/',
    description:
      '新宮町の静かな立地。プライバシーを重視したワンガレージ・ワンルームタイプ。全室に大型スマートTVを配し、VODでYouTubeなども視聴可能。DHCのアメニティ完備や無料ウェルカムフードなど、女性にも嬉しいサービスが充実しています。',
    amenities: [
      '大型スマートTV',
      'YouTube/VOD無料',
      '無料Wi-Fi',
      'ワンガレージタイプ',
      '浴室テレビ',
      'ジェットバス',
      'マッサージチェア（一部）',
      'DHCアメニティ',
      'ウェルカムフード（平日）',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥4,900', time: '6:00～24:00' }],
      宿泊: [{ title: '日～木曜', price: '¥7,900', time: '20:00～翌15:00も可' }],
    },
    reviews: [
      {
        title: '明るく清潔',
        body: '白を基調とした明るい部屋でとても清潔感がありました。一律料金で分かりやすく、ピラフが美味しかったです。',
        score: '4.0',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
  '5d2ddb66-5cad-4545-9d3b-565413cb16a0': {
    hotel_name: 'HOTEL JuJu (ホテル ジュジュ)',
    url: 'https://www.couples.jp/hotel-details/54001',
    description:
      '久留米市。全室4KインターネットTV完備。一部客室には露天風呂やカラオケ、さらにはプチSM設備を導入するなど、多彩なニーズに応える空間です。24時間対応フロントと無料駐車場完備でビジネスや一人利用も歓迎しています。',
    amenities: [
      '4KインターネットTV',
      '露天風呂（一部）',
      'カラオケ（一部）',
      'プチSM設備（一部）',
      '無料Wi-Fi',
      '電子レンジ',
      '冷蔵庫',
      '無料アメニティ一式',
      '無料専用駐車場',
    ],
    prices: {
      ショートタイム: [{ title: '平日 (90分)', price: '¥2,530', time: '24時間' }],
      宿泊: [{ title: '平日目安', price: '¥4,950～', time: '18:00～など' }],
    },
    reviews: [
      {
        title: '快適な滞在',
        body: '4Kテレビが綺麗で動画を楽しみました。お部屋も広くて、露天風呂があるのが贅沢な気分になれて良かったです。',
        score: '4.2',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'f5f3ae79-4f4e-401e-a99b-25faa1da322e': {
    hotel_name: 'おとぼけビーバー リーベ 大牟田',
    url: 'https://ssh-hotel-group.com/shop/liebe/',
    description:
      '大牟田インター近く。全20室に1,000タイトル以上のVODシステムを完備。コスプレ衣装やマッサージチェアの貸出など、バラエティ豊かなサービスが低価格で楽しめます。平日最大18時間滞在可能なゆったりプランが人気です。',
    amenities: [
      'VOD (1000タイトル)',
      '無料Wi-Fi',
      '電子レンジ',
      '持ち込み冷蔵庫',
      'マッサージチェア（一部）',
      'コスプレ衣装貸出',
      'シャンプー等レンタル品',
      'Wiiレンタル',
      'ハイルーフ車駐車可',
    ],
    prices: {
      ショートタイム: [{ title: '目安', price: '¥1,800～', time: '2時間など' }],
      宿泊: [{ title: '平日 (最大18時間)', price: '¥3,900～', time: '17:00～翌15:00' }],
    },
    reviews: [
      {
        title: 'コスパ重視ならここ',
        body: 'とにかく安くて長時間いられるのが魅力。VODが充実しているので、映画を見ながらのんびり過ごすのに最適です。',
        score: '3.3',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
  '11a43ffb-944f-4a7a-b5b1-aeaf9fcb96ac': {
    hotel_name: 'HOTEL LUANA (ホテル ルアナ)',
    url: 'https://www.hayama-hotels.com/shousai/luana/',
    description:
      '小倉駅から徒歩3分の超好立地に2025年リニューアル。全室に大型スマートTVを配し、最新のWi-Fiやクオリティアップした設備を完備。ナイトユースプランや最大15時間滞在など、利便性と快適さを追求した駅近リゾート空間です。',
    amenities: [
      '大型スマートTV',
      '無料Wi-Fi',
      '加湿空気清浄機（一部）',
      'バスタブ完備',
      '無料アメニティ一式',
      '冷蔵庫',
      'ルームサービス',
      '無料専用駐車場',
      'ナイトユース対応',
    ],
    prices: {
      宿泊: [{ title: '日～木曜', price: '¥8,990～', time: '20:00～翌12:00' }],
      ナイトユース: [{ title: '0時以降入室', price: '¥8,990～', time: '最大15時間' }],
    },
    reviews: [
      {
        title: '駅から近くて綺麗',
        body: 'リニューアルされたばかりで凄く清潔。駅からもすぐで、大型テレビでYouTubeが見れるのが最高に快適でした。',
        score: '4.5',
        date: '2026-01',
      },
    ],
    manual_recovery: true,
  },
  '80819bc4-3f14-4a81-ac4f-359cd2244ac3': {
    hotel_name: 'HOTEL ESPO (ホテル エスポ)',
    url: 'https://www.hayama-hotels.com/espocity-hayama/',
    description:
      '和白エリア。本格的なドライサウナや露天風呂を完備した客室が大人気のスパ＆リゾートホテル。ムービングベッド導入室や高音質カラオケ、新作ルームウェア、セレクトシャンプーなど、心身ともに「ととのう」ためのサービスを極めています。',
    amenities: [
      'ドライサウナ（一部）',
      '露天風呂（一部）',
      'ムービングベッド（一部）',
      'スマートTV',
      '高音質カラオケ',
      'VOD',
      '無料Wi-Fi',
      '新作ルームウェア',
      'シャンプーバイキング',
      '駐車場55台',
    ],
    prices: {
      休憩: [{ title: '平日 (4時間)', price: '¥3,890～', time: '24時間' }],
      宿泊: [{ title: '予約限定プラン', price: '¥6,900～', time: '18:00～翌12:00' }],
    },
    reviews: [
      {
        title: '本格サウナが凄い',
        body: '部屋にしっかりしたサウナがあって最高に『ととのい』ました！露天風呂もあって、まさにリゾートという感じ。コスパ神です。',
        score: '4.1',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  'd970fd7e-3ff2-44a0-a3e2-fe3139df4f0d': {
    hotel_name: 'ホテル シエル 湘南平塚店',
    url: 'https://hotel-ciel-gr.jp/shonan/',
    description:
      '国道134沿いの絶景オーシャンビュー。箱根駅伝の平塚中継所すぐそばに位置し、観光拠点に最適。ReFaシャワーや最新カラオケ、ムービングラブソファなど話題の設備を導入。無料朝食やドリンク、豊富なアメニティコーナーも大好評です。',
    amenities: [
      '全室オーシャンビュー',
      'ReFaファインバブルシャワー（一部）',
      'カラオケ（一部）',
      'ムービングラブソファ（一部）',
      'ウォーターサーバー (全室)',
      'VOD',
      '無料Wi-Fi',
      '無料朝食サービス',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥4,100～', time: '24時間' }],
      宿泊: [{ title: '日～木・祝', price: '¥7,100～', time: '最大19時間' }],
    },
    reviews: [
      {
        title: 'オーシャンビューが最高',
        body: '窓からの眺めが本当に素晴らしい。リニューアルされていて、ウォーターサーバーやReFaが使えるのが高ポイント。駅伝観戦にも最適でした。',
        score: '3.4',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  'b7970f1b-ca70-429e-95e5-85fee6026299': {
    hotel_name: 'ASOKONO HOTEL (アソコノホテル)',
    url: 'https://www.asokono-hotel.com/',
    description:
      '横浜町田ICすぐ。「近未来」をテーマにしたアーティスティックなデザイナーズホテル。サンドバッグのある部屋やライトアップが幻想的な地下ルームなど、唯一無二の世界観を楽しめます。JOYSOUND F1やVOD8万chなど、最新鋭のエンタメ設備も充実。',
    amenities: [
      '近未来デザイナーズルーム',
      'JOYSOUND F1（一部）',
      'サンドバッグ（一部）',
      '水中照明',
      'VOD (8万ch)',
      '無料Wi-Fi',
      'Bluetoothスピーカー',
      'ウェルカムドリンク＆アイス',
      '非対面チェックアウト',
    ],
    prices: {
      ショートタイム: [{ title: '平日 (120分)', price: '¥4,200 (税別)', time: '24時間' }],
      宿泊: [{ title: '日～木曜', price: '¥7,900 (税別)', time: '最大16時間' }],
    },
    reviews: [
      {
        title: '唯一無二の世界観',
        body: '内装がとにかく凄い！地下の部屋は非日常感が半端ないです。洗面所も綺麗で、VODの作品数も桁違いで楽しめました。',
        score: '3.6',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, batch5Data);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated 15 hotels (Batch 5) in JSON.');
