import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function detailedAudit() {
  const { data: articles } = await supabase
    .from('media_articles')
    .select('*')
    .eq('category', 'ikeo')
    .order('published_at', { ascending: false });

  console.log('=== IKEO ARTICLES DETAILED ANALYSIS ===\n');

  for (const a of articles || []) {
    const raw = a.content || '';
    const text = stripHtml(raw);

    // H1 check
    const h1Match = raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1 = h1Match ? stripHtml(h1Match[1]) : a.title;

    // Assertions check (income, medical, certainty)
    const assertionRegex = /([^。！？\n]*?(?:月収\s*\d+万|年収|稼げる|確実に|絶対|100%|保証|必ず|改善|効果)[^。！？\n]*?[。！？\n])/g;
    const matches = [];
    let m;
    while ((m = assertionRegex.exec(text)) !== null) {
      matches.push(m[1].trim());
    }

    // Dummy links
    const dummyLinks = raw.match(/href=["'](#|javascript:void\(0\)|https?:\/\/(www\.)?example\.com[^"']*)["']/gi) || [];

    // Internal links
    const internalLinks = raw.match(/href=["'](\/[^"']*)["']/gi) || [];

    // Images
    const imgs = raw.match(/<img[^>]+>/gi) || [];
    let alts = 0;
    imgs.forEach(i => {
      if (/alt=["']([^"']+)["']/i.test(i)) alts++;
    });

    // Operator mention
    const operator = /ストロベリーボーイズ|strawberry\s*boys/i.test(text);

    // Sources / Evidence
    const sources = /出典|根拠|参考文献|調査データ|厚生労働省|統計/i.test(text);

    console.log(`URL/slug: /ikeo/${a.slug}`);
    console.log(`Title: ${a.title}`);
    console.log(`H1: ${h1}`);
    console.log(`Title == H1: ${a.title === h1}`);
    console.log(`Status: ${a.status}`);
    console.log(`Published At: ${a.published_at || a.created_at}`);
    console.log(`Updated At: ${a.updated_at}`);
    console.log(`Text Length: ${text.length} chars`);
    console.log(`Operator Mention: ${operator ? '有' : '無'}`);
    console.log(`Sources/Evidence: ${sources ? '有' : '無'}`);
    console.log(`Dummy Links Count: ${dummyLinks.length}`);
    console.log(`Internal Links Count: ${internalLinks.length}`);
    console.log(`Images Count: ${imgs.length} (with alt: ${alts})`);
    console.log(`Assertions (${matches.length}):`);
    matches.forEach(m => console.log(`   > "${m}"`));
    console.log('-----------------------------------------------------\n');
  }
}

detailedAudit().catch(console.error);
