const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function checkImages() {
  const { data, error } = await supabase
    .from('blogs')
    .select(
      `
            id,
            blog_images (
                image_url
            )
        `,
    )
    .limit(1);

  if (error) console.error(error);
  else console.log('Images:', JSON.stringify(data, null, 2));
}
checkImages();
