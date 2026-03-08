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
  // --- Batch 43: Tohoku (Akita, Yamagata, Fukushima) Precision Enrichment ---
  '8fb8491a-f23a-4791-b955-1c85a23e64f0': {
    // HOTEL SOLUNA (潟上)
    amenities: 'VOD全室無料, 水中照明ブロアバス, 浴室TV, ハンディマッサージャー, 40-50インチ液晶TV',
    reviews:
      '【評判】潟上。VODや水中照明付きのブロアバスを全室に完備。一部の部屋には50インチの大型TVもあり、映像とバスタイムの質が非常に高い。',
  },
  '3e510ecb-4d3a-4fc8-aeea-336101362fd2': {
    // ホテル メイプル (大館)
    amenities:
      '本格サウナ(ドライ/ミスト), 岩盤浴, 露天風呂, 日焼けマシン, 天蓋ベッド, ウォーターサーバー',
    reviews:
      '【評判】大館。サウナ、岩盤浴、露天風呂まで揃う、北秋田屈指のスパ設備。天蓋ベッドや日焼けマシンなど、遊び心のある設備も満載。',
  },
  '88b387f4-2840-48e9-8475-c18b9535c5c6': {
    // ホテル 六甲 (秋田市)
    amenities: 'レインボーバス(一部), ブラックライト(一部), ルームサービス, 持ち込みDVDデッキ',
    reviews:
      '【評判】秋田。レインボーバスやブラックライト演出など、幻想的な空間作りが特徴。基本設備がしっかりしており、手軽に非日常を味わえる。',
  },
  '1a431f49-28d1-4812-9336-98959183ab84': {
    // HOTEL MON-CHERI (浦添)
    amenities:
      '全室レインボーバス, TVアプリ(Netflix/YouTube等), ミストサウナ(一部), エスプレッソマシン',
    reviews:
      '【評判】浦添。全室にレインボーバスとスマートTVを完備。Netflix等の動画配信も楽しめ、コーヒーマシン等の無料飲料も充実した現代的ホテル。',
  },
  '9e78e822-415b-4af4-a460-ab9017b1a87e': {
    // ホテル ドルフィンイマージュ (秋田)
    amenities: '65インチ4K液晶TV(一部), Chromecast全室, 浴室TV, ブルーレイプレーヤー',
    reviews:
      '【評判】秋田。最大65インチの巨大4KテレビとChromecastを完備。浴室テレビもあり、動画コンテンツを最高の環境で楽しみたい層に最適。',
  },
  '13010d8d-c075-4169-a0fc-9abdd919393b': {
    // HOTEL YOUME TSUKASA (八女)
    amenities:
      '5.1chサラウンドシステム, プロジェクター(一部), カラオケ, セレクトシャンプーレンタル',
    reviews:
      '【評判】八女。5.1chサラウンドによる映画館並みの音響体験が自慢。一部の部屋にはプロジェクターもあり、シアター気分で贅沢に過ごせる。',
  },
  'ffc58b70-a9ed-435c-a17b-cd325fe81283': {
    // ホテル ドルフィア (大仙)
    amenities: '本格SMルーム(一部), ハンディマッサージャー全室, 42インチ以上大型VOD',
    reviews:
      '【評判】大仙。シンプルで清潔な客室の中、一部の部屋には本格的なSM設備を備える。全室にハンディマッサージャーがあり、実利重視の設計。',
  },
  '7bf7109b-f82c-4a19-ad75-b9a98091493a': {
    // ホテル エリーゼマキシム・テラス (上山)
    amenities: 'マッサージチェア(テラス棟), 美容品レンタル, 宿泊者無料ドリンク, 浴室TV',
    reviews:
      '【評判】上山。広々としたジェットバスと、充実の美容品レンタルが女性に好評。宿泊者には無料ドリンクの特典もあり、温泉街近くの癒やしスポット。',
  },
  '1a71f77e-0591-4883-9dce-fce76b5a6d4d': {
    // SEAGULL HOTEL (三原)
    amenities: '全室Wi-Fi完備, ズボンプレッサー貸出, 個別空調, ランドリーサービス',
    reviews:
      '【評判】三原。ビジネスホテルのような利便性と、プライバシーを兼ね備えた一軒。清潔な客室とWi-Fi環境で、休憩から仕事、宿泊まで幅広く対応。',
  },
  '54d7fb31-a18a-4379-9b8c-6ec16a6b6f18': {
    // ホテル フェスタ 伊勢崎
    amenities: '露天風呂(一部), レインボーバス(一部), 自慢の手作り和洋食, 客室インターネット',
    reviews:
      '【評判】伊勢崎。一部の部屋に設けられた露天風呂が開放感抜群。手作りの充実した食事メニューが人気で、グルメな宿泊者からも支持。',
  },
  'd75e88c6-319e-4ce3-9e7a-abee51c6ef02': {
    // ホテル角館
    amenities: '40インチTV全室, 加湿空気清浄機, 貸自転車, 全室Wi-Fi, スキー乾燥室(冬季)',
    reviews:
      '【評判】仙北。観光拠点に最適なスタイリッシュな町家風。全室に加湿空気清浄機を完備し、季節によってはスキー乾燥室も利用できる機能的な店。',
  },
  '64b767e0-71f2-4061-8819-58a1e8b9e777': {
    // フォンタナと森のコテージ 未来予想図
    amenities: '個別BBQテラス, プライベート庭園, レインボーバス, スケベイス, バスローブ',
    reviews:
      '【評判】能代。全室コテージのプライベート空間。個別の庭でBBQが楽しめ、室内にはレインボーバスや特殊設備も揃う、大人のキャンプ気分。',
  },
  '5f49d7fc-808c-4d84-bf00-4a33136326b5': {
    // HOTEL Hokuto (尾花沢)
    amenities: 'スチームサウナ(一部), 有線放送全室, 42インチ以上TV(一部), コスプレレンタル',
    reviews:
      '【評判】尾花沢。充実した有線放送とスチームサウナで、自分だけの時間を満喫。42インチ以上の大型TVを備えた部屋もあり、設備投資に積極的。',
  },
  'c9854172-aba4-426a-b47a-03f762ffded3': {
    // ホテル エリーゼ13 (遊佐)
    amenities: '50インチTV全室, 浴室TV完備, Wi-Fi中継器増強, マッサージチェア(一部)',
    reviews:
      '【評判】遊佐。Wi-Fi環境が強化されており、動画視聴も快適。全室に浴室TVと50インチの大画面TVがあり、室内でゆったり寛げる優良店。',
  },
  '03a86eec-d699-482f-bf5b-1dc0dd7264fb': {
    // ホテル  オークス (館林)
    amenities: 'パチスロ実機全室, レインボーバス(一部), 通信カラオケ, マイナスイオンドライヤー',
    reviews:
      '【評判】館林。全室にパチスロ実機を設置した、好きな人には堪らない空間。マイナスイオンドライヤー完備など、基本アメニティも充実。',
  },
  '06d5f336-ed81-47f6-b73f-fb43101eff56': {
    // ホテル騎士 (山形)
    amenities: '2024年一部リニューアル, 全室フリーWi-Fi, 豊富なシャンプーレンタル',
    reviews:
      '【評判】山形。2024年のリニューアルにより、一部客室がさらに美しく。清潔な洗面台や進化した設備、豊富なシャンプーバーが嬉しい。',
  },
  '5de77bd5-8f5b-4ec4-8ed2-af4090fcd7b7': {
    // ホテルステラ (由利本荘)
    amenities: '露天風呂/サウナ(ドライ・ミスト), 浴室TV, プロジェクター, カラオケ',
    reviews:
      '【評判】由利本荘。由利本荘エリアきってのスパ設備。露天風呂や本格サウナに加え、プロジェクターも完備で贅沢な週末に最適。',
  },
  '2ceef527-4032-4317-bafe-f750ea79b3af': {
    // CHA.CHA 443 鶴岡店
    amenities: '無料洗濯機(洗剤付), ハート型風呂, 5.1chサラウンド, セパレートベッドルーム',
    reviews:
      '【評判】鶴岡。総合評価4.7。洗濯機無料開放という超実用的なサービスや、可愛いハート型の風呂など、独自のホスピタリティが光る。',
  },
  'a760a17b-50d3-482b-a9f9-7f7ce5c5deb8': {
    // ホテル フェアリーイレブン (郡山)
    amenities:
      '全室Refa製品完備, ドライサウナ/カラオケ(一部), スイートルーム露天風呂, アメニティバー',
    reviews:
      '【評判】郡山。全室にReFa製品を導入した最新鋭。一部のスイートには本格サウナや露天風呂、カラオケもあり、郡山トップクラスの完成度。',
  },
  '6667e05c-7c5f-4c8f-a750-7b4f65f96a1a': {
    // ホテル・ドキュー (会津若松)
    amenities: '露天風呂/天蓋ベッド(一部), 清潔感4.75の高評価, 充実のレンタルアメニティ',
    reviews:
      '【評判】会津若松。口コミ評価が非常に高く、特に清掃が行き届いた室内は快適そのもの。天蓋ベッドや露天風呂付きの部屋が特に人気。',
  },
  'b877e375-6926-4936-a22f-9bc838f2eec3': {
    // ホテル キャッスル (郡山)
    amenities: '郡山駅近徒歩5分, 外出OK, レインボーバス(一部), 42インチ以上TV',
    reviews:
      '【評判】郡山。駅近の好立地で外出も自由。最大42インチ超のテレビやレインボーバスを完備し、出張や観光の拠点として抜群の利便性。',
  },
  '6bfa37a2-86e3-4e47-83c3-dc73eeaa0fd1': {
    // HOTEL QiQ (郡山)
    amenities: 'ハイクオリティ清掃, プロフェッショナル管理, 最新VOD, 駐車場完備',
    reviews:
      '【評判】郡山。建物は落ち着きがあるが、管理と清掃が完璧と絶賛されている。清潔な空間で、静かに高品質な時間を過ごせるとリピーター増。',
  },
  'f2e1fa83-986b-490c-9bf4-8528aa82dc08': {
    // HOTEL TEN (南相馬)
    amenities: '本格手作りフードメニュー, レインボーバス, 強力水圧シャワー, オシャレな内装',
    reviews:
      '【評判】南相馬。総合評価5。手作りのフードが非常に美味しく、シャワーの水圧の強さなど、基本の質が極めて高い。センスの良い内装も魅力。',
  },
  'aeab0f78-f21a-4c1a-9308-aac1b7f9c90a': {
    // HOTEL SAZAN NUT's (白河)
    amenities: '充実の無料サービス, 全室Wi-Fi, 駐車場完備, 清潔重視のメンテナンス',
    reviews:
      '【評判】白河。サービス面での満足度が高く、スタッフの対応が丁寧と評判。清潔に保たれた客室が心地よく、白河インター近くでの宿泊に最適。',
  },
  'd7f39cee-6c32-4c5c-bde7-66b527c96a7c': {
    // ホテル ココナッツ (郡山)
    amenities: '大型ジェットバスxライト演出, 安心フレックス料金制, ガレージタイプ(一部直入可)',
    reviews:
      '【評判】郡山。広い浴槽でのライト演出が幻想的。自動精算やガレージからの直接入室など、プライバシーに配慮されたシステムで安心。',
  },
  '89ea0c6e-1439-467a-a0ae-c86256130070': {
    // HOTEL gara (白河)
    amenities: 'リニューアル済バスルーム, エアコン完備, 静かな住環境, 清潔なベッド',
    reviews:
      '【評判】白河。リニューアルされたバスルームが非常に綺麗で快適。周囲が静かな環境なので、二人でゆっくりと夜を過ごしたい時に最適。',
  },
};

updateMultipleHotelFacts(updates);
