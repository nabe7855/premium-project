import { prisma } from '../src/lib/prisma.ts';

async function cleanup() {
  const orphanedId = 'c2bc1100-92b3-430f-ab0a-fa6cb2f682d9';
  const meta = await prisma.interviewMeta.findUnique({ where: { id: orphanedId } });
  if (meta) {
    await prisma.interviewCastLink.deleteMany({ where: { interview_meta_id: orphanedId } });
    await prisma.interviewMeta.delete({ where: { id: orphanedId } });
    console.log(`Cleaned up orphaned InterviewMeta record: ${orphanedId}`);
  } else {
    console.log('No orphaned record found.');
  }
}

cleanup().catch(console.error);
