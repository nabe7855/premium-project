'use client';

import React, { useEffect, useState } from 'react';
import CalendarEditor from '../../schedule/CalendarEditor';
import { CastSchedule } from '@/types/cast-dashboard';
import { CastDiary } from '@/types/cast';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentCast } from '@/hooks/useCurrentCast';
import { fetchSchedules } from '@/lib/scheduleApi';

interface Props {
  diaries: CastDiary[];
}

export default function ScheduleSection({ diaries }: Props) {
  const { user, loading } = useAuth();
  const { castId, storeIds } = useCurrentCast(user);

  // ✅ storeIds の安全性確保
  const storeId = storeIds?.[0] ?? null;

  const [schedules, setSchedules] = useState<CastSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  // 🔹 DBからスケジュール取得
  useEffect(() => {
    const loadSchedules = async () => {
      if (!castId || !storeId) return;

      setLoadingSchedules(true);
      try {
        const data = await fetchSchedules(castId, storeId);
        setSchedules(data ?? []);
      } catch (err) {
        console.error('❌ スケジュール取得エラー:', err);
      } finally {
        setLoadingSchedules(false);
      }
    };

    loadSchedules();
  }, [castId, storeId, user]);

  if (loading || loadingSchedules) {
    return <div>読み込み中...</div>;
  }

  if (!castId || !storeId) {
    return <div>キャスト情報が見つかりません</div>;
  }

  return (
    <CalendarEditor
      schedules={schedules}
      onScheduleUpdate={setSchedules} // ✅ DB保存後に即反映
      diaries={diaries}
      castId={castId}
      storeId={storeId}
    />
  );
}
