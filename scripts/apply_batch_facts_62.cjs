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
  // --- Batch 62: Kanto & Kansai "Modern & Resort" Facts ---
  'f09877b5-9b0c-45ac-97a0-ac7cb36c844e': {
    // デザインホテル マホーラ摂津 (大阪)
    amenities:
      '4KインターネットTV, JOYSOUND f1カラオケ, ミラブルシャワー, 最新VOD, オーダーバイキング',
    reviews:
      '【評判】大阪摂津。2021年開業の最新設備が自慢。全ての部屋で4Kテレビやミラブルシャワーが使え、無料のオーダーバイキングなど「至れり尽くせり」な一軒。',
  },
  '40aa5ee9-f9bc-4f1c-8dbc-befb5500fd96': {
    // ホテルバリアンリゾート東名川崎I.C店
    amenities:
      'スチームサウナ, 貸切露天風呂, 岩盤浴, ダーツ/パターゴルフ, 庭園テラス, 毎日無料スイーツ',
    reviews:
      '【評判】川崎。高速ICからすぐの本格バリ風リゾート。岩盤浴や足湯、豊富な無料アメニティにスイーツまで、「手ぶらでバカンス」が叶う最高級のホスピタリティ。',
  },
  '6bdba063-d01f-4737-adb5-7a86ee95edd1': {
    // HOTEL ZEN RIKYU 横浜羽沢
    amenities: '無料本格朝食, スパバス, 24hフロント, アイロン/ヘアアイロン完備, 広い客室',
    reviews:
      '【評判】横浜。とにかく「朝食が美味しい」と宿泊者から絶賛の声。部屋の広さと清潔感も抜群で、スタッフの丁寧な接客が安心感を与えてくれる安定の優良店。',
  },
  '175ea908-64da-4def-a37f-4ae3cd3b3593': {
    // HOTEL 現代楽園 伊勢原店
    amenities: 'コテージ風ルーム, ペット同伴可, ハイキングトレイル、ウェルカムドリンク, 深めの浴槽',
    reviews:
      '【評判】伊勢原。静かな環境で別荘のように過ごせるコテージスタイル。ペットと一緒に泊まれる貴重な空間で、スタッフの細やかな心遣いが光るリゾートホテル。',
  },
  'b797aded-3bf2-41fe-b660-6d6e65091770': {
    // 江の島 ホテル ノアリゾート
    amenities:
      'オーシャンビュー、ダイソン製品レンタル、天蓋ベッド, 岩盤浴(一部), 貸出用高級ドライヤー',
    reviews:
      '【評判】江の島。海が見える部屋からの眺望が最高。ダイソンのドライヤーレンタルなど美容への拘りが強く、湘南の海風を感じながら贅沢な時間を過ごせる。',
  },
  '3c4ba0ec-eebd-4e52-9f5b-c8b0d6250a73': {
    // ホテル ファインガーデン甲西
    amenities: 'ミラブルzero, 75インチ大型TV, スチームサウナ, YouTube対応, 清潔感抜群',
    reviews:
      '【評判】滋賀。最新のミラブルzeroや超大型テレビを完備。全室にスチームサウナがあり、清潔感と設備の充実度でエリア最高レベルの評価を得ている。',
  },
  'b7edea97-d16e-4549-aee8-3b4a907ff36e': {
    // WATER HOTEL NOA (深谷)
    amenities: 'マイナスイオンバス, シルキーバス, 本格サウナ, 岩盤浴, 無料朝食',
    reviews:
      '【評判】深谷。リニューアルされた客室は清潔で設備も最新。炭酸泉のようなシルキーバスや岩盤浴など、癒しの設備が揃っており無料朝食の満足度も高い。',
  },
  '799b7ed1-c547-46fa-be89-9638f43a58ec': {
    // ホテル ロダン (渋谷)
    amenities: '渋谷駅近、大型TV(HDMI接続可), ポップデザインルーム, 豊富なアメニティ',
    reviews:
      '【評判】渋谷。駅近ながら静かで部屋が広く、ベッドやお風呂のゆとりが魅力。スマホ接続で動画を楽しめる最新設備もあり、渋谷観光の拠点として非常に優秀。',
  },
  'c671fdf2-3dc3-42dc-a2c3-fb8c82535be0': {
    // 隠家(ajito) HOTEL 555 小田原店
    amenities: '隠れ家風デザイナーズ, 湯沸かしポット/お茶セット, 衛星放送(無料), 清潔感重視',
    reviews:
      '【評判】小田原。デザイン性が高く落ち着いた「大人の隠れ家」。アメニティの充実度が高く、清潔な空間でゆっくりと二人の時間を過ごせると高い支持。',
  },
  '0b05f8a1-c7a1-4a3b-89fb-37ff8ff4a8f9': {
    // ホテル グランバリ リゾート 川崎
    amenities: 'シモンズ製ベッド, 手作り朝食, 24hフロント, 川崎駅至近, スナックバー',
    reviews:
      '【評判】川崎。シモンズのベッドで快適な睡眠が約束される。手作りの朝食が非常に好評で、駅近の好立地も含め、ビジネスからプライベートまで幅広く活躍。',
  },
};

updateMultipleHotelFacts(updates);
