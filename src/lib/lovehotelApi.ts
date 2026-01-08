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

  if (filters?.prefectureId) query = query.eq('prefecture_id', filters.prefectureId);
  if (filters?.cityId) query = query.eq('city_id', filters.cityId);
  if (filters?.areaId) query = query.eq('area_id', filters.areaId);

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
      lh_hotel_amenities(amenity_id),
      lh_hotel_services(service_id),
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
  const { error } = await supabase.from('lh_hotels').delete().eq('id', id);
  if (error) throw error;
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

// --- Master Management helpers ---

export const upsertMaster = async (table: string, data: any) => {
  const { error } = await supabase.from(table).upsert([data]);
  if (error) throw error;
};

export const deleteMaster = async (table: string, id: string | number) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};
