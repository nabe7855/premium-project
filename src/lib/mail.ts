import { Resend } from 'resend';
import { prisma } from './prisma';

const getResend = () => {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return null;
  return new Resend(resendKey);
};

const DEFAULT_EMAILS = [
  'sutoroberrys@yahoo.co.jp',
  'sutoroberrysrecruit@gmail.com',
  'contactsutoroberrys@gmail.com',
];

async function getTargetEmails(storeInfo: string | null) {
  const emails = [...DEFAULT_EMAILS];
  let matchedStore = 'fallback (default emails)';

  if (!storeInfo) return { emails, matchedStore };

  try {
    const searchName = storeInfo.trim();
    const searchNameAlternative = searchName.endsWith('店') ? searchName.slice(0, -1) : `${searchName}店`;

    const store = await prisma.store.findFirst({
      where: {
        OR: [
          { name: searchName },
          { name: searchNameAlternative },
          { slug: searchName },
          { slug: searchName.toLowerCase() }
        ],
      },
      select: {
        id: true,
        name: true,
        notification_email: true,
        recruit_pages: {
          where: { section_key: 'general' },
          select: { content: true },
        },
      },
    });

    if (store) {
      matchedStore = store.name;
      console.log(`[getTargetEmails] Store found: ${store.name} (ID: ${store.id})`);
      if (store.notification_email) {
        const extraEmails = store.notification_email
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.includes('@'));

        extraEmails.forEach((email) => {
          if (!emails.includes(email)) emails.push(email);
        });
      }

      const generalConfig = store.recruit_pages[0]?.content as any;
      if (generalConfig?.notificationEmails) {
        const extraEmails = generalConfig.notificationEmails
          .split(',')
          .map((e: string) => e.trim())
          .filter((e: string) => e.includes('@'));

        extraEmails.forEach((email: string) => {
          if (!emails.includes(email)) emails.push(email);
        });
      }
    }
  } catch (error) {
    console.error('[getTargetEmails] Error:', error);
  }

  return { emails, matchedStore };
}

export async function sendRecruitNotification(application: any, photos: { url: string }[]) {
  const { emails: targetEmails, matchedStore } = await getTargetEmails(application.store);

  const { type, name, phone, email, age, height, weight, address, message, store, details } = application;
  const subject = `【求人応募】${store || '店舗不明'} - ${name}様`;

  const html = `
    <h2>新しい求人応募がありました</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; width: 150px;">タイプ</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${type === 'chatbot' ? 'チャットボット' : type === 'quick' ? '簡易応募' : '本応募'}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">店舗</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store || '未指定'} (判定: ${matchedStore})</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">お名前</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">電話番号</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone || '未入力'}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">メールアドレス</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email || '未入力'}</td>
      </tr>
    </table>
    <h3 style="margin-top: 20px;">メッセージ</h3>
    <p style="white-space: pre-wrap;">${message || 'なし'}</p>
  `;

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  const finalTo = [...targetEmails];
  if (email && !finalTo.includes(email)) {
    finalTo.push(email);
  }

  try {
    const data = await resendInstance.emails.send({
      from: 'Strawberry Recruit <apply@send.sutoroberrys.jp>',
      to: finalTo,
      subject: subject,
      html: html,
    });
    if (data.error) return { success: false, error: data.error.message, matchedStore, recipients: finalTo };
    return { success: true, data, matchedStore, recipients: finalTo };
  } catch (error: any) {
    return { success: false, error: error.message, matchedStore };
  }
}

export async function sendInterviewReservationNotification(application: any) {
  const { emails: targetEmails, matchedStore } = await getTargetEmails(application.store);

  const subject = `【面接予約】${application.store || '店舗不明'} - ${application.name}様`;
  const html = `
    <h2>面接日時が設定されました</h2>
    <p>以下の内容で面接予約が更新されました。</p>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; width: 150px;">お名前</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${application.name}様</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">面接日時</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #d946ef;">${application.interviewDate}</td>
      </tr>
    </table>
  `;

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  const finalTo = [...targetEmails];
  if (application.email && !finalTo.includes(application.email)) {
    finalTo.push(application.email);
  }

  try {
    const data = await resendInstance.emails.send({
      from: 'Strawberry Recruit <apply@send.sutoroberrys.jp>',
      to: finalTo,
      subject: subject,
      html: html,
    });
    if (data.error) return { success: false, error: data.error.message, matchedStore, recipients: finalTo };
    return { success: true, data, matchedStore, recipients: finalTo };
  } catch (error: any) {
    return { success: false, error: error.message, matchedStore };
  }
}
