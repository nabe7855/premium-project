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
  // --- Batch 80: 新潟エリア・設備特化型ホテル ---
  'afc47a1a-56cb-4dab-8e91-df185af953db': {
    // フローレスII (燕市)
    amenities: 'SMルーム/地雷女子等コンセプトルーム, コスプレ約30種, Chromecast完備',
    reviews:
      '【評判】燕市。ガレージタイプで人目を気にせず入室可。SMルームや地雷女子ルームなどユニークなコンセプトルームが揃っており刺激的。',
  },
  'b85ab00e-039f-4c2e-a372-476d0f98bb22': {
    // さくらとうさぎ (新潟市)
    amenities: 'サウナ/マッサージチェア(一部), 浴室TV, ウォーターサーバー',
    reviews:
      '【評判】新潟。大きな浴室と設備の充実度が高くコスパ最高との声。サウナ付き部屋もあり、サウナーは持参した氷で水風呂を楽しむと吉。',
  },
  '67a7cf95-ee4c-4e2a-8539-8158bee6f788': {
    // ホテル ニューコスモス (長岡市)
    amenities: '浴室TV, 水中照明, おもちゃ(電動マッサージ機), ブラックライト',
    reviews:
      '【評判】長岡。地域No.1を目指すバリュープライスでありながら、浴室TVや各種AV設備・アメニティが手厚くおこもりデートに最適。',
  },
  '7c685a7a-a0d6-4e77-b449-88c5e1ce08d4': {
    // ホテル ホワイトコスモス (長岡市)
    amenities: '戸建てガレージ形式, マッサージチェア(一部), 水中照明, VOD',
    reviews:
      '【評判】長岡。各部屋に専用ガレージがあり、誰にも会わずに入退室できる完全プライベート空間。設備も一通り揃って使い勝手が良い。',
  },
  'c2a18b66-a097-41c9-bd95-40f4d176ed8b': {
    // ホテル 京都 白根店 (新潟市南区)
    amenities: '全室Chromecast完備, 天蓋ベッド/カラオケ/マッサージチェア(一部)',
    reviews:
      '【評判】新潟。全室にChromecastが導入されスマホ直結の動画鑑賞が快適。一部の部屋には天蓋ベッドやマッサージチェアもあり豪華。',
  },
  '2a5f6f99-b538-48c4-9f5c-8bb7fd1766b3': {
    // リオンズホテル新潟 (新潟市西蒲区)
    amenities: '露天風呂/露天風浴室(10部屋完備), 豪華VIP空間, 広い客室',
    reviews:
      '【評判】新潟。「広さと設備は流石VIP」と称される豪勢な造り。10部屋に露天風呂が完備されておりリゾート気分を存分に味わえる。',
  },
  'd8efcb23-2f5a-4ccc-8d60-952359808b97': {
    // ファースト亀田 (新潟市江南区)
    amenities: '岩盤浴/ドライサウナ/露天風呂(一部), 全室Chromecast, 天蓋ベッド',
    reviews:
      '【評判】新潟。Chromecast全室完備。一部客室には岩盤浴やドライサウナ、露天風呂まであり、スーパー銭湯顔負けの設備スパ。',
  },
  '0b32141f-b202-46d8-b579-eb02f6bea420': {
    // HOTEL 楽園伝説 (上越市)
    amenities: '本格サウナ/岩盤浴/スチームサウナ(一部), 5.1chサラウンドシステム',
    reviews:
      '【評判】上越。上越エリアランキング上位常連。岩盤浴や各種サウナ、本格的な5.1chサラウンドシステムなど、驚異的な設備投資が光る。',
  },
  '9b746ed0-6341-4b42-9de3-00d02d0f82f7': {
    // パール ラビット (上越市)
    amenities: '岩盤浴/ミストサウナ(一部), ホームシアター/カラオケ完備, ルームサービス',
    reviews:
      '【評判】上越。リニューアルで綺麗に生まれ変わり、広くて豪華な設備が整っていると大好評。岩盤浴やホームシアターと至れり尽くせり。',
  },
  '60d686cd-9cff-40db-a5f6-53540b3b2fb1': {
    // ホテル インパクト 小出店
    amenities: 'フロントガレージ式駐車場, アメニティバイキング, ジェットバス',
    reviews:
      '【評判】魚沼。車を停めてそのまま入れるガレージ式。手ぶらでの急な利用でも安心できるようアメニティバイキングに力を入れている。',
  },
  'f72673aa-a90f-4360-974c-7b8e607b558d': {
    // エリーゼ鳥屋野
    amenities: '全室Chromecast完備, 平日宿泊無料モーニング, ブルーレイプレーヤー',
    reviews:
      '【評判】新潟。全室へのChromecast導入や、平日宿泊者限定の朝食無料サービスなど、リピーター定着に向けた手厚いサービスを展開。',
  },
  '955886d7-630d-421e-87a1-a9916e1870cd': {
    // ホテル アスカ (上越市)
    amenities: '全室Chromecast/Wi-Fi完備, 90分ショートタイム',
    reviews:
      '【評判】上越。上越ICから至近。90分2700円などの激安ショートタイムがあり、サクッとリーズナブルに利用できる隠れ家ホテル。',
  },
  '7dad42df-29cd-48a5-936a-5176c42ca99f': {
    // ホテル ベニス
    amenities: '空気清浄機, 天蓋ベッド/天井ミラー(一部)',
    reviews:
      '【評判】新潟。周辺ホテルと比べて料金設定が非常に安く、かつ部屋も綺麗に保たれているため、実用性とコスパのバランスに優れる。',
  },
  'f611dc48-da80-450b-94c9-694e9f203e09': {
    // ホテル カサブランカ
    amenities: 'VOD/Chromecast, 防音室完備, 豊富なアメニティ',
    reviews:
      '【評判】新潟。ChromecastやVODなど近年のトレンドを押さえた設備と、防音完備で他を気にせず安心して過ごせる空間づくりが特徴。',
  },
  'b336dc0e-52a0-4e63-99e2-e2e00c500407': {
    // ホテル エリーゼ 白根店
    amenities: '特別ライティングルーム, 全室Chromecast完備, カラオケ(一部)',
    reviews:
      '【評判】新潟。照明にこだわった個性的なデザインルームが22室。全室でChromecastが使え、白根で一番綺麗との声も上がる。',
  },
  'b7e037ae-c0eb-4efc-bc9c-b40a37ca3bdd': {
    // ホテルQ (柏崎市)
    amenities: '本格ロウリュサウナ/水風呂, 無料ポップコーン/ドリンクバー, Chromecast',
    reviews:
      '【評判】柏崎。サウナは本格的なロウリュと水風呂が可能。ポップコーンやドリンクバーなどテーマパーク並の遊び心とサービスが売り。',
  },
  '8e4f1c26-a1bf-4225-b7b5-7f289084ba93': {
    // ホテル エリーゼ岩室店
    amenities: '全室Chromecast完備, カラオケ/ブルーレイプレーヤー完備',
    reviews:
      '【評判】岩室。新潟県内で多店舗展開する大手グループの一角。全室Chromecast完備で、安定した設備クオリティを提供している。',
  },
  '95f22e32-7d9c-43df-8bea-d53d0633ae81': {
    // ホテル クレヨン (飯田市)
    amenities: 'ハイルーフ対応駐車場, 丁寧な清掃, 電子レンジ',
    reviews:
      '【評判】飯田。駐車場はやや狭めなものの、客室の清掃が行き届いており非常に綺麗に保たれていると評価される安定感のある名裏方。',
  },
};

updateMultipleHotelFacts(updates);
