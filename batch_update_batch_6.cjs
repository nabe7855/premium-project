const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const batch6Data = {
  '1b71d08e-6a7c-44f6-b3cb-04325c4e9ec7': {
    hotel_name: 'HOTEL555 秦野 -現 UTSUTSU-',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '2024年リニューアルの「夢 YUMEMI」に隣接する姉妹店。洗練されたモダンな空間で、秦野エリア屈指のクオリティを提供。最新のVODシステムや大型TVを全室に完備し、落ち着いた大人の隠れ家として最適です。',
    amenities: [
      '大型液晶TV',
      'VOD',
      '無料Wi-Fi',
      '電子レンジ',
      '浴室テレビ',
      'ジェット・ブロアバス',
      '無料アメニティ',
    ],
    prices: {
      休憩: [{ title: '目安', price: '¥4,500～', time: '3時間など' }],
      宿泊: [{ title: '目安', price: '¥9,400～', time: '20:00～翌11:00' }],
    },
    reviews: [
      {
        title: '綺麗で快適',
        body: '隣の夢と並んで秦野では一番綺麗なホテルだと思います。設備が新しくて、VODの作品数も多くて楽しめました。',
        score: '4.1',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '82e60097-6bbc-466f-9425-80244afbfef2': {
    hotel_name: 'Bella Vista (ベラビスタ)',
    url: 'https://couples.jp/hotel-details/1897',
    description:
      '行橋市辻垣。落ち着いた雰囲気の客室に、VOD、Wi-Fi、電子レンジなど基本設備をしっかり完備。広々としたバスタブが好評で、一人のビジネス利用からカップルのデートまで幅広く利用可能です。',
    amenities: [
      'VOD',
      '無料Wi-Fi',
      '電子レンジ',
      '電気ポット',
      'ウォシュレット',
      'ヘアアイロンレンタル',
      'セレクトシャンプー',
      '無料駐車場 (20台)',
    ],
    prices: {
      休憩: [{ title: '平日', price: '¥3,500～', time: '最大19時間フリータイムあり' }],
      宿泊: [{ title: '平日・日曜', price: '¥5,640～', time: '18:00～翌12:00' }],
    },
    reviews: [
      {
        title: 'お風呂が広い',
        body: '建物は少し懐かしい感じですが、バスタブが大きくてゆっくりできました。セレクトシャンプーが選べるのも良かったです。',
        score: '3.4',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  'a68fc6e3-7876-42ac-a745-910401a7216e': {
    hotel_name: 'SILK HOTEL (シルクホテル)',
    url: 'http://hotelsilk.com/',
    description:
      '川崎駅から徒歩8分。花の香りが漂うくつろぎの空間をコンセプトに、リーズナブルな料金で提供。ドライサウナやカラオケ付きの客室もあり、ポイントカード特典などリピーターへのサービスも充実しています。',
    amenities: [
      'ドライサウナ（一部）',
      'VOD',
      '無料Wi-Fi',
      'カラオケ（一部）',
      '豊富なフードメニュー',
      '平日の朝食サービス',
      '駐車場7台',
      'ポイントカード',
    ],
    prices: {
      ショートタイム: [{ title: '平日 (2時間)', price: '¥3,700～', time: '6:00～翌1:00' }],
      宿泊: [{ title: '日～木曜', price: '¥8,800～', time: '18:00～翌12:00' }],
    },
    reviews: [
      {
        title: 'コスパが良い',
        body: '川崎でこの値段は安いと思います。風呂とトイレが別なのが高ポイント。設備は多少古いですが、清掃はされていました。',
        score: '3.7',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  'cb4c545e-b355-4c68-a480-29aae4d6d927': {
    hotel_name: '天然温泉 HOTEL 海 KAI',
    url: 'https://hotel-kai.jp/',
    description:
      '福岡市ベイエリアに位置する「源泉かけ流し」の天然温泉を楽しめる稀少なホテル。50インチ以上の大画面TVやVODを完備し、博多湾の潮風を感じながら上質なリラクゼーション体験を提供します。',
    amenities: [
      '源泉かけ流し天然温泉',
      '50インチ以上大型TV',
      'VOD',
      'ジェット・ブロアバス（一部）',
      '無料Wi-Fi',
      '通信カラオケ（一部）',
      '駐車場35台',
      '和室あり',
    ],
    prices: {
      休憩: [{ title: '月～金 (4時間)', price: '¥4,980～', time: '24時間' }],
      宿泊: [{ title: '月～木曜', price: '¥7,980～', time: '19:00～翌12:00' }],
    },
    reviews: [
      {
        title: '本物の温泉に感動',
        body: '福岡市内でかけ流しの温泉に入れるのは凄い！お風呂も広くて、テレビ付き。ペイペイドームからも近くて便利でした。',
        score: '4.4',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  'a86a5db0-f38a-4b09-a5a9-4c6803bf313d': {
    hotel_name: 'HOTEL BELL Ⅰ・Ⅱ (ホテル ベル)',
    url: 'http://hotel-bellone.com/',
    description:
      '鞍手ICから車で15分。和洋様々な客室に、VOD600タイトル、本格マッサージチェアなどを完備。窯焼きピザなどの本格的な食事メニューや、メンバー限定の無料モーニングサービスも好評です。',
    amenities: [
      'VOD (600タイトル)',
      'マッサージチェア',
      'カラオケ（一部）',
      '浴室テレビ（一部）',
      '無料Wi-Fi',
      '和室あり',
      '本格ピザ',
      '無料モーニング（メンバー）',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥3,400～', time: '24時間' }],
      深夜休憩: [{ title: '平日', price: '¥4,800～', time: '22:00～翌6:00' }],
    },
    reviews: [
      {
        title: 'サービスが良い',
        body: 'ピザが美味しくて驚きました。VODも見放題だし、マッサージチェアでゆっくりできて、コスパ最高です。',
        score: '3.0',
        date: '2023-11',
      },
    ],
    manual_recovery: true,
  },
  'ab92549e-82aa-4fa5-862c-2206df160983': {
    hotel_name: 'ホテル 現代楽園 大和店',
    url: 'https://www.ano-grp.com/yamato/',
    description:
      '「大人のための和モダンリゾート」を極めたハイクラスホテル。全室にタブレット、大型TV、ナノ水仕様のジェットバスを完備。テラス付きルームやメゾネットタイプのスイートなど、圧倒的なラグジュアリー空間を提供します。',
    amenities: [
      '和モダンデザイナーズ',
      'ナノ水ジェットバス',
      '浴室TV',
      '大型TV (VOD/Chromecast)',
      '客室タブレット',
      '無料Wi-Fi',
      'テラス（一部）',
      'メゾネット客室（一部）',
      '本格ルームサービス',
    ],
    prices: {
      休憩: [{ title: '毎日 (2時間)', price: '¥12,930～', time: '24時間' }],
      宿泊: [{ title: '女子会プランなど', price: '¥7,000/名～', time: '' }],
    },
    reviews: [
      {
        title: '最高級の体験',
        body: '部屋も風呂も次元が違いました。和モダンな装飾が美しく、スタッフの対応も完璧。特別な日に利用したい一軒です。',
        score: '4.5',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '06f66c84-61c3-431f-be3b-5b0380fc885e': {
    hotel_name: 'ホテル 2001 (横浜市南区)',
    url: 'https://sara-2001.jp/',
    description:
      '伊勢佐木長者町駅から徒歩3分の激安・優良ホテル。2020年リフレッシュオープンし、ジェットバスやVOD完備。ショートタイム2,400円〜という地域最安級の価格設定で、高いリピート率を誇ります。',
    amenities: [
      'ジェット・ブロアバス',
      'VOD',
      'YouTube/Netflix視聴可 (一部)',
      '無料Wi-Fi',
      '電子レンジ',
      '充電器レンタル',
      '駐車場17台',
      '伊勢佐木長者町駅近',
    ],
    prices: {
      ショートタイム: [{ title: '月～木 (70分)', price: '¥2,400', time: '24時間' }],
      宿泊: [{ title: '平日2部', price: '¥6,100～', time: '深夜チェックイン可' }],
    },
    reviews: [
      {
        title: 'とにかく安い！',
        body: '横浜でこの安さは驚愕。部屋も普通に綺麗だし、お風呂にジェットバスが付いているのが嬉しい。コスパ最強です。',
        score: '4.0',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  '815eca6c-31c4-4514-aedf-7588ec1e5680': {
    hotel_name: 'HOTEL ACQUA MYU (ホテル アクア ミュー)',
    url: 'https://lovehotel-ikitai.com/fukuoka/fukuokanishi/acqua-myu/',
    description:
      '姪浜駅から徒歩7分。防音窓仕様の静かな客室に、大画面TVやVODを完備。一部客室にはサウナや露天風呂、マッサージチェアも備え、広々としたお風呂でのんびり過ごせる、コスパ良好なベイエリアのレジャーホテルです。',
    amenities: [
      '防音窓仕様',
      '大画面TV (VOD対応)',
      'サウナ（一部）',
      '露天風呂（一部）',
      'マッサージチェア（一部）',
      '無料Wi-Fi',
      '電子レンジ',
      '駐車場45台 (ハイルーフ可)',
    ],
    prices: {
      休憩: [{ title: '4時間', price: '¥2,550～', time: '24時間' }],
      宿泊: [{ title: '日～木曜', price: '¥5,150～', time: '15:00～翌13:00 (最大22時間)' }],
    },
    reviews: [
      {
        title: 'お得感がある',
        body: '建物は歴史を感じますが、とにかく安くて部屋が広い。お風呂も大きくてゆっくり浸かれました。スタッフさんも親切でした。',
        score: '3.8',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
  '48dd463e-92ff-4918-b896-235b19a49846': {
    hotel_name: 'HOTEL BAMBOO GARDEN 相模原',
    url: 'https://bamboogarden.jp/',
    description:
      '「都会のオアシス」をテーマに、植物に囲まれた落ち着きのある空間を提供。65型TVでのChromecast対応や、フランスベッド社製の高級マットレスを全室導入。高級ホテルさながらの清潔感と充実のサービスが自慢です。',
    amenities: [
      'フランスベッド社製マットレス',
      '65型大型TV',
      'Chromecast',
      'カラオケ (JOYSOUND)',
      '浴室TV',
      '水中照明',
      '無料Wi-Fi',
      'ルームサービス',
      '無料サービスドリンク',
    ],
    prices: {
      休憩: [{ title: '平日 (2時間)', price: '¥3,500～', time: '24時間' }],
      宿泊: [{ title: '日曜均一プランなど', price: '¥Under 10,000', time: '' }],
    },
    reviews: [
      {
        title: 'ラブホっぽくない落ち着き',
        body: '高級ホテルのような内装で、清掃も完璧。Chromecastで自分の動画も見れるし、ベッドの寝心地が最高でした。',
        score: '4.6',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  'b859a5a9-876f-40ad-ba7f-45cb2e52f406': {
    hotel_name: 'ホテル ZALA 新横浜',
    url: 'https://hotel-zala.jp/',
    description:
      '新横浜駅から徒歩10分のスタイリッシュなホテル。レインボーブロアバスやカラオケ、VOD500タイトルを全室完備。ロビーではシャンパン、ポップコーン、ソフトクリームの無料サービスがあり、イベント帰りの利用にも最適です。',
    amenities: [
      'レインボーブロアバス',
      'カラオケ (全室)',
      'VOD (500タイトル)',
      'YouTube/ネットラジオ可',
      '無料Wi-Fi',
      'ウェルカムシャンパン',
      '無料ソフトクリーム',
      '駐車場完備',
    ],
    prices: {
      ショートタイム: [{ title: '平日 (2時間)', price: '¥3,000～', time: '24時間' }],
      宿泊: [{ title: '土・日・祝', price: '¥9,500～', time: '最大17時間' }],
    },
    reviews: [
      {
        title: 'サービス精神たっぷり',
        body: 'ロビーの無料サービスが多くて楽しめました。部屋のお風呂がレインボーに光って綺麗です。横浜アリーナから近くて便利！',
        score: '4.2',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'ea26a417-ab0c-48c3-a505-acd2eef23579': {
    hotel_name: 'レステイ ペントハウス (北九州)',
    url: 'https://www.restay.jp/kitakyushu/',
    description:
      '小倉北区金田。最大18〜19時間のロングステイが可能なゆったりプランが人気。広いお風呂と落ち着いた内装に加え、入浴剤バイキングや充実したレンタルアメニティで、ビジネス利用や一人旅にも選ばれています。',
    amenities: [
      '最大19時間フリータイム',
      '無料Wi-Fi',
      '広いバスタブ',
      '入浴剤バイキング',
      'マッサージ機（一部）',
      'カラオケ（一部）',
      '電子レンジ',
      '無料専用駐車場',
    ],
    prices: {
      休憩: [{ title: '平日 (2時間)', price: '¥2,070～', time: '24時間' }],
      宿泊: [{ title: '平日 (18時間利用)', price: '¥5,130～', time: '15:00～翌5:00 IN' }],
    },
    reviews: [
      {
        title: '小倉で一番のコスパ',
        body: 'ホテルの方がとても親切でした。お風呂も部屋も広くて、アメニティも充実。駅からは少し歩きますが、それを補う満足度です。',
        score: '3.9',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  'e57b701e-b746-4a99-818e-3bf795d9f396': {
    hotel_name: 'Hotel Dolce (ホテル ドルチェ)',
    url: 'https://couples.jp/hotel-details/1897',
    description:
      '日ノ出町駅から徒歩5分。一部客室には「本格SM設備」を備えつつ、ナノケア家電や大画面TVなど快適設備も充実。深夜チェックインでも最長13〜16時間滞在可能なロングプランなど、横浜・関内エリアでの拠点として重宝されます。',
    amenities: [
      '本格SM設備（一部）',
      '大画面TV',
      'VOD',
      'ジェット・バブルバス',
      '空気清浄機',
      '無料Wi-Fi',
      '電子レンジ',
      '提携駐車場あり',
      '外出可能',
    ],
    prices: {
      休憩: [{ title: '3時間', price: '¥3,900～', time: '5:00～翌2:00' }],
      宿泊: [{ title: '日～木曜', price: '¥6,600～', time: '最大16時間滞在可' }],
    },
    reviews: [
      {
        title: '清掃が綺麗',
        body: 'リニューアルされていて、お部屋がとても綺麗でした。お風呂のテレビが大きくて最高！スタッフさんの対応も良かったです。',
        score: '4.5',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '860d11e2-5c49-41d6-b285-172352e4b07a': {
    hotel_name: 'HOTEL I/S (ホテル アイエス)',
    url: 'https://hotels-reserve.jp/hotel/2320/',
    description:
      '石川町駅から徒歩1分、横浜中華街すぐのアジアンリゾートホテル。最大24時間の滞在可能なロングステイプランや、ミネラルウォーター・駄菓子・カップ麺の無料プレゼントなど、横浜観光の拠点としてコスパ最強を誇ります。',
    amenities: [
      'アジアンテイスト内装',
      '最大24時間ロングステイ',
      '無料Wi-Fi',
      'カップ麺・駄菓子プレゼント',
      'マッサージチェア（一部）',
      'プロジェクター（一部）',
      'コインランドリー',
      '駐車場8台',
    ],
    prices: {
      休憩: [{ title: '平日均一', price: '¥4,290', time: '24時間' }],
      宿泊: [{ title: '平日ロングステイ', price: '¥5,280～', time: '最大24時間' }],
    },
    reviews: [
      {
        title: '中華街のすぐ裏',
        body: 'ロケーションが最高！石川町駅からすぐで、無料のサービスが至れり尽くせり。アジアンな雰囲気が落ち着きます。',
        score: '4.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '72b2e558-9e96-48bc-a683-955ee18ea7de': {
    hotel_name: 'HOTEL SALA (ホテル サーラ)',
    url: 'http://hotel-sala.net/',
    description:
      '新横浜駅から徒歩8分。チェックアウト最長翌15時のゆったりステイが自慢。全室にレインボーブロアバスや浴室TVを完備。早割プランや25%オフ特典など、ビジネス利用やイベント時の宿泊に圧倒的な利便性を提供します。',
    amenities: [
      'レインボーブロアバス',
      '浴室TV (全室)',
      '大型液晶TV (VOD対応)',
      'Wiiレンタル（一部）',
      '無料Wi-Fi',
      '電子レンジ',
      '豊富なアメニティ',
      'タクシー料金割引サービス',
    ],
    prices: {
      ショートタイム: [{ title: '目安', price: '¥3,500～', time: '24時間' }],
      宿泊: [{ title: '早割・2部など', price: '¥5,620～', time: '最大翌15:00チェックアウト' }],
    },
    reviews: [
      {
        title: 'ゆっくり過ごせる',
        body: 'チェックアウトが15時なのが本当にありがたい。お風呂も広くて機能的。アメニティが多くて手ぶらで泊まれます。',
        score: '3.8',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '55497b49-8321-4972-87eb-15f19521fb31': {
    hotel_name: 'ヴィクトリアコート 元町',
    url: 'http://hotel-victoriacourt.com/',
    description:
      '2024年グランドオープン！石川町駅から徒歩2分の超豪華ホテル。ロウリュ対応の本格サウナや露天風呂、岩盤浴を備えたVIPルームなど、横浜屈指の最新設備を完備。50インチ以上大型TVでのVOD鑑賞も楽しめます。',
    amenities: [
      '本格サウナ (ロウリュ対応)',
      '露天風呂（一部）',
      '岩盤浴（一部）',
      'レインボーバス',
      '浴室TV',
      '大型液晶TV (VOD対応)',
      '無料Wi-Fi',
      '美肌シャワーヘッド',
      'Bluetoothスピーカー',
    ],
    prices: {
      ショートタイム: [{ title: '平日目安', price: '¥2,900～', time: '5:00～翌1:00' }],
      宿泊: [{ title: '金曜日', price: '¥7,400～', time: '最大18時間滞在可' }],
    },
    reviews: [
      {
        title: '設備が最強クラス',
        body: '新しくてめちゃくちゃ綺麗！部屋に本格的なサウナがあって、水風呂と外気浴までできるのは凄すぎます。横浜で一番おすすめ。',
        score: '4.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, batch6Data);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated 15 hotels (Batch 6) in JSON.');
