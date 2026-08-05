import { submitRecruitApplication, deleteRecruitApplication } from '../src/actions/recruit.ts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTask3() {
  console.log('=== TESTING TASK 3: REFERRAL SOURCE FORM SUBMISSION ===');

  let testIdA = null;
  let testIdB = null;

  try {
    // 1. Test (a): With referral_source selected
    console.log('\n--- Test A: Form submit WITH referral_source ---');
    const formA = new FormData();
    formA.append('type', 'quick');
    formA.append('name', '[TEST-A] Referral Test');
    formA.append('phone', '090-0000-0001');
    formA.append('email', 'test-a@example.com');
    formA.append('store', 'fukuoka');
    formA.append('referral_source', '求人サイト(kaikan等)');

    const resA = await submitRecruitApplication(formA);
    if (!resA.success || !resA.id) throw new Error('Submission A failed');
    testIdA = resA.id;

    const recordA = await prisma.recruitApplication.findUnique({ where: { id: testIdA } });
    console.log('✅ Submission A Result ID:', recordA.id);
    console.log('Stored details JSON:', recordA.details);
    if (recordA.details && recordA.details.referral_source === '求人サイト(kaikan等)') {
      console.log('✅ VERIFICATION A PASSED: referral_source "求人サイト(kaikan等)" stored cleanly!');
    } else {
      console.error('❌ VERIFICATION A FAILED: referral_source missing or mismatch');
    }

    // 2. Test (b): Without referral_source selected (blank)
    console.log('\n--- Test B: Form submit WITHOUT referral_source (Optional) ---');
    const formB = new FormData();
    formB.append('type', 'quick');
    formB.append('name', '[TEST-B] Blank Referral Test');
    formB.append('phone', '090-0000-0002');
    formB.append('email', 'test-b@example.com');
    formB.append('store', 'yokohama');

    const resB = await submitRecruitApplication(formB);
    if (!resB.success || !resB.id) throw new Error('Submission B failed');
    testIdB = resB.id;

    const recordB = await prisma.recruitApplication.findUnique({ where: { id: testIdB } });
    console.log('✅ Submission B Result ID:', recordB.id);
    console.log('Stored details JSON:', recordB.details);
    if (recordB) {
      console.log('✅ VERIFICATION B PASSED: Unselected/blank submission succeeded without error!');
    }

  } finally {
    // Clean up test data
    console.log('\n--- Cleaning up test records ---');
    if (testIdA) {
      await deleteRecruitApplication(testIdA);
      console.log(`🗑️ Deleted Test Record A: ${testIdA}`);
    }
    if (testIdB) {
      await deleteRecruitApplication(testIdB);
      console.log(`🗑️ Deleted Test Record B: ${testIdB}`);
    }
  }
}

testTask3().catch(console.error).finally(() => prisma.$disconnect());
