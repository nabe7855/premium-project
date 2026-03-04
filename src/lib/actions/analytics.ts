'use server';

import { prisma } from '@/lib/prisma';

export async function getAvailableMonths(storeId?: string) {
  try {
    const where: any = {
      status: 'completed',
    };
    if (storeId && storeId !== 'all') {
      where.store_id = storeId;
    }

    const completedReservations: any[] = await (prisma.reservations as any).findMany({
      where,
      select: { updated_at: true, created_at: true },
      orderBy: { updated_at: 'desc' },
    });

    const months = new Set<string>();
    completedReservations.forEach((res) => {
      const date = res.updated_at || res.created_at;
      if (date) {
        months.add(new Date(date).toISOString().substring(0, 7)); // YYYY-MM
      }
    });

    return Array.from(months).sort((a, b) => b.localeCompare(a));
  } catch (error) {
    console.error('Error fetching available months:', error);
    return [];
  }
}

export async function getAnalyticsData(storeId?: string, month?: string) {
  try {
    const where: any = {
      status: 'completed',
    };
    if (storeId && storeId !== 'all') {
      where.store_id = storeId;
    }

    // 特定の月が指定された場合、その月の絞り込みを追加
    if (month && month !== 'all') {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      where.OR = [
        {
          updated_at: {
            gte: startDate,
            lt: nextMonth,
          },
        },
        {
          updated_at: null,
          created_at: {
            gte: startDate,
            lt: nextMonth,
          },
        },
      ];
    }

    // Prisma Clientが未更新でも動くように、anyキャストを使用して既存の標準的な日時フィールドを使用
    const completedReservations: any[] = await (prisma.reservations as any).findMany({
      where,
      select: {
        id: true,
        updated_at: true,
        created_at: true,
        visit_count: true,
        customer_name: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // 1. 月別完了数
    const monthlyStats: Record<string, number> = {};
    completedReservations.forEach((res) => {
      const date = res.updated_at || res.created_at;
      if (date) {
        const month = new Date(date).toISOString().substring(0, 7); // YYYY-MM
        monthlyStats[month] = (monthlyStats[month] || 0) + 1;
      }
    });

    const monthlyChartData = Object.entries(monthlyStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // 2. カウンセリング・アンケート回答データの詳細収集
    const resIds = completedReservations.map((r) => r.id);

    const [counselingData, surveyData]: [any[], any[]] = await Promise.all([
      (prisma.workflow_counseling as any).findMany({
        where: { reservation_id: { in: resIds } },
      }),
      (prisma.workflow_survey as any).findMany({
        where: { reservation_id: { in: resIds } },
      }),
    ]);

    // カウンセリングデータからの集計（年代、流入経路、ニーズなど）
    const ageStats: Record<string, number> = {};
    const inflowStats: Record<string, number> = {};
    const needsStats: Record<string, number> = {};

    counselingData.forEach((c) => {
      const answers = c.answers as any;
      if (!answers) return;

      // 調査アンケートから（年代、流入経路、優先事項）
      const survey = answers.survey;
      if (survey) {
        if (survey.ageGroup) {
          ageStats[survey.ageGroup] = (ageStats[survey.ageGroup] || 0) + 1;
        }
        if (survey.inflowChannel && Array.isArray(survey.inflowChannel)) {
          survey.inflowChannel.forEach((channel: string) => {
            inflowStats[channel] = (inflowStats[channel] || 0) + 1;
          });
        }
        if (survey.priorityToday && Array.isArray(survey.priorityToday)) {
          survey.priorityToday.forEach((need: string) => {
            needsStats[need] = (needsStats[need] || 0) + 1;
          });
        }
      }

      // カウンセリングシートから（身体の悩みなど）
      const counseling = answers.counseling;
      if (counseling) {
        if (counseling.troubleAreas && Array.isArray(counseling.troubleAreas)) {
          counseling.troubleAreas.forEach((area: string) => {
            needsStats[area] = (needsStats[area] || 0) + 1;
          });
        }
      }
    });

    // workflow_survey テーブルから（旧仕様との互換性・補完用）
    surveyData.forEach((s) => {
      if (s.source && !inflowStats[s.source]) {
        inflowStats[s.source] = (inflowStats[s.source] || 0) + 1;
      }
    });

    const ageChartData = Object.entries(ageStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const inflowChartData = Object.entries(inflowStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const needsChartData = Object.entries(needsStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // 満足度の集計
    const satisfactionStats: Record<string, number> = {};
    surveyData.forEach((s) => {
      if (s.overall_satisfaction) {
        satisfactionStats[s.overall_satisfaction] =
          (satisfactionStats[s.overall_satisfaction] || 0) + 1;
      }
    });

    const satisfactionChartData = Object.entries(satisfactionStats).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalCompleted: completedReservations.length,
      monthlyChartData,
      sourceChartData:
        inflowChartData.length > 0 ? inflowChartData : [{ name: 'データなし', value: 1 }],
      satisfactionChartData,
      ageChartData: ageChartData.length > 0 ? ageChartData : [{ name: 'データなし', value: 1 }],
      needsChartData: needsChartData.length > 0 ? needsChartData : [],
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return null;
  }
}

export async function getCastPerformanceData(storeId?: string, month?: string) {
  try {
    const where: any = {
      status: 'completed',
    };
    if (storeId && storeId !== 'all') {
      where.store_id = storeId;
    }

    // 月指定があればフィルタリング
    if (month && month !== 'all') {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      where.OR = [
        { updated_at: { gte: startDate, lt: nextMonth } },
        { updated_at: null, created_at: { gte: startDate, lt: nextMonth } },
      ];
    }

    const reservations: any[] = await (prisma.reservations as any).findMany({
      where,
      select: {
        id: true,
        cast_id: true,
        visit_count: true,
        customer_name: true,
        updated_at: true,
        created_at: true,
      },
    });

    const resIds = reservations.map((r) => r.id);

    // 回答データを取得（強み・好評価抽出用など）
    const surveyData: any[] = await (prisma.workflow_survey as any).findMany({
      where: { reservation_id: { in: resIds } },
    });

    const statsByCast: Record<string, any> = {};

    reservations.forEach((r) => {
      if (!r.cast_id) return;
      if (!statsByCast[r.cast_id]) {
        statsByCast[r.cast_id] = {
          designations: 0,
          breakdown: { new: 0, repeat: 0, free: 0 },
          goodPoints: {},
          monthlyPerformance: {},
        };
      }

      const st = statsByCast[r.cast_id];
      st.designations += 1;

      if (r.customer_name === 'フリー新規' || r.customer_name === 'フリー') {
        st.breakdown.free += 1;
      } else if (r.visit_count === 1) {
        st.breakdown.new += 1;
      } else {
        st.breakdown.repeat += 1;
      }

      const date = r.updated_at || r.created_at;
      if (date) {
        const m = new Date(date).toISOString().substring(0, 7);
        const [yearStr, monthStr] = m.split('-');
        const monthKey = `${parseInt(monthStr)}月`;
        st.monthlyPerformance[monthKey] = (st.monthlyPerformance[monthKey] || 0) + 1;
      }
    });

    surveyData.forEach((s) => {
      const res = reservations.find((r) => r.id === s.reservation_id);
      if (!res || !res.cast_id) return;
      const st = statsByCast[res.cast_id];

      if (s.good_points && Array.isArray(s.good_points)) {
        s.good_points.forEach((gp: string) => {
          st.goodPoints[gp] = (st.goodPoints[gp] || 0) + 1;
        });
      }
    });

    // グラフ用や一覧用の整形
    const finalStats: Record<string, any> = {};
    for (const castId in statsByCast) {
      const st = statsByCast[castId];

      const topStrengths = Object.entries(st.goodPoints)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 3)
        .map((e) => e[0]);

      // 月次パフォーマンスを特定の並びに
      const performanceArr = [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月',
      ]
        .filter((m) => st.monthlyPerformance[m] !== undefined)
        .map((m) => ({ name: m, value: st.monthlyPerformance[m] }));

      if (performanceArr.length === 0) {
        performanceArr.push({ name: '今月', value: st.designations });
      }

      finalStats[castId] = {
        designations: st.designations,
        repeatRate:
          st.designations > 0 ? Math.floor((st.breakdown.repeat / st.designations) * 100) : 0,
        breakdown: st.breakdown,
        monthlyPerformance: performanceArr,
        strengths: topStrengths,
      };
    }

    return finalStats;
  } catch (e) {
    console.error('Error fetching cast performance', e);
    return {};
  }
}

export async function getCastDetailReservations(castId: string, storeId?: string, month?: string) {
  try {
    const normalizedCastId = castId.trim().toLowerCase();

    console.log('[DEBUG] getCastDetailReservations start', {
      castId,
      normalizedCastId,
      storeId,
      month,
    });

    const whereRes: any = {
      cast_id: normalizedCastId,
      // Temporarily allowing all statuses to see if data exists
      // status: 'completed',
    };

    const whereBlog: any = {
      cast_id: normalizedCastId,
    };

    if (storeId && storeId !== 'all') {
      whereRes.store_id = storeId;
    }

    if (month && month !== 'all') {
      const startDate = new Date(`${month}-01T00:00:00.000Z`);
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      whereRes.OR = [
        { updated_at: { gte: startDate, lt: nextMonth } },
        { updated_at: null, created_at: { gte: startDate, lt: nextMonth } },
      ];

      whereBlog.created_at = { gte: startDate, lt: nextMonth };
    }

    // Parallel fetch
    const [reservations, blogCount, samples] = await Promise.all([
      (prisma.reservations as any).findMany({
        where: whereRes,
        select: {
          id: true,
          customer_name: true,
          client_nickname: true,
          date_time: true,
          visit_count: true,
          status: true,
          updated_at: true,
          created_at: true,
          progress_json: true,
          cast_id: true,
        },
        orderBy: { date_time: 'desc' },
      }),
      prisma.blog.count({
        where: whereBlog,
      }),
      // Sample 3 reservations to see actual cast_id values in DB
      (prisma.reservations as any).findMany({
        take: 3,
        select: { cast_id: true },
      }),
    ]);

    console.log(`[DEBUG] Query Results for ${normalizedCastId}:`, {
      resCount: reservations.length,
      blogCount,
      sampleCastIds: samples.map((s: any) => s.cast_id),
    });

    return {
      success: true,
      reservations: reservations.map((r: any) => ({
        id: r.id,
        customerName: r.client_nickname || r.customer_name || '不明',
        dateTime: r.date_time || r.created_at?.toLocaleString('ja-JP') || '',
        visitCount: r.visit_count || 1,
        status: r.status,
        progress_json: r.progress_json || [],
      })),
      blogCount,
    };
  } catch (e) {
    console.error('Error fetching cast detail reservations:', e);
    return { success: false, reservations: [], blogCount: 0 };
  }
}
