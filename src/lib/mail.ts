import { Resend } from 'resend';
import { prisma } from './prisma';

const getResend = () => {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return null;
  return new Resend(resendKey);
};

// カテゴリ別のデフォルト通知先
const DEFAULT_EMAIL_MAP = {
  recruit: ['sutoroberrysrecruit@gmail.com', 'sutoroberrys@yahoo.co.jp'],
  reservation: ['contactsutoroberrys@gmail.com', 'contactsutoroberrys@ymail.ne.jp'],
  inquiry: ['contactsutoroberrys@gmail.com', 'contactsutoroberrys@ymail.ne.jp'],
} as const;

type NotificationType = keyof typeof DEFAULT_EMAIL_MAP;

async function getTargetEmails(storeInfo: string | null, type: NotificationType = 'recruit') {
  const emails: string[] = [...DEFAULT_EMAIL_MAP[type]];
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
        recruit_email: true,
        reservation_email: true,
        inquiry_email: true,
        recruit_pages: {
          where: { section_key: 'general' },
          select: { content: true },
        },
      },
    });

    if (store) {
      const s = store as any;
      matchedStore = s.name;
      
      // カテゴリ専用の上書き設定があればそれを優先（なければ全体通知設定や求人用特別設定をマージ）
      let specificOverride: string | null = null;
      if (type === 'recruit') specificOverride = s.recruit_email;
      else if (type === 'reservation') specificOverride = s.reservation_email;
      else if (type === 'inquiry') specificOverride = s.inquiry_email;

      if (specificOverride) {
        // 上書き設定がある場合はデフォルトを消さずにマージ
        const extraEmails = (specificOverride as string)
          .split(',')
          .map((e: string) => e.trim())
          .filter((e: string) => e.includes('@'));

        extraEmails.forEach((email: string) => {
          if (!emails.includes(email)) emails.push(email);
        });
      } else if (s.notification_email) {
        // カテゴリ別設定がない場合は汎用の通知設定を使用
        const extraEmails = (s.notification_email as string)
          .split(',')
          .map((e: string) => e.trim())
          .filter((e: string) => e.includes('@'));

        extraEmails.forEach((email: string) => {
          if (!emails.includes(email)) emails.push(email);
        });
      }

      if (type === 'recruit') {
        const generalConfig = s.recruit_pages?.[0]?.content as any;
        if (generalConfig?.notificationEmails) {
          const extraEmails = (generalConfig.notificationEmails as string)
            .split(',')
            .map((e: string) => e.trim())
            .filter((e: string) => e.includes('@'));

          extraEmails.forEach((email: string) => {
            if (!emails.includes(email)) emails.push(email);
          });
        }
      }
    }
  } catch (error) {
    console.error(`[getTargetEmails] Error for type ${type}:`, error);
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
  // 管理者のみに送信するように変更（応募者へは別メールで送信）

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
  const { emails: targetEmails, matchedStore } = await getTargetEmails(application.store, 'recruit');

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

export async function sendRecruitAutoReply(application: any) {
  const { email, name } = application;
  if (!email) {
    console.warn('⚠️ Applicant email is missing, skipping auto-reply.');
    return { success: false, error: 'Applicant email is missing' };
  }

  const subject = `【受領確認】求人へのご応募ありがとうございます`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #fdf2f8; padding: 20px; text-align: center; border-bottom: 2px solid #f9a8d4;">
        <h1 style="color: #db2777; margin: 0; font-size: 24px;">Strawberry Recruit</h1>
      </div>
      <div style="padding: 30px; background-color: #fff;">
        <p style="margin-top: 0;">${name} 様</p>
        
        <p>求人のお申込みありがとうございます。</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #db2777;">
          <p style="margin: 0; font-size: 14px;">※約２～３日のお時間をいただき、写真選考を含めた１次審査通過の方には、面接日程についてのご連絡をいたします。</p>
          <p style="margin: 10px 0 0 0; font-size: 14px;">相当期間経過後も当店からの連絡がない場合はあしからずご了承下さい。</p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          本メールはシステムによる自動送信です。<br>
          お心当たりがない場合は、お手数ですが本メールを破棄してください。
        </p>
      </div>
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Strawberry Group. All rights reserved.
      </div>
    </div>
  `;

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  const fromEmail = 'Strawberry Recruit <apply@sutoroberrys.jp>';

  try {
    const data = await resendInstance.emails.send({
      from: fromEmail,
      to: [email],
      subject: subject,
      html: html,
    });
    if (data.error) {
      console.error('❌ Resend Auto-Reply Error:', data.error);
      return { success: false, error: data.error.message };
    }
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Auto-Reply Exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 汎用的な通知メール（予約や問い合わせに使用）
 */
export async function sendStaffNotification({
  type,
  storeSlug,
  subject,
  data,
}: {
  type: NotificationType;
  storeSlug: string;
  subject: string;
  data: Record<string, string | number | null | undefined>;
}) {
  const { emails: targetEmails, matchedStore } = await getTargetEmails(storeSlug, type);
  
  const fromEmail = type === 'recruit' 
    ? 'Strawberry Recruit <apply@sutoroberrys.jp>' 
    : 'Strawberry Info <info@sutoroberrys.jp>';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background: #fdf2f8; padding: 20px; border-bottom: 2px solid #f9a8d4; text-align: center;">
        <h2 style="margin: 0; color: #db2777;">通知: ${subject}</h2>
        <p style="margin: 5px 0 0; font-size: 14px; color: #666;">店舗: ${matchedStore}</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${Object.entries(data).map(([key, value]) => `
            <tr>
              <th style="text-align: left; padding: 12px 8px; border-bottom: 1px solid #eee; width: 140px; font-size: 14px; color: #64748b;">${key}</th>
              <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 14px; color: #1e293b; white-space: pre-wrap;">${value ?? '-'}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  `;

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  try {
    const result = await resendInstance.emails.send({
      from: fromEmail,
      to: targetEmails,
      subject: `【${subject}】${matchedStore}`,
      html: html,
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Staff Notification Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 一般ユーザー（予約・問い合わせ）向けの自動返信
 */
export async function sendGenericAutoReply({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  if (!to) return { success: false, error: 'Recipient email is missing' };

  const resendInstance = getResend();
  if (!resendInstance) return { success: false, error: 'Resend not initialized' };

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden; color: #333;">
      <div style="background: #fdf2f8; padding: 30px; border-bottom: 2px solid #f9a8d4; text-align: center;">
        <h1 style="margin: 0; color: #db2777; font-size: 24px;">Strawberry Boys</h1>
        <p style="margin: 5px 0 0; color: #be185d; font-size: 14px;">自動返信メール</p>
      </div>
      <div style="padding: 30px; line-height: 1.8;">
        <p style="font-size: 16px; font-weight: bold;">${name} 様</p>
        <p>この度は、${subject}をいただき誠にありがとうございます。</p>
        <p>送信いただいた内容は無事に受け付けいたしました。</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f9a8d4;">
          <p style="margin: 0; font-size: 15px; color: #4b5563;">
            内容を確認の上、担当者より改めてご連絡させていただきます。<br />
            恐れ入りますが、今しばらくお待ちくださいますようお願い申し上げます。
          </p>
        </div>

        <p style="font-size: 13px; color: #9ca3af;">
          ※このメールは送信専用アドレスから自動送信されています。<br />
          返信いただいてもお答えできませんのでご了承ください。
        </p>
      </div>
      <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #eee;">
        &copy; ${new Date().getFullYear()} Strawberry Boys. All rights reserved.
      </div>
    </div>
  `;

  try {
    const result = await resendInstance.emails.send({
      from: 'Strawberry Boys <info@sutoroberrys.jp>',
      to: [to],
      subject: `【Strawberry Boys】${subject}ありがとうございます`,
      html: html,
    });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Auto-Reply Error:', error);
    return { success: false, error: error.message };
  }
}
