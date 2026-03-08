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
  951: {
    // ホテルARIA横浜関内 (IDはCSV行番号ベースではなくID文字列であるべきだが、スクリプト構造上ここをID文字列にする)
    amenities:
      '最大6名利用可(701号室), クイーンサイズツインベッド, カラオケ高音響, 横浜スタジアム徒歩5分, 無料Wi-Fi',
    reviews:
      '【評判】関内。リニューアルで内装が非常に綺麗。大人数でのパーティ利用が可能で、カラオケの音響の良さと圧倒的な清潔感が20代に支持されている。',
  },
  '5ab871f9-9271-4817-be85-900f85c82914': {
    // ホテルARIA横浜関内
    amenities:
      '最大6名利用可(701号室), クイーンサイズツインベッド, カラオケ高音響, 横浜スタジアム徒歩5分',
    reviews:
      '【評判】関内。リニューアル済。大人数での利用に対応した広い客室と、驚くほど綺麗なバスルームが魅力。スタジアム至近でイベント後の利用にも最適。',
  },
  '605dcb8a-004b-401e-9d74-cdc8999f3e2e': {
    // HOTEL AKAIKUTSU
    amenities:
      '元町・中華街駅徒歩2分, 天蓋付きベッド(一部), キングサイズマットレス, 中華街至近好立地, ウェルカムドリンク',
    reviews:
      '【評判】山下町。横浜観光の拠点として最高。中華街のすぐ裏手にあり、天蓋付きベッドのある広い室内で、異国情緒あふれる贅沢な時間を過ごせる。',
  },
  'ba9e70d8-7a39-42c6-8903-dcf2697ebe3c': {
    // SALA (港北)
    amenities: '浴室TV, 31台大型駐車場, 高天井車対応, シアターバー音響, ボリューム自慢の朝食',
    reviews:
      '【評判】新横浜。広大な駐車場完備で車でのアクセスが抜群。音響にこだわったシアタールームと、朝からお腹いっぱいになれる豪華な朝食サービスが好評。',
  },
  'd07ebe9b-1ec7-45ea-9f21-96d258953eb1': {
    // HOTEL ZEN 横浜羽沢
    amenities:
      'ナノウォーター導入, レインボーブロアバス, 浴室TV, 50インチTV(サウンドバー付), 露天風呂/岩盤浴(一部)',
    reviews:
      '【評判】羽沢。ナノ水の効果でお肌がすべすべになると女性に好評。サウンドバー付きの大画面シアターや幻想的なブロアバスなど、スパ設備が非常に充実。',
  },
  '9abe148a-ed1b-47ef-aade-6eb279476cd0': {
    // Will Base 鶴見
    amenities:
      '全室ウォーターサーバー完備, キングサイズベッド, 部屋食モーニング, スパバス, 広い客室',
    reviews:
      '【評判】鶴見。とにかく「広くて清潔」との声多数。各室にウォーターサーバーがある利便性と、プライバシー重視の部屋食サービスが、カップルに安心感を与える。',
  },
  '73f6d8a9-4215-4232-9e52-fc1b2713beef': {
    // 歌舞伎町 SENSE 東京
    amenities:
      'ネオジャパネスクスタイル, 露天風呂(一部), レインボーバス, ペンネグラタン(人気メニュー), 深夜利用可',
    reviews:
      '【評判】歌舞伎町。和とモダンが融合した独創的な空間。充実のスパ設備に加え、レストラン顔負けの食事が美味。特にペンネグラタンはリピーターの定番。',
  },
  'd3813241-3cff-490a-84e3-75116947fce0': {
    // ホテル サティス 柏インター
    amenities:
      'コテージ形式, 自慢のカツカレー, ナノケア美容家電完備, 人工温泉, 露天風呂/ミストサウナ(一部)',
    reviews:
      '【評判】柏インター。人目を気にせず入れるコテージタイプ。ナノケア家電での美容ケアと、絶賛される「秘伝のカツカレー」を目当てに来るファンも多い。',
  },
  '2768a94a-3187-45e8-9d13-01493d7c78b0': {
    // パシオンリゾート (福島)
    amenities:
      '福島駅徒歩7分, ホットタブ完備, ルームサービス, ジェットバス(一部), 清潔なワードローブ',
    reviews:
      '【評判】福島。駅近で抜群のアクセス。リーズナブルながらジェットバスや広い室内が保たれており、ビジネスや観光の拠点として非常に使い勝手が良い。',
  },
  '5a911ede-be00-4a14-a4f1-19551f620b7b': {
    // W-BAGUS (歌舞伎町)
    amenities:
      'バリ風リゾート, 黄色いぞうのシンボル, 露天風呂, マッサージチェア(401), カラオケ採点イベント',
    reviews:
      '【評判】歌舞伎町。バリ風の異国情緒が漂う都会の隠れ家。広々とした内風呂と露天風呂に加え、マッサージチェア完備の部屋もあり、究極の癒やしが得られる。',
  },
  '72079912-8349-44f2-933a-ce37d7b691e0': {
    // IROHA 六本木
    amenities:
      'ヒルズ徒歩3分, 露天風呂(201/301/302), ドライサウナ(一部), エスプレッソマシン, 5.1chサラウンド',
    reviews:
      '【評判】六本木。超都心の最高級立地にありながら、露天風呂や本格サウナを楽しめる。シアター設備や抽出式のコーヒーなど、細部までワンランク上のこだわり。',
  },
};

updateMultipleHotelFacts(updates);
