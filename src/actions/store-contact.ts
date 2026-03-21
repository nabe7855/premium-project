'use server';

import { prisma } from '@/lib/prisma';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';

export async function getStoreContactData(slug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      select: {
        name: true,
        phone: true,
        line_id: true,
        line_url: true,
        contact_email: true,
        notification_email: true,
      },
    });

    const configResult = await getStoreTopConfig(slug);

    // 優先順位: 1. Storeレコードのline_url, 2. Storeレコードのline_idから生成, 3. ConfigのlineIdから生成
    let finalLineUrl = store?.line_url || '';
    if (!finalLineUrl && store?.line_id) {
      finalLineUrl = `https://line.me/R/ti/p/${store.line_id.startsWith('@') ? store.line_id : '@' + store.line_id}`;
    }

    if (!finalLineUrl && configResult.success && configResult.config.lineId) {
      const lineId = configResult.config.lineId;
      finalLineUrl = `https://line.me/R/ti/p/${lineId.startsWith('@') ? lineId : '@' + lineId}`;
    }

    const email =
      store?.contact_email ||
      (configResult.success ? configResult.config.notificationEmail : store?.notification_email);

    return {
      success: true,
      data: {
        name: store?.name || '',
        phone: store?.phone || '',
        lineUrl: finalLineUrl || '',
        lineId: store?.line_id || (configResult.success ? configResult.config.lineId : '') || '',
        email: email || '',
      },
    };
  } catch (error) {
    console.error('Error in getStoreContactData:', error);
    return { success: false, error: 'Failed to fetch store contact data' };
  }
}

export async function sendStoreInquiry(slug: string, formData: any) {
  try {
    const { sendStaffNotification } = await import('@/lib/mail');
    
    // inquiryType のラベル変換
    const inquiryTypeLabels: Record<string, string> = {
      reservation: 'ご予約',
      monitor: 'モニター応募',
      instructor: '講師応募',
      collaboration: 'コラボ依頼',
      interview: '取材依頼',
      other: 'その他',
    };

    const contactMethodLabels: Record<string, string> = {
      email: 'メール',
      phone: '電話',
      line: 'LINE',
      other: 'その他',
    };

    await sendStaffNotification({
      type: 'inquiry',
      storeSlug: slug,
      subject: 'ホームページお問い合わせ',
      data: {
        'お名前': formData.name,
        'メールアドレス': formData.email,
        '電話番号': formData.phone || '-',
        '希望連絡方法': contactMethodLabels[formData.contactMethod] || formData.contactMethod,
        '来店履歴': formData.visitHistory === 'first' ? '初めて' : '2回目以上',
        'お問い合わせ種別': inquiryTypeLabels[formData.inquiryType] || formData.inquiryType,
        '内容': formData.message,
      }
    });

    // ユーザーへの自動返信
    if (formData.email) {
      try {
        const { sendGenericAutoReply } = await import('@/lib/mail');
        await sendGenericAutoReply({
          to: formData.email,
          name: formData.name,
          subject: 'お問い合わせ',
          body: '内容を確認の上、担当者より改めてご連絡させていただきます。',
        });
      } catch (err) {
        console.error('Failed to send inquiry auto-reply:', err);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error sending store inquiry:', error);
    return { success: false, error: error.message };
  }
}
