import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const sqlPath = path.join(process.cwd(), 'sql', 'create_recruit_pages_table.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📝 Executing SQL to create recruit_pages table...');

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

  if (error) {
    console.error('❌ Error:', error);

    // Try direct query if RPC doesn't work
    console.log('Trying direct query...');
    const { error: directError } = await supabase.from('recruit_pages').select('id').limit(1);

    if (directError && directError.code === '42P01') {
      console.log('Table does not exist. Creating manually via Prisma...');
      // We'll need to use Prisma raw query instead
    }
  } else {
    console.log('✅ Table created successfully');
  }
}

main().catch(console.error);
