import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const GOOGLE_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

import { createClient } from '@supabase/supabase-js';

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.toString().replace(/\D/g, '');
}

function normalizeName(name) {
  if (!name) return '';
  let n = name.replace(/[ａ-ｚＡ-Ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
  return n
    .toLowerCase()
    .replace(/[\uff08\uff09\(\)\s]/g, '')
    .trim();
}

async function uploadImage(hotelId, photoReference) {
  if (!photoReference) return null;
  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(photoUrl);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `hotels/${hotelId}_main.jpg`;
    await supabase.storage.from('hotel-images').upload(fileName, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });
    const {
      data: { publicUrl },
    } = supabase.storage.from('hotel-images').getPublicUrl(fileName);
    return publicUrl;
  } catch (e) {
    return null;
  }
}

async function getGoogleData(hotelName, phone) {
  try {
    const query = encodeURIComponent(`${hotelName} ${phone}`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_API_KEY}&language=ja`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== 'OK' || !data.results.length) return null;
    return data.results[0];
  } catch (e) {
    return null;
  }
}

async function main() {
  const csvPath =
    'c:/Users/nabe7/Documents/Projects/premium-project/public/サイト改修ToDo - Hotel phone number website.csv';
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
  const dataRows = results.data.slice(2);

  const dbHotels = await prisma.lh_hotels.findMany();
  const dbPhones = new Set(dbHotels.map((h) => normalizePhone(h.phone)).filter(Boolean));
  const dbNames = new Set(dbHotels.map((h) => normalizeName(h.name)).filter(Boolean));

  console.log(`🚀 DB未登録ホテルの新規作成を開始します...`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const row of dataRows) {
    const csvName = row[2]?.trim();
    const csvPhone = row[3]?.trim();
    const normCsvPhone = normalizePhone(csvPhone);
    const csvWebsite = row[4]?.trim();

    if (!csvName || !normCsvPhone) continue;

    // すでにDBにあるかチェック
    if (dbPhones.has(normCsvPhone) || dbNames.has(normalizeName(csvName))) {
      continue;
    }

    console.log(`🆕 新規登録候補: ${csvName} (${csvPhone})`);

    // Googleで情報を補完
    const gPlace = await getGoogleData(csvName, csvPhone);
    if (!gPlace) {
      console.log(`  [SKIP] Googleで見つかりませんでした`);
      skippedCount++;
      continue;
    }

    const hotelId = uuidv4();
    const imgUrl = await uploadImage(hotelId, gPlace.photos?.[0]?.photo_reference);

    // 都道府県判定
    let prefId = null;
    if (gPlace.formatted_address.includes('福岡')) prefId = ' Fukuoka';
    else if (gPlace.formatted_address.includes('神奈川')) prefId = 'Kanagawa';

    try {
      await prisma.lh_hotels.create({
        data: {
          id: hotelId,
          name: csvName,
          phone: csvPhone,
          website: csvWebsite,
          address: gPlace.formatted_address,
          image_url: imgUrl,
          place_id: gPlace.place_id,
          prefecture_id: prefId,
          status: 'active',
          created_at: new Date(),
        },
      });
      console.log(`  ✅ 登録完了: ${hotelId}`);
      createdCount++;

      // DBキャッシュの更新（同じホテルがCSVに複数回出てきても大丈夫なように）
      dbPhones.add(normCsvPhone);
      dbNames.add(normalizeName(csvName));
    } catch (e) {
      console.error(`  [ERROR] DB登録失敗: ${e.message}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎉 完了！\n新規作成: ${createdCount}件\n特定不能: ${skippedCount}件`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
