'use server';

import { getHotels, syncMasterData } from '@/lib/lovehotelApi';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabaseClient';
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
  distance_from_station: string;
  room_count: string | number;
  place_id: string;
  status: string;
  price_details: string;
  rest_price_min_weekday: string | number;
  rest_price_max_weekday: string | number;
  rest_price_min_weekend: string | number;
  rest_price_max_weekend: string | number;
  stay_price_min_weekday: string | number;
  stay_price_max_weekday: string | number;
  stay_price_min_weekend: string | number;
  stay_price_max_weekend: string | number;
  review_id: string;
  review_user: string;
  review_rating: string | number;
  review_content: string;
  review_date: string;
  amenities: string;
  services: string;
}

/**
 * ホテルと口コミ データをCSV文字列としてエクスポートする
 */
export async function exportHotelsToCSV() {
  try {
    const hotels = (await getHotels()) as any[];
    const reviews = await prisma.lh_reviews.findMany();

    const rows: HotelCSVRow[] = [];

    for (const hotel of hotels) {
      const hotelReviews = reviews.filter((r) => r.hotel_id === hotel.id);

      const baseRow = {
        hotel_id: hotel.id,
        hotel_name: hotel.name || '',
        address: hotel.address || '',
        phone: hotel.phone || '',
        website: hotel.website || '',
        image_url: hotel.imageUrl || '',
        description: hotel.description || '',
        area_id: hotel.area_id || hotel.areaId || '',
        city_id: hotel.city_id || hotel.cityId || '',
        prefecture_id: hotel.prefecture_id || hotel.prefectureId || '',
        min_price_rest: hotel.minPriceRest || '',
        min_price_stay: hotel.minPriceStay || '',
        rating: hotel.rating?.toString() || '',
        distance_from_station: hotel.distanceFromStation || '',
        room_count: hotel.roomCount?.toString() || '',
        place_id: (hotel as any).place_id || '',
        status: hotel.status || 'draft',
        price_details: hotel.priceDetails ? JSON.stringify(hotel.priceDetails) : '[]',
        rest_price_min_weekday: hotel.restPriceMinWeekday || '',
        rest_price_max_weekday: hotel.restPriceMaxWeekday || '',
        rest_price_min_weekend: hotel.restPriceMinWeekend || '',
        rest_price_max_weekend: hotel.restPriceMaxWeekend || '',
        stay_price_min_weekday: hotel.stayPriceMinWeekday || '',
        stay_price_max_weekday: hotel.stayPriceMaxWeekday || '',
        stay_price_min_weekend: hotel.stayPriceMinWeekend || '',
        stay_price_max_weekend: hotel.stayPriceMaxWeekend || '',
        amenities: (hotel.amenities || []).join(', '),
        services: (hotel.services || []).join(', '),
      };

      if (hotelReviews.length === 0) {
        rows.push({
          ...(baseRow as any),
          review_id: '',
          review_user: '',
          review_rating: '',
          review_content: '',
          review_date: '',
        });
      } else {
        for (const review of hotelReviews) {
          rows.push({
            ...(baseRow as any),
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
    const hotelMap = new Map<
      string,
      { hotel: any; reviews: any[]; amenities: string[]; services: string[] }
    >();

    for (const row of data) {
      const key = row.hotel_id || `new_${row.hotel_name}`;

      if (!hotelMap.has(key)) {
        let priceDetails = [];
        try {
          if (row.price_details) {
            priceDetails = JSON.parse(row.price_details);
          }
        } catch (e) {
          console.error('[importHotelsFromCSV] JSON parse error for price_details:', e);
        }

        hotelMap.set(key, {
          hotel: {
            id: row.hotel_id || undefined,
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
            distance_from_station: row.distance_from_station,
            room_count: row.room_count ? parseInt(row.room_count.toString()) : null,
            place_id: row.place_id,
            status: row.status,
            price_details: priceDetails,
            rest_price_min_weekday: row.rest_price_min_weekday
              ? parseInt(row.rest_price_min_weekday.toString())
              : null,
            rest_price_max_weekday: row.rest_price_max_weekday
              ? parseInt(row.rest_price_max_weekday.toString())
              : null,
            rest_price_min_weekend: row.rest_price_min_weekend
              ? parseInt(row.rest_price_min_weekend.toString())
              : null,
            rest_price_max_weekend: row.rest_price_max_weekend
              ? parseInt(row.rest_price_max_weekend.toString())
              : null,
            stay_price_min_weekday: row.stay_price_min_weekday
              ? parseInt(row.stay_price_min_weekday.toString())
              : null,
            stay_price_max_weekday: row.stay_price_max_weekday
              ? parseInt(row.stay_price_max_weekday.toString())
              : null,
            stay_price_min_weekend: row.stay_price_min_weekend
              ? parseInt(row.stay_price_min_weekend.toString())
              : null,
            stay_price_max_weekend: row.stay_price_max_weekend
              ? parseInt(row.stay_price_max_weekend.toString())
              : null,
          },
          reviews: [],
          amenities: row.amenities ? row.amenities.split(',').map((s) => s.trim()) : [],
          services: row.services ? row.services.split(',').map((s) => s.trim()) : [],
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

    // ホテルの保存（Supabaseを使用。Prismaはmany-to-manyが非推奨でうまく動かないため）
    for (const [key, item] of hotelMap) {
      // 1. 同期（マスターデータ）
      const amenityIds = await syncMasterData('lh_amenities', item.amenities);
      const serviceIds = await syncMasterData('lh_services', item.services);

      // 2. ホテル自身の保存
      const hotelPayload = { ...item.hotel };
      if (!hotelPayload.id) {
        delete hotelPayload.id; // 新規作成時はIDフィールドを除去
      }

      const { data: savedHotel, error: hotelError } = await supabase
        .from('lh_hotels')
        .upsert([hotelPayload])
        .select()
        .single();

      if (hotelError) {
        console.error(
          `[importHotelsFromCSV] Error upserting hotel ${item.hotel.name}:`,
          hotelError,
        );
        continue;
      }

      const hotelId = savedHotel.id;

      // 3. アメニティ・サービスのリレーションを更新
      await supabase.from('lh_hotel_amenities').delete().eq('hotel_id', hotelId);
      if (amenityIds.length > 0) {
        await supabase
          .from('lh_hotel_amenities')
          .insert(amenityIds.map((aId) => ({ hotel_id: hotelId, amenity_id: aId })));
      }

      await supabase.from('lh_hotel_services').delete().eq('hotel_id', hotelId);
      if (serviceIds.length > 0) {
        await supabase
          .from('lh_hotel_services')
          .insert(serviceIds.map((sId) => ({ hotel_id: hotelId, service_id: sId })));
      }

      // 4. 口コミの保存 (Prismaを利用し続ける)
      for (const review of item.reviews) {
        if (review.id) {
          await prisma.lh_reviews.upsert({
            where: { id: review.id },
            update: { ...review, hotel_id: hotelId },
            create: { ...review, hotel_id: hotelId },
          });
        } else {
          await prisma.lh_reviews.create({
            data: { ...review, hotel_id: hotelId },
          });
        }
      }
    }

    return { success: true, count: hotelMap.size };
  } catch (error) {
    console.error('[importHotelsFromCSV] Error:', error);
    return { success: false, error: 'インポートに失敗しました' };
  }
}
