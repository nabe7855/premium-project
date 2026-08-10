import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectNewsAndCampaigns() {
  console.log('=== INSPECTING NEWS & CAMPAIGNS IN ALL TABLES ===\n');

  // Check Prisma HomePageConfigHistory / StoreTopConfig / Campaign / Banner
  try {
    const campaigns = await prisma.campaign.findMany();
    console.log('Campaigns count:', campaigns.length);
    campaigns.forEach(c => console.log('  Campaign:', c.id, c.title, c.is_active));
  } catch (e) {
    console.log('Error fetching campaigns:', e.message);
  }

  // Check Supabase table list / news_posts / announcements / store_news / news
  const possibleTables = ['news', 'news_posts', 'announcements', 'store_news', 'campaigns', 'banners', 'store_top_configs', 'home_page_config_histories'];

  for (const tbl of possibleTables) {
    try {
      const { data, error } = await supabase.from(tbl).select('*').limit(5);
      if (!error && data) {
        console.log(`Table "${tbl}" exists, count sample: ${data.length}`);
        if (data.length > 0) {
          console.log(`Sample item in "${tbl}":`, JSON.stringify(data[0], null, 2));
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

inspectNewsAndCampaigns().catch(console.error);
