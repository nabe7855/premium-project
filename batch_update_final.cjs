const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const finalBatchData = {
  '8e1bc90b-1501-4701-bf36-16d27102a616': {
    hotel_name: 'HOTEL 乱（ラン）',
    url: 'https://hayama-hotels.com/shop/h006/',
    description:
      '博多区西月隈。和モダンを基調としたラグジュアリーな大人の空間。全室にVOD、Wi-Fi、電子レンジを完備。一部客室にはドライサウナや水中照明、ジェットバスを備え、入浴剤バイキングなど細やかなサービスも好評です。',
    amenities: [
      '和モダン客室',
      'ドライサウナ(一部)',
      '水中照明/ジェットバス',
      'VOD',
      '電子レンジ',
      '無料Wi-Fi',
      '入浴剤バイキング',
      'マッサージチェア(一部)',
      'カラオケ(一部)',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '平日(4時間)', price: '¥4,900〜', time: '6:00〜24:00' }],
      宿泊: [{ title: '平日目安', price: '¥8,200〜', time: '20:00〜翌12:00' }],
    },
    reviews: [
      {
        title: '清潔感のある和モダン',
        body: '内装がお洒落で落ち着きます。アメニティがとても充実していて、入浴剤が選べるのも嬉しい。お部屋も広くて清掃が行き届いていました。 ',
        score: '4.0',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '92b2bc6f-9919-4a4e-8550-2eb835d5db2e': {
    hotel_name: 'ホテル 銀巴里倶楽部',
    url: 'https://hotel-ginpari-club.com/',
    description:
      '黒崎駅徒歩5分。地域最大クラスの広さ(最大52㎡)と充実の設備を誇る。全室に高級マットレス、カラオケ、VODを導入。一部客室にはスイート仕様のジャグジーやサウナも完備し、上質なプライベートタイムを約束します。',
    amenities: [
      '高級マットレス(全室)',
      'カラオケ(全室)',
      'VOD(全室)',
      'サウナ(一部)',
      'ジャグジー/浴室TV(一部)',
      '50型大画面TV(一部)',
      '無料Wi-Fi',
      '本格フードメニュー',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '平日(2時間)', price: '¥3,700〜', time: '24時間受付' }],
      宿泊: [{ title: '平日目安', price: '¥7,000前後〜', time: '詳細要問合せ' }],
    },
    reviews: [
      {
        title: '黒崎エリアで一番広い',
        body: 'お部屋がとても広くて、テレビも巨大。カラオケも最新で楽しめました。ベッドの寝心地も良く、設備が整っているので長時間滞在したくなります。',
        score: '4.0',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  'cf899089-9781-4538-93db-71b0e3ee071a': {
    hotel_name: 'HOTEL RAVI／Ⅱ (新丸子)',
    url: 'https://happyhotel.jp/hotels/2583',
    description:
      '新丸子駅徒歩4分、武蔵小杉駅徒歩5分。二人の時間を誰にも邪魔されない「秘密の隠れ家」。全室に浴室TV、水中照明付ジェットバス、VODを完備。アクセス抜群ながら、静かで落ち着いたひとときを過ごせます。',
    amenities: [
      '水中照明付ジェットバス',
      '浴室TV',
      'VOD',
      '無料Wi-Fi',
      '電子レンジ',
      '持ち込み用冷蔵庫',
      '女性用・男性用化粧品',
      '大型TV(一部)',
      '駐車場6台(ハイルーフ可)',
    ],
    prices: {
      休憩: [{ title: '全日(3時間)', price: '¥7,000', time: '5:00〜24:00' }],
      宿泊: [{ title: '全日目安', price: '¥10,500', time: '21:00〜翌11:00' }],
    },
    reviews: [
      {
        title: '武蔵小杉の隠れ家',
        body: '駅近で便利ですが、とても静かに過ごせました。お風呂の水中照明が綺麗でリラックスできます。アメニティも一通り揃っていて手ぶらでOKでした。 ',
        score: '3.5',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '4ecdd659-188b-4648-a5bd-83b4967a4249': {
    hotel_name: 'ホテル パルティノン (川崎)',
    url: 'https://hotenavi.com/parthenon/',
    description:
      '京急川崎駅徒歩5分、JR川崎駅徒歩10分。アメニティの充実度と「パルティノン」の名に相応しい開放的な浴室が魅力。一部客室には露天風呂やブロアバスも完備。コスプレ無料貸出や豊富なメンズ用品など、細部まで行き届いたサービスが好評。',
    amenities: [
      '露天風呂(一部)',
      'ブロアバス(一部)',
      '50インチ大型TV',
      'VOD',
      '5.1chサラウンド(一部)',
      '空気清浄機(プラズマクラスター)',
      '無料Wi-Fi',
      'コスプレ無料レンタル(72着)',
      '駐車場あり',
    ],
    prices: {
      休憩: [{ title: '平日目安', price: '¥4,500〜', time: '詳細要問合せ' }],
      宿泊: [{ title: '日〜木目安', price: '¥9,000前後〜', time: 'チェックイン時間による' }],
    },
    reviews: [
      {
        title: '露天風呂が素晴らしい',
        body: '川崎の街中でこんなに広い露天風呂に入れるとは思いませんでした。部屋も広くて清潔。アメニティが驚くほど充実していて、シャンプーの種類も選べました。',
        score: '4.6',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '9c4d6c0e-c3e0-4581-9915-c9a737ad23b1': {
    hotel_name: 'ホテル グリーンボックスⅠ・Ⅱ',
    url: 'https://hotel-greenbox.com/',
    description:
      '若宮IC車で10分。脇田温泉至近。全室ワンルームワンガレージでプライバシー重視。100インチプロジェクターや5.1chサウンド、スロット機備付の客室など、自分たちだけのシアター空間として楽しめる個性派ホテル。',
    amenities: [
      'ワンルームワンガレージ',
      '100インチプロジェクター(一部)',
      '5.1chサウンド(一部)',
      'スロット実機(一部)',
      '24時間ルームサービス',
      '無料Wi-Fi',
      '低価格設定',
      'メンバー特典アップグレード',
    ],
    prices: {
      宿泊: [{ title: '平日目安', price: '¥2,500〜', time: '地域最安級' }],
      休憩: [{ title: '目安', price: '¥2,000前後〜', time: '時間制利用可' }],
    },
    reviews: [
      {
        title: '圧倒的なコスパと隠れ家感',
        body: 'ガレージからそのまま入室できるので、誰にも会わなくて済みます。プロジェクターがある部屋は迫力満点。この安さでシアター気分が味わえるのは最高です。',
        score: '3.1',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, finalBatchData);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated the final 5 hotels. Project Complete!');
