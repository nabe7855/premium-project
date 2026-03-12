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

    ${photos && photos.length > 0 ? `
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
    ` : ''}

    <p style="margin-top: 30px; color: #666; font-size: 12px;">
      このメールはシステムによって自動送信されています。<br>
      管理画面から詳細を確認・ステータス変更が可能です。
    </p>
  `;

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  const finalTo = [...targetEmails];
  if (email && !finalTo.includes(email)) {
    finalTo.push(email);
  }

  // 認証済みドメイン sutoroberrys.jp を使用（サブドメイン send. が原因でエラーになるため）
  const fromEmail = 'Strawberry Recruit <apply@sutoroberrys.jp>';

  try {
    const data = await resendInstance.emails.send({
      from: fromEmail,
      to: finalTo,
      subject: subject,
      html: html,
    });
    if (data.error) {
       console.error('❌ Resend API Error:', data.error);
       return { success: false, error: data.error.message, matchedStore, recipients: finalTo, attemptedFrom: fromEmail };
    }
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

  const fromEmail = 'Strawberry Recruit <apply@sutoroberrys.jp>';

  try {
    const data = await resendInstance.emails.send({
      from: fromEmail,
      to: finalTo,
      subject: subject,
      html: html,
    });
    if (data.error) return { success: false, error: data.error.message, matchedStore, recipients: finalTo, attemptedFrom: fromEmail };
    return { success: true, data, matchedStore, recipients: finalTo };
  } catch (error: any) {
    return { success: false, error: error.message, matchedStore };
  }
}
