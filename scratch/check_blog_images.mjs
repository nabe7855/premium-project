import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);
const key = anonKeyMatch[1].trim();

const supabase = createClient(supabaseUrl, key);

async function checkBlogImages() {
  const targetId = '26b90d63-4f34-4bb9-8af7-6c37f1e9f6ad';
  console.log('--- Checking blog post ID:', targetId, '---');

  const { data: blog, error: blogErr } = await supabase
    .from('blogs')
    .select(`
      id, title, content,
      blog_images ( id, image_url )
    `)
    .eq('id', targetId)
    .single();

  console.log('Blog title:', blog?.title);
  console.log('Blog images in DB:', blog?.blog_images);

  console.log('\n--- Checking first 10 blog_images in DB ---');
  const { data: images } = await supabase
    .from('blog_images')
    .select('id, blog_id, image_url')
    .limit(10);

  console.log(images);
}

checkBlogImages();
