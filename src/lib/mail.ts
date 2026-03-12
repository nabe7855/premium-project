import { Resend } from 'resend';
import { prisma } from './prisma';

const getResend = () => {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return null;
  return new Resend(resendKey);
};

const DEFAULT_EMAILS = ['sutoroberrys@yahoo.co.jp', 'sutoroberrysrecruit@gmail.com'];

async function getTargetEmails(storeInfo: string | null) {
  const emails = [...DEFAULT_EMAILS];

  if (!storeInfo) return emails;

  try {
    const store = await prisma.store.findFirst({
      where: {
        OR: [{ name: storeInfo }, { slug: storeInfo }],
      },
      select: {
        id: true,
        notification_email: true,
        recruit_pages: {
          where: { section_key: 'general' },
          select: { content: true },
        },
      },
    });

    if (store) {
      // 1. 店舗レコードのメールアドレスを追加
      if (store.notification_email) {
        const extraEmails = store.notification_email
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e.includes('@'));

        extraEmails.forEach((email) => {
          if (!emails.includes(email)) emails.push(email);
        });
      }

      // 2. 採用ページ設定(JSON)のメールアドレスを追加
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

  return emails;
}

export async function sendRecruitNotification(application: any, photos: { url: string }[]) {
  const targetEmails = await getTargetEmails(application.store);

  console.log('--- Email Notification Debug ---');
  console.log('Target Emails:', targetEmails);
  console.log('Application ID:', application?.id);
  console.log('Photos Count:', photos.length);

  const { type, name, phone, email, age, height, weight, address, message, store, details } =
    application;

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
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${store || '未指定'}</td>
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
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">年齢</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${age || '未入力'}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">身長/体重</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${height || '-'}cm / ${weight || '-'}kg</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">住所</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${address || '未入力'}</td>
      </tr>
      ${
        details
          ? Object.entries(details)
              .map(
                ([key, value]) => `
        <tr>
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${key}</th>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value || '-'}</td>
        </tr>
      `,
              )
              .join('')
          : ''
      }
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">メッセージ</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; white-space: pre-wrap;">${message || 'なし'}</td>
      </tr>
    </table>

    <h3 style="margin-top: 20px;">添付写真 (${photos.length}枚)</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
      ${photos
        .map(
          (p) => `
        <div style="width: 200px; margin-bottom: 10px;">
          <a href="${p.url}" target="_blank">
            <img src="${p.url}" style="width: 100%; border-radius: 8px; border: 1px solid #eee;" />
          </a>
        </div>
      `,
        )
        .join('')}
    </div>

    <p style="margin-top: 30px; color: #666; font-size: 12px;">
      このメールはシステムによって自動送信されています。<br>
      管理画面から詳細を確認・ステータス変更が可能です。
    </p>
  `;

  const resendInstance = getResend();

  if (!resendInstance) {
    console.error(
      'Email sending failed: Resend is not initialized. RESEND_API_KEY is missing in environment variables.',
    );
    return { success: false, error: 'Email service not configured. Please set RESEND_API_KEY.' };
  }

  try {
    console.log('Attempting to send email via Resend...');
    const data = await resendInstance.emails.send({
      from: 'Strawberry Recruit <apply@send.sutoroberrys.jp>',
      to: targetEmails,
      subject: subject,
      html: html,
    });

    console.log('Resend Response Data:', JSON.stringify(data, null, 2));
    return { success: true, data };
  } catch (error: any) {
    console.error('Email sending error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response?.data,
    });
  }
}

export async function sendInterviewReservationNotification(application: any) {
  const targetEmails = await getTargetEmails(application.store);

  console.log('--- Interview Date Notification Debug ---');
  console.log('Target Emails:', targetEmails);
  console.log('Interview Date:', application.interviewDate);

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
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">店舗</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${application.store || '未指定'}</td>
      </tr>
      <tr>
        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">現在の状況</th>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${application.status}</td>
      </tr>
    </table>
    <p style="margin-top: 20px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/admin/admin/interview-reservations" style="background: #006699; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">管理画面で確認する</a>
    </p>
  `;

  const resendInstance = getResend();

  if (!resendInstance) {
    console.error('Email sending failed: Resend not initialized.');
    return { success: false, error: 'Resend API key missing' };
  }

  try {
    const data = await resendInstance.emails.send({
      from: 'Strawberry Recruit <apply@sutoroberrys.jp>',
      to: targetEmails,
      subject: subject,
      html: html,
    });
    console.log('Interview Notification Result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Interview Notification Error:', error);
    return { success: false, error };
  }
}
