import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import Papa from 'papaparse';

const prisma = new PrismaClient();

function normalize(name) {
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
    select: { id: true, name: true, phone: true, website: true },
  });

  const hotelMap = new Map();
  allHotels.forEach((h) => {
    const norm = normalize(h.name);
    if (!hotelMap.has(norm)) hotelMap.set(norm, []);
    hotelMap.get(norm).push(h);
  });

  let updatedCount = 0;
  let notFoundCount = 0;
  let ambiguousCount = 0;
  const ambiguousNames = [];

  for (const row of dataRows) {
    const csvName = row[2]?.trim();
    let phone = row[3]?.trim();
    let website = row[4]?.trim();

    if (!csvName) continue;
    if (phone === 'ー' || phone === 'ー ' || !phone) phone = '';
    if (website === 'ー' || website === 'ー ' || !website) website = '';

    const normCsv = normalize(csvName);
    const matches = hotelMap.get(normCsv);

    let targetId = null;

    if (matches && matches.length === 1) {
      targetId = matches[0].id;
    } else if (matches && matches.length > 1) {
      const exactMatch = matches.find((m) => m.name === csvName);
      if (exactMatch) targetId = exactMatch.id;
      else {
        ambiguousCount++;
        ambiguousNames.push(csvName + ' -> [' + matches.map((m) => m.name).join(', ') + ']');
      }
    } else {
      let potMatches = [];
      for (const [normDb, dbHotels] of hotelMap.entries()) {
        if (normDb.includes(normCsv) || normCsv.includes(normDb)) {
          potMatches.push(...dbHotels);
        }
      }
      if (potMatches.length === 1) {
        targetId = potMatches[0].id;
      } else if (potMatches.length > 1) {
        ambiguousCount++;
        ambiguousNames.push(
          csvName + ' (Partial) -> [' + potMatches.map((m) => m.name).join(', ') + ']',
        );
      } else {
        notFoundCount++;
      }
    }

    if (targetId) {
      await prisma.lh_hotels.update({
        where: { id: targetId },
        data: {
          phone: phone || undefined,
          website: website || undefined,
        },
      });
      updatedCount++;
    }
  }

  const summary = `
Successfully updated: ${updatedCount}
Not found: ${notFoundCount}
Ambiguous: ${ambiguousCount}

Ambiguous Examples:
${ambiguousNames.slice(0, 50).join('\n')}
`;
  fs.writeFileSync('ambiguous_analysis.txt', summary);
  console.log('Update complete. Analysis saved to ambiguous_analysis.txt');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
