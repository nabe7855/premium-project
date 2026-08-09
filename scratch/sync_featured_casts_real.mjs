import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function syncFeaturedCasts() {
  console.log('=== SYNCING FEATURED_CASTS TABLE WITH REAL DB CASTS ===\n');

  // Fetch active casts with stores from Supabase
  const { data: casts, error } = await supabase
    .from('casts')
    .select(`
      id, name, slug, main_image_url, image_url, is_active,
      cast_store_memberships!inner (
        stores!inner ( id, name, slug )
      )
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching active casts:', error);
    return;
  }

  console.log(`Found ${casts.length} active casts in DB with store memberships:`);
  
  // Pick active casts from Fukuoka and Yokohama with valid images
  const validCasts = casts.filter(c => c.main_image_url || c.image_url);
  console.log(`Valid active casts with images: ${validCasts.length}`);

  // Delete old stale featured_casts entries
  await supabase.from('featured_casts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Insert real active casts into featured_casts
  const newFeaturedEntries = validCasts.map((c, idx) => {
    const store = c.cast_store_memberships?.[0]?.stores;
    const storeName = store?.name || '福岡店';
    const storeSlug = store?.slug || 'fukuoka';
    const imageUrl = c.main_image_url || c.image_url;

    return {
      name: c.name,
      store_name: storeName,
      store_slug: storeSlug,
      catch_copy: `${storeName}で大人気のセラピスト`,
      image_url: imageUrl.startsWith('http') ? imageUrl : `https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/gallery/${imageUrl}`,
      link_url: `/store/${storeSlug}/cast/${c.slug || c.id}`,
      is_external: false,
      is_active: true,
      display_order: idx + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  const { error: insertErr } = await supabase.from('featured_casts').insert(newFeaturedEntries);
  if (insertErr) {
    console.error('Error inserting featured_casts:', insertErr);
  } else {
    console.log(`✅ Successfully synced ${newFeaturedEntries.length} real active casts to featured_casts table!`);
  }
}

syncFeaturedCasts().catch(console.error);
