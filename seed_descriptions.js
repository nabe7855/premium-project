import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const PREF_DESCRIPTIONS = [
  {
    id: 'fukuoka',
    description:
      '福岡県でおすすめのラブホテル（レジャーホテル）。博多、天神、北九州エリアを中心に、最新のサウナ付きホテルや女子会に人気のラグジュアリーな空間まで、プロが厳選した信頼できるホテル情報をお届けします。',
  },
  {
    id: 'kanagawa',
    description:
      '神奈川県（横浜・川崎・湘南）のラブホテルガイド。みなとみらいを一望できるホテルや、隠れ家的な人気店、格安で休憩できるスポットまで。verifiedバッジ付きの実際に訪問した記録から選べます。',
  },
  {
    id: 'tokyo',
    description:
      '東京都内のラブホテル完全ガイド。新宿・歌舞伎町、渋谷、池袋、鶯谷など各エリアの最新設備（VOD・露天風呂・サウナ）を完備したホテルを、現役キャストの視点で評価しました。',
  },
];

const CITY_DESCRIPTIONS = [
  {
    id: 'hakata',
    description:
      '博多エリアのラブホテルなら。博多駅周辺のビジネス利用可能なホテルから、中洲・春吉エリアのデートに使えるスタイリッシュなホテルまで、詳細な設備と口コミで選べます。',
  },
  {
    id: 'chuo',
    description:
      '福岡市中央区（天神・今泉・大名）のホテル。ショッピングやディナー後のデートに最適な、ハイグレードな内装とアメニティにこだわったホテルを厳選してご紹介。',
  },
  {
    id: 'yokohama',
    description:
      '横浜市内の厳選ホテル。横浜駅周辺、関内、石川町、新横浜エリアなど、観光帰りや仕事帰りに立ち寄りたい人気のレジャーホテルを多数掲載。',
  },
];

async function seed() {
  console.log('🌱 Seeding Descriptions...');

  for (const pref of PREF_DESCRIPTIONS) {
    const { error } = await supabase
      .from('lh_prefectures')
      .update({ description: pref.description })
      .eq('id', pref.id);
    if (error) console.error(`Error updating ${pref.id}:`, error);
    else console.log(`✅ Updated prefecture: ${pref.id}`);
  }

  for (const city of CITY_DESCRIPTIONS) {
    const { error } = await supabase
      .from('lh_cities')
      .update({ description: city.description })
      .eq('id', city.id);
    if (error) console.error(`Error updating ${city.id}:`, error);
    else console.log(`✅ Updated city: ${city.id}`);
  }

  console.log('🎉 Done seeding descriptions.');
}

seed();
