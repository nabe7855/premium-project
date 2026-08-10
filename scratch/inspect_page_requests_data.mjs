import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectPageRequestsData() {
  console.log('=== INSPECTING PAGE_REQUESTS TABLE (NEWS / CAMPAIGNS) ===\n');

  const records = await prisma.pageRequest.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  console.log(`Total PageRequest records: ${records.length}\n`);

  const now = new Date();
  console.log(`Current Time (JS Date.now()): ${now.toISOString()} (${now.getTime()})\n`);

  records.forEach((r, idx) => {
    const misc = r.referenceUrls || {};
    const settingsFukuoka = misc.storeSettings?.['fukuoka'];
    const settingsYokohama = misc.storeSettings?.['yokohama'];

    console.log(`[${idx + 1}] ID: ${r.id}`);
    console.log(`     Title: "${r.title}"`);
    console.log(`     Global Status: ${r.status}`);
    console.log(`     Target Store Slugs:`, r.targetStoreSlugs);
    console.log(`     Category:`, misc.category);
    console.log(`     Updated At:`, r.updatedAt.toISOString(), `(Time: ${r.updatedAt.getTime()})`);
    console.log(`     Fukuoka Settings:`, JSON.stringify(settingsFukuoka));
    console.log(`     Yokohama Settings:`, JSON.stringify(settingsYokohama));

    // Evaluate filtering logic for fukuoka & yokohama
    for (const storeSlug of ['fukuoka', 'yokohama']) {
      const slugs = r.targetStoreSlugs;
      const inSlugs = Array.isArray(slugs) && slugs.includes(storeSlug);
      const settings = misc.storeSettings?.[storeSlug];

      let isPublished = false;
      let pubTime = null;

      if (settings && settings.status) {
        isPublished = settings.status === 'published';
        if (settings.publishedAt) pubTime = new Date(settings.publishedAt).getTime();
      } else {
        isPublished = r.status === 'published';
        pubTime = new Date(r.updatedAt).getTime();
      }

      const isFuture = pubTime ? pubTime > now.getTime() : false;
      const isVisible = r.status === 'published' && inSlugs && isPublished && pubTime && !isFuture;

      console.log(`     -> Filter Result for store '${storeSlug}': Visible=${isVisible}`);
      if (!isVisible) {
        console.log(`        Reason for invisible on '${storeSlug}':`, {
          globalStatusOk: r.status === 'published',
          inSlugs,
          isPublished,
          hasPubTime: !!pubTime,
          pubTimeIso: pubTime ? new Date(pubTime).toISOString() : null,
          nowIso: now.toISOString(),
          isFuture
        });
      }
    }
    console.log('----------------------------------------------------------------\n');
  });
}

inspectPageRequestsData().catch(console.error);
