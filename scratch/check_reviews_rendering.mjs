import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testGetReviewsByStore() {
  console.log('=== TESTING getReviewsByStore IMPLEMENTATION ===\n');

  // 1. Get active casts for Fukuoka via Prisma
  const activeCasts = await prisma.cast.findMany({
    where: {
      is_active: true,
      memberships: {
        some: {
          store: { slug: 'fukuoka' }
        }
      }
    },
    select: { id: true }
  });
  const targetCastIds = activeCasts.map((c) => c.id);

  console.log('Target Cast IDs count:', targetCastIds.length);

  // 2. Query Supabase
  const { data, error, count } = await supabase
    .from('reviews')
    .select(
      `
      id,
      cast_id,
      user_name,
      rating,
      comment,
      created_at,
      casts (
        id,
        slug,
        name,
        main_image_url,
        is_active
      ),
      review_tag_links (
        review_tag_master ( id, name )
      )
    `,
      { count: 'exact' }
    )
    .in('cast_id', targetCastIds)
    .order('created_at', { ascending: false })
    .range(0, 19);

  console.log('Supabase Query Result:');
  console.log('   error:', error);
  console.log('   count:', count);
  console.log('   data length:', data?.length);
  if (data && data.length > 0) {
    console.log('   Sample first review:', JSON.stringify(data[0], null, 2));
  }

  await prisma.$disconnect();
}

testGetReviewsByStore();
