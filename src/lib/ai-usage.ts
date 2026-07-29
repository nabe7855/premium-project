import { createClient } from '@supabase/supabase-js';

/**
 * Gemini API のトークン消費量を記録する。
 *
 * 保存先の ai_usage_logs テーブルは RLS 有効・ポリシーなし・
 * anon/authenticated の権限を剥奪してあるため、
 * アプリ（管理画面を含む）で使う匿名キーからは参照も書き込みもできない。
 * 書き込みと集計はサーバー側の service_role キーからのみ行う。
 *
 * 記録に失敗しても本来のAI機能は止めない（完全に fire-and-forget）。
 */

export type AiUsageRecord = {
  /** どの機能から呼ばれたか（voice-assist / recruit-analytics / analyze-face など） */
  feature: string;
  /** 実際に使用したモデル名 */
  model?: string;
  /** Gemini のレスポンスに含まれる usageMetadata */
  usage?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  } | null;
  /** 店舗を識別できる場合に記録（任意） */
  storeSlug?: string | null;
  succeeded?: boolean;
  errorMessage?: string | null;
};

export async function recordAiUsage(record: AiUsageRecord): Promise<void> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // service_role キーが無い環境では黙って記録をスキップする
    if (!url || !serviceKey) return;

    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

    await supabase.from('ai_usage_logs').insert({
      feature: record.feature,
      model: record.model ?? null,
      prompt_tokens: record.usage?.promptTokenCount ?? 0,
      output_tokens: record.usage?.candidatesTokenCount ?? 0,
      total_tokens: record.usage?.totalTokenCount ?? 0,
      store_slug: record.storeSlug ?? null,
      succeeded: record.succeeded ?? true,
      error_message: record.errorMessage ?? null,
    });
  } catch {
    // 記録の失敗で本処理を巻き込まない。ログも出さない（運用ログを汚さないため）
  }
}
