import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testPrismaVsSupabase() {
  console.log('=== PRISMA VS SUPABASE CAST QUERY ===\n');

  // 1. Prisma query for Fukuoka
  try {
    const prismaFukuoka = await prisma.cast.findMany({
      where: {
        is_active: true,
        memberships: {
          some: {
            store: { slug: 'fukuoka' }
          }
        }
      },
      select: { id: true, name: true }
    });
    console.log('1. Prisma Fukuoka active casts count:', prismaFukuoka.length, prismaFukuoka);
  } catch (e) {
    console.error('Prisma query error:', e);
  }

  // 2. Supabase query for Fukuoka
  try {
    const { data: supabaseFukuoka, error } = await supabase
      .from('casts')
      .select('id, name, cast_store_memberships!inner(stores!inner(slug))')
      .eq('is_active', true)
      .eq('cast_store_memberships.stores.slug', 'fukuoka');

    console.log('\n2. Supabase Fukuoka active casts count:', supabaseFukuoka?.length, 'error:', error);
  } catch (e) {
    console.error('Supabase query error:', e);
  }

  await prisma.$disconnect();
}

testPrismaVsSupabase();
