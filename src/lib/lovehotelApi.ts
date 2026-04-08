import { Hotel, Review } from '@/types/lovehotels';
import { v4 as uuidv4 } from 'uuid';
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

export const getPurposes = async () => {
  const { data, error } = await supabase.from('lh_purposes').select('*').order('name');
  if (error) throw error;
  return data;
};

// --- Hotels ---

export const getHotels = async (filters?: {
  prefectureId?: string;
  cityId?: string;
  cityIds?: string[];
  areaId?: string;
  keyword?: string;
  status?: string[];
  minRestPrice?: number;
  maxRestPrice?: number;
  minStayPrice?: number;
  maxStayPrice?: number;
  minRating?: number;
  purposeId?: string;
  purposeIds?: string[];
  amenityIds?: string[];
  tags?: string[];
  prefectureName?: string;
  dayType?: 'weekday' | 'weekend' | 'holiday';
  stayType?: 'rest' | 'stay';
  sort?: { column: string; ascending: boolean };
  take?: number;
}) => {
  let selectString = `
      *,
      lh_prefectures(name),
      lh_cities(name),
      lh_areas(name),
      lh_hotel_amenities(amenity_id, lh_amenities(*)),
      lh_hotel_services(service_id, lh_services(*)),
      lh_hotel_purposes(purpose_id, lh_purposes(*)),
      lh_hotel_images(*)
    `;

  // Filter joins using !inner if needed
  const hasPurposes = (filters?.purposeIds && filters.purposeIds.length > 0) || filters?.purposeId;
  const hasAmenities = filters?.amenityIds && filters.amenityIds.length > 0;

  if (hasPurposes || hasAmenities) {
    selectString = `
      *,
      lh_prefectures(name),
      lh_cities(name),
      lh_areas(name),
      lh_hotel_amenities${hasAmenities ? '!inner' : ''}(amenity_id, lh_amenities(*)),
      lh_hotel_services(service_id, lh_services(*)),
      lh_hotel_purposes${hasPurposes ? '!inner' : ''}(purpose_id, lh_purposes(*)),
      lh_hotel_images(*)
    `;
  }

  let query = supabase.from('lh_hotels').select(selectString);

  // Area Filters
  if (filters?.prefectureId) {
    const cleanId = filters.prefectureId.trim();
    query = query.in('prefecture_id', [cleanId, ` ${cleanId}`]);
  }
  if (filters?.prefectureName) {
    query = query.eq('lh_prefectures.name', filters.prefectureName);
  }
  if (filters?.cityId) {
    const cleanId = filters.cityId.trim();
    query = query.in('city_id', [cleanId, ` ${cleanId}`]);
  }
  if (filters?.cityIds && filters.cityIds.length > 0) {
    query = query.in('city_id', filters.cityIds);
  }
  if (filters?.areaId) {
    const cleanId = filters.areaId.trim();
    query = query.in('area_id', [cleanId, ` ${cleanId}`]);
  }

  // Keyword / Tags
  if (filters?.keyword) {
    const k = filters.keyword;
    query = query.or(
      `name.ilike."%${k}%",address.ilike."%${k}%",description.ilike."%${k}%",access_info->>stations.ilike."%${k}%"`,
    );
  }
  if (filters?.tags && filters.tags.length > 0) {
    // Treat tags as keywords for now to widen search
    const tagQuery = filters.tags.map((t) => `description.ilike."%${t}%"`).join(',');
    query = query.or(tagQuery);
  }

  // Status
  if (filters?.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  // Price Filters
  const hasPriceFilter =
    filters?.minRestPrice || filters?.maxRestPrice || filters?.minStayPrice || filters?.maxStayPrice;

  if (hasPriceFilter) {
    if (filters?.minRestPrice) {
      query = query.gte('min_price_rest', filters.minRestPrice);
    }
    if (filters?.maxRestPrice) {
      query = query.lte('min_price_rest', filters.maxRestPrice);
    }
    if (filters?.minStayPrice) {
      query = query.gte('min_price_stay', filters.minStayPrice);
    }
    if (filters?.maxStayPrice) {
      query = query.lte('min_price_stay', filters.maxStayPrice);
    }
  }

  // Rating
  if (filters?.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  // Purposes & Amenities (Joins)
  if (filters?.purposeId) {
    query = query.eq('lh_hotel_purposes.purpose_id', filters.purposeId);
  } else if (filters?.purposeIds && filters.purposeIds.length > 0) {
    query = query.in('lh_hotel_purposes.purpose_id', filters.purposeIds);
  }

  if (filters?.amenityIds && filters.amenityIds.length > 0) {
    query = query.in('lh_hotel_amenities.amenity_id', filters.amenityIds);
  }

  const sortCol = filters?.sort?.column || 'created_at';
  const sortAsc = filters?.sort?.ascending ?? false;

  let { data, error } = await query
    .order(sortCol, { ascending: sortAsc })
    .limit(filters?.take || 1000);

  if (error) throw error;
  return data || [];
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
      lh_hotel_amenities(amenity_id, lh_amenities(*)),
      lh_hotel_services(service_id, lh_services(*)),
      lh_hotel_purposes(purpose_id, lh_purposes(*)),
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
  purposeIds: string[],
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

  // 5. Link Purposes
  if (purposeIds && purposeIds.length > 0) {
    const { error: purpError } = await supabase
      .from('lh_hotel_purposes')
      .insert(purposeIds.map((id) => ({ hotel_id: hotel.id, purpose_id: id })));
    if (purpError) throw purpError;
  }

  return hotel;
};

export const updateHotel = async (
  id: string,
  hotelData: any,
  amenityIds: string[],
  serviceIds: string[],
  purposeIds: string[],
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

  // 5. Refresh Purposes
  await supabase.from('lh_hotel_purposes').delete().eq('hotel_id', id);
  if (purposeIds && purposeIds.length > 0) {
    await supabase
      .from('lh_hotel_purposes')
      .insert(purposeIds.map((pId) => ({ hotel_id: id, purpose_id: pId })));
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

/**
 * 名前リストからマスターデータを同期し（存在しなければ作成）、IDリストを返す
 */
export const syncMasterData = async (table: string, names: string[]) => {
  const cleanNames = [...new Set(names.filter(Boolean).map((n) => n.trim()))];
  if (cleanNames.length === 0) return [];

  // 1. 既存のデータを取得
  const { data: existing } = await supabase.from(table).select('id, name').in('name', cleanNames);

  const existingMap = new Map(existing?.map((e: any) => [e.name, e.id]) || []);
  const existingNames = new Set(existing?.map((e: any) => e.name) || []);

  // 2. 未登録の名前を特定して挿入
  const missingNames = cleanNames.filter((n) => !existingNames.has(n));

  if (missingNames.length > 0) {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(missingNames.map((name) => ({ id: uuidv4(), name })))
      .select();

    if (error) {
      console.error(`[syncMasterData] Error inserting missing ${table}:`, error);
      throw error;
    }

    inserted?.forEach((i: any) => existingMap.set(i.name, i.id));
  }

  // 3. 元の順番・リストに対応するIDを返す
  return cleanNames.map((name) => existingMap.get(name)).filter(Boolean) as string[];
};

export const getPrefectureDetails = async (prefectureSlug: string) => {
  const cleanSlug = prefectureSlug.trim();

  // スラグからDBの都道府県を探す。DBのIDは " Fukuoka" のようにスペース付き英語の可能性あり。
  // 複数候補を試行する
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const candidateIds = [
    cleanSlug,
    ` ${cleanSlug}`,
    ` ${capitalize(cleanSlug)}`,
    capitalize(cleanSlug),
  ];

  let targetPrefId = cleanSlug; // fallback
  let prefName: string | null = null;
  let prefDescription: string | null = null;

  for (const candidateId of candidateIds) {
    const { data } = await supabase
      .from('lh_prefectures')
      .select('id, name, description')
      .eq('id', candidateId)
      .maybeSingle();
    if (data) {
      targetPrefId = data.id;
      prefName = data.name;
      prefDescription = data.description;
      break;
    }
  }

  // 2. 市区町村とエリアを取得
  const { data: cityData, error: cityError } = await supabase
    .from('lh_cities')
    .select(
      `
      id,
      name,
      description,
      lh_areas (
        id,
        name
      )
    `,
    )
    .eq('prefecture_id', targetPrefId)
    .order('name');

  if (cityError) {
    console.error('[getPrefectureDetails] city fetch error:', cityError.message);
  }

  // 3. 各市区町村のホテル数を取得
  const { data: hotels } = await supabase
    .from('lh_hotels')
    .select('city_id')
    .eq('prefecture_id', targetPrefId);

  const results = (cityData || []).map((city: any) => ({
    ...city,
    count: hotels?.filter((h: any) => h.city_id === city.id).length || 0,
    areas: city.lh_areas?.map((a: any) => a.name) || [],
  }));

  return {
    prefectureName: prefName || cleanSlug,
    description: prefDescription,
    cities: results,
  };
};

export const getHotelsCount = async (filters: { prefecture?: string; cities?: string[] }) => {
  let query = supabase.from('lh_hotels').select('city_id, lh_cities(name)');
  const { data } = await query;
  const counts: Record<string, number> = {};
  data?.forEach((h: any) => {
    const name = h.lh_cities?.name;
    if (name) counts[name] = (counts[name] || 0) + 1;
  });
  return counts;
};

export const getCityDetails = async (cityId: string) => {
  const { data, error } = await supabase
    .from('lh_cities')
    .select('id, name, description')
    .eq('id', cityId)
    .single();

  if (error) return null;
  return data;
};

// Normalize price_details: accepts both array [{category, plans}] and object {category: plans}
export const normalizePriceDetails = (raw: any): any[] | undefined => {
  if (!raw) return undefined;
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') {
    // Convert {宿泊: [...], 延長料金: [...]} => [{category: '宿泊', plans: [...]}, ...]
    return Object.keys(raw).map((key) => ({ category: key, plans: raw[key] || [] }));
  }
  return undefined;
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
    prefectureId: dbHotel.prefecture_id?.trim() || '',
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
    purposes: dbHotel.lh_hotel_purposes?.map((p: any) => p.lh_purposes?.name).filter(Boolean) || [],
    distanceFromStation: dbHotel.distance_from_station || '',
    accessInfo: dbHotel.access_info || null,
    roomCount: dbHotel.room_count || 0,
    description: dbHotel.description || '',
    aiDescription: dbHotel.ai_description || '',
    aiSummary: dbHotel.ai_summary || '',
    aiProsCons: dbHotel.ai_pros_cons || null,
    priceDetails: normalizePriceDetails(dbHotel.price_details),
    status: dbHotel.status || 'draft',
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
    design: dbReview.design,
    facilities: dbReview.facilities,
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
    helpfulCount: dbReview.helpful_count || 0,
    isCast: dbReview.is_cast,
    isVerified: dbReview.is_verified,
    isRecommended: dbReview.is_recommended ?? true,
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
        design: reviewData.design,
        facilities: reviewData.facilities,
        rooms: reviewData.rooms,
        value: reviewData.value,
        content: reviewData.content,
        stay_type: reviewData.stayType,
        room_number: reviewData.roomNumber,
        cost: reviewData.cost,
        is_recommended: reviewData.isRecommended ?? true,
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

export const incrementReviewHelpfulCount = async (reviewId: string) => {
  // Using rpc or manual increment
  // Manual increment for simplicity if not using postgrest-js rpc
  const { data: review } = await supabase
    .from('lh_reviews')
    .select('helpful_count')
    .eq('id', reviewId)
    .single();

  const newCount = (review?.helpful_count || 0) + 1;

  const { error } = await supabase
    .from('lh_reviews')
    .update({ helpful_count: newCount })
    .eq('id', reviewId);

  if (error) throw error;
  return newCount;
};
