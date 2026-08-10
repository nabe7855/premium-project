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

async function analyzeIkeoArticles() {
  console.log('===========================================================');
  console.log('=== FULL IKEO / RECRUIT MEDIA ARTICLES ANALYSIS ===');
  console.log('===========================================================\n');

  const { data: articles } = await supabase.from('media_articles').select('*').order('created_at', { ascending: false });

  const ikeoCategoryArticles = (articles || []).filter(a => a.category === 'ikeo' || a.slug?.includes('ikeo') || a.slug?.includes('fukuoka-recruit') || a.slug?.includes('recruit'));

  console.log(`Total target articles for IKEO audit: ${ikeoCategoryArticles.length}\n`);

  const results = [];

  for (const article of ikeoCategoryArticles) {
    const rawContent = article.content || '';
    const plainText = stripHtml(rawContent);
    const charCount = plainText.length;

    // Check title vs h1
    const h1Match = rawContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const h1Text = h1Match ? stripHtml(h1Match[1]) : article.title;
    const isTitleH1Same = (article.title || '').trim() === h1Text.trim();

    // Health / Income assertions check
    const assertionRegex = /(改善|必ず稼げる|平均月収|年収|月収\s*\d+万|稼げる|確実に|絶対|病気が治る|効果がある)/gi;
    const assertionMatches = plainText.match(assertionRegex) || [];

    // Specific assertions extraction
    const assertionSentences = [];
    const sentences = plainText.split(/[。！!？\?\n]/);
    for (const sentence of sentences) {
      if (assertionRegex.test(sentence)) {
        assertionSentences.push(sentence.trim());
      }
    }

    // Dummy links check (# or example.com)
    const dummyLinkRegex = /href=["'](#|javascript:void\(0\)|https?:\/\/(www\.)?example\.com[^"']*)["']/gi;
    const dummyLinksCount = (rawContent.match(dummyLinkRegex) || []).length;

    // Internal links count
    const internalLinkRegex = /href=["'](\/(ikeo|store|recruit|plan|guide)[^"']*)["']/gi;
    const internalLinks = rawContent.match(internalLinkRegex) || [];

    // Image analysis
    const imgRegex = /<img[^>]+>/gi;
    const imgTags = rawContent.match(imgRegex) || [];
    let altCount = 0;
    imgTags.forEach(img => {
      if (/alt=["']([^"']+)["']/i.test(img)) altCount++;
    });

    // Check operator mention ("ストロベリーボーイズが運営" etc)
    const operatorMention = /ストロベリーボーイズ(が運営|運営|公式)/i.test(plainText);

    // Summary draft
    const summaryDraft = plainText.slice(0, 120) + '...';

    results.push({
      id: article.id,
      slug: article.slug,
      category: article.category,
      url: `/ikeo/${article.slug}`,
      title: article.title,
      h1: h1Text,
      isTitleH1Same,
      status: article.status,
      created_at: article.created_at,
      updated_at: article.updated_at,
      published_at: article.published_at,
      charCount,
      summaryDraft,
      assertionSentences,
      hasAssertion: assertionSentences.length > 0,
      operatorMention,
      dummyLinksCount,
      internalLinksCount: internalLinks.length,
      imageCount: imgTags.length,
      imageAltCount: altCount,
      eyecatchImage: article.eyecatch_image
    });
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'scratch', 'ikeo_audit_results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('Saved detailed audit analysis to scratch/ikeo_audit_results.json');
}

analyzeIkeoArticles().catch(console.error);
