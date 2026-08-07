import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://plfnvubetflomuhypfcf.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function auditReviews() {
  console.log('====================================================');
  console.log('=== STORE REVIEWS ACCURATE AUDIT (PER-STORE & CAST) ===');
  console.log('====================================================\n');

  const stores = ['fukuoka', 'yokohama'];

  for (const slug of stores) {
    // 1. Get active casts belonging to this store
    const activeCasts = await prisma.cast.findMany({
      where: {
        is_active: true,
        memberships: {
          some: {
            store: { slug }
          }
        }
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    console.log(`📍 Store: ${slug.toUpperCase()}`);
    console.log(`   Active Casts Count: ${activeCasts.length}`);

    const castIds = activeCasts.map(c => c.id);

    // 2. Fetch all reviews for these active cast IDs in DB
    const { data: reviews, error, count } = await supabase
      .from('reviews')
      .select('id, cast_id, user_name, rating, created_at', { count: 'exact' })
      .in('cast_id', castIds);

    if (error) {
      console.error(`❌ Error fetching reviews for ${slug}:`, error.message);
      continue;
    }

    console.log(`   TOTAL ACCURATE REVIEWS COUNT (Active Casts Only): ${count ?? 0}`);

    // Break down by cast
    const castCountMap = {};
    activeCasts.forEach(c => { castCountMap[c.id] = { name: c.name, count: 0 }; });

    (reviews || []).forEach(r => {
      if (castCountMap[r.cast_id]) {
        castCountMap[r.cast_id].count++;
      }
    });

    console.log(`   --- Cast Breakdown (${slug}) ---`);
    Object.values(castCountMap)
      .sort((a, b) => b.count - a.count)
      .forEach(c => {
        console.log(`     - ${c.name}: ${c.count}件`);
      });

    console.log('\n----------------------------------------------------\n');
  }

  await prisma.$disconnect();
}

auditReviews().catch(console.error);
