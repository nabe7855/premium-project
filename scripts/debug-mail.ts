import * as dotenv from 'dotenv';
import path from 'path';
import { sendInterviewReservationNotification, sendRecruitNotification } from '../src/lib/mail';
import { prisma } from '../src/lib/prisma';

// .env から環境変数を読み込む
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function debugMail() {
  console.log('--- Mail Debug Start ---');
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

  // ダミーの応募データ
  const dummyApplication = {
    id: 'test-id-' + Date.now(),
    type: 'quick',
    name: 'デバッグ太郎',
    phone: '090-0000-0000',
    email: 'nabe7855@gmail.com',
    age: '25',
    height: '175',
    weight: '65',
    address: '東京都渋谷区',
    message: 'これはローカル環境からのテスト送信です。',
    store: 'fukuoka', // DBにある既存の店舗名またはスラグを指定
    status: 'pending',
    details: {
      experience: 'あり',
      transport: '徒歩',
    },
  };

  console.log('\n1. Testing sendRecruitNotification...');
  try {
    const result = await sendRecruitNotification(dummyApplication, []);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error in sendRecruitNotification:', error);
  }

  console.log('\n2. Testing sendInterviewReservationNotification...');
  try {
    const interviewApp = {
      ...dummyApplication,
      interviewDate: '2024年4月1日 14:00',
    };
    const result = await sendInterviewReservationNotification(interviewApp);
    console.log('Result:', result);
  } catch (error) {
    console.error('Error in sendInterviewReservationNotification:', error);
  }

  console.log('\n--- Mail Debug End ---');
}

debugMail()
  .catch((err) => console.error('Fatal error:', err))
  .finally(() => prisma.$disconnect());
