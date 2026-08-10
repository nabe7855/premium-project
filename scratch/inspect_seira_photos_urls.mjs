import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectSeiraPhotos() {
  console.log('=== INSPECTING SEIRA SUPABASE PHOTOS ===\n');

  // 1. Get Seira cast
  const { data: casts } = await supabase.from('casts').select('*').ilike('name', '%せいら%');
  if (casts && casts.length > 0) {
    console.log('Cast ID:', casts[0].id);
    console.log('Main Image URL:', casts[0].main_image_url);
    console.log('Image URL:', casts[0].image_url);
  }

  // 2. Get gallery images for Seira
  const { data: gallery } = await supabase.from('gallery').select('*').eq('cast_id', casts?.[0]?.id);
  console.log('Gallery Images:', gallery);
}

inspectSeiraPhotos().catch(console.error);
