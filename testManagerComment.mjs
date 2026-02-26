import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envKeys = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
envKeys.forEach((line) => {
  const [key, ...val] = line.trim().split('=');
  if (key) env[key] = val.join('=').replace(/^[\"'](.*)[\"']$/, '$1');
});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase
  .from('casts')
  .select('manager_comment')
  .limit(1)
  .then((res) => {
    console.log(JSON.stringify(res));
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
