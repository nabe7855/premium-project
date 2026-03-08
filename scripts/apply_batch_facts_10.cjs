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
  '90fc1c64-23ce-4d2f-b507-a939cdd88180': {
    // ホテル ステラビアンカ
    amenities: 'マッサージチェア(一部), 浴室TV(一部), ジェットバス, 電気ポット, 除菌シート配布',
    reviews:
      '【評判】越谷。リニューアル済みで清潔感があり、全体的に高評価。価格とクオリティのバランスが良い。',
  },
  'db812cc5-668e-4c26-b063-b2186fbcbc5b': {
    // HOTEL YELLOW TOKOROZAWA
    amenities:
      '無料ビールサーバー(ロビー), シャンプー/バスソルトバー, キングベッド客室あり, 無料朝食, 24時間セキュリティ',
    reviews:
      '【評判】所沢。スタッフのホスピタリティが非常に高く、豪華な朝食やロビーの無料サービスが絶賛されている。',
  },
  'a573cd12-1e86-4f5b-afd5-8fb4b855b814': {
    // HOTEL Rima Style LUXE
    amenities:
      '全室最新マッサージチェア, 浴室TV, ブロアバス, レインボーバス, スチームサウナ(一部), 高機能ヘアアイロン',
    reviews:
      '【評判】札幌。リラクゼーション設備が屈指の充実度。清潔で広く、女性向けアメニティに力が入っている。',
  },
  '0ec32603-4b27-4740-b5e3-c368c6e7f1bb': {
    // HOTEL EXE 蓮田
    amenities:
      '岩盤浴(一部), ウェルカムドリンク, 未就学児無料プランあり, 駐車場無料, 手頃なフードメニュー',
    reviews:
      '【評判】蓮田。圧倒的なコスパ。ファミリーや女子会（ママ会）利用も推奨されるほど、サービスが多角的で親切。',
  },
  '65085a28-a388-4ce7-9220-bfac3003ac30': {
    // 旭川 ホテル818
    amenities: '無料Wi-Fi, 禁煙ルームあり, 駐車場12台(ハイルーフ可), リーズナブルな料金体系',
    reviews:
      '【評判】旭川。市街地から少し離れるが、その分静かでコスパが良い。清潔感があり安定したサービス。',
  },
  'cf8aa7fb-def5-4e5e-bb2e-f7393a9b5844': {
    // HOTEL ATLANTIS 小樽
    amenities:
      '展望風呂, アクアリウム, サウナルーム, 映画プロジェクター, ダーツ付き客室あり, 屋内大型駐車場',
    reviews:
      '【評判】小樽。娯楽設備の宝庫。美味しい朝食、広い部屋、バルコニー、サウナなど「遊べるホテル」として最高評価。',
  },
  'b39cac3c-8dc0-44e5-9bc8-0a605c1d20ec': {
    // ホテル 現代楽園 高崎
    amenities:
      '1h無料ドリンクバー(クラフトビール等), スイーツビュッフェ(週1), 5.1chサラウンド, ドルチェグスト全室, ガーデンテラス',
    reviews:
      '【評判】高崎。もはやリゾートホテル。豪華なドリンク・スイーツサービスと圧倒的なアメニティで、贅沢な時間を過ごせる。',
  },
  '2f9fc337-7889-4b3c-90b0-6de93ff2427d': {
    // ホテル ウォーターゲート伊勢崎
    amenities:
      'ドライサウナ(一部), 浴室TV, プロジェクター(一部), 無料朝食バイキング, 豊富なコスプレレンタル',
    reviews:
      '【評判】伊勢崎。広々とした客室と美味しい食事が好評。ビジネス目的でも満足できるほどの充実した設備。',
  },
  'e9dafb40-e87b-4fd5-ab82-6895146dd41f': {
    // BLUE HOTEL OCTA
    amenities:
      '天然温泉完備, スパバス, 無料ドリンク/スイーツ(ロビー), 駐車場無料, 24時間ルームサービス',
    reviews:
      '【評判】札幌。温泉が大人気で「癒やしの宿」として定評。清潔感があり、ロビーの無料サービスも宿泊客に喜ばれている。',
  },
  'ed4c182f-a5e7-42ac-ac61-10c6e49b973d': {
    // ウォーターホテルK
    amenities:
      'スチームサウナ, ジェットバス, 浴室TV, 豊富な手作りスイーツ, 美容効果の高い加湿器全室, 徹底防音',
    reviews:
      '【評判】札幌。女性向けサービス（美容家電・スイーツ）が非常に手厚い。防音性能が高く、静かに二人だけの時間を過ごせる。',
  },
};

updateMultipleHotelFacts(updates);
