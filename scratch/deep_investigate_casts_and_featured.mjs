import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function deepInvestigate() {
  console.log('================================================================');
  console.log('=== DEEP INVESTIGATION: CASTS & FEATURED CASTS STORE MAPPING ===');
  console.log('================================================================\n');

  // 1. Fetch all casts and their store memberships
  const { data: casts, error: castErr } = await supabase
    .from('casts')
    .select(`
      id, name, slug, image_url, main_image_url, is_active,
      cast_store_memberships (
        stores ( id, name, slug )
      )
    `);

  console.log(`--- 1. REAL CASTS IN DB (Total: ${casts?.length || 0}) ---`);
  (casts || []).forEach((c, idx) => {
    const stores = (c.cast_store_memberships || []).map(m => `${m.stores?.name} (${m.stores?.slug})`).join(', ');
    console.log(`[${idx + 1}] Cast Name: "${c.name}" (slug: ${c.slug})`);
    console.log(`     Real Stores in DB: [ ${stores || '所属店舗なし'} ]`);
    console.log(`     Image URL: ${c.main_image_url || c.image_url}`);
    console.log('---');
  });

  // 2. Fetch featured_casts table entries
  const { data: featured, error: featErr } = await supabase.from('featured_casts').select('*');
  console.log(`\n--- 2. FEATURED_CASTS TABLE ENTRIES (Total: ${featured?.length || 0}) ---`);
  (featured || []).forEach((f, idx) => {
    console.log(`[${idx + 1}] Name: "${f.name}"`);
    console.log(`     DB Store Name: "${f.store_name}" (slug: ${f.store_slug})`);
    console.log(`     Image URL: ${f.image_url}`);
    console.log(`     Link URL: ${f.link_url}`);
    console.log('---');
  });
}

deepInvestigate().catch(console.error);
