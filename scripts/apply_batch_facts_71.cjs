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
  // --- Batch 71: Variety & Unique Equipment Facts ---
  'dede4ce4-2caa-482e-a1f2-d0a7ae431cd8': {
    // HOTEL AKAIKUTSU (横浜)
    amenities:
      '天蓋ベッド(一部), 岩盤浴ルーム(一部), レインボーバス全室, 50インチ以上TV, 元町・中華街駅徒歩2分',
    reviews:
      '【評判】横浜。元町・中華街駅からすぐの好立地。天蓋ベッドや岩盤浴を備えた客室があり、中華街観光の後の贅沢なひとときを演出。スタッフの親切な対応も高評価。',
  },
  '3e43f5ae-f550-419b-979a-d4e11cd77c2f': {
    // GOLF Ⅱ 厚木
    amenities:
      'レインボーバス, 42インチ以上TV, マッサージチェア(一部), VOD, 電子レンジ, 駐車場完備',
    reviews:
      '【評判】厚木。広い浴槽でのレインボーバスが自慢。マッサージチェア付きの客室もあり、ドライブの疲れを癒やすのに最適。安定した清潔感と充実の家電でリピーターが多い。',
  },
  '49f596d2-22d1-42b7-be62-35bbeb7dcdf3': {
    // HOTEL ROSSO (川崎)
    amenities: '動画配信サービス対応TV, スマホ充電器全機種, セレクトアメニティ, Wi-Fi完備',
    reviews:
      '【評判】川崎。NetflixやYouTubeを視聴できる大画面TVが嬉しい。スマホ充電器の貸出も全機種対応で安心。シンプルながら清潔で、都市部でのスマートな滞在が可能。',
  },
  '571618e8-78ed-49ae-b315-0ac53cd0318c': {
    // デザイナーズホテルR (小田原)
    amenities: '2020年リノベ, 65インチ超大型TV, JOYSOUNDカラオケ, レインボーバス, ワンガレージ式',
    reviews:
      '【評判】小田原。リニューアルで内装が一新。65インチの超巨大TVと本格カラオケを全室で楽しめるエンタメ重視型。ガレージから直接入室でき、プライバシーも完璧。',
  },
  '58fb7987-3ed3-48de-9992-1b2242cde401': {
    // HOTEL B・P (横浜)
    amenities:
      'JOYSOUNDカラオケ全室, マッサージチェア(一部), 42インチ大型TV, ジェットバス, 水中照明(一部)',
    reviews:
      '【評判】横浜。全室にカラオケと大型TVを完備し、歌って遊べる空間。マッサージチェア付きの部屋もあり、ジェットバスでの癒やしと遊びを欲張りた時に最適。',
  },
  '033238cb-3033-4bc1-9f89-6373db7cf63f': {
    // スパイラル (那珂)
    amenities:
      '40室のユニークルーム, スパイラルゾーン, ルームサービス, メンバー特典, 国道118号沿い',
    reviews:
      '【評判】那珂。40通りもの趣向を凝らした部屋があり、何度来ても飽きない遊び心が満載。国道沿いでアクセスが良く、地域に根ざした安定のサービスと価格が支持されている。',
  },
  '6ffce5ca-73de-4a85-8cb1-e0a0b4b00fa0': {
    // Queens Town PartⅠ (厚木)
    amenities: '無料ドリンクバー, レインボーバス, 浴室TV(一部), 42インチTV, VOD, 和室あり',
    reviews:
      '【評判】厚木。無料ドリンクバーのサービスが嬉しい。浴室テレビやレインボーバスでのバスタイムも贅沢。和室もあり、落ち着いた雰囲気の中で最新VODを楽しめる。',
  },
  'e492166c-b876-4f30-a21c-5c52c5b5d8bc': {
    // ホテル 八重洲 (横浜)
    amenities: '100インチ大型TV(一部), 50インチTV全室, バリアフリールーム対応, 浴室BGM, ブロアバス',
    reviews:
      '【評判】横浜。一部客室の100インチ巨大スクリーンは圧巻。バリアフリー設計への配慮や、浴室BGMなど細かな「過ごしやすさ」を追求した大人のためのリゾート。',
  },
  'b595c965-d83d-4a13-ad43-cfa5fc58c236': {
    // HOTEL MAXIMA (川崎)
    amenities:
      'ダイエットマシン(204), マッサージチェア(一部), 浴室TV全室, ナノケアドライヤー全室, カラオケ',
    reviews:
      '【評判】新丸子。204号室のダイエットマシンなどユニークな設備が話題。全室に浴室テレビとナノケア家電を完備し、美容と健康を意識した滞在ができる個性派ホテル。',
  },
  '2c003f7d-d15e-404d-816b-9b864d53f7a8': {
    // ホテル プルメリア (日出町)
    amenities: '本格ロウリュサウナ, サウナ温度88度, 水風呂20度, 完全プライベート空間, 大分観光至近',
    reviews:
      '【評判】日出町。本格派サウナー必見の「ロウリュ」が楽しめる稀有な宿。88度の高音サウナと冷たい水風呂を独り占めできる体験が、サウナ好きの間で話題。',
  },
  '2fda8bf3-5428-474c-b812-0c7f817b3c73': {
    // ホテル ミンク 町田
    amenities:
      '充実のシャンプーバー, イオンケアドライヤー, 低反発枕レンタル, コスプレ豊富, 24hデリバリー対応',
    reviews:
      '【評判】相模原。シャンプーや家電のレンタル品がエリア最大級。自分に合ったケアアイテムを選んで、清潔な広々とした部屋で心ゆくまで自分磨きを楽しめる。',
  },
  'c81a89ad-87fe-402c-b9b1-6cc3213fc8b6': {
    // HOTEL Knight (小田原)
    amenities:
      'ワンルーム・ワンガレージ, 42インチプラズマTV, 15インチ浴室TV, 24h休憩可, 隠れ家的立地',
    reviews:
      '【評判】小田原。全室ガレージ直結で、誰にも会わずにチェックインできる安心感が最大の特徴。浴室テレビでの映画視聴も快適で、お忍びデートに最適な隠れ家。',
  },
};

updateMultipleHotelFacts(updates);
