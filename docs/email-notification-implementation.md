# メール通知機能の実装ガイド

## 概要

一般設定ページで設定した通知先メールアドレスに、採用応募や予約が入った際に自動でメールを送信する機能の実装方法を説明します。

## 現在の状態

- ✅ 通知先メールアドレスの設定機能は実装済み
- ❌ 実際のメール送信機能は未実装

## 推奨される実装方法

### 方法1: Resend + Next.js API Route（推奨）

#### メリット

- Next.jsアプリケーション内で完結
- デバッグが容易
- TypeScriptで型安全に実装可能

#### 実装手順

1. **Resendのセットアップ**

```bash
npm install resend
```

2. **環境変数の設定**
   `.env.local`に追加:

```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

3. **API Routeの作成**
   `src/app/api/send-notification/route.ts`:

```typescript
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { type, data, storeId } = await request.json();

    // 店舗の通知メールアドレスを取得
    const { getStoreTopConfig } = await import('@/lib/store/getStoreTopConfig');
    const config = await getStoreTopConfig(storeId);
    const notificationEmail = (config.config as any)?.notificationEmail;

    if (!notificationEmail) {
      return NextResponse.json({ error: 'Notification email not configured' }, { status: 400 });
    }

    let subject = '';
    let html = '';

    if (type === 'recruit') {
      subject = `【新規応募】${data.name}様からの採用応募`;
      html = `
        <h2>新しい採用応募がありました</h2>
        <p><strong>氏名:</strong> ${data.name}</p>
        <p><strong>メール:</strong> ${data.email}</p>
        <p><strong>電話番号:</strong> ${data.phone}</p>
        <p><strong>応募日時:</strong> ${new Date().toLocaleString('ja-JP')}</p>
      `;
    } else if (type === 'reservation') {
      subject = `【新規予約】${data.customerName}様からの予約`;
      html = `
        <h2>新しい予約がありました</h2>
        <p><strong>お客様名:</strong> ${data.customerName}</p>
        <p><strong>予約日時:</strong> ${data.reservationDate}</p>
        <p><strong>キャスト:</strong> ${data.castName}</p>
      `;
    }

    const { data: emailData, error } = await resend.emails.send({
      from: 'notifications@yourdomain.com',
      to: notificationEmail,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: emailData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
```

4. **既存のフォーム送信処理に統合**
   例: `src/actions/recruit.ts`の採用応募処理:

```typescript
export async function submitApplication(data: ApplicationData) {
  // Supabaseにデータを保存
  const { error } = await supabase.from('recruit_applications').insert([data]);

  if (error) throw error;

  // メール通知を送信
  await fetch('/api/send-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'recruit',
      data,
      storeId: data.storeId,
    }),
  });

  return { success: true };
}
```

### 方法2: Supabase Edge Functions + Database Webhooks

#### メリット

- アプリケーションコードの変更が最小限
- データベーストリガーで自動実行
- スケーラブル

#### 実装手順

1. **Supabase Edge Functionの作成**

```bash
supabase functions new send-notification-email
```

2. **Edge Function実装**
   `supabase/functions/send-notification-email/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  const { type, record } = await req.json();

  // 店舗設定から通知メールアドレスを取得
  const { data: config } = await supabaseClient
    .from('store_configs')
    .select('notification_email')
    .eq('store_id', record.store_id)
    .single();

  if (!config?.notification_email) {
    return new Response('No notification email configured', { status: 400 });
  }

  // Resendでメール送信
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'notifications@yourdomain.com',
      to: config.notification_email,
      subject: type === 'recruit' ? '新規採用応募' : '新規予約',
      html: generateEmailHTML(type, record),
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

3. **Database Webhookの設定**
   Supabaseダッシュボードで:

- Database → Webhooks → Create a new webhook
- Table: `recruit_applications` または `reservations`
- Events: `INSERT`
- Webhook URL: Edge FunctionのURL

### 方法3: Supabase Database Trigger（SQL）

PostgreSQLのトリガー関数を使用して、直接メール送信APIを呼び出す方法もあります。

```sql
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
DECLARE
  notification_email TEXT;
BEGIN
  -- 店舗の通知メールアドレスを取得
  SELECT (config->>'notificationEmail')::TEXT INTO notification_email
  FROM store_configs
  WHERE store_id = NEW.store_id;

  -- HTTP POSTでメール送信APIを呼び出し
  PERFORM http_post(
    'https://api.resend.com/emails',
    jsonb_build_object(
      'from', 'notifications@yourdomain.com',
      'to', notification_email,
      'subject', '新規採用応募',
      'html', format('<h2>新しい応募: %s</h2>', NEW.name)
    ),
    'application/json',
    ARRAY[http_header('Authorization', 'Bearer YOUR_RESEND_API_KEY')]
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_application
AFTER INSERT ON recruit_applications
FOR EACH ROW
EXECUTE FUNCTION notify_new_application();
```

## 選択基準

| 方法                      | 難易度 | メンテナンス性 | デバッグ | 推奨度     |
| ------------------------- | ------ | -------------- | -------- | ---------- |
| Resend + API Route        | 低     | 高             | 容易     | ⭐⭐⭐⭐⭐ |
| Edge Functions + Webhooks | 中     | 中             | 普通     | ⭐⭐⭐⭐   |
| Database Trigger          | 高     | 低             | 困難     | ⭐⭐       |

## 次のステップ

1. Resendアカウントを作成（無料プランで月3,000通まで）
2. 方法1（Resend + API Route）で実装を開始
3. テスト環境で動作確認
4. 本番環境にデプロイ

## 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
