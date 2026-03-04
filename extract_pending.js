import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import Papa from 'papaparse';

const prisma = new PrismaClient();

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

async function main() {
  const csvFilePath =
    'c:/Users/nabe7/Documents/Projects/premium-project/public/サイト改修ToDo - Hotel phone number website.csv';
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  const results = Papa.parse(fileContent, { header: false, skipEmptyLines: true });
  const dataRows = results.data.slice(2);

  const allHotels = await prisma.lh_hotels.findMany({
    select: { id: true, name: true, address: true, image_url: true, place_id: true, phone: true },
  });

  const pendingList = [];

  for (const row of dataRows) {
    const csvName = row[2]?.trim();
    const csvPhone = row[3]?.trim();
    const normCsvPhone = normalizePhone(csvPhone);
    const csvWebsite = row[4]?.trim();

    if (!csvName) continue;

    // 電話番号または名前で一致を確認
    const match = allHotels.find(
      (h) =>
        normalizePhone(h.phone) === normCsvPhone ||
        normalizeName(h.name) === normalizeName(csvName),
    );

    if (!match || !match.image_url || !match.place_id) {
      pendingList.push({
        CSV上の名称: csvName,
        CSV電話番号: csvPhone,
        CSVサイト: csvWebsite,
        理由: !match ? 'DB未登録かつGoogleでも特定不能' : 'データ不足（画像/IDなし）',
        'DB側の候補（似た名前）': match ? `${match.name} (${match.address || '住所不明'})` : 'なし',
      });
    }
  }

  const csvOutput = Papa.unparse(pendingList);
  fs.writeFileSync(
    'c:/Users/nabe7/Documents/Projects/premium-project/public/保留ホテルリスト.csv',
    csvOutput,
  );
  console.log(`Extract complete. ${pendingList.length} items saved to public/保留ホテルリスト.csv`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
