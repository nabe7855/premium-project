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
  // --- Batch 74: Variety & High-Cost-Performance Facts ---
  '9ca6f284-35c1-4a7c-976d-73e6ede3f86e': {
    // HOTEL LALA (道玄坂)
    amenities:
      'LUX/Tsubakiなど厳選シャンプー, くるくるドライヤー貸出, 最新通信カラオケ, VOD/WOWOW視聴可, 充実したルームサービス',
    reviews:
      '【評判】渋谷。外出自由でデリバリーや持ち込みもOKと使い勝手抜群。厳選されたアメニティやルームサービスが充実しており、渋谷デートの拠点に最適。',
  },
  'f0558d03-9ebc-4c2a-aa80-7fae2308f4c3': {
    // ホテル エメラルド (五反田)
    amenities:
      'イルミネーションブロアバス(一部), VOD見放題, シャンプー/入浴剤バイキング, ウェルカムドリンク, 各種美容家電貸出',
    reviews:
      '【評判】五反田。清掃が行き届いており、クローゼットなどの設備も綺麗と好評。ウェルカムドリンクや入浴剤・シャンプーのバイキングなど無料サービスが充実。',
  },
  'e18c66b4-68d4-4a53-990a-13a5ef510e73': {
    // HOTEL The Atta (池袋)
    amenities:
      '最大65型スマートTV(Netflix対応), 美顔器スチーマー貸出, 5.1chサラウンド(一部), 有名ブランドコスメ貸出, 無料お菓子提供',
    reviews:
      '【評判】池袋。全室リニューアルで清潔感抜群。大画面スマートTVや5.1ch音響での映画視聴が人気。対面不要の精算システムと豊富なアメニティで満足度が高い。',
  },
  '6c46d581-48e5-4cb2-b2e6-dff74fdb3a7f': {
    // HOTEL UNITED (上野)
    amenities:
      'ReFaドライヤー(一部), 美容軟水風呂, カラオケ/ミストシャワー(一部), 最大65インチTV(一部), コスプレ衣装無料貸出',
    reviews:
      '【評判】上野。アワード5年連続受賞の殿堂入りホテル。美容軟水風呂やReFa家電など女性に嬉しい設備が揃う。豊富な無料レンタル品と高い清潔感でリピーター多数。',
  },
  'bd04b13f-2418-415c-b04f-40bd8efd95a7': {
    // ホテル エクセレント (歌舞伎町)
    amenities:
      'ミラー・イリュージョン演出, スマートTV(Netflix等), ナノケアスチーマー, ウェルカムデザート, ドトールホットドッグサービス',
    reviews:
      '【評判】歌舞伎町。鏡張りのイリュージョン演出で非日常を味わえる。最新の動画配信対応TVから、ホットドッグやデザートなどの手厚い無料サービスまで大充実。',
  },
  '9ec443e0-489f-4a25-8538-9346c7da7eb6': {
    // DECAS HOTEL (西荻窪)
    amenities:
      '100インチプロジェクター(一部), 各種サウナ/岩盤浴(一部), 天蓋ベッド(一部), 2WAYマイナスイオンアイロン貸出, 各種アルコール提供',
    reviews:
      '【評判】西荻窪。駅徒歩2分の隠れ家。部屋はコンパクトながら、行き届いた清掃と充実した設備(プロジェクター等)で居心地が良い。アルコール提供などサービスも高評価。',
  },
  'b0ad47df-1295-4711-8654-bf64c79e6f2e': {
    // HOTEL ココバリ (渋谷)
    amenities:
      'バリリゾート風内装, ナノケアドライヤー(貸出), お香サービス, 電子レンジ/冷蔵庫全室, VOD/Wi-Fi完備',
    reviews:
      '【評判】渋谷。バリ島をイメージした内装とお香の香りで、都会にいながら南国のリゾート気分。清潔感が高く、「癒し処」としての需要が高い。',
  },
  '9dd671ed-b634-49b5-b782-b5a845adfec6': {
    // HOTEL GRASSINO URBAN RESORT (立川)
    amenities:
      '人工温泉＆美容軟水, キッチン付き客室(一部), 露天風呂(一部), 最新ナノドライヤー/カールアイロン完備, タブレットオーダー',
    reviews:
      '【評判】立川。全室に人工温泉と美容軟水を導入した設備特化型。キッチン付きの部屋で料理デートを楽しんだり、露天風呂で高級旅館気分を味わえたりと多彩な過ごし方が可能。',
  },
  '22988fd1-527c-419a-b6a6-0e3084d5c387': {
    // HOTEL Ami (高円寺)
    amenities:
      '50インチ以上TV(一部), 無料ペットボトル水/ドトールコーヒー, 入浴剤/ハーブティー提供, 各種美容家電貸出, 清潔なリニューアル内装',
    reviews:
      '【評判】高円寺。リニューアルで清潔感のある内装に。無料のドトールコーヒーや行き届いた接客サービスが好評で、高円寺エリアでのコスパ重視ならここ。',
  },
  'cd36a36d-f32b-4e47-b4f9-1dc0628762d8': {
    // HOTEL Palio (大森)
    amenities:
      '全室ジェットバス, 無料ミネラルウォーター, 最新VODシステム, 充実の無料アメニティ, 大型立体駐車場完備',
    reviews:
      '【評判】大森。22時前には満室になるほどの超人気店。広い部屋、強い水圧のシャワー、清潔な室内、そしてスタッフの丁寧な対応など、全てが高水準でコスパ抜群。',
  },
  'e69f59ae-37c5-47c4-b675-be94bc39e452': {
    // ホテル フェスタ (円山町)
    amenities:
      '全室改装済み(昨年夏), ミネラルウォーター2本無料, 豊富な入浴剤アメニティ, ジェットバス(一部), ゆったりとした広さ',
    reviews:
      '【評判】円山町。昨年夏に全室を改装し、タバコ臭のない清潔でピカピカの空間に。広さも十分で、アメニティやサービスを含めた総合的な満足度が非常に高い。',
  },
  'c7b467f4-c7eb-46a0-b260-f25875f79096': {
    // minim (錦糸町)
    amenities:
      '高品質タオル＆備品完備, 朝食デリバリー対応(サブウェイ等), シャワートイレ, 充実した基本アメニティ, バスルーム広め',
    reviews:
      '【評判】錦糸町。「狭さ」を売りにする個性派だが、お風呂は広く清潔。タオルなどの備品の質が高く、平日朝食デリバリーなどの工夫で「快適な極小空間」を実現。',
  },
  '9df334a9-882f-487d-8e96-954a2822c430': {
    // ホテル エルメ (渋谷)
    amenities:
      '各部屋固有Wi-Fi, アメニティバイキング, 美容アイロン＆充電器貸出, マウスウォッシュ完備, 空気清浄機',
    reviews:
      '【評判】渋谷。アメニティバイキングや各種レンタル品の充実度が特に女性から高評価。平日の宿泊プランが非常にお得で、渋谷駅からのアクセスも良好。',
  },
  'aceebbfd-88d3-4083-b0c5-0f46979835b2': {
    // ホテル ルナ＆シーヘブン (日暮里/根岸)
    amenities:
      'ウォーターサーバー全室, Android TV(Netflix等)全室, レンタルコスプレ, 豊富な無料アメニティ, 非対面システム',
    reviews:
      '【評判】鶯谷/日暮里。誰にも会わずに利用できるシステムが好評。全室Android TVやウォーターサーバーを完備し、一人利用でも快適な「充実設備の人気店」。',
  },
};

updateMultipleHotelFacts(updates);
