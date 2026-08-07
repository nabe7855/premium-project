import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);
const key = anonKeyMatch[1].trim();

const supabase = createClient(supabaseUrl, key);

async function inspectPost() {
  const targetId = '574c9b2c-c8f3-4957-a336-7a58c5c6517c';
  const { data: blog } = await supabase
    .from('blogs')
    .select(`
      id, title, content,
      blog_images ( id, image_url )
    `)
    .eq('id', targetId)
    .single();

  console.log('--- Inspecting Post 574c9b2c-c8f3-4957-a336-7a58c5c6517c ---');
  console.log('Title:', blog?.title);
  console.log('Images in blog_images:', blog?.blog_images);
  console.log('Content Snippet:\n', blog?.content);
}

inspectPost();
