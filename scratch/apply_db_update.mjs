import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const timestamp = Date.now();
  const backupPath = path.join(process.cwd(), 'tmp', 'news_backup_1785465716648.json');
  if (!fs.existsSync(backupPath)) {
    throw new Error('Original backup file not found!');
  }

  const rawBackup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  const originalMousho = rawBackup.mousho;
  const originalObon = rawBackup.obon;

  const idMousho = originalMousho.id;
  const idObon = originalObon.id;

  console.log('--- Step 1: Loaded original backup records ---');
  console.log(`Mousho Original Title: "${originalMousho.title}" (Slug: ${originalMousho.slug})`);
  console.log(`Obon Original Title: "${originalObon.title}" (Slug: ${originalObon.slug})`);

  // Step 2: Title Assert
  if (!originalMousho.title.includes('猛暑日割')) {
    throw new Error(`ASSERTION FAILED: Mousho title does not contain "猛暑日割"`);
  }
  if (!originalObon.title.includes('8月13日')) {
    throw new Error(`ASSERTION FAILED: Obon title does not contain "8月13日"`);
  }
  console.log('✅ Title assertions PASSED!');

  // Step 3: Prepare final texts

  // 1. Mousho Article: Restore original base description, then append ONLY the 3 links paragraph
  const moushoSections = JSON.parse(JSON.stringify(originalMousho.sections));
  const moushoBaseDescription = originalMousho.sections[0].content.description;
  const moushoAppendix = `\n\n猛暑日割は、通常コースすべてにご利用いただけます。コース内容と料金の詳細は[福岡店の料金システム](/store/fukuoka/price)を、本日ご案内できるセラピストは[出勤スケジュール](/store/fukuoka/schedule)をご覧ください。福岡で[女性用風俗が初めての方へのご案内](/store/fukuoka/first-time)もあわせてどうぞ。`;
  
  moushoSections[0].content.description = moushoBaseDescription + moushoAppendix;

  // 2. Obon Article: Set new title and full text replacement with internal link to Mousho article slug
  const obonSections = JSON.parse(JSON.stringify(originalObon.sections));
  const newObonTitle = '【福岡店】お盆期間(8月13日〜17日)も通常営業｜ご予約はお早めに';
  const newObonDescription = `ストロベリーボーイズ福岡店は、お盆期間(8月13日〜17日)も休まず通常営業いたします。受付時間も通常どおりです。\n\n例年この5日間は、1年で最もご予約が集中する期間です。特に8月13日〜15日の夕方以降は、直前のご連絡ではご希望に添えない場合がございます。帰省やご旅行で福岡(博多・天神・中洲エリア)にお越しの方のご利用も多く、ホテルへの出張のご依頼が増えるのもこの時期です。\n\n日程が決まっている方は、8月上旬までにご相談いただけますと、ご希望のセラピスト・お時間を確保しやすくなります。ご予約はWEB予約・公式LINE・お電話にて承っています。\n\n期間中の出勤状況は[出勤スケジュール](/store/fukuoka/schedule)にて随時更新します。はじめてのご利用をご検討中の方は[初めての方へのご案内](/store/fukuoka/first-time)を、コースと料金は[料金システム](/store/fukuoka/price)をご覧ください。なお、気温35℃以上の日は[猛暑日割](/store/fukuoka/news/${originalMousho.slug})をご利用いただけます。`;

  obonSections[0].content.description = newObonDescription;

  // Step 4: Write updates to DB
  console.log('--- Step 4: Updating DB records ---');

  const updatedMousho = await prisma.pageRequest.update({
    where: { id: idMousho },
    data: {
      sections: moushoSections,
    },
  });
  console.log(`✅ Mousho article updated! ID: ${updatedMousho.id}`);

  const updatedObon = await prisma.pageRequest.update({
    where: { id: idObon },
    data: {
      title: newObonTitle,
      sections: obonSections,
    },
  });
  console.log(`✅ Obon article updated! ID: ${updatedObon.id}`);

  console.log('\n--- Step 5: Final Content Check ---');
  console.log('1. Mousho description snippet (end):');
  console.log(updatedMousho.sections[0].content.description.slice(-300));
  console.log('\n2. Obon title & full description:');
  console.log('Title:', updatedObon.title);
  console.log('Description:\n', updatedObon.sections[0].content.description);
}

main()
  .catch((e) => {
    console.error('❌ Error executing DB update:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
