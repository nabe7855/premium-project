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
  '493718da-7a93-48d1-b0d2-666a2986bb35': {
    // DESIGN HOTEL NOX
    amenities:
      'ミストサウナ(一部), 露天風呂(一部), レインボージェットバス全室, Chromecast(901/902), 禁煙フロアあり, 駐車場16台',
    reviews:
      '【評判】五反田。駅近の洗練されたデザイナーズ空間。光り輝くレインボーバスや最新のネット動画対応など、都会での贅沢な休息に最適な一軒。',
  },
  '4c759af4-bdc6-4ac4-960a-471328005d2d': {
    // HOTEL LUXE SHINAGAWA
    amenities:
      'ドライサウナ(902), 5.1chサラウンド(一部), 50インチ以上大型TV, Chromecast全室, セーフティボックス完備',
    reviews:
      '【評判】五反田。エリア屈指のラグジュアリー。大画面での映画体験と、本格サウナを備えた特別室など、音響と映像に徹底的にこだわった高級店。',
  },
  '5a911ede-be00-4a14-a4f1-19551f620b7b': {
    // HOTEL W-BAGUS
    amenities:
      '専用露天風呂(一部), カラオケDAM(マイク2本), 広々とした浴室, 豊富な無料レンタル品, 清潔な客室',
    reviews:
      '【評判】歌舞伎町。地下への入り口が隠れ家感を演出。露天風呂付きの部屋や、二人の距離が縮まる広い浴室とカラオケ設備が若者に大人気。',
  },
  '54c48270-8e57-4eef-a3b8-4cf10362e382': {
    // 遊楽膳
    amenities:
      '和風デザイナーズ内装, 障子仕立ての客室, ショートタイム割安定評, 歌舞伎町中心部好立地',
    reviews:
      '【評判】歌舞伎町。新宿の中心にありながら比較的空室がある「穴場」。和の趣を感じる落ち着いた内装と、手頃なショート料金で賢く利用できる。',
  },
  '02c55acb-0176-4e9b-a59d-771cbbb6b00d': {
    // TIARA Brun
    amenities:
      'ReFaウルトラファインバブル, 個室サウナ(一部), JOYSOUNDカラオケ, ダーツライブ, ウォーターサーバー',
    reviews:
      '【評判】大和。最新設備と美容家電の宝庫。ReFa製品やサウナに加え、ダーツや本格カラオケも楽しめる、まさに「至れり尽くせり」の人気店。',
  },
  '4939c224-e069-45d4-a612-95617989cb91': {
    // 宿屋 湯島御苑
    amenities: 'フィンランド式サウナ(303), 岩盤浴付きルーム(502), 和室旅館スタイル, Chromecast対応',
    reviews:
      '【評判】湯島。都会にいながら本格旅館の情緒を味わえる和室ホテル。本格フィンランド式サウナや岩盤浴を備えた部屋は、究極の癒やしスポット。',
  },
  '64b5d7ee-2ab7-476f-a0f7-870de66a66dd': {
    // HOTEL CLAiRE
    amenities:
      'アジアンリゾート風内装, 浴室テレビ, ジェットバス, シャンプーバイキング(20種以上), リーズナブル料金',
    reviews:
      '【評判】渋谷。アジアンリゾートのような落ち着いた空間が魅力。20種類以上のシャンプーから選べるサービスや、高いコスパでリピーター多数。',
  },
  '23edd5b8-7614-442a-b2bf-155b8c985043': {
    // HOTEL BOTA
    amenities:
      '全室コーヒー/紅茶完備, 大型冷蔵庫, 駐車場33台完備, 豊富なルームサービス, 全館喫煙可',
    reviews:
      '【評判】豊橋。圧倒的なコストパフォーマンスと、広々とした客室・浴室が自慢。ファミレス並みの豊富なメニューを大きなテーブルで楽しめると好評。',
  },
  'fb9d40c2-8a7a-442e-8eeb-6eaded7492b8': {
    // HOTEL BRATTO STAY
    amenities:
      'Dysonドライヤー全室, Tempurマットレス, 読み放題サービス「ビューン」, 激ウマ10種のカレー, 露天風呂(一部)',
    reviews:
      '【評判】八王子。ダイソンのドライヤーやテンピュールの寝心地など「質」にこだわる名店。10種類以上ある絶品カレーと無料の雑誌読み放題が最高。',
  },
  '7d35337f-9d11-4c85-beb0-185573a0b284': {
    // HOTEL 1987 新大久保
    amenities:
      '無料貸出グッズ50種以上(下着/保存液等), 広いバスルーム, チェックイン前荷物預かり, 駅近好立地',
    reviews:
      '【評判】新大久保。駅近でとにかく部屋と風呂が広い！手ぶらでOKな50種類以上の貸出アイテムや、荷物預かりなどの神対応サービスが絶賛されている。',
  },
};

updateMultipleHotelFacts(updates);
