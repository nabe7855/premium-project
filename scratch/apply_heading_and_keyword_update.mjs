import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const targetSlug = 'news-1785718651524';
  const expectedTitle = '【福岡店】新人セラピスト「りく」「青空（せいら）」が入店しました';

  const article = await prisma.pageRequest.findUnique({
    where: { slug: targetSlug },
  });

  if (!article) {
    console.error('❌ Article not found with slug:', targetSlug);
    process.exit(1);
  }

  // Guard 1-2: Assert title
  if (article.title !== expectedTitle) {
    console.error(`❌ Title mismatch assertion failed!\nExpected: "${expectedTitle}"\nActual: "${article.title}"`);
    process.exit(1);
  }
  console.log('✅ Guard 1-2: Title assertion matched perfectly:', article.title);

  // Guard 1-1: Backup to tmp/news_backup_<timestamp>.json
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  const backupPath = path.join(tmpDir, `news_backup_${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(article, null, 2), 'utf-8');
  console.log('✅ Guard 1-1: Saved backup to:', backupPath);

  const currentSections = Array.isArray(article.sections) ? article.sections : [];

  const updatedSections = [
    {
      id: currentSections[0]?.id || 'y3y5mn6zl',
      type: 'hero',
      content: {
        imageUrl: currentSections[0]?.content?.imageUrl,
        description: 'いつも福岡の女性用風俗ストロベリーボーイズ福岡店をご利用いただき、誠にありがとうございます。このたび福岡店に、新人セラピスト「りく」と「青空（せいら）」の2名が入店いたしました。',
      },
    },
    {
      id: 'section-riku',
      type: 'text_block',
      content: {
        title: 'りく（癒し系新人セラピスト）',
        description: `国家資格を持ち、指圧やオイルマッサージの技術に確かな自信を持つ癒し系セラピストです。レディファーストを心がけ、お客様一人ひとりの気持ちやペースを大切にしながら、その日の体調や気分に合わせた施術をご提案いたします。「頑張っているからこそ、誰かの前では無理をしてしまう」——そんな日も、飾らずありのままで過ごせる時間をお届けします😊\n[▶ りくのプロフィール](https://www.sutoroberrys.jp/store/fukuoka/cast/-25469e)`,
      },
    },
    {
      id: 'section-seira',
      type: 'text_block',
      content: {
        title: '青空（せいら）',
        description: `（エロさ満点。期待の大型新人）\n\n優しさと気配りに自信のある、期待の大型新人です。お話を楽しみたい日も、ただそっと寄り添ってほしい日も、その日のお客様に合わせた過ごし方を大切にしています。初めての方でも緊張せず、自然と笑顔になれる空気づくりが得意なセラピストです。\n[▶ 青空（せいら）のプロフィール](https://www.sutoroberrys.jp/store/fukuoka/cast/-130642)`,
      },
    },
    {
      id: 'section-closing',
      type: 'text_block',
      content: {
        description: `お二人とも初めてのお客様も大歓迎で、博多・天神・中洲エリアのホテルへの出張にも対応しています。ぜひこの機会に、新しい出会いをお楽しみください。\n\nお二人の出勤日は[出勤スケジュール](https://www.sutoroberrys.jp/store/fukuoka/schedule)からご確認いただけます。はじめてのご利用をご検討中の方は[初めての方へのご案内](https://www.sutoroberrys.jp/store/fukuoka/first-time)を、コースと料金は[料金システム](https://www.sutoroberrys.jp/store/fukuoka/price)をご覧ください。ご予約・お問い合わせを心よりお待ちしております。`,
      },
    },
  ];

  const updatedRecord = await prisma.pageRequest.update({
    where: { slug: targetSlug },
    data: {
      sections: updatedSections,
      status: 'published',
    },
  });

  console.log('✅ Successfully updated DB record for news-1785718651524!');
  console.log('Title:', updatedRecord.title);
  console.log('Backup Path:', backupPath);
}

main().catch(console.error).finally(() => prisma.$disconnect());
