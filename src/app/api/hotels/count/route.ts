import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // 1時間キャッシュ

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefectureId = searchParams.get('prefecture') || 'Fukuoka';

    // エリア別・市別のホテル件数を集計
    // まず都道府県IDを取得
    const prefecture = await prisma.lh_prefectures.findFirst({
      where: {
        name: {
          equals: prefectureId,
          mode: 'insensitive',
        },
      },
    });

    if (!prefecture) {
      return NextResponse.json({
        byArea: {},
        byCity: {},
        total: 0,
      });
    }

    const hotels = await prisma.lh_hotels.findMany({
      where: {
        prefecture_id: prefecture.id,
        status: 'active',
      },
      select: {
        area_id: true,
        city_id: true,
      },
    });

    // エリア別集計
    const byArea: Record<string, number> = {};
    const byCity: Record<string, number> = {};

    hotels.forEach((hotel) => {
      // エリア別カウント
      if (hotel.area_id) {
        byArea[hotel.area_id] = (byArea[hotel.area_id] || 0) + 1;
      }

      // 市別カウント
      if (hotel.city_id) {
        byCity[hotel.city_id] = (byCity[hotel.city_id] || 0) + 1;
      }
    });

    return NextResponse.json({
      byArea,
      byCity,
      total: hotels.length,
    });
  } catch (error) {
    console.error('Error fetching hotel counts:', error);
    return NextResponse.json({ error: 'Failed to fetch hotel counts' }, { status: 500 });
  }
}
