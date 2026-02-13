import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. 最近の更新ボタン実行ログ (update_logs) を取得
    const { data: updateLogs, error: updateError } = await supabase
      .from('update_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (updateError) throw updateError;

    // 2. 最近の自動投稿ログ (auto_logs) を取得
    const { data: postLogs, error: postError } = await supabase
      .from('auto_logs')
      .select('*, auto_posts(title, target_site)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (postError) throw postError;

    // 3. ワーカーの稼働状態を判定
    // 直近5分以内にログ（ハートビートまたは更新ボタン）があれば稼働中とする
    const latestLog = updateLogs?.[0];
    let isWorkerActive = false;
    let lastActiveAt = null;

    if (latestLog) {
      lastActiveAt = latestLog.created_at;
      const lastSeen = new Date(latestLog.created_at).getTime();
      const now = new Date().getTime();
      const diffMinutes = (now - lastSeen) / (1000 * 60);
      // 10分以内なら稼働中とみなす（ハートビートは5分間隔なので余裕を持たせる）
      if (diffMinutes < 10) {
        isWorkerActive = true;
      }
    }

    return NextResponse.json({
      worker: {
        isActive: isWorkerActive,
        lastActiveAt: lastActiveAt,
      },
      updateLogs: updateLogs || [],
      postLogs: postLogs || [],
    });
  } catch (error: any) {
    console.error('API Error (get-status):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
