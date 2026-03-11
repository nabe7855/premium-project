const fs = require('fs');
const JSON_PATH = 'data/raw_hotel_data/hotels_raw_data.json';

const batch9Data = {
  '85fd7404-463d-454a-b63b-04e2f022becf': {
    hotel_name: 'HOTEL GRASSINO URBAN RESORT 新横浜',
    url: 'https://grassino-hotels.com/pc/jp/index.php?shopno=19',
    description:
      '新横浜駅徒歩5分。全76室の大型ラグジュアリーホテル。お姫様ベッドや露天風呂、ミストサウナなど「非日常」を形にした空間が魅力。52インチ以上の大型TVと32インチ以上の浴室TVを全室に完備し、人工温泉も楽しめます。',
    amenities: [
      '人工温泉',
      '大型液晶TV(52型〜)',
      '浴室TV(32型〜)',
      'VOD(1000本)',
      'Chromecast',
      'ジェット/ブロアバス',
      '露天風呂(一部)',
      'マッサージチェア(一部)',
      '天蓋ベッド(一部)',
      '最新美容家電',
      '無料Wi-Fi',
      '駐車場(コインパーキング負担)',
    ],
    prices: {
      ショートタイム: [{ title: '全日 (90分)', price: '¥1,980〜', time: '24時間' }],
      宿泊: [{ title: '目安', price: '¥11,900〜', time: 'LUXURY TOWERフレックス制など' }],
    },
    reviews: [
      {
        title: '新横浜エリア最大級',
        body: 'お部屋がとても広くて、テレビも浴室テレビも巨大で驚きました。人工温泉でリラックスでき、アメニティも最高級。スタジアムのイベント帰りにも便利です。',
        score: '4.7',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '0c90ea99-b27e-41b9-9671-2cb9ca012e65': {
    hotel_name: 'ホテル エルミタージュ 田名店',
    url: 'https://hotenavi.com/hermitage-t/',
    description:
      '相模原ICから10分。アメニティとサービスの充実度が自慢の隠れ家ホテル。1000タイトル以上のVOD、入浴剤・シャンプーバイキング、さらに無料レンタル品も豊富。コスパ抜群で、落ち着いた滞在を提供します。',
    amenities: [
      'VOD(1000タイトル)',
      'ジェットバス',
      '通信カラオケ',
      '入浴剤・シャンプーバイキング',
      '最新美容家電レンタル',
      '無料Wi-Fi',
      '電子レンジ',
      '大型プラズマTV',
      '駐車場完備',
    ],
    prices: {
      ショートタイム: [{ title: '平日', price: '¥2,950〜', time: 'Aタイプ' }],
      宿泊: [{ title: '平日', price: '¥6,000〜', time: '目安' }],
    },
    reviews: [
      {
        title: 'コスパとサービスが最高',
        body: '入浴剤やシャンプーが選べるバイキングが楽しい。お部屋も清潔で、この料金でこの設備なら大満足です。接客も丁寧で安心できました。',
        score: '4.0',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '2262137d-7f70-4a8c-bda9-8246563ec485': {
    hotel_name: 'HOTEL THE MOON (HAYAMA HOTELS)',
    url: 'https://hayama-hotels.com/shop/h005/',
    description:
      '2024年8月リニューアル。「月」をデザインコンセプトにした幻想的な空間。博多・月隈ICすぐで空港の夜景も楽しめる好立地。全室にスマートTVを導入し、話題のSMルームも完備した大人の隠れ家リゾートです。',
    amenities: [
      'スマートTV',
      'VOD',
      'カラオケ (一部)',
      'SMルーム (一部)',
      'マッサージチェア (一部)',
      'ジェット/ブロアバス',
      '無料Wi-Fi',
      '無料フードサービス',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '平日 (4時間)', price: '¥4,900〜', time: '6:00〜24:00' }],
      宿泊: [{ title: '平日', price: '¥8,000〜', time: 'リニューアル限定プランあり' }],
    },
    reviews: [
      {
        title: 'リニューアルで綺麗',
        body: '月のモチーフがロマンチック。福岡空港の夜景が見える部屋もあり、非日常感があります。スマートTVでYouTubeも見れるし、清潔感も抜群でした。',
        score: '4.0',
        date: '2024-09',
      },
    ],
    manual_recovery: true,
  },
  'c10fc7b3-dd38-46c3-91d4-17c2a1c120b1': {
    hotel_name: 'HOTEL 凛 (HAYAMA HOTELS)',
    url: 'https://rinhakata.jp/',
    description:
      '天神・中洲徒歩5分。和モダンを基調とした落ち着いた大人の空間。喧騒を忘れる「隠れ家」として、全室にジェットバス、VOD、最新ブルーレイプレイヤーを完備。宿泊者には無料の本格朝食サービスも提供しています。',
    amenities: [
      '和モダン客室',
      'ジェット/ブロアバス',
      'VOD',
      '無料朝食 (宿泊者)',
      '無料ドリンクバー',
      '最新美容家電',
      '無料Wi-Fi',
      'ブルーレイプレイヤー',
      'ブラックライト (一部)',
    ],
    prices: {
      宿泊: [{ title: '平日・日曜', price: '¥8,980〜', time: '20:00〜翌12:00' }],
      休憩: [{ title: '目安', price: '¥4,000〜', time: '中洲観光に便利' }],
    },
    reviews: [
      {
        title: '中洲の隠れ家',
        body: '中洲で飲んだ後にすぐ行ける場所なのに、中はとても静かで和の雰囲気に癒されます。無料の朝食が本格的で美味しく、接客も良かったです。',
        score: '4.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '50b9a42f-2438-4a30-be9c-0e829f6fb902': {
    hotel_name: 'HOTEL CUE 厚木',
    url: 'https://hotenavi.com/cue-a/',
    description:
      '厚木ICから5分。「上質な休息」をテーマにしたデザイナーズホテル。全室に830タイトルのVOD、空気清浄機、キングサイズベッドを完備。一部客室にはサウナやマッサージチェア、ウォーターサーバーもあり、高い清潔感が支持されています。',
    amenities: [
      'キングサイズベッド',
      'VOD(830タイトル)',
      'サウナ(506号室)',
      'マッサージチェア(一部)',
      '浴室TV',
      'ウォーターサーバー(一部)',
      'ナノケア美容家電(一部)',
      '無料Wi-Fi',
      '駐車場27台',
    ],
    prices: {
      休憩: [{ title: '平日 (2時間)', price: '¥2,040〜', time: '5:00〜24:00' }],
      宿泊: [{ title: '月〜木曜', price: '¥7,000〜', time: '15:00〜翌12:00' }],
    },
    reviews: [
      {
        title: '清潔で高級感がある',
        body: '内装がとても綺麗で、タオルの質も高いです。インターから近くて便利。2,000円台から休憩できるのに、お部屋のクオリティはそれ以上でした。',
        score: '4.0',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'c8e8cdde-8fc4-4434-98e8-53c07c6bf916': {
    hotel_name: 'ホテル コンサートの森',
    url: 'https://p-hotels.net/concert/',
    description:
      '森の中に佇むフレンチシックなコテージホテル。鳥栖ICから10分。全室独立したコテージタイプで、プライバシーを重視。噴水のあるガーデンや四季折々の自然に囲まれ、アットホームで心安らぐひとときを提供します。',
    amenities: [
      '独立コテージ',
      'ガーデンビュー浴槽',
      'ウェルカムドリンク',
      '無料Wi-Fi',
      'VOD',
      'プライベート駐車場',
      '非対面チェックイン対応',
      'アメニティ一式',
    ],
    prices: {
      休憩: [{ title: '平日 (12時間)', price: '¥4,350〜', time: 'ロングサービスタイム' }],
      宿泊: [{ title: '目安', price: '¥7,000〜', time: 'コテージ1棟料金' }],
    },
    reviews: [
      {
        title: '森の中の別荘',
        body: 'コテージなので隣を気にせずリラックスできました。お風呂からの景色も良く、自然の中で非日常を味わえます。鳥栖プレミアムアウトレットからも近くて便利。',
        score: '4.1',
        date: '2024-03',
      },
    ],
    manual_recovery: true,
  },
  '4bed63db-3e98-421c-b19b-03ce6b82f830': {
    hotel_name: 'HOTEL MUZE (飯塚)',
    url: 'https://stay-lovely.jp/hotels/1511',
    description:
      '2018年浴室フルリニューアル。アラビアンテイストなロビーを抜けると、50インチ大型TVや最新VOD、Wi-Fi完備の快適な客室が広がります。勝盛公園の緑に隣接し、女子会プランやお泊りビールサービスなども充実。',
    amenities: [
      '50インチ以上大型TV',
      'VOD(700タイトル)',
      '浴室リニューアル済',
      '無料Wi-Fi',
      '電子レンジ',
      '美容家電レンタル',
      'モーニング無料(メンバー)',
      '宿泊限定ビールサービス',
      'ハイルーフ駐車場',
    ],
    prices: {
      休憩: [{ title: '目安', price: '¥3,500〜', time: 'クーポン利用可' }],
      宿泊: [{ title: '平日', price: '¥6,000〜', time: '16:00〜翌12:00' }],
    },
    reviews: [
      {
        title: 'お風呂が綺麗で広い',
        body: '浴室がリニューアルされていて、とても清潔で快適でした。大型テレビで映画も見放題。公園の隣で静かだし、飯塚で一番お気に入りのホテルです。',
        score: '4.0',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '475dbdd2-561c-42e1-9311-cd8d6e710975': {
    hotel_name: 'ホテルクロス V・I・P (久留米)',
    url: 'https://slp-hotels.com/vip/',
    description:
      '久留米ICから2分。全室リニューアル済。Refa・ミラブルなどの最新美容家電や、話題のマイクロブロアバスを導入。SMルームやカラオケルーム、本格的な生姜焼き定食が自慢のルームサービスなど、遊びと癒しのバランスが絶妙です。',
    amenities: [
      'Refa/ミラブル美容家電(全室)',
      'マイクロブロアバス(一部)',
      'SMルーム(一部)',
      'カラオケルーム(一部)',
      'VOD/大型TV',
      'Chromecast',
      'ウェルカムビール/ドリンク',
      '100円朝食(追加料金)',
      'QR決済対応',
    ],
    prices: {
      休憩: [{ title: '平日 (3時間)', price: '¥3,200〜', time: 'サービス料金' }],
      宿泊: [{ title: '日〜木曜', price: '¥6,500〜', time: '20:00〜翌12:00' }],
    },
    reviews: [
      {
        title: '食事が驚くほど美味しい',
        body: '評判の生姜焼き定食を食べましたが、定食屋レベルで美味しかった！Refaのシャワーヘッドやドライヤーがあるのも嬉しい。ICからすぐでアクセスも最高です。',
        score: '3.1',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '4b094250-dc4a-4a12-9ef8-8e125ef7e5cb': {
    hotel_name: 'HOTEL ZAFIRO RESORT 横浜',
    url: 'https://nissingroup.co.jp/hotel_zafiro/',
    description:
      '横浜駅徒歩5分。「大人のための上質なプライベートリゾート」がコンセプト。50インチ以上の大画面TV、一部客室には露天風呂やミストサウナ、ウォーターサーバーを完備。スタイリッシュで未来的なデザインが、特別なデートを演出します。',
    amenities: [
      '露天風呂(一部)',
      'ミストサウナ(一部)',
      '大型50型TV/VOD',
      'ウォーターサーバー(一部)',
      '浴室TV',
      'レインボーバス',
      '無料Wi-Fi',
      'アメニティ充実',
      '駐車場完備(EV充電可)',
    ],
    prices: {
      休憩: [{ title: '月〜金 (3時間)', price: '¥5,000〜', time: '深夜2時まで' }],
      宿泊: [{ title: '日〜木・祝', price: '¥8,000〜', time: '最大18時間滞在プランあり' }],
    },
    reviews: [
      {
        title: '横浜駅近で一番綺麗',
        body: '内装がとにかくお洒落で未来的。露天風呂がある部屋に泊まりましたが、都会の真ん中で解放感を味わえました。アメニティの質も非常に高く、コスパ最高です。',
        score: '4.5',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  'de346ccd-07fc-4e57-83cf-ced7fab6fab9': {
    hotel_name: 'Think・Hotel・Think 海老名',
    url: 'https://couples.jp/hotel-details/1344',
    description:
      '2016年オープン。青く光る幻想的な外観が目印のデザイナーズホテル。全室に65インチ超大型TV、Netflix、YouTube対応。水中照明付ブロアバスや高級ベッドを完備し、ロビーでは無料ドリンクサービスも提供しています。',
    amenities: [
      '65インチ超大型TV',
      'Chromecast/Netflix/YouTube',
      '水中照明付ブロアバス',
      '低反発ポケットコイルベッド',
      '浴室TV',
      'VOD',
      '無料Wi-Fi',
      '無料ドリンクバー(ロビー)',
      'マッサージチェア(一部)',
    ],
    prices: {
      休憩: [{ title: '目安 (5時間制あり)', price: '¥3,900〜', time: '24時間' }],
      宿泊: [{ title: '平日目安', price: '¥6,500〜', time: '2名1室料金' }],
    },
    reviews: [
      {
        title: 'テレビが巨大！',
        body: '65インチのテレビで映画を見るのが最高。お風呂も広くてライトが綺麗でした。ロビーで無料の飲み物がいただけるし、お部屋も清潔で大満足です。',
        score: '4.1',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  '17be51e3-4267-4998-8b32-306949391c80': {
    hotel_name: 'HOTEL VICTORIA RESORT 茅ヶ崎',
    url: 'https://hotel-victoriacourt.com/chigasaki/',
    description:
      'サザンビーチ徒歩1分。湘南最大級の豪華設備。スーペリアスイートには露天風呂やサウナ、100インチスクリーン、ワイド3Mベッドを完備。潮風を感じながら、最高級のリゾート体験を茅ヶ崎の特等席で。',
    amenities: [
      '露天風呂(一部)',
      'ドライサウナ(一部)',
      '100インチスクリーン(一部)',
      '3Mワイドベッド(スイート)',
      'レインボーバス',
      'VOD/大型TV',
      '最新美容家電(Refa等)',
      '無料Wi-Fi',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '平日(4時間)', price: '¥3,900〜', time: '湘南リゾート価格' }],
      宿泊: [{ title: '平日', price: '¥5,900〜', time: 'スイートは¥9,900〜' }],
    },
    reviews: [
      {
        title: '湘南の最高級リゾート',
        body: '海からすぐの最高な立地。サウナ付きのスイートに泊まりましたが、設備の豪華さがすごいです。清潔感もあり、アメニティも完璧。まさに湘南の王道ホテルです。',
        score: '4.3',
        date: '2024-06',
      },
    ],
    manual_recovery: true,
  },
  '092d45be-75e2-45cb-8b48-5b4d8e8d396d': {
    hotel_name: 'EXECUTIVE HOTEL GRAND GARDEN (横浜)',
    url: 'https://hotels-reserve.jp/hotel/2353/',
    description:
      '石川町駅徒歩2分。階ごとにコンセプトの異なるラグジュアリー空間。シーリー製ベッドやウォーターベッド、一部客室にはサウナやジャグジーを完備。Netflix対応のGoogle TVや豊富なアメニティで、充実のホテルステイを。',
    amenities: [
      'シーリー製ベッド/ウォーターベッド',
      'ジャグジー/サウナ(一部)',
      'Google TV/Netflix対応',
      'カラオケ',
      'VOD',
      'Bluetoothスピーカー',
      '無料Wi-Fi',
      'バリアフリー対応',
      '荷物預かりサービス',
    ],
    prices: {
      休憩: [{ title: '最安目安', price: '¥2,500〜', time: 'ショートタイム料金等' }],
      宿泊: [{ title: '平日', price: '¥7,560〜', time: '宿泊予約プランあり' }],
    },
    reviews: [
      {
        title: '接客と設備が良い',
        body: '石川町駅からすぐでアクセス抜群。受付の方の対応がとても丁寧でした。アメニティがこれ以上ないほど揃っていて、手ぶらで全く問題ありません。お風呂も大きくて快適でした。',
        score: '7.3',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '0a4232dd-a459-4489-9f60-0bf020538713': {
    hotel_name: 'HOTEL IRIS (藤沢)',
    url: 'https://stay-lovely.jp/hotels/1360',
    description:
      '藤沢駅徒歩5分。江ノ島観光の拠点に最適。全室に65型TV、YouTube対応Chromecast、カラオケDAMを完備。円形露天ジャグジーやスチームサウナを備えた開放的な客室もあり、藤沢エリア屈指の充実した設備を誇ります。',
    amenities: [
      '65型TV/Chromecast',
      'カラオケDAM',
      '円形露天ジャグジー(一部)',
      'スチームサウナ(一部)',
      '浴室TV',
      'スチーム美容家電',
      '無料Wi-Fi',
      '無料フード/ドリンク',
      '駐車場完備(19台)',
    ],
    prices: {
      休憩: [{ title: '平日(3時間)', price: '¥5,500〜', time: '6:00〜翌1:00' }],
      宿泊: [{ title: '月〜木曜', price: '¥8,200〜', time: '18:00〜翌11:00' }],
    },
    reviews: [
      {
        title: '露天ジャグジーが最高',
        body: '藤沢駅近で露天風呂に入れるなんて最高です。65インチの巨大テレビでYouTubeも映画も楽しめました。スチームサウナも本格的でリフレッシュできました。',
        score: '4.3',
        date: '2024-05',
      },
    ],
    manual_recovery: true,
  },
  'c1710432-a1ea-4b9f-9caa-55126b6d7e78': {
    hotel_name: 'ホテル ポニー (淵野辺)',
    url: 'https://ssh-hotel-group.com/hotel_details/pony/',
    description:
      '淵野辺駅徒歩3分。24時間アルコール・ドリンク飲み放題サービスが話題。全室Chromecast完備で、動画配信サービスを大画面で楽しめます。リーズナブルな料金設定ながら、清潔感とおもてなしの心でリピーターの多い人気店です。',
    amenities: [
      '24時間ドリンクバー(アルコール込)',
      'Chromecast (全室)',
      'シネマチャンネル無料',
      '無料Wi-Fi',
      'サウナ(一部)',
      'ハイルーフ駐車場',
      'ビジネス利用可',
      'PayPay決済対応',
      'コスチュームレンタル',
    ],
    prices: {
      休憩: [{ title: '平日最安', price: '¥3,960〜', time: '目安' }],
      宿泊: [{ title: '平日メンバー', price: '¥6,490', time: '一律料金設定' }],
    },
    reviews: [
      {
        title: '24時間飲み放題が凄い',
        body: 'ロビーのドリンクバーがアルコールも含めて飲み放題なのは衝撃です。お部屋でYouTubeも見れるし、この安さでこのサービスは他にはないと思います。',
        score: '3.3',
        date: '2024-04',
      },
    ],
    manual_recovery: true,
  },
  '59f3f316-f489-4c92-8629-70fb00a2b5b1': {
    hotel_name: 'HOTEL GRAN. 相模原店',
    url: 'https://stay-lovely.jp/hotels/1183',
    description:
      '2025年2月リニューアルオープン！圏央道相模原ICすぐ。フィンランドサウナや露天風呂、最新のRefa美容家電を導入。「手ぶらでリゾート体験」をコンセプトに、地域最多のVODタイトルと最新設備、極上のルームサービスを提供します。',
    amenities: [
      'フィンランドサウナ(一部)',
      '露天風呂(一部)',
      'Refa美容家電(全11機種)',
      'Chromecast (全室)',
      '1000タイトル以上VOD',
      'テレワーク用デスク(一部)',
      'バリアフリー対応',
      '無料Wi-Fi',
      '駐車場完備',
    ],
    prices: {
      休憩: [{ title: '最安', price: '¥2,900〜', time: 'リニューアル限定料金' }],
      宿泊: [{ title: '目安', price: '¥7,500〜', time: 'ベストレート保証' }],
    },
    reviews: [
      {
        title: '最新設備が素晴らしい',
        body: 'リニューアルしたばかりで全てがピカピカ。フィンランドサウナ付きの部屋は本当に最高でした。Refaのドライヤーやアイロンも自由に使えて、女子にはたまらないホテルです。',
        score: '4.6',
        date: '2025-02',
      },
    ],
    manual_recovery: true,
  },
};

const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
Object.assign(jsonContent, batch9Data);
fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
console.log('Successfully updated 15 hotels (Batch 9) in JSON.');
