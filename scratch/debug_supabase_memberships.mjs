import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);
const key = anonKeyMatch[1].trim();

const supabase = createClient(supabaseUrl, key);

async function testSupabaseQuery() {
  const postId = '1e6894a8-560e-4c46-9c3b-7817b6319827';
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id, title,
      casts ( id, name, slug, is_active, cast_store_memberships ( stores ( slug ) ) )
    `
    )
    .eq('id', postId)
    .single();

  console.log('--- Supabase Raw Data ---');
  console.log(JSON.stringify(data, null, 2));

  const castData = Array.isArray(data.casts) ? data.casts[0] : data.casts;
  const memberships = castData?.cast_store_memberships ?? [];
  console.log('Memberships:', memberships);
  const storeSlugs = Array.isArray(memberships)
    ? memberships.map((m) => m.stores?.slug).filter(Boolean)
    : [];
  console.log('All Store Slugs:', storeSlugs);

  const JP_STORES = ['fukuoka', 'yokohama'];
  const jpStoreSlugs = storeSlugs.filter((s) => JP_STORES.includes(s));
  console.log('JP Store Slugs:', jpStoreSlugs);
}

testSupabaseQuery();
