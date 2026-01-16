import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ Environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('--- Checking Supabase Storage ---');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('❌ Error listing buckets:', error);
    return;
  }

  console.log('✅ Connected to Supabase Storage');
  console.log('Total buckets found:', buckets.length);

  buckets.forEach((bucket) => {
    console.log(`- Bucket: ${bucket.name} (Public: ${bucket.public})`);
  });

  const bannersBucket = buckets.find((b) => b.name === 'banners');
  if (bannersBucket) {
    console.log('✅ "banners" bucket exists.');
  } else {
    console.log('❌ "banners" bucket does NOT exist.');
    console.log('Attempting to create "banners" bucket (this might fail if RLS is on)...');

    // We try to create it, but usually this requires a service role key or specific RLS permissions
    const { data, error: createError } = await supabase.storage.createBucket('banners', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880, // 5MB
    });

    if (createError) {
      console.error('❌ Failed to create "banners" bucket:', createError.message);
      console.log('Please create it manually in the Supabase Dashboard:');
      console.log('1. Go to Storage.');
      console.log('2. Click "New bucket".');
      console.log('3. Name it "banners".');
      console.log('4. Ensure "Public bucket" is checked.');
    } else {
      console.log('✅ Successfully created "banners" bucket!');
    }
  }
}

checkStorage();
