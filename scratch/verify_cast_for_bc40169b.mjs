import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function verifyCastForRecord() {
  const recordId = 'bc40169b-c8eb-4268-b80c-47aa2ae1b2c9';
  const { data: review } = await supabase.from('reviews').select('*, casts(id, name, slug)').eq('id', recordId).single();

  console.log('=== RECORD bc40169b DETAILS ===');
  console.log('Review ID:', review.id);
  console.log('Cast ID:', review.cast_id);
  console.log('Cast Name:', review.casts?.name);
  console.log('Cast Slug:', review.casts?.slug);
}

verifyCastForRecord().catch(console.error);
