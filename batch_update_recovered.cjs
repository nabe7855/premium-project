const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const hotelData = {
  'bf51611e-af80-48f5-9215-83c670a770df': {
    hotel_name: 'HOTEL AZAD (ホテル アザドゥ)',
    url: 'https://couples.jp/hotel-details/1922',
    description:
      '多摩川の畔に位置し、明るく清潔感のある客室が自慢のホテル。昼はリバービュー、夜は都心の夜景を楽しめるお部屋もございます。専任シェフによる約50種類の本格料理を24時間提供しています。',
    amenities: [
      'ドライサウナ',
      'ジェットバス',
      '浴室テレビ',
      'VOD',
      '無料Wi-Fi',
      '大型プロジェクター',
      'カールドライヤー',
      'ヘアアイロン',
    ],
    prices: {
      休憩: [{ title: '全日', price: '¥5,200～¥7,600', time: '5:00～24:00の間で3時間' }],
      宿泊: [
        { title: '日～木・祝', price: '¥8,800～¥12,500', time: '20:00～翌12:00' },
        { title: '金曜', price: '¥9,800～¥13,500', time: '20:00～翌10:00' },
        { title: '土・祝前', price: '¥11,800～¥15,500', time: '22:00～翌10:00' },
      ],
      サービスタイム: [
        { title: '全日', price: '¥5,200～¥7,600', time: '時間帯により複数設定あり' },
      ],
    },
    reviews: [
      {
        title: '料理が美味しい',
        body: '専任シェフがいるだけあって料理がとても美味しいです。多摩川の景色も綺麗でした。',
        score: '4.5',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '29fa7dd0-91e3-4412-bf8a-54426b694ca3': {
    hotel_name: 'ラブ バレンシア＆ジャパン 小倉',
    url: 'https://happyhotel.jp/hotels/600720',
    description:
      '小倉東インターすぐの好立地。全室ジェットバス完備で、VRルームやPS4設置ルームなどエンタメ設備が充実。100種類以上のグランドメニューや季節のモーニングも人気です。',
    amenities: [
      'ジェットバス',
      'ブロアーバス',
      'VRルーム',
      'PS4',
      'マッサージチェア',
      '空気清浄機',
      'コスプレ衣装貸出',
      '4Kテレビ',
    ],
    prices: {
      ショートタイム: [
        { title: '月～金 (2時間)', price: '¥2,190～¥3,290', time: '24時間いつでも' },
        { title: '土日祝 (2時間)', price: '¥3,950', time: '24時間いつでも' },
      ],
      宿泊: [{ title: '平日', price: '¥3,290～', time: '18:00～翌12:00' }],
    },
    reviews: [
      {
        title: 'コスパ最高',
        body: '料金が安いのに設備がしっかりしていて驚きました。駐車場も広くて使いやすいです。',
        score: '4.0',
        date: '2024-10',
      },
    ],
    manual_recovery: true,
  },
  'c364044c-f66b-450b-8a13-138841d972d9': {
    hotel_name: 'ホテルヴィクトリアコート 関内',
    url: 'https://happyhotel.jp/hotels/600115',
    description:
      '関内エリア最大級の豪華設備。天然御影石を使用した高級感あふれる外観と、露天風呂やサウナ完備のスイートルームが自慢. コスプレ無料レンタルやVOD見放題などサービスも充実しています。',
    amenities: [
      '露天風呂',
      'ドライサウナ',
      'ミストサウナ',
      '岩盤浴',
      'カラオケ',
      'マッサージチェア',
      'レインボーバス',
      'VOD',
      '無料Wi-Fi',
    ],
    prices: {
      休憩: [
        { title: '平日', price: '¥2,980～', time: '1時間40分' },
        { title: '土日祝 (3時間)', price: '¥4,400～', time: '24時間' },
      ],
      宿泊: [{ title: '全日', price: '¥6,900～', time: '最大18時間' }],
    },
    reviews: [
      {
        title: '設備が豪華',
        body: 'お風呂がレインボーで広くて最高でした。サウナ付きの部屋もあり、関内では一番のお気に入りです。',
        score: '4.2',
        date: '2024-08',
      },
    ],
    manual_recovery: true,
  },
  'cdf6a933-497f-41d7-9075-50b7cc30e4db': {
    hotel_name: 'HOTEL JOY seaside',
    url: 'https://couples.jp/hotel-details/61825',
    description:
      '宗像市の閑静なエリアに位置する癒しの空間。道の駅むなかたや世界遺産・宗像大社からのアクセスも良好。VOD 700タイトル以上が無料で楽しめる、リーズナブルな郊外型ホテルです。',
    amenities: ['VOD (700タイトル)', '無料Wi-Fi', '電子レンジ', '持込用冷蔵庫', '無料アメニティ'],
    prices: {
      ショートタイム: [
        { title: '月～金', price: '¥2,640', time: '24時間' },
        { title: '土日祝', price: '¥4,290', time: '24時間' },
      ],
      宿泊: [{ title: '全日目安', price: '¥7,500前後', time: '18:00～11:00' }],
    },
    reviews: [
      {
        title: '静かで落ち着く',
        body: '朝に鳥の声が聞こえてとても癒されました。料金も安くて使いやすいです。',
        score: '3.5',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '0d8478ef-1a6a-45f8-9265-2a409dbf2b51': {
    hotel_name: 'ホテル アイヒルズ',
    url: 'https://stay-lovely.jp/hotels/1126',
    description:
      '「城山の天然水」を全室で使用。こだわりのウォーターサーバー設置やSMルーム、コンセプトルームなど、刺激的で最高の癒しを提供。ランチ・ディナーのフードサービスも充実しています。',
    amenities: [
      'SMルーム',
      'ブラックライト',
      'ウォーターサーバー',
      'ジェットバス',
      'VOD',
      'フードサービス',
      '大型TV',
      '無料Wi-Fi',
    ],
    prices: {
      休憩: [
        { title: '平日 (3時間)', price: '¥2,700～¥4,200', time: '6:00～24:00' },
        { title: '土日祝 (3時間)', price: '¥3,000～¥4,500', time: '6:00～24:00' },
      ],
      宿泊: [
        { title: '日～金', price: '¥3,900～¥6,900', time: '18:00～翌12:00' },
        { title: '土・祝前', price: '¥5,000～¥8,500', time: '20:00～翌12:00' },
      ],
    },
    reviews: [
      {
        title: 'コンセプトルームが面白い',
        body: 'SMルームなどの刺激的な部屋があり、普通のホテルとは一味違った楽しみ方ができます。天然水も美味しいです。',
        score: '3.8',
        date: '2024-11',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, hotelData);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated 5 hotels in JSON.');
