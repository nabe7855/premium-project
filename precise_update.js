import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import Papa from 'papaparse';

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

// 電話番号の正規化（数字のみ抽出）
function normalizePhone(phone) {
  if (!phone) return '';
  return phone.toString().replace(/\D/g, '');
}

// 名前の正規化（比較用）
function normalizeName(name) {
  if (!name) return '';
  let n = name.replace(/[ａ-ｚＡ-Ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
  return n
    .toLowerCase()
    .replace(/[\uff08\uff09\(\)\s]/g, '')
    .trim();
}

/**
 * Googleから画像をダウンロードし、Supabase Storageにアップロード
 */
async function uploadImage(hotelId, photoReference) {
  if (!photoReference) return null;
  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(photoUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `hotels/${hotelId}_main.jpg`;
    const { error } = await supabase.storage.from('hotel-images').upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('hotel-images').getPublicUrl(fileName);
    return publicUrl;
  } catch (error) {
    console.error(`  [ERROR] 画像処理失敗: ${error.message}`);
    return null;
  }
}

/**
 * Googleで検索
 */
async function getGoogleData(hotelName, address) {
  try {
    const query = encodeURIComponent(`${hotelName} ${address || ''}`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}&language=ja`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results.length) return null;
    const p = data.results[0];
    return {
      place_id: p.place_id,
      photo_ref: p.photos?.[0]?.photo_reference || null,
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  if (!GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY が見つかりません。');
    return;
  }

  const csvPath =
    'c:/Users/nabe7/Documents/Projects/premium-project/public/サイト改修ToDo - Hotel phone number website.csv';
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
  const dataRows = results.data.slice(2);

  const dbHotels = await prisma.lh_hotels.findMany();

  console.log(`🚀 精密マッチングによる最終更新を開始します... (対象行: ${dataRows.length})`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of dataRows) {
    const csvName = row[2]?.trim();
    const csvPhone = normalizePhone(row[3]);
    const csvWebsite = row[4]?.trim();

    if (!csvName || !csvPhone) continue;

    // 1. 電話番号でDBを検索（最強の一致条件）
    let match = dbHotels.find((h) => normalizePhone(h.phone) === csvPhone);

    // 2. 電話番号で不明な場合かつCSVと住所の冒頭が一致する場合に名前で検索
    if (!match) {
      const normCsvName = normalizeName(csvName);
      match = dbHotels.find((h) => {
        const normDbName = normalizeName(h.name);
        return normDbName.includes(normCsvName) || normCsvName.includes(normDbName);
      });
    }

    if (match) {
      // 既に画像とPlaceIDがある場合、およびwebsiteが登録済みの場合はスキップ
      if (match.image_url && match.place_id && match.website) {
        continue;
      }

      console.log(`✨ 一致確認: [CSV] ${csvName} -> [DB] ${match.name}`);

      const gData = await getGoogleData(match.name, match.address);
      const updates = { website: csvWebsite };

      if (gData) {
        updates.place_id = gData.place_id;
        const imgUrl = await uploadImage(match.id, gData.photo_ref);
        if (imgUrl) updates.image_url = imgUrl;
      }

      await prisma.lh_hotels.update({
        where: { id: match.id },
        data: updates,
      });

      updatedCount++;
      await new Promise((r) => setTimeout(r, 500));
    } else {
      skippedCount++;
    }
  }

  console.log(`\n🎉 完了！\n更新成功: ${updatedCount}件\n保留（DB未登録など）: ${skippedCount}件`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
