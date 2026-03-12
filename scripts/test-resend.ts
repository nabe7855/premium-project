import * as dotenv from 'dotenv';
import path from 'path';
import { Resend } from 'resend';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testSimple() {
  const results: any[] = [];

  try {
    const { data, error } = await resend.emails.send({
      from: 'Strawberry Recruit <apply@sutoroberrys.jp>',
      to: ['nabe7855@gmail.com'],
      subject: 'Test apply@sutoroberrys.jp',
      html: '<p>Test</p>',
    });
    results.push({ test: 1, data, error });
  } catch (err: any) {
    results.push({ test: 1, catch: err.message });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['nabe7855@gmail.com'],
      subject: 'Test onboarding@resend.dev',
      html: '<p>Test</p>',
    });
    results.push({ test: 2, data, error });
  } catch (err: any) {
    results.push({ test: 2, catch: err.message });
  }

  console.log('FINAL_RESULTS:' + JSON.stringify(results));
}

testSimple();
