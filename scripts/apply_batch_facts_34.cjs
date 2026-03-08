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
  // --- Batch 34: Strategic Regional & Premium ---
  'ea25572a-de2f-4b13-82c1-db82e7113b20': {
    // リヴィエラ 相模原
    amenities:
      '全室ウォーターサーバー, 広い客室, 無料朝食(好評), 加湿空気清浄機, 充実したアメニティ',
    reviews:
      '【評判】相模原。広くて清潔な部屋と、リーズナブルで美味しい朝食が人気。全室に使い勝手の良いウォーターサーバーがあるなど、細やかな配慮が光るコスパ店。',
  },
  '8514378c-3a60-4131-b298-f8a679a42a57': {
    // GRAN. 相模原
    amenities:
      'ReFa最新11機種レンタル, LG Styler, スチームサウナ, 浴室YouTube視聴, 圏央道アクセス至便',
    reviews:
      '【評判】相模原。リニューアルで最新美容家電の宝庫に。LG Stylerでの衣類ケアや、浴室でYouTubeを見ながらのスチームサウナなど、最新設備を遊び尽くせる。',
  },
  '263501b5-18a9-4162-aebc-6bd8d7734dad': {
    // BAMBOO GARDEN 新横浜
    amenities:
      '2021年リノベーション, 洗練されたデザイナーズ空間, 24時間ルームサービス, 快適なワイドベッド',
    reviews:
      '【評判】新横浜。リノベ直後で非常に近代的かつ清潔。ホテル全体がハイセンスなデザインで統一されており、ビジネスからデートまで幅広く満足度が高い。',
  },
  '294521f0-f8f7-43f1-a2c8-420d77e3ecaa': {
    // LUNA 茨木
    amenities:
      'ヒール風呂(癒やし), 室内ビールサーバー, プロジェクター, VRルーム, プラネタリウムルーム',
    reviews:
      '【評判】茨木。遊び心の塊のようなホテル。客室でのビールサーバーやプラネタリウム、さらにはヒール型の浴槽など、ここだけでしか味わえない驚きの仕掛けが満載。',
  },
  'cdb3c3e4-01ac-48e1-bc61-b5fa002bc7c7': {
    // LOTUS Oriental 京都
    amenities: '貸切露天風呂(無料), 天井水槽ルーム, 室内ビールサーバー, ネオジャパネスク空間',
    reviews:
      '【評判】竹田。アジアと和が融合した超高級リゾート。天井にある水槽や、無料で利用できる本格的な貸切露天風呂など、京都の夜を贅沢に彩る最高峰の演出。',
  },
  '29c3838c-3344-430e-928b-0e58a35bfb4b': {
    // ウォーターゲート 札幌
    amenities: '本格サウナ(100度)&水風呂(15度)完備, 浴室TV, マッサージチェア, すすきの徒歩圏内',
    reviews:
      '【評判】札幌。本格派サウナー注目の宿。100度のサウナと15度の水風呂を客室で独り占めできる体験は格別。清掃も行き届いており、サービスレベルが高い。',
  },
  'b95233b9-6153-494b-8bec-7c103aab61d8': {
    // AROMA BOWERY (横浜)
    amenities: '館内アロマ演出, 浴室TV, 伊勢佐木長者町徒歩1分, 大人向け落ち着いた内装',
    reviews:
      '【評判】横浜。一歩足を踏み入れるとアロマの香りに癒やされる、大人の隠れ家。駅近の好立地ながら静寂が守られており、落ち着いたデートを楽しみたい時に最適。',
  },
  'c68f13a7-f906-4c90-8417-2e555f5fd3e0': {
    // アクアキッス 守山
    amenities:
      '天空露天ジャグジー(最上階), ReFaシャワーヘッド全室, YouTube見放題ネットTV, 豪華無料モーニング',
    reviews:
      '【評判】守山。琵琶湖を望む最高のロケーション。最上階の露天ジャグジーやReFa完備のスパ体験に加え、選べる無料の食事やスイーツが豪華すぎると大評判。',
  },
  'a97e8697-75ce-4787-846b-210d637a56d4': {
    // TIME 厚木
    amenities: '厚木IC至近, カラオケ設置ルーム, 湘南アウトレット至近, リーズナブルな休憩プラン',
    reviews:
      '【評判】厚木。ドライブ中の休憩に最適。インターからのアクセスが良く、清潔で広々とした室内。周辺の買い物帰りなどに手軽に立ち寄れる便利さが重宝される。',
  },
  '5836bef3-8e81-43c3-a8a5-c4bab55553f1': {
    // パレットゴールド (倉敷)
    amenities:
      'リクライニングベッド完備, マッサージチェア(一部), 100分低価格コース, 西富井駅徒歩7分',
    reviews:
      '【評判】倉敷。短時間の休憩が非常にリーズナブル。足元の高さを調整できるリクライニングベッドなど、旅の疲れを少しだけ癒やしたい時に頼れる街のホテル。',
  },
};

updateMultipleHotelFacts(updates);
