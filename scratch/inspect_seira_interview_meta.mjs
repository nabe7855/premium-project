import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function inspectSeiraMeta() {
  console.log('=== INSPECTING SEIRA INTERVIEW META & CAST LINKS ===\n');

  const meta = await prisma.interviewMeta.findMany({
    include: { cast_links: true }
  });

  meta.forEach((m) => {
    console.log('Meta ID:', m.id);
    console.log('  Article ID:', m.article_id);
    console.log('  Area:', m.area);
    console.log('  Vol Number:', m.vol_number);
    console.log('  Cast Links:', m.cast_links);
    console.log('-------------------------------------------');
  });
}

inspectSeiraMeta().catch(console.error);
