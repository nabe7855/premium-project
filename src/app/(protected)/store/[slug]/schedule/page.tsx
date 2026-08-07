import ScheduleContent from '@/components/sections/schedule/ScheduleContent';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `出勤スケジュール｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」の本日の出勤スケジュール。人気のイケメンセラピストの出勤状況をリアルタイムでご確認いただけます。ご予約はお早めに。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/schedule` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/schedule`,
      images: [{ url: `/ogp/store-${slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/ogp/store-${slug}.png`]
    }
  };
}

import { supabase } from '@/lib/supabaseClient';
import { Cast, ScheduleDay as ScheduleDayType } from '@/types/schedule';
import { formatScheduleTime } from '@/lib/utils/formatSchedule';

async function getInitialScheduleData(storeSlug: string): Promise<ScheduleDayType[]> {
  try {
    const today = new Date();
    const days = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, dayOfWeek: dayNames[d.getDay()] });
    }

    const { data: schedules } = await supabase
      .from('schedules')
      .select(`
        *,
        casts!inner (
          *,
          cast_statuses (
            *,
            status_master (*)
          ),
          cast_store_memberships!inner (
            stores!inner ( id, slug )
          )
        )
      `)
      .gte('work_date', days[0].date)
      .lte('work_date', days[days.length - 1].date)
      .eq('casts.cast_store_memberships.stores.slug', storeSlug);

    return days.map((day) => {
      const castsForDay: Cast[] =
        schedules
          ?.filter((s) => s.work_date === day.date)
          .map((s) => {
            const cast = Array.isArray(s.casts) ? s.casts[0] : s.casts;
            return {
              id: cast?.id ?? '',
              name: cast?.name ?? '',
              age: cast?.age ?? 0,
              photo: cast?.main_image_url ?? '',
              slug: cast?.slug ?? '',
              workingHours: formatScheduleTime(s.start_datetime, s.end_datetime, ' - '),
              status: 'available',
              description: cast?.catch_copy ?? '',
              isFavorite: false,
              isRecentlyViewed: false,
              category: '',
              scheduleStatus: s.status ?? null,
              statuses: (cast?.cast_statuses ?? []).map((cs: any) => ({
                id: cs.id,
                statusId: cs.status_id,
                label: cs.status_master?.name ?? '',
                labelColor: cs.status_master?.label_color ?? '#fce7f3',
                textColor: cs.status_master?.text_color ?? '#9d174d',
              })),
              storeSlug,
            } as Cast;
          }) ?? [];

      return {
        ...day,
        casts: castsForDay,
        recommendedCasts: [],
      };
    });
  } catch (err) {
    console.error('getInitialScheduleData error:', err);
    return [];
  }
}

export default async function SchedulePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [topConfigResult, initialSchedule] = await Promise.all([
    getStoreTopConfig(slug, { skipCasts: true }),
    getInitialScheduleData(slug),
  ]);
  const topConfig = topConfigResult.success ? (topConfigResult.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header (Server fetched config ensures it renders immediately) */}
      {slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      {/* Header Spacer */}
      <div className="h-[54px] md:h-[65px]" />

      <main className="flex-grow">
        <h1 className="sr-only">出勤スケジュール</h1>
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <ScheduleContent storeSlug={slug} initialSchedule={initialSchedule} />
        </Suspense>
      </main>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}

      {slug === 'fukuoka' && (
        <FukuokaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
      {slug === 'yokohama' && (
        <YokohamaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
    </div>
  );
}
