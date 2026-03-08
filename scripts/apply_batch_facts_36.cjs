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
  // --- Batch 36: High-Density Metropolitan & Resort ---
  'e3209177-11cc-47f0-9e4d-5929038c585c': {
    // おもてなしのホテル もしピ (泉大津)
    amenities: '露天風呂, 岩盤浴, SMルーム完備, カラオケ/VOD全室, 無料Wi-Fi, 女子会プラン',
    reviews:
      '【評判】泉大津。リーズナブルながら露天風呂や岩盤浴、さらには本格的なSMルームまで備える多様性が魅力。女子会での利用も多く、清潔感と遊び心を両立。',
  },
  'e35e1e68-98fe-4690-9fd3-9d43f4ffb221': {
    // グランドカリビアン (所沢)
    amenities:
      '半露天風呂付き客室, 美容軟水人工温泉, キングベッド, 豊富な食事メニュー, 日替わりプレゼント',
    reviews:
      '【評判】所沢。リゾート感あふれる非日常空間。半露天風呂や美容軟水など、ラブホテルの枠を超えたクオリティ。「もうここしか利用できない」と絶賛される。',
  },
  '709e2527-dff5-4a2f-922e-e6d171949c65': {
    // ホテル クレア (蓮田)
    amenities:
      '50インチTV全室, ドトールモーニング無料, ジェットバス, 豊富な貸出品, バリアフリー対応',
    reviews:
      '【評判】蓮田。とにかく部屋が広くて綺麗。ドトールの朝食サービスや豊富なアメニティが好評で、低ランクの部屋でも十分すぎる満足度を得られる優良店。',
  },
  '07910fa5-250e-4159-be61-3cf94aa788c2': {
    // ホテル おもちゃ箱 (久留米)
    amenities:
      '全室スマートTV(YouTube/Netflix), ウォーターサーバー全室, 人気コミック1000冊, スロットマシン設置',
    reviews:
      '【評判】久留米。名前通り「おもちゃ箱」をひっくり返したような楽しさ。YouTube見放題や大量のコミック、さらにはスロットまで、退屈することのない充実設備。',
  },
  'f81d8ce1-8f14-40c4-b5b0-09526e98998a': {
    // バリアン 東新宿
    amenities:
      'バリ島直輸入家具, 24時間ルームサービス, 55インチ大型TV, 天蓋付きベッド, アメニティバイキング',
    reviews:
      '【評判】歌舞伎町。都会の真ん中でバリ島リゾートを体験。ふかふかのベッドと充実のルームサービス、無料で楽しめるアメニティの数々にリピーターが絶えない。',
  },
  '2c70a1c8-8cba-41c8-bcc6-b03bad352e17': {
    // アルティア ダイナソー 町田
    amenities: '巨大動く恐竜, 貸切露天風呂, ゴルフシミュレーター, ビリヤード, スマートTV全室',
    reviews:
      '【評判】町田。恐竜好き必見のテーマパーク型ホテル。貸切露天風呂やゴルフなど、宿泊以上のエンタメが満載。大人も子供心を思い出して楽しめる唯一無二の場所。',
  },
  '76276ac5-f272-4a46-992f-bb645c2417f3': {
    // 目黒エンペラー
    amenities: '本格サウナ, ジャグジー, 浴室TV, クイーンベッド, 目黒駅徒歩5分, 24時間対応フロント',
    reviews:
      '【評判】目黒。歴史ある豪華ホテルの風格。広大なバスルームにサウナとジャグジーを完備。「一晩では遊び尽くせない」と言わしめる圧倒的な設備力が自慢。',
  },
  'dc4ec9be-e607-4967-8cbe-fedcaec650e7': {
    // コレスト 日本橋
    amenities: '豪華大理石造り, 禁煙ルーム(半数), 大画面TV/VOD, 浴室/トイレ別, 日本橋エリア至近',
    reviews:
      '【評判】人形町。ビジネス利用も多い清潔な大理石ホテル。風呂・トイレ別でゆったり過ごせる。静かで落ち着いた雰囲気は、都心の喧騒を忘れたい大人に最適。',
  },
  '9511880c-98ef-4798-b1c2-0086aa5f900c': {
    // ペリエ 歌舞伎町
    amenities:
      '55インチ4Kテレビ, レインボージェットバス, 浴室TV, 通信カラオケ全室, 1300タイトルVOD',
    reviews:
      '【評判】歌舞伎町。多彩なコンセプトのゴージャス空間。最新の4Kテレビやレインボーバスなど、煌びやかな夜を彩る設備が完璧。ラブホ女子会にも超人気。',
  },
  '11fe6e7b-3b46-4fad-bfcb-5751baa29dac': {
    // ホテル 晏 (歌舞伎町)
    amenities:
      '全室ドライ/ミストサウナ, プロジェクター(一部), 4K大画面TV, 無料ドリンク, Dysonドライヤー',
    reviews:
      '【評判】歌舞伎町。高級感あふれる輸入大理石の内装。全室にサウナを備え、Dysonドライヤーなど備品にも妥協なし。歌舞伎町トップクラスの満足度を誇る。',
  },
  '9dce269b-5f4f-4775-b9b3-e7d0d06ade9e': {
    // バリアン 錦糸町
    amenities:
      '専用露天風呂(一部), 専用サウナ(一部), ダーツ/ビリヤード無料, ドリンクバー, スカイツリー眺望',
    reviews:
      '【評判】錦糸町。最上級「ロイヤルバリアン」は露天風呂とサウナを独り占め。無料のダーツやドリンクバーもあり、ホテルから一歩も出たくなくなる至福の時。',
  },
  'f7d12e81-e789-4c77-af05-121385d13802': {
    // リンデン 湯島
    amenities: 'ジャグジー/光るお風呂, マッサージチェア(一部), 衛星放送/VOD全室, 専用ルーター設置',
    reviews:
      '【評判】湯島。都内屈指の広さを誇る客室と風呂。ジャグジーや光るお風呂など豪華設備が揃い、文京エリアで静かに、かつ贅沢に過ごしたいならここ一択。',
  },
  'a646f489-e44a-4319-887e-72bf5926b65d': {
    // GAO5 (戸畑)
    amenities: 'グランドピアノ設置ルーム, 室内遊具設備, 岩盤浴カプセル, Chromecast全室, 広大な浴槽',
    reviews:
      '【評判】北九州。衝撃の「ピアノ付き」巨大ルーム。浴槽も規格外の大きさで、岩盤浴や最新カラオケなど、驚きと寛ぎが同居する個性派リゾート。',
  },
  'ce5a429b-efb4-4543-bd1e-6cceee6f385e': {
    // ココホテルティアラ 静岡インター
    amenities:
      '50インチTV, メゾネットタイプ(人気), 天蓋付きベッド, 24時間フロント, 充実のフードメニュー',
    reviews:
      '【評判】静岡。メゾネットや天蓋付きベッドなど、ロマンチックな演出が得意。フードメニューの充実度も高く、インターチェンジ至近でアクセスも抜群。',
  },
  '2b33da7c-b93a-4a78-b976-b66335bd113d': {
    // 鳳凰 (八王子)
    amenities: '陣馬街道沿い, 趣のある和室(一部), リーズナブルな休憩, 通信カラオケ, 駐車場完備',
    reviews:
      '【評判】八王子。隠れ家的な落ち着いた雰囲気が魅力。和室など趣の異なる部屋があり、日常を忘れて静かに二人だけの時間を過ごしたいカップルに支持。',
  },
};

updateMultipleHotelFacts(updates);
