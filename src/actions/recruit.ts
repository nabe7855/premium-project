'use server';

import { extractImageUrls } from '@/lib/image-cleanup';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Get recruitment page configuration for a specific store
 */
export async function getRecruitPageConfig(storeSlug: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      include: { recruit_pages: true },
    });

    if (!store) {
      return { success: false, error: 'Store not found' };
    }

    // Convert array of sections to a single config object
    const config: Record<string, any> = {};
    store.recruit_pages.forEach((page: any) => {
      config[page.section_key] = page.content;
    });

    return { success: true, config };
  } catch (error) {
    console.error('Error fetching recruit config:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Save recruitment page configuration for a specific store
 */
export async function saveRecruitPageConfig(storeSlug: string, fullConfig: any) {
  console.log('🚀 Starting saveRecruitPageConfig for store:', storeSlug);
  console.log('📦 Config keys to save:', Object.keys(fullConfig));

  try {
    // Check DATABASE_URL existence (without security-sensitive details)
    const hasDbUrl = !!process.env.DATABASE_URL;
    console.log('💎 DATABASE_URL configured:', hasDbUrl);
    if (hasDbUrl) {
      const urlShort = process.env.DATABASE_URL?.substring(0, 20) + '...';
      console.log('🔗 DATABASE_URL starts with:', urlShort);
    }

    // 1. Resolve Store ID from Slug
    console.log('🔍 Looking up store by slug...');
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      console.error(`❌ Store not found for slug: ${storeSlug}`);
      return { success: false, error: 'Store not found' };
    }

    console.log('✅ Store found. ID:', store.id);
    const storeId = store.id;

    // 2. Iterate over config sections
    for (const [key, content] of Object.entries(fullConfig)) {
      if (!content) {
        console.log(`⏩ Skipping empty section: ${key}`);
        continue;
      }

      console.log(`📝 Processing section: [${key}]`);

      // Fetch existing
      console.log(`🔍 Checking existing record for section: ${key}`);
      const existing = await prisma.recruitPage.findUnique({
        where: {
          store_id_section_key: {
            store_id: storeId,
            section_key: key,
          },
        },
      });

      if (existing) {
        console.log(`🔄 Existing record found (ID: ${existing.id}). Updating...`);
        // 3. Image Cleanup
        const oldUrls = extractImageUrls(existing.content);
        const newUrls = extractImageUrls(content);
        const removedUrls = oldUrls.filter((u) => !newUrls.includes(u));

        if (removedUrls.length > 0) {
          console.log(`🧹 Cleaning up ${removedUrls.length} removed images:`, removedUrls);
          for (const url of removedUrls) {
            try {
              const urlObj = new URL(url);
              const pathParts = urlObj.pathname.split('/storage/v1/object/public/');
              if (pathParts.length > 1) {
                const fullPath = pathParts[1];
                const [bucket, ...rest] = fullPath.split('/');
                const filePath = rest.join('/');

                if (bucket && filePath) {
                  console.log(`🗑️ Deleting from storage: bucket=${bucket}, path=${filePath}`);
                  const { error } = await supabaseAdmin.storage.from(bucket).remove([filePath]);
                  if (error) {
                    console.error(`❌ Storage deletion failed for ${filePath}:`, error);
                  } else {
                    console.log(`✅ Deleted ${filePath}`);
                  }
                }
              }
            } catch (e) {
              console.error('⚠️ Error parsing URL for deletion:', url, e);
            }
          }
        }

        // 4. Update
        try {
          await prisma.recruitPage.update({
            where: { id: existing.id },
            data: { content: content as any },
          });
          console.log(`✅ Updated section [${key}] successfully.`);
        } catch (updateError) {
          console.error(`❌ Prisma update error for [${key}]:`, updateError);
          throw updateError;
        }
      } else {
        console.log(`✨ Creating new record for section: ${key}`);
        // 5. Create
        try {
          await prisma.recruitPage.create({
            data: {
              store_id: storeId,
              section_key: key,
              content: content as any,
            },
          });
          console.log(`✅ Created section [${key}] successfully.`);
        } catch (createError) {
          console.error(`❌ Prisma create error for [${key}]:`, createError);
          throw createError;
        }
      }
    }

    console.log('🎉 saveRecruitPageConfig completed successfully.');
    return { success: true };
  } catch (error) {
    console.error('🔥 CRITICAL ERROR in saveRecruitPageConfig:', error);
    // Log more detailed error if available
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    return { success: false, error: String(error) };
  }
}
