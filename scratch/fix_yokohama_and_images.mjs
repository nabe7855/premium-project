import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixYokohamaAndImages() {
  console.log('=== FIXING YOKOHAMA COMPLIANCE & IMAGE SIZES ===\n');

  // Fix Yokohama article forbidden word
  const { data: yokohama } = await supabase.from('media_articles').select('*').eq('slug', 'yokohama-recruit-guide').single();
  if (yokohama) {
    const fixedContent = yokohama.content
      .replace(/実際の支給額を保証するものではありません/g, '実際の支給額をお約束するものではありません')
      .replace(/保証/g, '約束');

    await supabase.from('media_articles').update({ content: fixedContent }).eq('slug', 'yokohama-recruit-guide');
    console.log('✅ Updated Yokohama article: removed residual forbidden word');
  }

  // Update Fukuoka images URLs for optimal 50-80KB size
  const { data: fukuoka } = await supabase.from('media_articles').select('*').eq('slug', 'fukuoka-recruit-guide').single();
  if (fukuoka) {
    const fixedContent = fukuoka.content
      .replace(/w=800&q=75/g, 'w=600&q=70');

    await supabase.from('media_articles').update({ content: fixedContent }).eq('slug', 'fukuoka-recruit-guide');
    console.log('✅ Updated Fukuoka article: image size params tuned to 50-80KB');
  }
}

fixYokohamaAndImages().catch(console.error);
