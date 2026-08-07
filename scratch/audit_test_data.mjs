import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co';
const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?(.*?)["']?$/m);
const key = anonKeyMatch[1].trim();

const supabase = createClient(supabaseUrl, key);

async function auditTestData() {
  console.log('===========================================================');
  console.log('=== AUDITING TEST DATA & STORE MEMBERSHIP IN DB ===');
  console.log('===========================================================\n');

  // 1. Audit Casts
  console.log('1. AUDITING CASTS (セラピスト一覧):');
  const { data: casts } = await supabase
    .from('casts')
    .select(`
      id, name, slug, status,
      cast_store_memberships (
        stores ( id, slug, name )
      )
    `);

  console.log(`Total casts in DB: ${casts?.length || 0}`);
  const suspiciousCasts = (casts || []).filter(c => 
    c.name.includes('test') || c.name.includes('テスト') || c.name.toLowerCase() === 'koko' ||
    c.slug.includes('test') || c.name.match(/[ぁ-んァ-ヶa-zA-Z]{10,}/)
  );

  console.log('Suspicious / Test Casts:');
  suspiciousCasts.forEach(c => {
    const stores = c.cast_store_memberships?.map((m) => m.stores?.slug).join(', ') || '所属なし';
    console.log(`  - [ID: ${c.id}] 名前: "${c.name}" | slug: "${c.slug}" | 所属店舗: [${stores}] | status: ${c.status}`);
  });

  // 2. Audit Blogs (写メ日記) & Store Mapping
  console.log('\n2. AUDITING BLOGS (写メ日記全レコード ＆ 店舗所属判定):');
  const { data: blogs } = await supabase
    .from('blogs')
    .select(`
      id, title, content, status, published_at, created_at,
      casts ( id, name, slug, cast_store_memberships ( stores ( id, slug, name ) ) ),
      blog_images ( image_url )
    `)
    .order('created_at', { ascending: false });

  console.log(`Total blog posts in DB: ${blogs?.length || 0}`);

  const blogAuditTable = [];
  const suspiciousBlogs = [];

  (blogs || []).forEach((b) => {
    const cast = Array.isArray(b.casts) ? b.casts[0] : b.casts;
    const castName = cast?.name || 'キャストなし';
    const storeSlugs = cast?.cast_store_memberships?.map((m) => m.stores?.slug).filter(Boolean) || [];

    const images = b.blog_images?.map((i) => i.image_url) || [];
    const hasDummyImg = images.some(img => img.includes('favicon.png') || img.includes('no-image.png') || img.includes('test'));
    const isSuspiciousText = b.title?.match(/(おいｆ|テスト|test|あいうえお|asdf|qwerty)/i) || 
                             b.content?.match(/(こにんいちは|テスト|test|おいｆ|asdf)/i) ||
                             castName === 'koko' || castName.includes('test');

    const isTest = hasDummyImg || isSuspiciousText;

    blogAuditTable.push({
      id: b.id,
      title: b.title,
      castName,
      stores: storeSlugs.length > 0 ? storeSlugs.join(', ') : '⚠️ 所属店舗なし',
      isDuplicateStore: storeSlugs.length > 1,
      isTest,
      imagesCount: images.length,
      firstImg: images[0] || '画像なし',
      status: b.status,
      created_at: b.created_at
    });

    if (isTest) {
      suspiciousBlogs.push({
        id: b.id,
        title: b.title,
        castName,
        stores: storeSlugs.join(', '),
        reason: [
          isSuspiciousText ? '意味をなさないタイトル/本文' : null,
          hasDummyImg ? 'favicon/no-image画像使用' : null,
          castName === 'koko' ? '未在籍キャスト(koko)' : null
        ].filter(Boolean).join(' / ')
      });
    }
  });

  console.log('\n--- 洗い出されたテスト写メ日記一覧 ---');
  suspiciousBlogs.forEach((sb, idx) => {
    console.log(`${idx + 1}. [ID: ${sb.id}] "${sb.title}" (投稿者: ${sb.castName})`);
    console.log(`   理由: ${sb.reason}`);
    console.log(`   所属店舗: ${sb.stores}`);
  });

  // 3. Audit News (ニュース)
  console.log('\n3. AUDITING NEWS (ニュース全レコード):');
  const { data: newsList } = await supabase
    .from('news')
    .select('id, title, content, status, store_id, created_at');

  console.log(`Total news in DB: ${newsList?.length || 0}`);
  const suspiciousNews = (newsList || []).filter(n =>
    n.title?.match(/(テスト|test|おいｆ|あいうえお)/i) ||
    n.content?.match(/(テスト|test|こにんいちは|asdf)/i)
  );

  console.log('Suspicious / Test News:');
  suspiciousNews.forEach((n, idx) => {
    console.log(`${idx + 1}. [ID: ${n.id}] "${n.title}" | store_id: ${n.store_id} | status: ${n.status}`);
  });

  // Save Full Blog Store Mapping Table
  fs.writeFileSync('scratch/blog_store_mapping_table.json', JSON.stringify(blogAuditTable, null, 2));
  console.log('\n✅ Full Blog Store Mapping Table saved to scratch/blog_store_mapping_table.json');
}

auditTestData();
