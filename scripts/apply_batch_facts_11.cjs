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
  '45cdb358-c51c-4d95-a51a-080d375659bc': {
    // HOTEL I/S 横浜
    amenities:
      '全室無料Wi-Fi, ドリンクバー/駄菓子無料, セレクトシャンプー豊富, 24時間滞在プランあり, 駐車場完備',
    reviews:
      '【評判】横浜中華街近くでコスパ最強。清潔で広々しており、平日限定のカップ麺サービスなど細かな気配りが嬉しい。',
  },
  '9acc8b35-1e74-4d4f-866c-eaea04510a38': {
    // HOTEL MYTH YAMASHITA KOEN
    amenities:
      '最新AV設備, 豊富なレンタルグッズ, 駐車場12台(ハイルーフ可), 24時間ルームサービス, 清潔感あふれる内装',
    reviews:
      '【評判】横浜山下公園エリア。驚異の評価4.9。清潔さ、広さ、設備の全てにおいて非の打ち所がない人気店。',
  },
  'aa8aa01a-9ce9-43ee-9983-441966749b69': {
    // HOTEL CHa-CHa-Ra 札幌
    amenities:
      'ReFaシャワーヘッド全室, 65型巨大TV(VOD/Netflix対応), ミラバス/ミラブル(一部), ウォーターサーバー完備',
    reviews:
      '【評判】札幌。設備投資が凄まじく、ReFaや巨大TV、美容設備が充実。遊びもリラックスも高次元で楽しめる。',
  },
  '9588c4af-16db-4192-a87c-f75e2e8f1e5c': {
    // ホテル バリバリ 伊勢佐木
    amenities:
      '足マッサージ機全室, ドリンクバー/スナック無料, セレクトシャンプー, 防音ルーム完備, Wi-Fi無料',
    reviews:
      '【評判】横浜。リゾート感のあるオシャレな内装。アメニティの充実と、無料のドリンク・軽食サービスが非常に好評。',
  },
  '361bf589-f4cf-4c51-a2df-2b9d0aca178d': {
    // ホテル 八重洲 横浜
    amenities:
      'レインボーバス/ジェットバス, プロジェクター(一部), 広々リビング/特大ソファ, 入浴剤/お菓子無料サービス',
    reviews:
      '【評判】横浜駅近。スタイリッシュな和モダン空間が人気。広いお部屋でゆったり過ごせ、ホスピタリティも高い。',
  },
  'c11f0dc1-0c37-4dc4-b31a-15f830cc5ca1': {
    // GOLD MOON 旭川
    amenities: '地域最大級VOD, 広い浴室, 駐車場ハイルーフ対応, Wi-Fi完備, お菓子/ドリンクサービス',
    reviews:
      '【評判】旭川。旧アイルからリニューアル。モダンな内装と充実のデジタル設備で、若者に人気。',
  },
  'c170f71a-5a02-400b-9067-14d0c73c5694': {
    // ホテル ドルフィン 小倉
    amenities: 'オーシャンビュー客室あり, ジャグジーバス, 全室Wi-Fi, 豊富なフードメニュー',
    reviews:
      '【評判】小倉。海が見えるロケーションが最高。静かな環境でくつろげ、料理のレベルも高いと評判。',
  },
  '46ff3f81-c8cc-4a3d-a457-3cba51536f58': {
    // ホテル ペガサス 小倉
    amenities: 'リーズナブルな休憩プラン, 全室カラオケ完備, VOD, 清潔な水回り',
    reviews: '【評判】小倉北区。料金が非常に安く、気軽に利用できる安定の老舗店。',
  },
  'd104ea8f-562f-478b-bea1-45136dd8c3cd': {
    // HOTEL AZUL&MOV 小倉
    amenities: 'デザイナーズルーム, 浴室TV, レインボーバス, 無料駐車場完備',
    reviews: '【評判】小倉。オシャレな空間作りが特徴。設備が新しく、デートを盛り上げる演出が豊富。',
  },
  'ea21fcf3-4c50-42e4-8f34-e74e5d29874d': {
    // HOTEL RINO 小倉
    amenities: '最新VOD, 広い客室, 駐車場完備, 充実のアメニティ, 清潔なバスルーム',
    reviews: '【評判】小倉。広々と開放的な部屋が好評で、清掃が行き届いたお風呂も人気。',
  },
  'ffca1200-a751-463f-b728-992c7327b6f9': {
    // ホテル レッツ函館
    amenities: '格安フリータイム, 全室VOD完備, 駐車場無料, アメニティバー',
    reviews: '【評判】函館本町。観光にも便利な立地で、とにかく料金が安く学生や若いカップルに人気。',
  },
  '32ce60f9-155b-444d-96ed-5eae83000578': {
    // ホテル リーベ 札幌
    amenities: '駐車場から直接入室可能(お忍び感), 広いお風呂, 冷蔵庫/電子レンジ完備',
    reviews:
      '【評判】札幌手稲。プライバシー重視の設計で、誰にも会わずに利用できる安心感が支持されている。',
  },
  '5db18c5b-6f3c-4179-8ba8-c8ebc1265482': {
    // レステイ ウィンディ 小倉
    amenities:
      'ウェルカムドリンク, 低反発枕レンタル, 加湿器, 駐車場完備, 豊富なコミック読み放題(一部)',
    reviews:
      '【評判】小倉。サービスが非常にきめ細やか。レステイグループならではの安定した清掃と豊富なサービスが魅力。',
  },
  '10081766-906e-429f-a94c-acdb6dd2db30': {
    // ホテル シズ 笠間
    amenities:
      '完全コテージタイプ(戸建), シャッター付きガレージ, 全室Wi-Fi, カラオケルームあり, 内原イオン車2分',
    reviews:
      '【評判】笠間。誰にも会わずに直接お部屋に入れる「お忍び感」MAXのコテージ。静かな環境で二人きりを満喫できる。',
  },
};

updateMultipleHotelFacts(updates);
