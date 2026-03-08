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
  'b59e9ac2-1cba-4e82-80ed-8b42c2bf489e': {
    // 福島 MISTY 飯坂
    amenities: '天然温泉(美肌の湯), ナノ水全館導入, 高級しゃぶしゃぶルームサービス, 浴室TV(一部)',
    reviews:
      '【評判】飯坂。本格的な天然温泉を室内で楽しめる贅沢さが魅力。ナノ水でお肌もしっとりし、温泉旅行気分を味わいながら絶品しゃぶしゃぶも堪能できる。',
  },
  'b4e0822f-2327-452a-b9b1-dddecbfe4986': {
    // SARA GRANDE 五反田
    amenities:
      '50室全室異なるコンセプト, ソフトクリーム無料, 入浴剤バイキング, お菓子・ドリンクバー無料, コスプレ',
    reviews:
      '【評判】五反田。2022年オープンのフラッグシップ店。広大な風呂と、ソフトクリームやお菓子が食べ放題のサービスに「遊べるホテル」として高評価。',
  },
  'cd09266e-3187-4b25-9972-450d946dacb8': {
    // サンモリッツ・テラ 根岸
    amenities:
      'テラス付き客室(一部), 和室タイプ(一部), 大きな浴室, 駅近好立地, カールドライヤー完備',
    reviews:
      '【評判】根岸。サンモリッツグループならではの安定した広さと開放的なテラスが自慢。電車の音は多少あるが、それを補って余りあるホスピタリティ。',
  },
  'ade98c00-fa97-41e0-843e-c3f20049f060': {
    // WILL BAY CITY 亀戸
    amenities: 'シャンプーバー, 入浴剤・ドリンクバー無料, 会員ウェルカムビールサービス, VOD全室',
    reviews:
      '【評判】亀戸。ロビーのアメニティバイキングが圧巻。手頃な価格で豊富な貸出シャンプーやドリンクを楽しめ、リピーターに愛される親しみやすい一軒。',
  },
  'effe220f-84d3-4cfe-b4a0-a88310cb20ea': {
    // M・Gate RESORT 福岡
    amenities:
      '最上階露天風呂, 100円朝食サービス, 豪華デザイナーズ照明, コスプレレンタル豊富, VOD全室',
    reviews:
      '【評判】小戸。最上階の露天風呂から眺める景色が最高。100円の格安朝食や、夜景に映える豪華な照明演出など、リゾートとしての完成度が極めて高い。',
  },
  '6004509f-96f3-4f27-b0ef-a6a6e137293b': {
    // ホテル プルミエ 池袋
    amenities:
      '2023全室リニューアル, レインボーブロアバス, VSドライヤー完備, デザイナーズルーム, 大型TV',
    reviews:
      '【評判】池袋。リニューアルで生まれ変わった清潔空間。全室に導入された七色に光るブロアバスと、ヴィダルサスーンの高機能ドライヤーが女性から好評。',
  },
  '95a7155e-39cc-4547-8757-e2ed82b531d0': {
    // HOTEL ZERO III 渋谷
    amenities: '渋谷駅徒歩5分, 水中照明, ジェットバス, 最新VOD映画見放題, 3名以上利用可',
    reviews:
      '【評判】円山町。渋谷のど真ん中にありながら水中照明や広いジャグジーで非日常を演出。VODも充実しており、遊びの拠点として抜群のタイパを誇る。',
  },
  '513ef1e1-358e-405a-b166-3ce1b726969c': {
    // ホテル クイーン 池袋
    amenities: 'Alexa全室導入, VOD, 豊富なレンタルグッズ, 清潔な浴室, Wi-Fi完備',
    reviews:
      '【評判】池袋。Alexaでの音声操作など最先端の利便性を追求。浴室の広さとおしゃれな内装が人気で、充実したレンタル品により手ぶらでの急泊も安心。',
  },
  '3be96a90-be4d-4800-9f2f-ca9b07db6f9d': {
    // レステイ 郡山アイネ
    amenities: 'サウナ室(1室限定予約可), 全室無料ランジェリー贈呈, LINE特典充実, 徹底した清掃管理',
    reviews:
      '【評判】郡山。建物は古めだが、それを補う清掃の徹底とサウナ室の完備、さらには全員にランジェリー無料プレゼントという驚きのサービスで支持継続。',
  },
  '1f154e2d-d301-469f-9525-d8c72254f1b4': {
    // HOTEL AQUA GATE 岡崎
    amenities: '幻想的な水中照明, 多彩なバスアメニティ, 大型駐車場, VOD完備, コンビニBOX',
    reviews:
      '【評判】岡崎。その名の通り「水」の演出が幻想的。広いお風呂と落ち着いた内装、そして豊富なバスアメニティが、カップルに安らぎの時間を提供。',
  },
};

updateMultipleHotelFacts(updates);
