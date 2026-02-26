import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs
  .readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const line_trimmed = line.trim();
    if (!line_trimmed || line_trimmed.startsWith('#')) return acc;
    const [key, ...val] = line_trimmed.split('=');
    if (key && val)
      acc[key.trim()] = val
        .join('=')
        .trim()
        .replace(/^["'](.*)["']$/, '$1');
    return acc;
  }, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
      id,
      casts (
        name,
        cast_store_memberships (
          stores ( slug )
        )
      )
    `,
    )
    .limit(1);

  if (error) {
    console.error(error);
  } else {
    console.log('Structure of casts:', JSON.stringify(data[0].casts, null, 2));
    console.log('Is array?', Array.isArray(data[0].casts));
  }
}

testFetch();
