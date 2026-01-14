import { Hotel, Review } from '@/types/lovehotels';
import { supabase } from './supabaseClient';

// --- Master Data ---

export const getPrefectures = async () => {
  const { data, error } = await supabase.from('lh_prefectures').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getCities = async (prefectureId?: string) => {
  let query = supabase.from('lh_cities').select('*, lh_prefectures(name)');
  if (prefectureId) {
    query = query.eq('prefecture_id', prefectureId);
  }
  const { data, error } = await query.order('name');
  if (error) throw error;
  return data;
};

export const getAreas = async (cityId?: string) => {
  let query = supabase.from('lh_areas').select('*, lh_cities(name)');
  if (cityId) {
    query = query.eq('city_id', cityId);
  }
  const { data, error } = await query.order('name');
  if (error) throw error;
  return data;
};

export const getAmenities = async () => {
  const { data, error } = await supabase.from('lh_amenities').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getServices = async () => {
  const { data, error } = await supabase.from('lh_services').select('*').order('name');
  if (error) throw error;
  return data;
};

// --- Hotels ---

export const getHotels = async (filters?: {
  prefectureId?: string;
  cityId?: string;
  areaId?: string;
  keyword?: string;
}) => {
  let query = supabase.from('lh_hotels').select(`
      *,
      lh_prefectures(name),
      lh_cities(name),
      lh_areas(name),
      lh_hotel_amenities(lh_amenities(*)),
      lh_hotel_services(lh_services(*)),
      lh_hotel_images(*)
    `);

  if (filters?.prefectureId) {
    const cleanId = filters.prefectureId.trim();
    query = query.in('prefecture_id', [cleanId, ` ${cleanId}`]);
  }
  if (filters?.cityId) {
    const cleanId = filters.cityId.trim();
    query = query.in('city_id', [cleanId, ` ${cleanId}`]);
  }
  if (filters?.areaId) {
    const cleanId = filters.areaId.trim();
    query = query.in('area_id', [cleanId, ` ${cleanId}`]);
  }
  if (filters?.keyword) {
    query = query.or(
      `name.ilike.%${filters.keyword}%,address.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`,
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getHotelById = async (id: string) => {
  const { data, error } = await supabase
    .from('lh_hotels')
    .select(
      `
      *,
      lh_prefectures(name),
      lh_cities(name),
      lh_areas(name),
      lh_hotel_amenities(lh_amenities(*)),
      lh_hotel_services(lh_services(*)),
      lh_hotel_images(*)
    `,
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createHotel = async (
  hotelData: any,
  amenityIds: string[],
  serviceIds: string[],
  images: { url: string; category: string }[],
) => {
  // 1. Insert Hotel
  const { data: hotel, error: hotelError } = await supabase
    .from('lh_hotels')
    .insert([hotelData])
    .select()
    .single();
  if (hotelError) throw hotelError;

  // 2. Link Amenities
  if (amenityIds.length > 0) {
    const { error: amenError } = await supabase
      .from('lh_hotel_amenities')
      .insert(amenityIds.map((id) => ({ hotel_id: hotel.id, amenity_id: id })));
    if (amenError) throw amenError;
  }

  // 3. Link Services
  if (serviceIds.length > 0) {
    const { error: servError } = await supabase
      .from('lh_hotel_services')
      .insert(serviceIds.map((id) => ({ hotel_id: hotel.id, service_id: id })));
    if (servError) throw servError;
  }

  // 4. Insert Images
  if (images.length > 0) {
    const { error: imgError } = await supabase
      .from('lh_hotel_images')
      .insert(images.map((img) => ({ ...img, hotel_id: hotel.id })));
    if (imgError) throw imgError;
  }

  return hotel;
};

export const updateHotel = async (
  id: string,
  hotelData: any,
  amenityIds: string[],
  serviceIds: string[],
  images: { url: string; category: string }[],
) => {
  // 1. Update Hotel
  const { error: hotelError } = await supabase.from('lh_hotels').update(hotelData).eq('id', id);
  if (hotelError) throw hotelError;

  // 2. Refresh Amenities
  await supabase.from('lh_hotel_amenities').delete().eq('hotel_id', id);
  if (amenityIds.length > 0) {
    await supabase
      .from('lh_hotel_amenities')
      .insert(amenityIds.map((aId) => ({ hotel_id: id, amenity_id: aId })));
  }

  // 3. Refresh Services
  await supabase.from('lh_hotel_services').delete().eq('hotel_id', id);
  if (serviceIds.length > 0) {
    await supabase
      .from('lh_hotel_services')
      .insert(serviceIds.map((sId) => ({ hotel_id: id, service_id: sId })));
  }

  // 4. Refresh Images
  await supabase.from('lh_hotel_images').delete().eq('hotel_id', id);
  if (images.length > 0) {
    await supabase.from('lh_hotel_images').insert(images.map((img) => ({ ...img, hotel_id: id })));
  }
};

export const deleteHotel = async (id: string) => {
  // 1. Get images before deleting
  const { data: hotel } = await supabase
    .from('lh_hotels')
    .select('lh_hotel_images(url)')
    .eq('id', id)
    .single();

  const imageUrls = hotel?.lh_hotel_images?.map((img: any) => img.url) || [];

  // 2. Delete DB record
  const { error } = await supabase.from('lh_hotels').delete().eq('id', id);
  if (error) throw error;

  // 3. Delete from Storage
  if (imageUrls.length > 0) {
    await deleteStorageImages(imageUrls);
  }
};

// --- Storage ---

export const uploadHotelImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `hotels/${fileName}`;

  const { error: uploadError } = await supabase.storage.from('hotel-images').upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('hotel-images').getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteStorageImages = async (urls: string[]) => {
  if (urls.length === 0) return;

  const paths = urls
    .map((url) => {
      // URLからパス部分を抽出 (例: .../hotel-images/hotels/xxx.jpg -> hotels/xxx.jpg)
      const urlParts = url.split('/hotel-images/');
      return urlParts.length > 1 ? urlParts[1] : null;
    })
    .filter((path): path is string => path !== null);

  if (paths.length > 0) {
    const { error } = await supabase.storage.from('hotel-images').remove(paths);
    if (error) console.error('Failed to delete images from storage:', error);
  }
};

// --- Master Management helpers ---

export const upsertMaster = async (table: string, data: any) => {
  console.log(`[upsertMaster] table: ${table}, data:`, data);
  const { error } = await supabase.from(table).upsert([data]);
  if (error) {
    console.error(`[upsertMaster] Error updating ${table}:`, error);
    throw error;
  }
};

export const deleteMaster = async (table: string, id: string | number) => {
  console.log(`[deleteMaster] table: ${table}, id: ${id}`);
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`[deleteMaster] Error deleting from ${table}:`, error);
    throw error;
  }
};

export const getPrefectureDetails = async (prefectureId: string) => {
  const cleanId = prefectureId.trim();
  // 1. 都道府県情報を取得（IDまたは名前で検索）
  const { data: prefData } = await supabase
    .from('lh_prefectures')
    .select('id, name')
    .or(`id.eq.${cleanId},id.eq." ${cleanId}",name.ilike.%${cleanId}%`)
    .single();

  const targetPrefId = prefData?.id || cleanId;

  // 2. 市区町村とエリアを取得
  const { data, error } = await supabase
    .from('lh_cities')
    .select(
      `
      id,
      name,
      lh_areas (
        id,
        name
      )
    `,
    )
    .eq('prefecture_id', targetPrefId)
    .order('name');

  if (error) {
    throw error;
  }

  // 3. 各市区町村のホテル数を取得
  const { data: hotels } = await supabase
    .from('lh_hotels')
    .select('city_id')
    .eq('prefecture_id', targetPrefId);

  const results = data.map((city: any) => ({
    ...city,
    count: hotels?.filter((h: any) => h.city_id === city.id).length || 0,
    areas: city.lh_areas?.map((a: any) => a.name) || [],
  }));

  return results;
};

// Map DB hotel data to frontend Hotel interface
export const mapDbHotelToHotel = (dbHotel: any): Hotel => {
  // Use the first exterior image or legacy image_url
  const exteriorImages =
    dbHotel.lh_hotel_images?.filter((img: any) => img.category === 'exterior') || [];
  const mainImage = exteriorImages.length > 0 ? exteriorImages[0].url : dbHotel.image_url || '';

  return {
    id: dbHotel.id,
    name: dbHotel.name,
    prefecture: dbHotel.lh_prefectures?.name || '',
    city: dbHotel.lh_cities?.name || '',
    cityId: dbHotel.city_id || '',
    area: dbHotel.lh_areas?.name || '',
    address: dbHotel.address || '',
    phone: dbHotel.phone || '',
    website: dbHotel.website || '',
    imageUrl: mainImage,
    images:
      dbHotel.lh_hotel_images?.map((img: any) => ({ url: img.url, category: img.category })) || [],
    // Legacy price support (fallback)
    minPriceRest: dbHotel.min_price_rest,
    minPriceStay: dbHotel.min_price_stay,
    // New pricing structure
    restPriceMinWeekday: dbHotel.rest_price_min_weekday,
    restPriceMaxWeekday: dbHotel.rest_price_max_weekday,
    restPriceMinWeekend: dbHotel.rest_price_min_weekend,
    restPriceMaxWeekend: dbHotel.rest_price_max_weekend,
    stayPriceMinWeekday: dbHotel.stay_price_min_weekday,
    stayPriceMaxWeekday: dbHotel.stay_price_max_weekday,
    stayPriceMinWeekend: dbHotel.stay_price_min_weekend,
    stayPriceMaxWeekend: dbHotel.stay_price_max_weekend,
    rating: dbHotel.rating || 0,
    reviewCount: dbHotel.review_count || 0,
    amenities:
      dbHotel.lh_hotel_amenities?.map((a: any) => a.lh_amenities?.name).filter(Boolean) || [],
    services: dbHotel.lh_hotel_services?.map((s: any) => s.lh_services?.name).filter(Boolean) || [],
    distanceFromStation: dbHotel.distance_from_station || '',
    roomCount: dbHotel.room_count || 0,
    description: dbHotel.description || '',
  };
};

// --- Reviews ---

export const getReviews = async (hotelId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('lh_reviews')
    .select(
      `
      *,
      lh_review_photos(*)
    `,
    )
    .eq('hotel_id', hotelId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapDbReviewToReview);
};

export const mapDbReviewToReview = (dbReview: any): Review => {
  return {
    id: dbReview.id,
    hotelId: dbReview.hotel_id,
    userName: dbReview.user_name,
    rating: dbReview.rating,
    cleanliness: dbReview.cleanliness,
    service: dbReview.service,
    rooms: dbReview.rooms,
    value: dbReview.value,
    content: dbReview.content,
    date: dbReview.created_at ? new Date(dbReview.created_at).toISOString().split('T')[0] : '',
    roomNumber: dbReview.room_number,
    stayType: dbReview.stay_type,
    cost: dbReview.cost,
    photos: dbReview.lh_review_photos?.map((p: any) => ({
      url: p.url,
      category: p.category,
    })),
  };
};

export const uploadReviewImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `reviews/${fileName}`;

  // Using 'review-images' bucket (ensure it exists or use hotel-images if necessary)
  const { error: uploadError } = await supabase.storage.from('hotel-images').upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('hotel-images').getPublicUrl(filePath);
  return data.publicUrl;
};

export const submitReview = async (
  reviewData: Omit<Review, 'id' | 'photos' | 'date'>,
  photoFiles: { file: File; category: string }[],
) => {
  // 1. Insert Review
  const { data: review, error: reviewError } = await supabase
    .from('lh_reviews')
    .insert([
      {
        hotel_id: reviewData.hotelId,
        user_name: reviewData.userName,
        rating: reviewData.rating,
        cleanliness: reviewData.cleanliness,
        service: reviewData.service,
        rooms: reviewData.rooms,
        value: reviewData.value,
        content: reviewData.content,
        stay_type: reviewData.stayType,
        room_number: reviewData.roomNumber,
        cost: reviewData.cost,
      },
    ])
    .select()
    .single();

  if (reviewError) throw reviewError;

  // 2. Upload Photos & Link
  if (photoFiles.length > 0) {
    const photoInserts = await Promise.all(
      photoFiles.map(async (p) => {
        const url = await uploadReviewImage(p.file);
        return {
          review_id: review.id,
          url: url,
          category: p.category,
        };
      }),
    );

    const { error: photoError } = await supabase.from('lh_review_photos').insert(photoInserts);
    if (photoError) throw photoError;
  }

  return review;
};

export const deleteReview = async (reviewId: string) => {
  // 1. Get photo URLs before deleting
  const { data: photos } = await supabase
    .from('lh_review_photos')
    .select('url')
    .eq('review_id', reviewId);

  const photoUrls = photos?.map((p: any) => p.url) || [];

  // 2. Delete DB record (lh_review_photos will be cascaded if foreign key is set up with ON DELETE CASCADE)
  const { error } = await supabase.from('lh_reviews').delete().eq('id', reviewId);
  if (error) throw error;

  // 3. Delete from Storage
  if (photoUrls.length > 0) {
    await deleteStorageImages(photoUrls);
  }
};
