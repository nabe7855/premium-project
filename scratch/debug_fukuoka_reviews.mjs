import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plfnvubetflomuhypfcf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkReviews() {
  console.log('=== CHECKING REVIEWS & RESERVATIONS ===');

  // 1. Get Fukuoka Casts via memberships
  const fukuokaCasts = await prisma.cast.findMany({
    where: { memberships: { some: { store: { slug: 'fukuoka' } } } },
    select: { id: true, name: true }
  });
  console.log(`Fukuoka active casts count: ${fukuokaCasts.length}`);
  const fukuokaCastIds = fukuokaCasts.map(c => c.id);

  // 2. Get Fukuoka Reservations
  const { data: resData, error: resErr } = await supabase
    .from('reservations')
    .select('id, customer_name, client_nickname, cast_id, store_id, status, created_at')
    .in('cast_id', fukuokaCastIds)
    .order('created_at', { ascending: false })
    .limit(10);

  console.log('Recent Fukuoka Reservations count:', resData?.length || 0);
  if (resErr) console.error('Reservation fetch error:', resErr);
  else console.log('Recent Fukuoka Reservations:', resData);

  // 3. Get Fukuoka Reviews
  const { data: revData, error: revErr } = await supabase
    .from('reviews')
    .select('id, cast_id, user_name, rating, comment, created_at')
    .in('cast_id', fukuokaCastIds)
    .order('created_at', { ascending: false });

  console.log(`Fukuoka Reviews count: ${revData?.length || 0}`);
  if (revErr) console.error('Review fetch error:', revErr);
  else console.log('Fukuoka Reviews:', revData);

  // 4. Test reviews table schema and null checks
  const { data: allRevs } = await supabase.from('reviews').select('id, cast_id, user_name, rating, comment, created_at').order('created_at', { ascending: false }).limit(5);
  console.log('Latest 5 Global Reviews:', allRevs);

  await prisma.$disconnect();
}

checkReviews().catch(console.error);
