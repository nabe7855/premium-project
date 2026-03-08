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
        result.push(current);
        return result; // Error case handling simplified
      }
    }
    result.push(current);
    return result;
  };

  // More robust CSV parser for safety
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
      part = part; // no-op
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
  // --- Batch 66: Milestones & Entertainment Facts ---
  '3044035a-845a-41ef-b7a6-44fb2593d3dd': {
    // HOTEL ARTIA Luxury 岐阜店
    amenities:
      '全室Chromecast完備, 露天風呂/岩盤浴(一部), VR体験, ビールサーバー, 室内水槽/ホタル浴槽, IHキッチン',
    reviews:
      '【評判】岐阜。全面改装で地域トップクラスの設備へ。VRやビールサーバー、光るホタル浴槽など、同棲体験もできる充実のエンタメ設備が若年層に圧倒的人気。',
  },
  '629b792f-b1b6-41f9-b367-62a15c9fc3ce': {
    // ホテルバリアンリゾート新宿アイランド店
    amenities: 'バリ島直輸入家具, 岩盤浴/貸切露天風呂, 足湯, ダーツ, 豊富なアメニティバイキング',
    reviews:
      '【評判】新宿。都会のど真ん中で味わえる本格バリ島リゾート。岩盤浴やダーツ、充実した無料サービスなど、宿泊以上の価値を提供する「手ぶらでバカンス」の極致。',
  },
  '635a4c2f-dbf6-4b67-afcb-1d4d1e469ed3': {
    // HOTEL PASHA RESORT (歌舞伎町)
    amenities:
      'ドライ/スチームサウナ, 岩盤浴(一部), レインシャワー, 露天風呂(VIP室), 55インチ大型TV',
    reviews:
      '【評判】新宿歌舞伎町。サウナや岩盤浴を備えた都会の隠れ家リゾート。高級感溢れる内装と、最新のバスシステムが「非日常の癒やし」を提供し、高い評価を得ている。',
  },
  '0154f2a5-2acc-4366-b436-bcdf3a2e4928': {
    // HOTEL Water Bali (千葉一宮)
    amenities: '75インチ大型TV(一部), ダイソン製品レンタル, 浴室テレビ, 電子レンジ, Wi-Fi完備',
    reviews:
      '【評判】一宮。エリア随一の高級感を誇るリゾートホテル。75インチの巨大TVやダイソンのレンタルなど、美容とエンタメに妥協のない設備がカップルに支持されている。',
  },
  '006a9e27-c4db-49e3-84ae-8c44c3ee9704': {
    // HOTEL LE STYLE (横浜)
    amenities: '本格ドライサウナ, ジェットバス, 持ち込み冷蔵庫, 最新VOD, 清潔な客室',
    reviews:
      '【評判】横浜鶴屋町。リニューアルで導入された「本格派サウナ」がサウナーから高評価。横浜観光の拠点として、清潔で落ち着いた空間が旅の疲れを癒やしてくれる。',
  },
  '0c682ce7-056c-432f-9c5d-de1456f29192': {
    // NOA HOTEL 豊田南
    amenities: '大型TV(一部), マッサージチェア(一部), VODシステム, 電子レンジ, 清潔感重視',
    reviews:
      '【評判】愛知安城。豊田南IC近くでアクセス抜群。広々とした清潔な客室と、大型TVでの映画鑑賞が人気。安定したサービスで高いリピート率を誇る優良ホテル。',
  },
  '0eba61ce-0576-47ba-92dd-3d482cfdadec': {
    // HOTEL IORI (山梨甲斐)
    amenities: '本格手作りグラタン/パフェ, 高級感ある内装, ナノイードライヤー, 広いベッド',
    reviews:
      '【評判】山梨。特筆すべきは「食事の美味しさ」。本格的なグラタンやパフェが宿泊客の間で話題で、独特の高級感とアットホームな接客が心地よい隠れた名店。',
  },
  '0ecc22a2-3565-4b1f-94ee-cd01b3856ced': {
    // SKYCLUB 1 LEGEND (大分別府)
    amenities: '別府湾一望の露天風呂, コーヒーメーカー, バスローブ, 展望窓',
    reviews:
      '【評判】別府。小高い丘から別府湾を一望できる露天風呂が最大の魅力。景色を楽しみながら入る滝のような浴槽は圧巻で、ゴージャスな気分に浸れる絶景ホテル。',
  },
  '05c79783-1972-45ac-a67b-a96fa8599e54': {
    // ホテル チャリチョコ (池袋)
    amenities: 'YouTube/配信動画対応, ソフトクリーム無料, お菓子バイキング, ガチャガチャイベント',
    reviews:
      '【評判】池袋。おとぎの国をテーマにした可愛い内装が人気。ソフトクリームやお菓子、ウェルカムドリンクなど「無料尽くし」のサービスが、若い世代から高評価。',
  },
  '0e6a49b3-6c2e-4c36-89a8-1d0f16c077a1': {
    // スターリゾート ウィル (盛岡)
    amenities: '本格ドライサウナ, シルキーバス, カップルズ予約対応, 駐車場完備',
    reviews:
      '【評判】盛岡。2023年にリブランドオープン。本格サウナやシルキーバスなど、宿泊者の「整い」を意識した設備が充実しており、盛岡観光の宿泊拠点としても優秀。',
  },
  '0561ec1a-59cd-450a-903c-4a3fbe218e0b': {
    // ホテル リスボン (滋賀米原)
    amenities:
      'PS5/Switch無料貸出, 露天風呂(一部), 本格手作りカツ丼/サムゲタン, 除菌クリーナーレイコップ導入',
    reviews:
      '【評判】米原。最新ゲーム機やレイコップの除菌など、ゲストの快適性を追求。近所の専門店が作る本格カツ丼も評判で、昭和レトロと最新サービスの融合が面白い。',
  },
};

updateMultipleHotelFacts(updates);
