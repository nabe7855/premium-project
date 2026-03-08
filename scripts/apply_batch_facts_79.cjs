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
  // --- Batch 79: 栃木南部〜山梨方面 高評価ホテル ---
  'faeaa700-40a4-4d3f-a0bc-55ab72473343': {
    // ホテルGEM小山（旧：シンドバッド小山）
    amenities: '全室非接触型ウォーターサーバー, QR決済, 和モダン内装, ハイルーフ可',
    reviews:
      '【評判】小山。最新設備の導入に積極的で、全室非接触ウォーターサーバーやQR決済が便利。木彫り家具等の和モダン内装も高評価。',
  },
  '8b801041-ac99-4ddb-9946-523abfc2b6ff': {
    // ホテル 夕月 小山店
    amenities: '40インチ以上YouTube対応TV, ブロアバス, VOD, 和モダン内装',
    reviews:
      '【評判】小山。和モダンで統一されたお洒落な内装と広々としたお風呂が人気。質の高いガウンやタオルの用意があり快適に過ごせる。',
  },
  '6d8ed5ae-b5c0-4502-9847-4134d37c4b4b': {
    // ホテル あかま (栃木市)
    amenities: 'サウナ/スチームサウナ(一部), 通信カラオケ, 有線放送, 和室(一部)',
    reviews:
      '【評判】栃木。一部客室にサウナやスチームサウナを完備。通信カラオケ等のアミューズメント設備も充実し、おこもり滞在に最適。',
  },
  '6d470016-7eae-44c0-a431-117b0a7410a1': {
    // ホテル スィーン (佐野市)
    amenities: '50型TV/VOD/浴室TV(一部), ジェット/ブロアバス, マッサージチェア, 禁煙室',
    reviews:
      '【評判】佐野。大型テレビやマッサージチェア等のリッチな設備が揃う。禁煙ルームの選択肢もあり、幅広い客層から支持される優良店。',
  },
  '4d058f07-b17d-4002-b7a1-56e71f40129d': {
    // フィーノ (佐野市)
    amenities: '会員証自販機(クレカ/タッチ決済対応), 豊富なアメニティ, 女性用化粧品, バスローブ',
    reviews:
      '【評判】佐野。古い建物をリノベし、清掃が行き届いた超快適空間へと変貌。クレカ決済対応や充実したアメニティで全方位満点評価を獲得。',
  },
  'cb0587cd-b7a7-46db-b422-c5cc082db4eb': {
    // ホテル アネックス艶 (笛吹市)
    amenities: '全室戸建て離れ, YouTube/Netflix対応, VOD, ジェットバス(一部)',
    reviews:
      '【評判】笛吹。2023年末オープンの隠れ家風全室離れホテル。素泊まりや日帰り利用に特化したシンプルで破格のサービスが好評。',
  },
  '96be69e9-a8fc-4d71-878c-f7eff0e2627c': {
    // ホテル バリハイ (甲斐市)
    amenities:
      '外出可能フレックス制, ワンコイン手作りご飯, ウォーターサーバー, 和室/SMルーム(一部)',
    reviews:
      '【評判】甲斐。外出可能なフレックス制で利便性抜群。500円で食べられる支配人特製の手作りご飯が美味しく、リピーター続出。',
  },
  '2a6e5aaf-c68b-45e3-930b-cc1098617db3': {
    // マドンナPART1 (御代田町)
    amenities: '戸建て形式, サウナ完備(10室), ジェットバス, レンタルグッズ/コスプレ',
    reviews:
      '【評判】御代田。半数以上の部屋にサウナを完備。手作り唐揚げの美味しさやスタッフの丁寧な対応等、ホスピタリティの面での評価が高い。',
  },
  'bc1c57eb-8870-4180-968c-3ca282760586': {
    // ホテル クレア (甲斐市アルプス通り)
    amenities: 'ジェット・ブロアバス, レインボーバス, 無料ドルチェサービス, Wi-Fi',
    reviews:
      '【評判】甲斐。広々としたバスタブとレインボーバスで優雅なバスタイムを楽しめる。無料のドルチェサービスが女性客から非常に高評価。',
  },
  '9267531b-aa0b-4236-80e0-7cda8894a551': {
    // ホテル エアー 韮崎
    amenities: 'スチームサウナ(一部), 天蓋ベッド, レインボーバス, カラオケ/ゲーム',
    reviews:
      '【評判】韮崎。天蓋ベッドやスチームサウナ等、非日常空間を格上げする設備が多数。誕生日等のイベント割引も充実している。',
  },
  '8c0b1dff-9416-4752-a671-c825339777a6': {
    // ホテル ハッピーキッス (昭和町)
    amenities: '65型以上大型TV,防音設備, 24時間フロント, ルームサービス朝食',
    reviews:
      '【評判】昭和町。22年のリニューアルで65型以上TVを導入。一般のBookingサイトでも高評価連発の、ビジネスユースも可能な超優良ホテル。',
  },
  '646b6a82-7c6c-4e85-b00f-832d7ad9f176': {
    // HOTEL Cream (甲府市)
    amenities: '次亜塩素酸加湿器, 徹底した感染症対策, フードメニュー充実',
    reviews:
      '【評判】甲府。アルコール除菌や次亜塩素酸加湿器など清掃・衛生管理が極めて行き届いている。メンバー特典の食事交換サービスも人気。',
  },
  '0699ac5b-3c10-47cb-b088-ae4ef804baa0': {
    // HOTEL Vanilla (南アルプス市)
    amenities: '車庫タイプ駐車場, モーニング無料サービス, ウェルカムドリンク',
    reviews:
      '【評判】南アルプス。ウェルカムドリンクやモーニング無料等、コスパの良いサービスが充実。お部屋も清潔で快適に過ごせる。',
  },
  '9efcb061-66bd-4010-b579-66a82fb7f25b': {
    // ホテル フィオーネ石和 (笛吹市)
    amenities: 'ハイルーフ車対応駐車場(22台), 広い客室, 充実の設備',
    reviews:
      '【評判】笛吹。総合評価が高く、特に部屋の広さと清潔さにおいて安定したクオリティを提供している人気のスタンダードホテル。',
  },
};

updateMultipleHotelFacts(updates);
