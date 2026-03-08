const fs = require('fs');
const path = require('path');

function updateMultipleHotelFacts(updates) {
  const csvPath = path.join(process.cwd(), 'data', 'hotels_enriched_data.csv');
  if (!fs.existsSync(csvPath)) return;

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const header = lines[0];

  const robustParseCsvLine = (line) => {
    const parts = [];
    let part = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          part += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          part += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          parts.push(part);
          part = '';
        } else {
          part += char;
        }
      }
    }
    parts.push(part);
    return parts;
  };

  const formatCsvField = (field) => {
    if (field === null || field === undefined) return '""';
    return `"${String(field).replace(/"/g, '""')}"`;
  };

  const updatedLines = lines
    .slice(1)
    .map((line) => {
      if (!line.trim()) return '';
      const parts = robustParseCsvLine(line);
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
  // --- Batch 76: Optimal Accuracy/Volume Trade-offs ---
  'ef576f3d-edeb-4d95-80e2-297dde43d3fd': {
    // Vogue 川越
    amenities: 'ガレージイン形式, コスプレ充実, SMオプション(一部), 広い浴室と客室',
    reviews:
      '【評判】川越。ガレージインで完全プライベート重視。広い部屋とユニークなオプション設備があり、ディープな楽しみ方ができると高く評価されている。',
  },
  'af08c915-375e-4cfe-ace5-02eb04f0052f': {
    // JOEL 戸田
    amenities: 'タッチパネル部屋選択, マッサージチェア/サウナ(一部), 通信カラオケ, 浴室テレビ',
    reviews:
      '【評判】戸田。非対面のタッチパネル操作がスムーズ。広めの浴室やサウナ完備の客室があり、清潔な環境で快適なホテルステイが楽しめる。',
  },
  '3408d484-e3a2-4506-a21c-f37a874d707b': {
    // アリア 千葉
    amenities:
      '岩盤浴＆スカイビュー(1002号室), レインボーバス, 無料ランチ/ディナー(指定時), 防音対策済',
    reviews:
      '【評判】千葉。1002号室の岩盤浴とスカイビューが圧倒的。無料の食事や充実したアメニティなど至れり尽くせりのサービスが非常に好評。',
  },
  'a8aaeb7a-c49b-4f95-807c-9cbecb6f99ad': {
    // COCO 沼南
    amenities: '100種のレンタルシャンプー, 4種のアロマ加湿器, 無料モーニング(平日), 全室VOD完備',
    reviews:
      '【評判】柏/沼南。100種のシャンプーバーにアロマ加湿器など「香り」にこだわるサービスが秀逸。平日の無料モーニングなども相まってコスパが良い。',
  },
  'dfa586e2-bf09-47f6-8015-76981b977618': {
    // シップスアーバンリゾート 船橋
    amenities: 'ReFaカールアイロン導入, 各種充実した貸出品, VOD見放題, アメニティ豊富',
    reviews:
      '【評判】船橋。ReFaなどの高級美容家電のレンタルが強化されており女性ウケ抜群。接客サービスの良さも含めてエリア内で安定した人気。',
  },
  '72aa1196-0363-49cd-94b6-d9c43c882c7b': {
    // クリスタルゲート 木更津
    amenities: '無料サービス充実, マッサージチェア(一部), Chromecast導入(一部), 豪華な内装',
    reviews:
      '【評判】木更津。部屋が広く高級感のある内装で、Chromecastなど現代のニーズにもしっかり対応。木更津エリアでのデート利用に鉄板の選択肢。',
  },
  '99e1dbeb-f945-4bdc-8e3a-5c7db3340dfd': {
    // ファーストウッド 勝田台
    amenities: '駅から徒歩2分, 42インチ以上大型TV(一部), レンタルシャンプー, 豊富なアメニティ',
    reviews:
      '【評判】勝田台。駅から徒歩2分の素晴らしい立地。清潔感があり基本的なアメニティも十分に揃っているため、急な宿泊やショートタイムに重宝する。',
  },
  'd73b61d5-bd9b-418e-ac14-d33bd7718ee0': {
    // オスカー 新松戸
    amenities:
      '55インチ大型TV全室, ReFaシリーズ(シャワー/ドライヤー等)使い放題, 浴室レインボー風呂全室',
    reviews:
      '【評判】新松戸。全室にReFaの美容家電やレインボーバスを導入し、コスパと美容を極限まで高めた。女子会プランでも選ばれるエリア屈指の大人気店。',
  },
  '68114303-1c88-4415-8d47-6f5b1f42f04e': {
    // ツバキ 柏
    amenities: '約100種無料シャンプーバー, 無料コスプレルーム, 広い客室ソファー, 各種アメニティ',
    reviews:
      '【評判】柏。広々としたソファーベッドや、100種類から選べる巨大なシャンプーバーが圧巻。コストパフォーマンスの高さでリピーターを生み出し続けている。',
  },
  '85dc2cef-d5d2-446d-bd11-dde7d458e69f': {
    // トライアングル 八街
    amenities: '1部屋ごとに異なるテーマ内装, プロジェクター/Chromecast(一部), 全室均一料金',
    reviews:
      '【評判】八街。バリやローマなど部屋ごとに全く異なるテーマが設定されており、何度行っても飽きない。全室均一料金の明朗会計も高く支持されている。',
  },
  '9c460f4d-02f3-48b1-a437-5f37e5e793d3': {
    // ウィルスイート 八街
    amenities: '強力なメンバー割引, カラオケ/DVD完備, セレクトシャンプー, 充実のコスプレ',
    reviews:
      '【評判】八街。無駄を省いたコンパクトな空間ながら必要十分な設備が揃う。メンバー登録すれば格安で利用でき、お財布に優しい点が人気の理由。',
  },
  '16705b54-3080-4c05-a88d-c1e42e963801': {
    // ホテル ミュウ 新松戸
    amenities: '65型大型TV, 5.1chサラウンド, ReFaシリーズ使い放題, R301/R401限定ドライサウナ',
    reviews:
      '【評判】新松戸。駅徒歩2分の非日常リゾート。ReFa使い放題や本格ドライサウナ完備など、設備面での満足度が群を抜いているプレミアムなホテル。',
  },
  '851d36a2-6272-4118-bc54-b8df7817026e': {
    // アモーレ 四街道
    amenities: 'VOD(900タイトル)全室, レインボーバス/マッサージチェア(一部), 圧倒的な貸出品数',
    reviews:
      '【評判】四街道。閑静な住宅街に佇む静かなロケーション。枕やズボンプレッサーなど驚異的な貸出品の数々で、かゆいところに手が届くサービスが光る。',
  },
  'bf045d3a-a9e1-4f60-b25c-08002924c4db': {
    // アイズベイサイド 船橋
    amenities: 'ドライサウナ5部屋完備, 無料モーニング＆ドリンク, 各種交通系IC/スマホ決済対応',
    reviews:
      '【評判】船橋。サウナ好きには堪らない本格ドライサウナ完備の優良店。電子決済への柔軟な対応や無料モーニングなど、現代的でスマートな運営が人気。',
  },
  '1ec25248-7126-4ccb-ba6b-b4abb47d4b4d': {
    // 十色 千葉
    amenities: '完全ガレージイン型, コンビニ冷蔵庫, アダルトグッズ販売, 広々ジェットバス',
    reviews:
      '【評判】千葉/祐光。ネット上の各種項目で「5点満点」を叩き出すモンスターホテル。誰にも会わない動線と清潔な室内で、絶対の安心感を提供している。',
  },
  '279c2430-de11-41bd-922c-7f333848e515': {
    // ラブワン 茂原
    amenities: 'マイル割引システム, 広々とした駐車スペース, リラックスできる清潔な客室',
    reviews:
      '【評判】茂原。知る人ぞ知る茂原の良質ホテル。清掃が徹底されており、独自のマイル割引システムによりリピートするほどお得に快適なステイが可能。',
  },
  '3fd8415f-207f-4bac-b430-e3b801f790c3': {
    // カリビアン 宮野木
    amenities: '広々とした露天風呂, 客室内にTV2台完備(ソファ側/ベッド側), 岩盤浴完備(一部)',
    reviews:
      '【評判】千葉/宮野木。バルコニーに設置された広い露天風呂が最大のウリ。部屋にTVが2台ある贅沢な作りで、リゾート感たっぷりの癒しの時間が過ごせる。',
  },
  '5ea12267-68af-444a-affb-945ffe8407ec': {
    // ニューコロン 東金
    amenities: '小窓からの料金受け渡し, レトロな昭和風内装, 圧倒的な低価格設定, 一人利用可',
    reviews:
      '【評判】東金。今となっては貴重な「THE昭和」の雰囲気を色濃く残す激渋レトロホテル。とにかく料金が安く、独自のディープな雰囲気を愛する層から根強い支持。',
  },
};

updateMultipleHotelFacts(updates);
