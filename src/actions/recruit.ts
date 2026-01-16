'use server';

// TEMPORARY: Commented out until DATABASE_URL is properly configured
// Uncomment this file when you're ready to set up the database

/*
import { extractImageUrls } from '@/lib/image-cleanup';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function saveRecruitPageConfig(storeSlug: string, fullConfig: any) {
  try {
    // 1. Resolve Store ID from Slug
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      console.error(`Store not found for slug: ${storeSlug}`);
      return { success: false, error: 'Store not found' };
    }

    const storeId = store.id;

    // 2. Iterate over config sections
    for (const [key, content] of Object.entries(fullConfig)) {
      if (!content) continue;

      // Fetch existing
      const existing = await prisma.recruitPage.findUnique({
        where: {
          store_id_section_key: {
            store_id: storeId,
            section_key: key,
          },
        },
      });

      if (existing) {
        // 3. Image Cleanup
        const oldUrls = extractImageUrls(existing.content);
        const newUrls = extractImageUrls(content);
        const removedUrls = oldUrls.filter((u) => !newUrls.includes(u));

        if (removedUrls.length > 0) {
          console.log('Cleaning up removed images:', removedUrls);
          for (const url of removedUrls) {
            try {
              const urlObj = new URL(url);
              // Expected URL format: https://.../storage/v1/object/public/[bucket]/[path]
              // Or direct Supabase extracted URL
              const pathParts = urlObj.pathname.split('/storage/v1/object/public/');
              if (pathParts.length > 1) {
                const fullPath = pathParts[1];
                // Extract bucket name (first segment)
                const [bucket, ...rest] = fullPath.split('/');
                const filePath = rest.join('/');

                if (bucket && filePath) {
                  // Use Supabase Admin to delete
                  const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);
                  if (error) {
                    console.error(`Failed to delete ${filePath} from ${bucket}:`, error);
                  } else {
                    console.log(`Deleted ${filePath} from ${bucket}`);
                  }
                }
              }
            } catch (e) {
              console.error('Error parsing URL for deletion:', url, e);
            }
          }
        }

        // 4. Update
        await prisma.recruitPage.update({
          where: { id: existing.id },
          data: { content: content as any },
        });
      } else {
        // 5. Create
        await prisma.recruitPage.create({
          data: {
            store_id: storeId,
            section_key: key,
            content: content as any,
          },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving recruit config:', error);
    return { success: false, error: String(error) };
  }
}
*/

// Temporary stub function
export async function saveRecruitPageConfig(_storeSlug: string, _fullConfig: any) {
  console.warn('saveRecruitPageConfig is currently disabled. Configure DATABASE_URL to enable.');
  return { success: false, error: 'Database not configured' };
}
