import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import Papa from 'papaparse';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const prisma = new PrismaClient();

async function main() {
  const csvFilePath =
    'c:/Users/nabe7/Documents/Projects/premium-project/public/サイト改修ToDo - Hotel phone number website.csv';
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');

  // Skip first 2 lines (header/instructions)
  const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
  const dataRows = results.data.slice(2);

  console.log(`📂 CSV読み込み完了: ${dataRows.length}件`);

  let added = 0;
  let updated = 0;

  for (const row of dataRows) {
    const name = row[2]?.trim();
    const phone = row[3]?.trim();
    const website = row[4]?.trim();

    if (!name) continue;

    // 名前または電話番号で既存のホテルを探す
    let hotel = await prisma.lh_hotels.findFirst({
      where: {
        OR: [{ name: name }, { phone: phone && phone !== 'ー' ? phone : undefined }].filter(
          Boolean,
        ),
      },
    });

    if (hotel) {
      // 既存ホテルのURLを更新
      if (website && website !== 'ー' && hotel.website !== website) {
        await prisma.lh_hotels.update({
          where: { id: hotel.id },
          data: { website: website },
        });
        updated++;
      }
    } else {
      // 新規ホテルとして追加 (最低限の情報)
      // 注意: prefecture_id, city_id などが必須の場合はダミーを入れるか、
      // 既存の地域情報を類推する必要があるが、一旦website更新を優先。
      // ここでは、一旦既存のホテルが見つかった場合のみwebsiteを同期する形にする。
      // (地域が不明なまま新規作成するとサイト上で表示されないため)
    }
  }

  console.log(`✅ 同期完了: 更新 ${updated}件`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
