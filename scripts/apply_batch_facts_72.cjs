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
  // --- Batch 72: Resort & High-End City Facts ---
  '3e7eb146-bfa5-498f-b9e0-347bc04c1668': {
    // レイクヒル・ホテル シャトー (相模原)
    amenities:
      '露天風呂付き客室, ジェットバス全室, サウナ(一部), マッサージチェア(一部), 絶縁景観, 駐車場32台',
    reviews:
      '【評判】相模原。相模湖方面に佇む絶景ホテル。露天風呂から望む景色が最高で、リーズナブルながらジェットバスやサウナなど癒やしの設備が完璧に揃う。',
  },
  '3e5cd4ad-a456-4cb9-aa64-c779903d094b': {
    // ホテル ニュー京浜 (横浜)
    amenities:
      'デザイナーズホテル, ジェットバス/ブロアバス, VOD/リクエストビデオ, くるくるドライヤー, Wi-Fi無料',
    reviews:
      '【評判】横浜。洗練されたデザイナーズ空間。ジェットバスや豊富なアメニティを備え、クレジットカードも5大ブランド対応でスマートに利用できる定番店。',
  },
  '24184ae8-c426-49e1-9b8e-76ec6e3d0162': {
    // hotel fukuju (広島)
    amenities:
      '42インチ以上大型TV(一部), VODシステム全室, 豊富な無料貸出品, 和室あり, 広島市中心部',
    reviews:
      '【評判】広島。中区の好立地。全室VOD完備で、ヘアアイロンから加湿器まで無料貸出品が充実。出前メニューも豊富で、持ち込みデートに最適な使い勝手の良さ。',
  },
  'a063e91c-4c84-4983-a250-d3f2b6390387': {
    // HOTEL VERONA (横浜)
    amenities:
      'ブルーレイ全室完備, 50インチ以上大画面TV(一部), 通信カラオケ, ウェルカムドリンク, レンタルパジャマ',
    reviews:
      '【評判】横浜。全室ブルーレイデッキと無料Wi-Fi完備で、映画鑑賞会に最適。多彩な貸出品やアメニティにくわえ、ウェルカムドリンクのサービスも好評。',
  },
  '9b4f27ef-e3af-4daf-8ecf-e4a85ac879bb': {
    // HOTEL VIEW (所沢)
    amenities:
      'VOD全室, 禁煙ルーム(8室), 最新カラオケ設備, ブランドシャンプー貸出, ミネラルウォーター無料',
    reviews:
      '【評判】所沢。手ぶらで泊まれるほどアメニティが豊富。禁煙ルームの用意や、最新のカラオケ・VOD設備があり、価格改定によりさらにコストパフォーマンスが上昇。',
  },
  'be9b1956-cc72-4ec1-b051-8f1241936e0c': {
    // HOTEL Roussillon (川崎)
    amenities:
      '南仏プロヴァンス風, 40インチ以上TV全室, レインボーブロアバス全室, 充実ルームサービス, Netflix対応',
    reviews:
      '【評判】川崎。南仏リゾートのような洗練された内装。全室完備のレインボーバスと豊富なルームサービスで、ゆったりと優雅な時間を過ごしたいカップルに最適。',
  },
  '31418ede-6979-4202-9750-27a24f1f69ad': {
    // サンパール (川越)
    amenities:
      'レインボーブロアバス全室, 100種以上のフードメニュー, 女性/男性化粧品一式, マッサージチェア(一部), 3人以上利用可',
    reviews:
      '【評判】川越。全室レインボーバス完備でバスタイムが充実。レストラン顔負けの食事メニューと、3人以上の利用にも対応する寛容さが、多彩なニーズに応える。',
  },
  '9511880c-98ef-4798-b1c2-0086aa5f900c': {
    // HOTEL Perrier (歌舞伎町)
    amenities:
      '19年リニューアル, 55インチ4KTV＆浴室TV全室, ドライサウナ(一部), 無料コスプレ, ナノケアドライヤー',
    reviews:
      '【評判】歌舞伎町。豪華絢爛な最上級空間。全室4Kの大画面と浴室TVを備え、選べる入浴剤や豊富なアメニティが、歌舞伎町の夜を限りなくラグジュアリーに彩る。',
  },
  '2c70a1c8-8cba-41c8-bcc6-b03bad352e17': {
    // HOTEL ARTIA DINOSAUR (町田)
    amenities:
      '恐竜テーマパーク(約50体), 貸切露天風呂, ゴルフ/ビリヤード, 入浴剤バイキング, スマートTV全室',
    reviews:
      '【評判】町田。本物の恐竜テーマパーク。圧倒的な世界観に加え、貸切の露天風呂やゴルフシミュレーターなど遊び尽くせない設備が揃う、圧倒的エンタメホテル。',
  },
  '7e0a8001-8319-4818-809d-5b4fb5e0bc3c': {
    // バリアンリゾート池袋西口店
    amenities:
      'バリ島直輸入内装, 55インチTV全室, ジェットバス＆浴室TV, 100種超24hルームサービス, 天蓋ベッド',
    reviews:
      '【評判】池袋。都心でアジアンリゾートの極致。24時間頼める100種類以上の絶品グルメと、無料デザートバイキングなどの圧倒的「バリアン品質」が堪能できる。',
  },
  'd4e8c985-2215-42d0-9479-432945250a45': {
    // HOTEL Dino (相模原)
    amenities:
      'Chromecast全室, ウォーターサーバー, 75インチ巨大TV(一部), 本格サウナ(一部), 無料モーニング',
    reviews:
      '【評判】相模原。全室Chromecast完備でスマホ連携が完璧。一部の本格サウナや75インチ巨大TV、無料モーニングなど、痒いところに手が届くサービスが好評。',
  },
  '8a3ac360-8214-4598-b6b3-d21d9c92a658': {
    // GOLF 東名川崎店
    amenities:
      '50インチTV全室, ブルーレイプレーヤー全室, 酵素美泡湯(2/7/9号室), マッサージ機(一部), 無料Wi-Fi',
    reviews:
      '【評判】川崎。安定のGOLFブランド。全室50インチTV＆ブルーレイ完備で映像鑑賞に最適。「酵素美泡湯」などのこだわり設備を引ければ、満足度がさらに跳ね上がる。',
  },
};

updateMultipleHotelFacts(updates);
