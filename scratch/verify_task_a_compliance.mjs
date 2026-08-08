import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

async function verifyCompliance() {
  console.log('=== VERIFYING TASK A COMPLIANCE (GREP ZERO MATCH) ===\n');

  const { data: articles } = await supabase
    .from('media_articles')
    .select('*')
    .eq('category', 'ikeo');

  const forbiddenRegex = /(保証|確実に|絶対|必ず|安定して稼げる)/g;
  let totalViolations = 0;

  for (const article of articles) {
    const text = stripHtml(article.content || '') + ' ' + (article.title || '');
    const matches = text.match(forbiddenRegex) || [];

    console.log(`Checking /ikeo/${article.slug}...`);
    if (matches.length > 0) {
      console.error(`❌ VIOLATION FOUND (${matches.length} matches):`, matches);
      totalViolations += matches.length;
    } else {
      console.log(`✅ CLEAN: 0 violations found.`);
    }
  }

  console.log(`\nTOTAL COMPLIANCE VIOLATIONS: ${totalViolations}`);
  if (totalViolations === 0) {
    console.log('🎉 TASK A COMPLIANCE VERIFICATION PASSED PERFECTLY!');
  }
}

verifyCompliance().catch(console.error);
