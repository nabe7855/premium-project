import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';

const serviceRoleMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=["']?(.*?)["']?$/m);
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);

const key = serviceRoleMatch ? serviceRoleMatch[1].trim() : (anonKeyMatch ? anonKeyMatch[1].trim() : null);

async function upload() {
  if (!key) {
    console.error('Could not find Supabase Key in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, key);
  const fileBuffer = fs.readFileSync('public/images/amolab/jyosei-fuzoku-guide-eyecatch.jpg');
  const fileName = `jyosei-fuzoku-guide-eyecatch_${Date.now()}.jpg`;

  console.log('Uploading attached dedicated eyecatch image to Supabase Storage (gallery bucket)...');
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload error:', error);
    return;
  }

  console.log('Upload success:', data);
  const rawPublicUrl = `${supabaseUrl}/storage/v1/object/public/gallery/${fileName}`;
  const transformedUrl = `${supabaseUrl}/storage/v1/render/image/public/gallery/${fileName}?width=800&quality=75&resize=contain&format=webp`;

  console.log('\n======================================================');
  console.log('Raw Public URL (for OGP):', rawPublicUrl);
  console.log('Transformed WebP URL (for Eyecatch):', transformedUrl);
  console.log('======================================================\n');
}

upload();
