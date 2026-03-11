const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const batch3Data = {
  'ea2b023a-a937-467b-9e18-8b8496797cc7': {
    hotel_name: 'HOTEL Knight (ホテル ナイト)',
    url: 'http://hotel-knight.com/',
    description:
      '小田原の早川エリアに位置する、ワンルーム・ワンガレージ形式のプライベート重視ホテル。全室に55インチ大型液晶TV、ジェットバス、リクライニングベッドを完備。人目を気にせず入室できるガレージインタイプです。',
    amenities: [
      'ジェットバス',
      '浴室テレビ',
      '55インチ大型TV',
      'リクライニングベッド',
      '電子レンジ',
      'DVDデッキ',
      'マッサージチェア（一部）',
      '無料アメニティ',
    ],
    prices: {
      休憩: [{ title: '3時間', price: '¥5,000～', time: '6:00～24:00' }],
      宿泊: [{ title: '日～木・祝', price: '¥7,800～', time: '21:00～翌10:00' }],
      フリータイム: [
        { title: 'サービスタイム', price: '¥5,000～', time: '朝の入室で最大7時間など' },
      ],
    },
    reviews: [
      {
        title: '意外と綺麗',
        body: '外観より中が綺麗で驚きました。ピンク系の内装で清潔感もあり、近隣の古いホテルより断然いいです。',
        score: '4.2',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'bcf6865d-3ebd-4301-a3f8-8c9d6a25fbbe': {
    hotel_name: 'ホテル 二番館PLUS (ニバンカンプラス)',
    url: 'http://nibankan-y.com/',
    description:
      '横浜駅きた西口から徒歩6分の好立地。全室にレインボーブロアバス、VOD1000タイトル以上を完備。月曜限定の「プライムマンデー」など、お得なサービスも充実しているスタイリッシュな都市型ホテルです。',
    amenities: [
      'レインボーブロアバス',
      'VOD (1000タイトル)',
      '無料Wi-Fi',
      'カラオケ',
      'Bluetoothミュージック',
      'ウェルカムドリンク',
      '電子レンジ',
      'システム冷蔵庫',
    ],
    prices: {
      ショートタイム: [
        { title: '平日 (2時間)', price: '¥3,300～', time: '10:00～21:00' },
        { title: '休日 (2時間)', price: '¥3,800～', time: '10:00～19:00' },
      ],
      宿泊: [
        { title: '日～木', price: '¥7,800～', time: '20:00～翌11:00' },
        { title: '土曜', price: '¥8,800～', time: '21:00～翌10:00' },
      ],
    },
    reviews: [
      {
        title: '駅から近い',
        body: '横浜駅から歩いて行けるのが便利。ウェルカムドリンクのアルコールサービスが嬉しかったです。',
        score: '4.0',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
  'd3c753d4-a8d4-4663-a694-d10e51b95291': {
    hotel_name: 'HOTEL AROMA BOWERY (ホテル アロマ バワリー)',
    url: 'http://aromabowery.com/',
    description:
      '伊勢佐木長者町駅から徒歩1分。女性デザイナーが手掛けた、アロマの香りに包まれるハイグレードなプライベートホテル。シャンパンバスやアロマバスソルトなどのリラクゼーションサービスが充実しています。',
    amenities: [
      'レインボーバス',
      '浴室テレビ',
      'ジェットバス',
      'VOD',
      '無料Wi-Fi',
      'マッサージチェア（一部）',
      'アロマディフューザー',
      '和室あり',
    ],
    prices: {
      休憩: [{ title: '全日 (3時間)', price: '¥5,700～¥10,100', time: '24時間' }],
      宿泊: [
        { title: '日～木・祝', price: '¥9,500～', time: '18:00～翌12:00' },
        { title: '金曜', price: '¥9,500～', time: '18:00～翌11:00' },
        { title: '土・祝前', price: '¥11,800～', time: '21:00～翌10:00' },
      ],
    },
    reviews: [
      {
        title: 'リラックスできる',
        body: 'アロマの香りがとても良くて癒されます。駅からも近くて、部屋もとても綺麗でした。',
        score: '4.1',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '097f0861-d0da-4592-a186-49b5ab85a6d3': {
    hotel_name: 'HOTEL GIULIA (ホテル ジュリア)',
    url: 'https://hotenavi.com/giulia/',
    description:
      '厚木エリアで屈指のクチコミ評価を誇る人気ホテル。エキゾチックで豪華な内装に、レインボージェットバスやRefa製品のレンタルなど美容・リラックス設備が非常に充実しています。ウェルカムサービスも豊富です。',
    amenities: [
      'レインボージェットバス',
      '浴室テレビ',
      'Refa製品（シャワー・ドライヤー）',
      '岩盤浴（一部）',
      '足湯（一部）',
      'プロジェクター',
      'VOD',
      '無料Wi-Fi',
      'ウェルカムドリンク',
    ],
    prices: {
      休憩: [
        { title: '平日 (3時間)', price: '¥3,900～', time: '5:00～02:00' },
        { title: 'ショート(2時間)', price: '¥2,900～', time: '平日' },
      ],
      宿泊: [
        { title: '日～金', price: '¥6,500～', time: '19:00～翌12:00' },
        { title: '土曜', price: '¥8,500～', time: '19:00～翌11:00' },
      ],
    },
    reviews: [
      {
        title: 'サービスが最高',
        body: 'アメニティバイキングが豪華で、Refaのドライヤーが使えるのが嬉しいです。部屋も綺麗で大満足です。',
        score: '4.4',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '0b05f8a1-c7a1-4a3b-89fb-37ff8ff4a8f9': {
    hotel_name: 'ホテル グランバリ リゾート 川崎',
    url: 'https://hotel-granbali.com/',
    description:
      '川崎駅近でバリ島リゾート気分を。ガムラン音楽とお香の香りが漂うエキゾチックな空間。アメニティバイキングやVOD見放題に加え、最新のナノイードライヤー貸出など、女性に嬉しいサービスが満載です。',
    amenities: [
      'VOD',
      '無料Wi-Fi',
      'ナノイードライヤー',
      'アメニティバイキング',
      'シャンプーバイキング',
      '電気ケトル',
      '冷蔵庫',
      '空気清浄機',
    ],
    prices: {
      ショートステイ: [{ title: '全日 (120分～)', price: '¥3,200～', time: '24時間' }],
      宿泊: [
        { title: '日～木', price: '¥7,600～', time: '18:00～翌11:00' },
        { title: '金・土・祝前', price: '¥9,800～', time: '18:00～翌11:00' },
      ],
    },
    reviews: [
      {
        title: 'バリの雰囲気',
        body: 'バリっぽい内装で旅行気分が味わえます。アメニティが豊富なので手ぶらで泊まれるのがいいですね。',
        score: '4.3',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '22102d1e-ef0b-46a5-bfe5-8b2081467cf7': {
    hotel_name: 'CROWN MOTEL (クラウン モーテル)',
    url: 'https://stay-lovely.jp/hotels/2171',
    description:
      '横浜町田インターすぐ。プライバシー万全の「1ガレージ1ルーム」タイプで、人目を気にせず直接入室可能。アメリカンスタイルにリニューアルされた清潔な室内には、最新カラオケやVODも完備しています。',
    amenities: [
      'ガレージインタイプ',
      'ジェットバス',
      'VOD',
      'カラオケ (JOYSOUND F1)',
      '無料Wi-Fi',
      'マッサージチェア（一部）',
      '水中照明',
      '電気ポット',
    ],
    prices: {
      休憩: [
        { title: '平日 (2時間)', price: '¥3,100～', time: '24時間' },
        { title: '休日 (2時間)', price: '¥3,600～', time: '24時間' },
      ],
      宿泊: [{ title: '全日', price: '¥8,800～', time: '最大23時間プランあり' }],
    },
    reviews: [
      {
        title: '居心地が良い',
        body: 'ガレージから直接部屋に入れるのがとても便利。お部屋も高級感があってゆっくり過ごせました。',
        score: '4.0',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  'e422a1c9-6f1e-4d19-ab14-9c5131a0d2b6': {
    hotel_name: 'HOTEL NEW PARCO (ホテル ニューパルコ)',
    url: 'https://couples.jp/hotel-details/1922',
    description:
      '磯子駅から徒歩5分。八景島や元町へのアクセスも良好な、広々とした客室が特徴のホテル。ジャグジーやレインボーバスなどの入浴設備に加え、無料レンタル品が非常に充実しており高いコスパを誇ります。',
    amenities: [
      'ジャグジー',
      'レインボーバス',
      '浴室テレビ',
      'VOD',
      'カラオケ',
      'マッサージチェア',
      'テレビゲーム',
      '無料レンタル品多数',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥4,200～', time: '6:00～24:00' }],
      宿泊: [
        { title: '日～木・祝', price: '¥6,700～', time: '20:00～翌12:00' },
        { title: '土曜', price: '¥7,000～', time: '22:00～翌11:00' },
      ],
    },
    reviews: [
      {
        title: 'コスパ抜群',
        body: '古いけれど部屋が広くて清潔。この値段でこの広さは横浜ではかなりお得感があります。',
        score: '3.8',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '5aed83da-2c97-4ead-9175-6e537e229df7': {
    hotel_name: 'ホテル リヴィエラ 相模原店',
    url: 'http://napo-ing.com/riviera_sagamihara/',
    description:
      '相模原で屈指のリーズナブルさを誇るレジャーホテル。水中照明付きのレインボーバスを全室に完備し、大画面でYouTube視聴が可能なChromecastも設置。ウェルカムドリンクなどのサービスも好評です。',
    amenities: [
      '水中照明付きレインボーバス',
      'ジェットバス',
      'サウナ（一部）',
      'VOD',
      'Chromecast',
      'カラオケ（一部）',
      '無料Wi-Fi',
      'ウォーターサーバー',
      '無料駐車場',
    ],
    prices: {
      休憩: [{ title: '平日 (2時間)', price: '¥3,580～', time: '5:00～24:00' }],
      宿泊: [{ title: '全日', price: '¥5,800～', time: 'チェックインより' }],
    },
    reviews: [
      {
        title: 'YouTubeが見れる',
        body: '大きなテレビでYouTubeが見れるのが最高。部屋も広くてアメニティも充実していました。',
        score: '4.0',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'e607e5b8-4f53-408f-b38c-03a33e9b2e11': {
    hotel_name: 'HOTEL 森の湯 cuscus (ホテル 森の湯 クスクス)',
    url: 'http://sbc-g.info/cuscus/',
    description:
      '京都郡みやこ町に位置する、露天風呂が自慢のホテル。天然アルカリイオン水を使用した露天風呂は美肌効果も期待できます。清潔感あふれる室内にはカラオケやジェットバスも備え、極上の癒しを提供します。',
    amenities: [
      '露天風呂（一部）',
      '天然アルカリイオン水使用',
      'ジェットバス',
      'カラオケ',
      'VOD',
      '無料Wi-Fi',
      '電子レンジ',
      'マッサージチェア（一部）',
    ],
    prices: {
      休憩: [
        { title: '平日 (3時間)', price: '¥2,980～', time: '24時間' },
        { title: '休日 (3時間)', price: '¥3,580～', time: '24時間' },
      ],
      宿泊: [
        { title: '日～木', price: '¥3,980～', time: '20:00～翌12:00' },
        { title: '金曜', price: '¥4,980～', time: '20:00～翌12:00' },
        { title: '土・祝前', price: '¥7,980～', time: '21:00～翌11:00' },
      ],
    },
    reviews: [
      {
        title: '露天風呂が最高',
        body: '天然水の露天風呂がとても気持ちよかったです。部屋も設備も清潔で、ゆっくりできました。',
        score: '4.6',
        date: '2023-11',
      },
    ],
    manual_recovery: true,
  },
  '7b50039c-8248-4181-8e29-d4d6fa75d333': {
    hotel_name: 'HOTEL CITY (ホテル シティー)',
    url: 'https://hotels-reserve.jp/hotel/city/',
    description:
      '川崎駅徒歩1～3分の超好立地。Refaのドライヤーやシャワーヘッドを全室に導入した、女性に嬉しい設備が自慢。65インチ大画面TVでのVODやYouTube視聴、豊富なシャンプーバイキングも楽しめます。',
    amenities: [
      'Refaドライヤー/シャワー',
      '65インチ大型TV',
      'VOD',
      'Chromecast',
      'Bluetoothスピーカー',
      '無料Wi-Fi',
      'シャンプーバイキング',
      'ウォーターサーバー',
      'キャッシュレス対応',
    ],
    prices: {
      宿泊: [
        { title: '日・祝', price: '¥9,000～', time: '20:00～翌12:00' },
        { title: '月～木', price: '¥21,800～', time: '19:00～翌12:00' },
        { title: '金・土', price: '¥26,800～', time: '20:00～' },
      ],
    },
    reviews: [
      {
        title: '立地最強、設備良し',
        body: '駅からすぐで、Refaのアイロンが借りられるのが最高。部屋も木目調で落ち着きます。',
        score: '3.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '6bdba063-d01f-4737-adb5-7a86ee95edd1': {
    hotel_name: 'HOTEL ZEN RIKYU 横浜羽沢',
    url: 'http://yokohama-hazawa-zen-rikyu.com/',
    description:
      '第三京浜・羽沢ICすぐ。心地よい和モダンとラグジュアリーが融合した、家族でも泊まれる上質な空間。ナノ水やマイクロバブルバス、露天風呂など水にこだわった設備と、無料の美味しい朝食が人気です。',
    amenities: [
      '露天風呂（一部）',
      'マイクロバブルバス',
      'ナノ水導入',
      '60インチ大型TV',
      '5.1chサラウンド',
      'スチームサウナ',
      'VOD',
      '無料Wi-Fi',
      '無料朝食ビュッフェ',
    ],
    prices: {
      宿泊: [
        { title: '平日 (観光プラン)', price: '¥17,000', time: '最大18時間' },
        { title: '休日 (観光プラン)', price: '¥19,000', time: '最大18時間' },
        { title: 'ビジネス (単身)', price: '¥7,900～', time: '日～金' },
      ],
    },
    reviews: [
      {
        title: '朝食が美味しい',
        body: 'ラブホっぽくなくて、部屋も朝食もビジネスホテル以上のクオリティ。ナノ水のお風呂が気持ちよかった。',
        score: '4.1',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '0be1d90f-630b-473f-9053-da8ab841248e': {
    hotel_name: 'ホテル アーユル湘南',
    url: 'http://napo-ing.com/ayur_shonan/',
    description:
      '平塚駅から車ですぐ。駄菓子バーや入浴剤バイキング、ビールサーバー付きのドリンクバーなど、遊び心あふれる無料サービスが満載。JOYSOUNDカラオケも全室完備し、女子会やビジネスにも最適です。',
    amenities: [
      'JOYSOUNDカラオケ',
      'Chromecast',
      '無料Wi-Fi',
      'ドリンクバー（ビールあり）',
      '駄菓子バー',
      '入浴剤バイキング',
      'シャンプーバー',
      'マッサージマット',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥4,900～', time: '24時間' }],
      宿泊: [{ title: '平日', price: '¥4,990～', time: '最大19時間' }],
    },
    reviews: [
      {
        title: 'サービス満点',
        body: '駄菓子やドリンクの無料サービスが楽しくて、子供連れでも楽しめました。隣にスーパーがあるのも便利。',
        score: '3.9',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '40aa5ee9-f9bc-4f1c-8dbc-befb5500fd96': {
    hotel_name: 'ホテルバリアンリゾート東名川崎I.C店',
    url: 'https://www.balian.jp/shop/kawasaki/',
    description:
      '東名川崎ICすぐ。バリ島を凝縮した複合リゾート空間。天蓋付きベッドや露天風呂、岩盤浴に加え、ハンモックや足湯、パターゴルフまで楽しめるガーデンテラスを完備。女子会や推し会にも大人気です。',
    amenities: [
      '天蓋付きベッド',
      '露天風呂',
      '岩盤浴（一部）',
      '貸切露天風呂',
      'ダーツ/カラオケ',
      'ハンモック/足湯',
      'アメニティバイキング',
      '無料朝食ビュッフェ',
      'ハニートースト',
    ],
    prices: {
      休憩: [{ title: 'デイユース', price: '¥7,800～', time: '時間帯による' }],
      宿泊: [{ title: 'ステイ', price: '¥13,800～', time: '18:00～' }],
    },
    reviews: [
      {
        title: '安定のバリアン',
        body: '足湯やダーツなど、お泊まり以外でも遊べるのがいい。サービスが手厚くて、いつもハッピーな気分になれます。',
        score: '4.7',
        date: '2024-07',
      },
    ],
    manual_recovery: true,
  },
  '45fad53f-10c5-4092-a64c-0b7bb2041e20': {
    hotel_name: 'Hotel passo passo 相模原店',
    url: 'https://grassino-hotels.com/shop/passo-passo.html',
    description:
      'ナノテクノロジー「美浴水」を全室導入。大きな水槽のある幻想的なロビーと、足湯付き露天風呂、展望風呂、打たせ湯など、水にこだわった癒しを提供。最低価格保証の公式サイト予約がお得です。',
    amenities: [
      '美浴水（ナノ水）',
      '打たせ湯',
      '足湯付き露天風呂',
      '展望風呂',
      'ゲルマニウム温浴',
      '大型水槽ロビー',
      '無料Wi-Fi',
      '美容器具レンタル',
      '豊富なフードメニュー',
    ],
    prices: {
      ショートタイム: [{ title: '70分', price: '¥2,740～', time: '月～金' }],
      休憩: [{ title: '190分', price: '¥5,200～', time: '月～金' }],
      宿泊: [
        { title: '日～金', price: '¥5,380～', time: '最大17時間など' },
        { title: '土曜', price: '¥12,530～', time: '18:00～' },
      ],
    },
    reviews: [
      {
        title: '水が気持ちいい',
        body: 'ナノ水のお風呂がとても柔らかくて肌がしっとりしました。水槽のあるロビーも素敵です。',
        score: '4.1',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  'd6f939b7-dca5-4101-8e4c-46f00cdca230': {
    hotel_name: 'HOTEL PALM GATE (ホテル パームゲート)',
    url: 'https://palm-gate.com/',
    description:
      '福岡市那の津エリアのタイムレス・リゾート。女子会プランやセレクトシャンプー、コスプレレンタルなど、ラグジュアリーな空間で楽しむサービスが充実。ベイサイドプレイス近くで観光にも便利です。',
    amenities: [
      '無料Wi-Fi',
      'セレクトシャンプー',
      'コスプレ衣装レンタル',
      'カールドライヤー',
      'ヘアアイロン',
      '女子会プラン',
      '無料駐車場',
      'ルームサービス',
    ],
    prices: {
      休憩: [
        { title: '月～金 (4時間)', price: '¥5,900～', time: '6:00～24:00' },
        { title: '土日祝 (3時間)', price: '¥7,800～', time: '6:00～24:00' },
      ],
    },
    reviews: [
      {
        title: 'リゾート気分満点',
        body: '内装がとても豪華で、那の津の海風を感じながらリラックスできました。女子会プランがおすすめです。',
        score: '4.0',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, batch3Data);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated 15 hotels (Batch 3) in JSON.');
