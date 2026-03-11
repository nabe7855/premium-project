const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const batch2Data = {
  'e5fc03cc-8aaf-4061-a9f7-5f95d5e38dd3': {
    hotel_name: 'HOTEL Roussillon (ホテル ルション)',
    url: 'http://hotelroussillon.com/',
    description:
      '南仏プロヴァンス地方をイメージしたデザイナーズホテル。21室の趣の異なるお部屋は、スイングベッドやカラオケ付きなど個性豊か。羽田空港からのアクセスも抜群で、ビジネスや観光の拠点に最適です。',
    amenities: [
      'レインボーブロアバス',
      '浴室テレビ',
      '40インチ以上液晶TV',
      'VOD',
      '無料Wi-Fi',
      'Netflix対応',
      'スイングベッド',
      'カラオケ',
      'ホームシアター',
      'アロマ入浴剤セット',
    ],
    prices: {
      休憩: [
        { title: '平日 (4時間)', price: '¥4,800～¥6,300', time: '6:00～23:00の間' },
        { title: 'ショート(2時間)', price: '¥3,300～¥5,800', time: '6:00～23:00の間' },
      ],
      宿泊: [
        { title: '日～木・祝', price: '¥7,800～¥10,800', time: '21:00～翌12:00' },
        { title: '金・土・祝前', price: '¥8,300～¥12,300', time: '18:00～翌12:00など' },
      ],
    },
    reviews: [
      {
        title: '清潔でオシャレ',
        body: 'プロヴァンス風の外観と内装がとても可愛いです。お風呂のレインボー照明が綺麗でリラックスできました。',
        score: '4.6',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  '0af37c60-0a40-47e2-b976-893ab0d3db0d': {
    hotel_name: 'HOTEL GOLF 横浜 (ホテル ゴルフ 横浜)',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '港北インター近く、ららぽーと横浜のすぐそばに位置する大人専用ホテル。全室にジェットバスや最新映画見放題のVODを完備。フレックスタイム制の導入により、短時間から長時間まで柔軟に利用可能です。',
    amenities: [
      'ジェットバス',
      'ブロアバス',
      'VOD',
      'マッサージチェア',
      'カラオケ',
      '無料Wi-Fi',
      '5.1chサラウンド',
      '岩盤浴',
      '電子レンジ',
      '持ち込み用冷蔵庫',
    ],
    prices: {
      休憩: [
        { title: '2時間', price: '¥3,900～', time: '全日' },
        { title: '4時間', price: '¥5,500～', time: '全日' },
        { title: '6時間', price: '¥6,500～', time: '全日' },
      ],
      宿泊: [
        { title: '月～金 (16時間)', price: '¥8,400', time: 'チェックインより' },
        { title: '土日祝 (14時間)', price: '¥9,800', time: 'チェックインより' },
      ],
    },
    reviews: [
      {
        title: '使い勝手が良い',
        body: 'フレックス制なので時間を気にせず入れます。部屋も広くてアメニティも充実していました。',
        score: '3.8',
        date: '2023-12',
      },
    ],
    manual_recovery: true,
  },
  '138e7922-3cd1-47c9-bf43-9aed67bc55bf': {
    hotel_name: 'HOTEL W-MULIA / 横浜市保土ヶ谷区',
    url: 'https://w-hotels.net/w-mulia/',
    description:
      '本格的なロウリュサウナやスチームサウナが楽しめる、サウナ好きに大人気のラグジュアリーホテル。専任シェフによる絶品モーニングやディナーも評判。サプライズ演出などのおもてなしも充実しています。',
    amenities: [
      'ロウリュサウナ',
      'スチームサウナ',
      '15度水風呂',
      'ジェットバス',
      'マッサージチェア',
      'Wi-Fi',
      '電子レンジ',
      '館内休憩スペース',
      'バースデー割引',
    ],
    prices: {
      休憩: [
        { title: '月～金 (フレックス)', price: '¥4,900～¥9,800', time: '最大10時間など' },
        { title: 'ショート(2時間)', price: '¥3,900～¥7,800', time: '全日' },
      ],
      宿泊: [
        { title: '日～金', price: '¥16,000～', time: '最大15時間' },
        { title: '土・祝前', price: '¥20,800～', time: '19:00～翌10:00' },
      ],
    },
    reviews: [
      {
        title: 'サウナが本格的',
        body: 'ラブホとは思えないほどサウナの質が高いです。ロウリュもできて最高でした。朝食もとても美味しかったです。',
        score: '4.7',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '8f0595ee-e47f-4bf3-a6bd-fa1720fa8d43': {
    hotel_name: '旅荘 草月 / 川崎市麻生区',
    url: 'https://couples.jp/hotel-details/61825',
    description:
      'よみうりランド近くの閑静な住宅街に佇む、大人の隠れ家的レジャーホテル。リーズナブルな料金設定ながら、ブラックライトや日焼けマシンなどユニークな設備も備えており、プライベートな時間をゆっくり過ごせます。',
    amenities: [
      '電子レンジ',
      '持ち込み用冷蔵庫',
      '電気ポット',
      'ウォーターサーバー',
      'ブラックライト',
      '日焼けマシン',
      '無料Wi-Fi',
    ],
    prices: {
      休憩: [{ title: '全日目安', price: '¥4,000～¥5,000', time: '10:00～23:00の間' }],
    },
    reviews: [
      {
        title: '落ち着く隠れ家',
        body: '看板が目立ちすぎず入りやすいです。静かな環境でゆっくりできました。',
        score: '3.5',
        date: '2023-08',
      },
    ],
    manual_recovery: true,
  },
  '793068fe-b20e-4bb3-836f-8bd3ac9c4442': {
    hotel_name: 'GOLF 厚木 (ゴルフ 厚木) / 厚木市',
    url: 'https://happyhotel.jp/hotels/600115',
    description:
      '東名厚木インターから車ですぐの好立地。広々とした清潔感のある客室に、マッサージチェアやジェットバスなどリラックス設備が充実。アメニティの種類も豊富で、ビジネス利用にもおすすめです。',
    amenities: [
      'ジェットバス',
      'マッサージチェア',
      'VOD',
      '無料Wi-Fi',
      '電子レンジ',
      '冷蔵庫',
      'オンデマンド見放題',
      '無料アメニティ',
    ],
    prices: {
      休憩: [{ title: '目安', price: '¥4,364～', time: '24時間' }],
      宿泊: [{ title: '平日目安', price: '¥6,800～', time: '20:00～' }],
    },
    reviews: [
      {
        title: '広くて綺麗',
        body: '古い建物と聞いていましたが、中はとても綺麗で広かったです。スタッフの対応も丁寧でした。',
        score: '4.1',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '544ae2c4-94d9-4a1e-af0c-47d9d00fe5fc': {
    hotel_name: 'HOTEL The SCENE (ホテル ザ シーン) / 横浜市港北区',
    url: 'https://yokohamanohotel.com/',
    description:
      '新横浜駅から徒歩圏内のハイグレードな大人専用ホテル。100平米のスイートルームを擁し、ドリンクバーやお菓子バイキングなどの無料サービスが非常に充実しています。女子会や記念日にも最適です。',
    amenities: [
      '露天風呂（一部）',
      'マッサージチェア',
      '浴室テレビ',
      'VOD',
      '無料Wi-Fi',
      'ドリンクバー',
      'お菓子バイキング',
      'アメニティバイキング',
      '24時間ルームサービス',
      '大型液晶TV',
    ],
    prices: {
      休憩: [{ title: '平日 (5時間)', price: '¥5,300～¥13,800', time: '24時間' }],
      宿泊: [
        { title: '日～木', price: '¥7,800～¥19,800', time: '21:00～翌12:00' },
        { title: '金・土', price: '¥10,800～', time: '21:00～' },
      ],
    },
    reviews: [
      {
        title: 'サービスが凄い',
        body: 'ドリンクやお菓子の無料サービスが充実していて驚きました。部屋も広くて清潔感があり、大満足です。',
        score: '4.8',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '5c9c1249-b202-4c48-9715-9860dbcda80e': {
    hotel_name: 'HOTEL EBINA (ホテル エビナ) / 海老名市',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '海老名駅からアクセス良好な都市型レジャーホテル。リーズナブルなショートタイム料金設定が魅力。各種携帯充電器やヘアアイロン、豊富な女性用化粧品などアメニティの配慮が行き届いています。',
    amenities: [
      'ジェットバス',
      'ブロアバス',
      'ヘアアイロン',
      '女性用化粧品',
      '電子レンジ',
      '持ち込み用冷蔵庫',
      '無料Wi-Fi',
      '携帯充電器',
    ],
    prices: {
      ショートタイム: [{ title: '月～金 (2時間)', price: '¥3,600～¥4,400', time: '24時間' }],
      宿泊: [{ title: '全日', price: '¥7,000～¥9,800', time: '20:00～' }],
    },
    reviews: [
      {
        title: '手軽に利用できる',
        body: '駅からも近く、短時間利用がお得なのでよく利用します。アメニティが揃っているので手ぶらでも安心です。',
        score: '4.0',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
  '8218251e-91b7-47d8-bf73-dc563b292caf': {
    hotel_name: '湘南ベイホテル / 茅ヶ崎市',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '湘南・茅ヶ崎の海岸近くに位置し、露天風呂や本格サウナを完備したリゾート感あふれるホテル。ペット同伴可能なお部屋もあり、江の島・鎌倉観光の拠点としても非常に人気があります。',
    amenities: [
      '露天風呂 (12室)',
      '本格サウナ (8室)',
      'ジェットバス',
      'ペット同伴可',
      '無料Wi-Fi',
      '電子レンジ',
      '無料駐車場',
      '入浴剤バイキング',
      'マクドナルド朝食券',
    ],
    prices: {
      休憩: [{ title: '全日目安', price: '¥4,000～', time: '24時間' }],
      宿泊: [{ title: '全日目安', price: '¥5,980～', time: '18:00～' }],
    },
    reviews: [
      {
        title: 'リゾート気分',
        body: '露天風呂付きの部屋に泊まりましたが、最高にリラックスできました。ペットも一緒に泊まれるのが嬉しいです。',
        score: '4.5',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'd2dd6b9b-3ebd-4e7b-9b1f-bbad80e3fac9': {
    hotel_name: 'ホテル ホワイトハウス 葉山 / 三浦郡',
    url: 'http://wbed.jp/hotel/whitehouse/',
    description:
      '葉山の高台に建つ、白亜の城のような外観が印象的なラグジュアリーホテル。60インチ大型TVやVOD、浴室TVに加え、一部の部屋には岩盤浴も完備。葉山のリゾートムードをリーズナブルに楽しめます。',
    amenities: [
      '岩盤浴（一部）',
      'スチームサウナ',
      '浴室テレビ',
      '60インチ超大型TV',
      'VOD',
      '通信カラオケ',
      'ジェットバス',
      '空気清浄機',
      '無料Wi-Fi',
    ],
    prices: {
      休憩: [
        { title: '月～金 (3時間)', price: '¥4,800～¥7,300', time: '5:00～25:00' },
        { title: '土日祝 (3時間)', price: '¥5,800～¥8,300', time: '5:00～25:00' },
      ],
      宿泊: [
        { title: '日～金', price: '¥7,200～¥10,500', time: '20:00～翌11:30' },
        { title: '土曜', price: '¥10,200～¥13,500', time: '20:00～翌10:30' },
      ],
    },
    reviews: [
      {
        title: '外観が豪華',
        body: '白亜の建物がとても綺麗です。部屋も広くて、岩盤浴がとても気持ちよかったです。コスパが良いです。',
        score: '4.3',
        date: '2024-02',
      },
    ],
    manual_recovery: true,
  },
  '1119a4d3-f140-4132-9e2f-fddfecb1bbf5': {
    hotel_name: 'ホテル カルチャークラブ / 大和市',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '大和駅から徒歩2分の好立地に佇む、パステルカラーの隠れ家ホテル。バリ風のプチリゾートスタイルで、ビジネスや一人旅でも利用可能。リーズナブルな料金と清潔感のある空間が好評です。',
    amenities: [
      'ブロアバス',
      '浴室テレビ',
      '無料ミネラルウォーター',
      '無料Wi-Fi',
      '電子レンジ',
      '冷蔵庫',
      'ハイルーフ駐車場',
      'メンバー特典',
    ],
    prices: {
      休憩: [
        { title: '月～金 (2時間)', price: '¥3,100～', time: '17:00～翌1:00' },
        { title: '土日祝 (2時間)', price: '¥3,300～', time: '17:00～翌1:00' },
      ],
      宿泊: [{ title: '全日', price: '¥5,850～¥7,700', time: '17:00～翌11:00' }],
    },
    reviews: [
      {
        title: '駅近で便利',
        body: 'とにかく駅から近くて便利です。パステルカラーの部屋が可愛くて落ち着きます。価格も安くて助かります。',
        score: '4.0',
        date: '2024-01',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, batch2Data);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated next 10 hotels in JSON.');
