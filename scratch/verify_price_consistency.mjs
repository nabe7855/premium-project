import fs from 'fs';
import { prisma } from '../src/lib/prisma.ts';

async function verifyPriceConsistency() {
  console.log('======================================================');
  console.log('=== (2) PRICING DATA EXACT MATCH VERIFICATION (DB vs PAGES) ===');
  console.log('======================================================\n');

  // 1. Raw DB Query Result
  const dbResult = await prisma.store.findMany({
    where: { slug: { in: ['fukuoka', 'yokohama'] } },
    select: {
      slug: true,
      name: true,
      price_config: {
        select: {
          courses: {
            where: { name: { contains: 'スタンダード' } },
            select: {
              name: true,
              plans: {
                select: { minutes: true, price: true, display_order: true },
                orderBy: { display_order: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  console.log('【1. DB Query Raw Execution Result (JSON)】');
  console.log(JSON.stringify(dbResult, null, 2));

  console.log('\n----------------------------------------------------\n');

  // 2. Fukuoka Price Page Raw HTML Extracts
  const fukuokaRaw = fs.readFileSync('scratch/fukuoka_price_raw.html', 'utf8');
  console.log('【2. Fukuoka Store Price Page (/store/fukuoka/price) Raw HTML Price Snippet】');
  const fukuokaIdx = fukuokaRaw.indexOf('スタンダードコース');
  console.log(fukuokaRaw.substring(fukuokaIdx, fukuokaIdx + 800));

  console.log('\n----------------------------------------------------\n');

  // 3. Yokohama Price Page Raw HTML Extracts
  const yokohamaRaw = fs.readFileSync('scratch/yokohama_price_raw.html', 'utf8');
  console.log('【3. Yokohama Store Price Page (/store/yokohama/price) Raw HTML Price Snippet】');
  const yokohamaIdx = yokohamaRaw.indexOf('スタンダードコース');
  console.log(yokohamaRaw.substring(yokohamaIdx, yokohamaIdx + 800));

  console.log('\n----------------------------------------------------\n');

  // 4. Top Page Fukuoka & Yokohama Raw HTML Extracts
  const topRaw = fs.readFileSync('scratch/top_raw.html', 'utf8');
  console.log('【4. Root Top Page (/) Fukuoka & Yokohama SSR Price HTML Snippet】');
  const fukuokaTopIdx = topHtmlIndex(topRaw, 'ストロベリーボーイズ福岡店 基本コース価格');
  const yokohamaTopIdx = topHtmlIndex(topRaw, 'ストロベリーボーイズ横浜店 基本コース価格');
  
  console.log('Fukuoka Block in Top Page:');
  console.log(topRaw.substring(fukuokaTopIdx, fukuokaTopIdx + 700));

  console.log('\nYokohama Block in Top Page:');
  console.log(topRaw.substring(yokohamaTopIdx, yokohamaTopIdx + 700));
}

function topHtmlIndex(html, searchStr) {
  return html.indexOf(searchStr);
}

verifyPriceConsistency().catch(console.error);
