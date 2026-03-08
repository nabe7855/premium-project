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
  // --- Batch 78: 栃木県小山・宇都宮周辺 高クオリティホテル ---
  '7fcb69ea-0ec0-4ad7-85fc-8df8f6177e0a': {
    // ホテル セピア (下野市)
    amenities: 'プラズマクラスター空気清浄機, ナノケアスチーマー, ナノケアドライヤー',
    reviews:
      '【評判】下野。ナノケア製品などの美容アメニティが全室に充実しており、どの部屋を選んでもハズレがないと高評価。',
  },
  '6674171e-9a03-4920-96ee-8a2954297d78': {
    // KJワールド (日光市)
    amenities: '50インチ以上TV(一部), 車庫から直接入室, レンタル品充実, 軽食サービス',
    reviews:
      '【評判】日光。ガレージから直接部屋に入れるプライバシー設計。レトロな雰囲気の中に大画面TVなどの現代的な快適さが同居している。',
  },
  '15f5f907-1ed9-4789-a806-225aa6238e17': {
    // インパル21 (小山市)
    amenities: 'フルVOD＆アダルト見放題, 空気清浄機/加湿器, くるくるドライヤー',
    reviews:
      '【評判】小山。映画やアダルトコンテンツの圧倒的な充実度が特徴。リーズナブルな価格設定でサクッと楽しみたい時の休憩利用に最適。',
  },
  '27da96a9-0495-4805-aa40-b1f4ac47fcc2': {
    // ヘブンズドア (栃木市)
    amenities: 'SMルーム完備(一部/拘束具付き), 無料Wi-Fi, 特殊コンセプト',
    reviews:
      '【評判】栃木。一部にエックスチェアー等を備えた本格的なSMルームがあり、非日常のプレイに特化した知る人ぞ知るホテル。',
  },
  '8c6d8133-db79-4974-9fad-4a8b544209f9': {
    // K RESORT (那須塩原市) ← Petit_mo:mの近くの確実な情報(前回収集済みですが、Petit_mo:mの代替として今回スキップを判断し、補填で追加済みのためここは不要。実はPetit_mo:mは情報薄)
  },
  '36313082-0f02-40d7-9de2-29d9ef23ee0d': {
    // HOTEL Ki (小山市)
    amenities: '客室露天風呂完備(一部), 本格サウナ室, 誕生日/記念日特化イベント',
    reviews:
      '【評判】小山。客室露天風呂やサウナがある部屋は特大の非日常感を味わえると大人気。フリータイムの開始時間も早く使い勝手が良い。',
  },
  'd3a9176f-c3ce-461e-b73e-ceee7b676bfe': {
    // アンダルシア (鹿沼市)
    amenities: '戸建て連棟ガレージイン, 駐車場完備, 広い客室',
    reviews:
      '【評判】鹿沼。車を部屋のすぐ下に停められる完全ガレージタイプ。豪華設備こそ無いが、とにかく部屋が広くて清潔、そして安いと絶賛。',
  },
  '631d4a36-76a0-4ebf-80d9-9c03704c4217': {
    // シンフォニー (佐野市)
    amenities: '最新VOD設備, スマホQR決済対応, ガレージイン, 清潔な客室',
    reviews:
      '【評判】佐野。最新のVODやQR決済などのシステム面が強み。フロントの対応も非常に親切で、全項目で満点近い評価を獲得し続けている。',
  },
  'f8fe6212-6eab-49bb-87de-79cd41a67b00': {
    // レステイ Koakuma (宇都宮市)
    amenities: '80度本格サウナ＆水風呂(一部), ジャグジー, 24時間ルームサービス',
    reviews:
      '【評判】宇都宮。一部のサウナ付き部屋は水風呂まで楽しめ、サウナーからも注目。ハロウィン等イベント時の無料スイーツや丁寧な接客が人気。',
  },
  '82be557e-d037-4cf8-9d4d-1477cfd4ffc2': {
    // パスタアイネ (矢板市)
    amenities: '宿泊4500円～の超低価格, ウェルカムディナー, 無料モーニング',
    reviews:
      '【評判】矢板。宿泊で4500円という驚愕の安さ。さらに無料のウェルカムディナーや豪華な朝食まで付き、車旅行者のオアシスとなっている。',
  },
  'f6ab79f2-45c5-4473-bd26-fc6a3ddda2ef': {
    // メモリー小俣店 (足利市)
    amenities: 'シャワートイレ, 豊富な種類のドライヤー, 充実のアメニティ',
    reviews:
      '【評判】足利。掃除が隅々まで行き届いていることと、何種類ものヘアアイロン・ドライヤーが用意されている点で女性客の満足度が極めて高い。',
  },
  '83100996-a50c-4822-8694-93e9dd1293f3': {
    // ティンカーベル 小山店
    amenities: '1棟独立ガレージ, ジーラ製スキンケア一式, ボルダリングルーム(一部), 5種の入浴剤',
    reviews:
      '【評判】小山。DHCやジーラ等の高級アメニティが常備され手ぶら宿泊も安心。ボルダリング付きの遊び心ある部屋や、冷蔵庫の冷えたグラス等気遣いが最高。',
  },
  '031583eb-31fd-4d38-84e1-76db72f2a9af': {
    // ホテル 夕月 宇都宮店
    amenities: 'リニューアル客室, 大きな浴槽, 充実のレンタル品, 畳の和室(一部)',
    reviews:
      '【評判】宇都宮。近年リニューアルされた部屋が大好評。足を伸ばせる大きな浴槽や、ゴロゴロ寛げる畳の和室もあり、価格を超えた快適ステイ。',
  },
  '098242b4-7954-478e-a5b2-253b5d97f1f6': {
    // ウィンザー足利 (足利市)
    amenities: '露天風呂, 天蓋ベッド, Chromecast/Wi-Fi完備, マッサージチェア',
    reviews:
      '【評判】足利。露天風呂や天蓋ベッドといった「王道のラブホらしさ」に、Chromecast等の最新設備を融合。お姫様気分で非日常を味わえる。',
  },
  '0d76ece0-b42f-49aa-88db-6441f50244e9': {
    // HOTEL  Jyedo (宇都宮市)
    amenities: '豪華特別室, 本格露天サウナ/水風呂/外気浴スペース, 豪華内装',
    reviews:
      '【評判】宇都宮。特別室である311号室の露天風呂とサウナ（水風呂・外気浴可）のコンボが強力。宇都宮エリアでも格上の非日常体験が可能。',
  },
  'c79dd9fb-808d-43e1-9f11-71aac347426f': {
    // レステイ サンシティー (宇都宮市)
    amenities: '24時間対応フロント, ルームサービス導入, ジェットバス, ネット予約の長時間特典',
    reviews:
      '【評判】宇都宮。ネットプラン限定の「早めのチェックイン＆長時間滞在」が圧倒的コスパ。大人専用ながら一般ホテルのような安心のサービス水準。',
  },
};

updateMultipleHotelFacts(updates);
