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
  '93c2f6c7-50d1-4baa-98fd-b2b50998c994': {
    // 新宿 ホテル アランド
    amenities:
      '回転ベッド, プライベートサウナ(ドライ/スチーム), 全室大型TV, ジェットバス, 浴室TV, シースルーバス, 無料Wi-Fi',
    reviews:
      '【評判】歌舞伎町の老舗。最長18時間の長時間利用が可能。回転ベッドやサウナなど昭和レトロと最新設備が混在する刺激的な空間。',
  },
  '0d48f53e-08ca-4d92-8d89-54b4a3701456': {
    // 水戸 HOTEL LOTUS
    amenities:
      '2025年リニューアル, 癒しの露天風呂, スチームサウナ, カラオケ/ダーツ/卓球(無料貸切), 美味しい朝食',
    reviews:
      '【評判】リニューアルしたばかりで非常に綺麗。カラオケや卓球で遊び尽くせる。癒やしと楽しみが両立する人気店。',
  },
  'aa6135ea-b529-4637-878e-fc3ac49380c5': {
    // 赤羽 ホテル THE Mooon
    amenities:
      '近未来デザイン, ウェルカム無料ビール, シャンプーバー, VIPルーム露天風呂, VOD/BD全室完備',
    reviews:
      '【評判】メタリックな非日常空間。最上階の露天風呂が絶景。無料の生ビールサービスが宿泊客に大好評。',
  },
  'accab9fe-7636-4e1a-8f83-8607096ef606': {
    // 錦糸町 ホテル 貮番館
    amenities: '最新VOD(1300作以上), アプリdeタッチ端末, ウェルカムコーヒー/紅茶, 広い浴室',
    reviews: '【評判】評点4.6。錦糸町の穴場。丁寧な清掃と、ゆったり寛げる広いスペースが魅力。',
  },
  'ee5ea87e-faca-4565-b2cb-30e025c3aa0e': {
    // 五反田 HOTEL ZHIPAGO
    amenities: '全室ReFaシャワーヘッド, ネオジャポネスク(花魁)空間, 2022年11月OPEN, 清潔感MAX',
    reviews:
      '【評判】五反田で最も綺麗と言われる人気店。ReFaの設備や洗練された和のデザインが女性に圧倒的人気。',
  },
  '0cd2c7c8-5b68-4827-8811-6928ea692867': {
    // 八王子 ホテル フランセ
    amenities: '駐車場特大(ハイルーフ可), 昭和レトロな広々設計, 格安ルーム料金',
    reviews:
      '【評判】懐かしい雰囲気だが、とにかく安くて部屋も風呂も広い。コスパ重視のユーザーに愛される安定感。',
  },
  'b24c5d9c-5bdd-4a61-ac17-61cd9a0c8195': {
    // 国立 HOTEL CHERENA
    amenities:
      'ハート型ミラー, 15インチ浴室TV, 防音完備, ストリーミング再生対応, 24時間ルームサービス, 65型大画面(一部)',
    reviews:
      '【評判】「素敵」という声が多数。こだわりの美容家電やハート型の鏡など、女性を笑顔にする仕掛けがいっぱい。',
  },
  '9c79c542-c6b7-4d2d-8d08-89a495f19d89': {
    // あきる野 ホテル ニューぼたん
    amenities: 'レインボーバス, ウォーターサーバー完備, ナノイー加湿空気清浄機, 2009年リニューアル',
    reviews:
      '【評判】外観に騙されるな、中身は最高に綺麗。静かな環境で、フリータイムを使って長時間ゆっくり過ごせる穴場。',
  },
  '9a49f438-1f02-4dbd-9c1f-c854930c6ec3': {
    // 鶯谷 ニュー大柿
    amenities: '地域最安値クラス, 最新カラオケ, BDプレーヤー, VOD全室, 無料Wi-Fi',
    reviews:
      '【評判】節約派の聖地。最新のカラオケや映像設備が充実しており、リーズナブルに楽しめる。',
  },
  '5e1c32f1-c000-43b6-9d33-58fb4b56a3cb': {
    // 小倉 レステイ小倉
    amenities: 'Android TV全室, 広いお風呂, 無料駐車場, 入浴剤バイキング, シャンプーレンタル豊富',
    reviews:
      '【評判】ネット動画が大きな画面で楽しめるのが強み。豊富な貸出アメニティが選ぶ楽しさを提供してくれる。',
  },
  '0db8d397-0ff8-4da8-a51a-d0d42c43dcf6': {
    // 名古屋 ビーナスガーデン
    amenities: '2020年全室改装, 60インチTV, 暖炉(一部), 絶品朝食サービス, 浴室TV, 水中照明',
    reviews:
      '【評判】豪華なリゾート空間。大きなベッドと美味しい食事、ホスピタリティ溢れる接客が最高評価。',
  },
};

updateMultipleHotelFacts(updates);
