import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import path from 'path';

async function backup() {
  const slugsToDraft = [
    'self-pleasure-guide',
    'couple-sex-communication',
    'women-orgasm-science',
    'femtech-sex-health',
    'self-care-tonight'
  ];

  console.log('Fetching articles for backup...');
  const articlesToBackup = await prisma.mediaArticle.findMany({
    where: {
      slug: { in: slugsToDraft }
    },
    include: {
      tags: { include: { tag: true } }
    }
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const backupFilePath = path.join(tmpDir, `amolab_triage_backup_${timestamp}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(articlesToBackup, null, 2), 'utf8');

  console.log(`✅ Backup saved to: ${backupFilePath}`);
  console.log(`Backed up ${articlesToBackup.length} articles.`);
  return backupFilePath;
}

backup().catch(console.error);
