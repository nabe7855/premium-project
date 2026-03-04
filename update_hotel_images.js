import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env と .env.local の両方を読み込む
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const GOOGLE_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

/**
 * Google Places APIを使ってホテルのPlace IDと写真を検索
 */
async function findHotelOnGoogle(hotelName, address) {
  try {
    const query = encodeURIComponent(`${hotelName} ${address || ''}`);
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}&language=ja`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results.length) {
      console.log(`  [SKIP] Googleで見つかりませんでした: ${hotelName}`);
      return null;
    }

    const place = data.results[0]; // 最も関連性の高い最初の結果を使用
    return {
      place_id: place.place_id,
      photo_reference: place.photos?.[0]?.photo_reference || null,
      formatted_address: place.formatted_address,
    };
  } catch (error) {
    console.error(`  [ERROR] Google検索中にエラーが発生しました: ${error.message}`);
    return null;
  }
}

/**
 * Googleから画像をダウンロードし、Supabase Storageにアップロード
 */
async function downloadAndUploadImage(hotelId, photoReference) {
  if (!photoReference) return null;

  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;

    // 画像を取得
    const response = await fetch(photoUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Supabase Storage にアップロード (hotels/ フォルダに保存)
    const fileName = `hotels/${hotelId}_main.jpg`;
    const { data, error } = await supabase.storage.from('hotel-images').upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

    if (error) throw error;

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('hotel-images').getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error(`  [ERROR] 画像処理中にエラーが発生しました: ${error.message}`);
    return null;
  }
}

async function main() {
  if (!GOOGLE_API_KEY) {
    console.error(
      '❌ GOOGLE_PLACES_API_KEY が設定されていません。 .env または .env.local を確認してください。',
    );
    return;
  }

  console.log('🚀 ホテル画像の自動取得を開始します...');

  // 画像がまだ設定されていない、またはPlace IDが未取得のホテルをDBから取得
  const hotels = await prisma.lh_hotels.findMany({
    where: {
      OR: [{ image_url: null }, { place_id: null }],
    },
    take: 500, // 全件一括で処理
  });

  console.log(`📊 処理対象: ${hotels.length} 件`);

  for (const hotel of hotels) {
    console.log(`\n🏨 処理中: ${hotel.name}`);

    // 1. Googleで検索
    const googleData = await findHotelOnGoogle(hotel.name, hotel.address);
    if (!googleData) continue;

    const updates = {};
    if (googleData.place_id) updates.place_id = googleData.place_id;

    // 2. 特徴的な写真があれば取得してアップロード
    if (googleData.photo_reference) {
      const publicUrl = await downloadAndUploadImage(hotel.id, googleData.photo_reference);
      if (publicUrl) {
        updates.image_url = publicUrl;
        console.log(`  ✅ 画像を保存しました: ${publicUrl}`);
      }
    }

    // 3. データベースを更新
    if (Object.keys(updates).length > 0) {
      await prisma.lh_hotels.update({
        where: { id: hotel.id },
        data: updates,
      });
      console.log('  ✨ データベースを更新しました');
    }

    // APIのレート制限に配慮して少し待機
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n✅ すべての処理が完了しました。');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
