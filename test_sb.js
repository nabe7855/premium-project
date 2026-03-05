import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function main() {
  const { data: hotels, error } = await supabase
    .from('lh_hotels')
    .select(
      `
      id,
      name,
      lh_hotel_amenities(lh_amenities(*))
    `,
    )
    .limit(10);

  if (error) throw error;
  const hotelWithAmenity = hotels.find(
    (h) => h.lh_hotel_amenities && h.lh_hotel_amenities.length > 0,
  );
  if (!hotelWithAmenity) {
    console.log('No hotels found with amenities in Supabase.');
    return;
  }
  console.log('Hotel:', hotelWithAmenity.name);
  console.log(
    'Join entry sample:',
    JSON.stringify(hotelWithAmenity.lh_hotel_amenities[0], null, 2),
  );
}

main().catch(console.error);
