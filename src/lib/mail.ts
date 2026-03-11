import { Resend } from 'resend';

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

export async function sendRecruitNotification(application: any, photos: { url: string }[]) {
  const targetEmails = ['sutoroberrys@yahoo.co.jp', 'sutoroberrysrecruit@gmail.com'];

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

  if (!resend) {
    console.error('Email sending failed: Resend is not initialized (missing API key)');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Strawberry Recruit <apply@sutoroberrys.jp>',
      to: targetEmails,
      subject: subject,
      html: html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}
