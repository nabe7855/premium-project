'use server';

import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

export interface HotelCSVRow {
  hotel_id: string;
  hotel_name: string;
  address: string;
  phone: string;
  website: string;
  image_url: string;
  description: string;
  area_id: string;
  city_id: string;
  prefecture_id: string;
  min_price_rest: string | number;
  min_price_stay: string | number;
  rating: string | number;
  review_id: string;
  review_user: string;
  review_rating: string | number;
  review_content: string;
  review_date: string;
}

/**
 * ホテルと口コミ データをCSV文字列としてエクスポートする
 */
export async function exportHotelsToCSV() {
  try {
    const hotels = await prisma.lh_hotels.findMany();
    const reviews = await prisma.lh_reviews.findMany();

    const rows: HotelCSVRow[] = [];

    for (const hotel of hotels) {
      const hotelReviews = reviews.filter((r) => r.hotel_id === hotel.id);

      if (hotelReviews.length === 0) {
        // 口コミがない場合も1行作成
        rows.push({
          hotel_id: hotel.id,
          hotel_name: hotel.name || '',
          address: hotel.address || '',
          phone: hotel.phone || '',
          website: hotel.website || '',
          image_url: hotel.image_url || '',
          description: hotel.description || '',
          area_id: hotel.area_id || '',
          city_id: hotel.city_id || '',
          prefecture_id: hotel.prefecture_id || '',
          min_price_rest: hotel.min_price_rest || '',
          min_price_stay: hotel.min_price_stay || '',
          rating: hotel.rating?.toString() || '',
          review_id: '',
          review_user: '',
          review_rating: '',
          review_content: '',
          review_date: '',
        });
      } else {
        for (const review of hotelReviews) {
          rows.push({
            hotel_id: hotel.id,
            hotel_name: hotel.name || '',
            address: hotel.address || '',
            phone: hotel.phone || '',
            website: hotel.website || '',
            image_url: hotel.image_url || '',
            description: hotel.description || '',
            area_id: hotel.area_id || '',
            city_id: hotel.city_id || '',
            prefecture_id: hotel.prefecture_id || '',
            min_price_rest: hotel.min_price_rest || '',
            min_price_stay: hotel.min_price_stay || '',
            rating: hotel.rating?.toString() || '',
            review_id: review.id,
            review_user: review.user_name || '',
            review_rating: review.rating || '',
            review_content: review.content || '',
            review_date: review.review_date
              ? new Date(review.review_date).toISOString().split('T')[0]
              : '',
          });
        }
      }
    }

    const csv = Papa.unparse(rows);
    return { success: true, csv };
  } catch (error) {
    console.error('[exportHotelsToCSV] Error:', error);
    return { success: false, error: 'エクスポートに失敗しました' };
  }
}

/**
 * CSVからデータをインポート/更新する
 */
export async function importHotelsFromCSV(csvContent: string) {
  try {
    const { data, errors } = Papa.parse<HotelCSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error('[importHotelsFromCSV] CSV Parse Errors:', errors);
      return { success: false, error: 'CSVの解析に失敗しました' };
    }

    // ホテルごとにデータをグループ化
    const hotelMap = new Map<string, { hotel: any; reviews: any[] }>();

    for (const row of data) {
      // ホテルの特定（ID優先、なければ名前）
      const key = row.hotel_id || `new_${row.hotel_name}`;

      if (!hotelMap.has(key)) {
        hotelMap.set(key, {
          hotel: {
            id: row.hotel_id || undefined, // undefinedにするとPrismaが自動生成
            name: row.hotel_name,
            address: row.address,
            phone: row.phone,
            website: row.website,
            image_url: row.image_url,
            description: row.description,
            area_id: row.area_id,
            city_id: row.city_id,
            prefecture_id: row.prefecture_id,
            min_price_rest: row.min_price_rest ? parseInt(row.min_price_rest.toString()) : null,
            min_price_stay: row.min_price_stay ? parseInt(row.min_price_stay.toString()) : null,
            rating: row.rating ? parseFloat(row.rating.toString()) : null,
          },
          reviews: [],
        });
      }

      if (row.review_content) {
        hotelMap.get(key)!.reviews.push({
          id: row.review_id || undefined,
          user_name: row.review_user,
          rating: row.review_rating ? parseInt(row.review_rating.toString()) : null,
          content: row.review_content,
          review_date: row.review_date ? new Date(row.review_date) : null,
        });
      }
    }

    // トランザクションで保存
    await prisma.$transaction(async (tx) => {
      for (const [key, item] of hotelMap) {
        // ホテルの保存
        let hotelId = item.hotel.id;

        if (hotelId) {
          const updated = await tx.lh_hotels.upsert({
            where: { id: hotelId },
            update: item.hotel,
            create: item.hotel,
          });
          hotelId = updated.id;
        } else {
          // IDがない新規ホテルの場合
          const created = await tx.lh_hotels.create({
            data: item.hotel,
          });
          hotelId = created.id;
        }

        // 口コミの保存
        for (const review of item.reviews) {
          if (review.id) {
            await tx.lh_reviews.upsert({
              where: { id: review.id },
              update: { ...review, hotel_id: hotelId },
              create: { ...review, hotel_id: hotelId },
            });
          } else {
            await tx.lh_reviews.create({
              data: { ...review, hotel_id: hotelId },
            });
          }
        }
      }
    });

    return { success: true, count: hotelMap.size };
  } catch (error) {
    console.error('[importHotelsFromCSV] Error:', error);
    return { success: false, error: 'インポートに失敗しました' };
  }
}
