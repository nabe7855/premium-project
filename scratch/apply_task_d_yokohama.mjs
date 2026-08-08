import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function applyTaskDYokohama() {
  console.log('=== APPLYING TASK D: CREATING YOKOHAMA RECRUIT GUIDE (ORIGINAL WRITE) ===\n');

  const slug = 'yokohama-recruit-guide';
  const title = '【横浜エリア求人】女性用風俗セラピスト募集の全貌｜関内・みなとみらいでの働き方ガイド';
  const h1 = '【横浜求人ガイド】関内・みなとみらいで始める女性用風俗セラピストの採用事情と働き方';

  const content = `
<h1>${h1}</h1>

<p>港町として長い歴史を持ち、洗練された都市文化と異国情緒が交錯する神奈川県・横浜（関内・みなとみらい・新横浜）。ビジネス街と高級住宅街が共存するこのエリアでは、洗練された女性たちの間で癒やしやリフレッシュを求める声が高まり、女性用風俗（出張ホスト・セラピスト）の需要が大きく伸びています。</p>

<p>本記事では、横浜エリアでセラピストとして活動を検討されている方向けに、港町横浜ならではの市場特性、主要出張エリアの環境、東京からの通いやすさや副業スタイル、面談・講習の流れからプライバシー管理体制までを完全書き下ろしで解説します。</p>

<img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=75" alt="横浜関内・みなとみらいエリアの女性用風俗セラピスト求人イメージ" width="800" height="450" />

<h2>1. 横浜・みなとみらいエリアにおける女性用風俗事情と客層</h2>

<p>横浜エリアのサービス拠点は、関内・桜木町・みなとみらい・新横浜といったホテルや高級マンションが集中する主要駅を中心に広がっています。ご利用されるお客様は、都内や横浜市内の企業で活躍するキャリア女性から、都心に住まうマダム層まで多岐にわたります。</p>

<p>横浜エリアのお客様の特徴として、「上質で落ち着いた接客空間」や「清潔感とスマートなコミュニケーション」を求める方が多い点が挙げられます。単にマッサージ技術を提供するだけでなく、品のある仕草や心地よい対話の時間が、リピート指名に大きく直結します。</p>

<h2>2. 都内・神奈川全域からのアクセスと柔軟な通勤スタイル</h2>

<p>横浜はJR東海道線・京浜東北線・東急東横線・みなとみらい線など、多数の路線が交差する交通の要所です。そのため、横浜市内に限らず、川崎・相模原・湘南エリア、さらには品川や渋谷などの都内から通勤・副業で通うセラピストも多く在籍しています。</p>

<p>「地元の最寄り駅では活動したくない」「本業の勤務地から少し離れた横浜で副業したい」という身バレ回避のニーズにも、横浜エリアは非常に適した環境を提供します。</p>

<h2>3. 完全歩合制の給与システムと還元率の考え方</h2>

<p>ストロベリーボーイズ横浜店では、セラピストの成果に応じた「完全歩合制（50%〜80%）」を導入しています。指名料金やコース時間に比例して報酬が増加するため、ご自身の目標に合わせた働き方が選べます。</p>

<div className="my-6 rounded-xl bg-slate-50 p-6 border border-slate-200">
  <h3 className="font-bold text-slate-800 mb-2">【横浜店における働き方・収入モデル例】</h3>
  <ul className="space-y-3 text-sm text-slate-700">
    <li>・<strong>都内・川崎からの副業スタイル（週末・金土出勤）：</strong>月収 20万円〜35万円前後</li>
    <li>・<strong>横浜近郊でのバランススタイル（週3〜4日出勤）：</strong>月収 40万円〜60万円前後</li>
    <li>・<strong>フルタイム専業スタイル（週5日レギュラー出勤）：</strong>月収 70万円〜100万円以上</li>
  </ul>
  <p className="mt-3 text-xs text-slate-500">※上記は個人の指名状況やご提供コースに応じた実例モデルであり、実際の支給額を保証するものではありません。</p>
</div>

<h2>4. 面談から実技講習・デビューまでの安心フロー</h2>

<img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=75" alt="横浜店の面談およびプロセラピスト研修風景" width="800" height="450" loading="lazy" />

<p>応募後の選考・研修プロセスは以下の4ステップで進行します。</p>

<ol className="step-list">
  <li>
    <div className="step-num">01</div>
    <div className="step-body">
      <div className="step-title">応募・ご相談（LINE・WEBフォーム）</div>
      <p>履歴書は不要。スマートフォンから簡単にお問い合わせ・ご応募いただけます。</p>
    </div>
  </li>
  <li>
    <div className="step-num">02</div>
    <div className="step-body">
      <div className="step-title">個別に合わせた説明会・面談（オンライン対応）</div>
      <p>希望する給与・出勤頻度・プライバシー配慮について詳しく打ち合わせます。</p>
    </div>
  </li>
  <li>
    <div className="step-num">03</div>
    <div className="step-body">
      <div className="step-title">女性講師による実践リラクゼーション研修</div>
      <p>安全な施術手順とマナーを学べる専用講習を実施。初心者でもプロの技術を習得可能です。</p>
    </div>
  </li>
  <li>
    <div className="step-num">04</div>
    <div className="step-body">
      <div className="step-title">プロフィール掲載・デビュー</div>
      <p>顔出し無しの写真でもスタート可能。公式ページ公開後、予約が入れば活動開始となります。</p>
    </div>
  </li>
</ol>

<h2>5. 横浜店セラピスト求人 FAQ（よくある質問）</h2>

<div className="space-y-4 my-6">
  <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
    <h3 className="font-bold text-slate-800 text-sm mb-1">Q. 東京在住ですが、横浜店に応募・所属することは可能ですか？</h3>
    <p className="text-xs text-slate-600 leading-relaxed">A. もちろん可能です。都内からのアクセスも良く、地元の知人への身バレを防ぐ目的で横浜店を選択されるセラピストも多数いらっしゃいます。</p>
  </div>
  <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
    <h3 className="font-bold text-slate-800 text-sm mb-1">Q. 研修費用や違約金などが請求されることはありますか？</h3>
    <p className="text-xs text-slate-600 leading-relaxed">A. 一切ございません。登録料・研修費・システム使用料などの名目で費用を請求することはございませんのでご安心ください。</p>
  </div>
</div>

<h2>6. まとめと横浜店求人への応募方法</h2>

<p>ストロベリーボーイズ横浜店では、関内・みなとみらいエリアで活躍していただける新しい仲間を募集しています。洗練された環境で高収入を目指したい方は、ぜひご応募ください。</p>

<div className="my-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white shadow-xl">
  <h3 className="text-xl font-bold mb-2">ストロベリーボーイズ横浜店 セラピスト求人</h3>
  <p className="text-xs mb-6 opacity-90">手厚い講習制度とプライバシー配慮で未経験からのスタートを全面サポート！</p>
  <div className="flex flex-wrap justify-center gap-4">
    <a href="/store/yokohama/recruit" className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 shadow-md transition-all hover:bg-slate-100">
      横浜店 求人詳細ページを見る →
    </a>
    <a href="/ikeo/fukuoka-recruit-guide" className="rounded-full border border-white bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10">
      福岡版 求人ガイドを読む →
    </a>
  </div>
</div>
`;

  const plainText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`Yokohama plain text character count: ${plainText.length} characters`);

  // Check if article already exists
  const { data: existing } = await supabase.from('media_articles').select('id').eq('slug', slug).single();

  if (existing) {
    const { error } = await supabase
      .from('media_articles')
      .update({
        title,
        content,
        category: 'ikeo',
        status: 'published',
        thumbnail_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=75',
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug);
    if (error) console.error('Error updating Yokohama article:', error);
    else console.log('✅ Successfully updated Yokohama recruit guide!');
  } else {
    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from('media_articles')
      .insert({
        id: newId,
        slug,
        title,
        content,
        category: 'ikeo',
        status: 'published',
        thumbnail_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=75',
        author_name: 'イケオラボ 編集部',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      });
    if (error) console.error('Error creating Yokohama article:', error);
    else console.log('✅ Successfully created new /ikeo/yokohama-recruit-guide!');
  }
}

applyTaskDYokohama().catch(console.error);
