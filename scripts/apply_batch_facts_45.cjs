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
  // --- Batch 45: Gunma area Precision Enrichment ---
  '3aef156c-d79a-4c61-9690-3cd0fc58756e': {
    // ホテル マリア (前橋)
    amenities:
      '露天風呂(一部), 本格岩盤浴/サウナ, 100インチプロジェクター, Chromecast/VOD, 専用ガレージ全室',
    reviews:
      '【評判】前橋。露天風呂や本格岩盤浴を備えた豪華設備。100インチプロジェクターによる大迫力シアターと高いプライバシー性がカップルに絶大支持。',
  },
  '51a51904-cf45-452f-8936-20b83252cd7f': {
    // マドンナPART2 (御代田)
    amenities: 'スキー場至近, 本格スパバス, ドライサウナ(一部), スキー乾燥室, 専用駐車場',
    reviews:
      '【評判】御代田。軽井沢近くの静かな環境。スパバスやドライサウナで疲れを癒やせ、スキー場へのアクセスも良いためレジャー拠点として有能。',
  },
  '468562b9-de88-4c51-a4ec-f413804cc3bd': {
    // アイカム (吉岡)
    amenities: '広々とした客室/浴室, 清潔感重視のメンテナンス, 有線放送, 公衆Wi-Fi',
    reviews:
      '【評判】吉岡。周辺他店に比べ部屋と風呂が非常に広いと好評。清潔感があり価格もリーズナブルで、落ち着いて過ごしたい時の穴場。',
  },
  'd5c975a4-4065-45a9-8b26-33ee8dddbcc9': {
    // ホテル みやぎ (前橋)
    amenities: '全室Chromecast導入, 本格岩盤浴/サウナ, 浴室TV, プロジェクター, ウォーターサーバー',
    reviews:
      '【評判】前橋。サウナ・岩盤浴・プロジェクターを全室に完備。YouTube等を大画面で飛ばせるChromecastもあり、籠もりステイに最高な一軒。',
  },
  '7466ba60-52de-4c67-b0c4-77b637daaeaf': {
    // ホテル ヨコハマ (高崎)
    amenities:
      '光るレインボーシャワー全室, DAZN見放題VOD, サウナ/マッサージチェア(一部), 豊富なアメニティ',
    reviews:
      '【評判】高崎。全室導入のレインボーシャワーとDAZN見放題が特徴。アメニティの充実度が非常に高く、ホスピタリティを感じる優良店。',
  },
  '95904247-a2c8-4b6b-9574-48b28b0cd619': {
    // セーラ 赤堀 (伊勢崎)
    amenities: '本格SM設備ルームあり, DAM通信カラオケ, 天蓋ベッド, 自動精算機, 駐車場直結',
    reviews:
      '【評判】伊勢崎。一部の部屋には本格的なSM設備や天蓋ベッドを完備。全室でのカラオケや高い匿名性で、多様なニーズに応える人気店。',
  },
  '5a4e4a49-2ebf-47a2-a145-b3c4901c44dd': {
    // HOTEL SEINE (伊勢崎)
    amenities: 'VOD 700ch以上, ヘアアイロン全室貸出, イオンドライヤー, 豊富なメンバー特典',
    reviews:
      '【評判】伊勢崎。VODの圧倒的チャンネル数と、ヘアアイロン等の豊富な無料貸出が好評。メンバー特典が手厚く、地域でもリピート率が高い。',
  },
  '69004ae1-3a3a-45ea-840f-506d7d3e437b': {
    // ホテル ウインド (伊勢崎)
    amenities: '豊富なウェルカムドリンク(ビール/ワイン等), 32インチ液晶TV, 有線放送',
    reviews:
      '【評判】伊勢崎。生ビールやワインなど、種類豊富なウェルカムドリンクのサービスが愛好家に人気。昔ながらの落ち着く空間。',
  },
  'f7d75fc6-8a26-46b2-bf7c-9c1171296de2': {
    // ホテル アイネランド (伊勢崎)
    amenities: 'サウナ/スチームサウナ(一部), マッサージチェア, 50インチ以上巨大TV, ブルーレイ/VOD',
    reviews:
      '【評判】伊勢崎。50インチ超の巨大TVと本格サウナ・マッサージチェアが揃うハイグレード店。設備の質に対して料金が手頃で、満足度が高い。',
  },
  '830e677c-334f-4cc0-bea9-637b4fcba9b2': {
    // ホテル 艶 安中店
    amenities:
      '任天堂Switch/最新カラオケ貸出, 骨盤矯正マッサージ機, ウォーターサーバー全室, 浴室液晶TV',
    reviews:
      '【評判】安中。エリア屈指のエンタメ設備。Switchや最新カラオケ、骨盤矯正機など、一日中遊んでリラックスできる豪華な内装。',
  },
};

updateMultipleHotelFacts(updates);
