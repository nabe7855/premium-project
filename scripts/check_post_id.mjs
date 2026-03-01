import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [key, ...val] = line.split('=');
      if (!key || !val) return ['', ''];
      return [
        key.trim(),
        val
          .join('=')
          .trim()
          .replace(/^["'](.*)["']$/, '$1'),
      ];
    })
    .filter(([k]) => k),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const postId = '5baf4cd0-d52b-4e9c-bb1a-d936c56b8737';
  console.log(`Checking diary post ID: ${postId}`);

  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id,
      title,
      created_at,
      casts ( name )
    `,
    )
    .eq('id', postId)
    .single();

  if (error) {
    console.error('❌ Blog not found or error:', error.message);
  } else {
    console.log('✅ Blog found:', JSON.stringify(data, null, 2));
  }
}

run();
