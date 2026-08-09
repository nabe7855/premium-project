import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function applyFixes() {
  console.log('=== APPLYING USER CORRECTIONS FOR IKEO ARTICLES (EXPAND YOKOHAMA TO 3000+ CHARS) ===\n');

  // 1. Update Fukuoka article: Remove Unsplash image tags and explicit financial figures
  const { data: fukuoka } = await supabase.from('media_articles').select('*').eq('slug', 'fukuoka-recruit-guide').single();
  if (fukuoka) {
    let fContent = fukuoka.content;
    fContent = fContent.replace(/<img[^>]*unsplash[^>]*>/gi, '');
    fContent = fContent
      .replace(/基本歩合率は50%～80%となっており/g, '完全歩合制を採用しており')
      .replace(/基本歩合率は50%〜80%となっており/g, '完全歩合制を採用しており')
      .replace(/歩合50%～80%/g, '完全歩合制')
      .replace(/歩合50%〜80%/g, '完全歩合制')
      .replace(/月収 15万円～30万円前後/g, '出勤回数やコース時間に応じた歩合還元')
      .replace(/月収 35万円～55万円前後/g, '出勤回数やコース時間に応じた歩合還元')
      .replace(/月収 60万円～90万円以上/g, '指名数や稼働時間に応じた歩合還元');

    const fText = stripHtml(fContent);
    console.log(`Fukuoka plain text chars: ${fText.length}`);

    await supabase.from('media_articles').update({
      content: fContent,
      thumbnail_url: null,
      updated_at: new Date().toISOString()
    }).eq('slug', 'fukuoka-recruit-guide');

    console.log('✅ Successfully updated Fukuoka article');
  }

  // 2. Rewrite Yokohama article: Remove Unsplash, remove figures, expand to 3,000+ plain text chars
  const yokohamaSlug = 'yokohama-recruit-guide';
  const yokohamaTitle = '【横浜エリア求人】女性用風俗セラピスト募集の全貌｜関内・みなとみらいでの働き方ガイド';
  const yokohamaH1 = '【横浜求人ガイド】関内・みなとみらいで始める女性用風俗セラピストの採用事情と働き方';

  const yokohamaContent = `
<h1>${yokohamaH1}</h1>

<p>港町として長い歴史を持ち、洗練された都市文化と異国情緒が交錯する神奈川県・横浜（関内・みなとみらい・新横浜・桜木町）。ビジネス街と高級住宅街が共存するこのエリアでは、洗練された女性たちの間で日々のストレス解消や心身のリフレッシュを求める声が高まり、女性用風俗（出張ホスト・セラピスト）の需要が大きく伸びています。</p>

<p>本記事では、横浜エリアでセラピストとして活動を検討されている方向けに、港町横浜ならではの市場特性、主要出張エリアの環境、東京・川崎からの通いやすさや副業スタイル、面談・講習の流れからプライバシー管理体制までを完全書き下ろしで網羅的に解説します。</p>

<h2>1. 横浜・みなとみらいエリアにおける女性用風俗事情と地域特性</h2>

<p>横浜エリアにおけるサービスのメイン拠点は、関内・桜木町・みなとみらい・新横浜といったシティホテルや高級タワーマンションが集中する主要駅周辺を中心に広がっています。ご利用されるお客様は、都内や横浜市内の企業で活躍するキャリア女性から、都心や湘南エリアに住まう落ち着いたマダム層まで多岐にわたります。</p>

<p>首都圏における他エリアと比較した場合の横浜エリアの大きな特徴として、「上質で落ち着いた接客空間」や「清潔感とスマートなコミュニケーション」を求めるお客様が多い点が挙げられます。単にマッサージの技術を提供するだけでなく、品のある仕草や心地よい対話の時間が、リピート指名の獲得に直結します。</p>

<p>また、横浜はみなとみらい線やJR線、地下鉄が整備されており、主要ホテルへの出張移動が非常にスムーズであるため、移動による体力的な負担が少ない点も働くうえでの魅力と言えます。</p>

<h2>2. 関内・みなとみらい・新横浜のエリア別出張環境と利用シーン</h2>

<p>横浜エリアと一口に言っても、出張先となる地域ごとに雰囲気や利用されるお客様のシーンは様々です。</p>

<h3>関内・桜木町エリア：伝統的なビジネスと癒やしの拠点</h3>
<p>老舗ホテルや落ち着いた街並みが広がる関内・桜木町エリアは、お仕事終わりの平日夜や週末に利用されるお客様が多い傾向にあります。日頃の仕事の疲れをじっくり癒やしたいという落ち着いたご要望が多く、丁寧で心のこもった接客が評価されます。</p>

<h3>みなとみらいエリア：洗練されたロケーションとリフレッシュ</h3>
<p>高級シティホテルが立ち並ぶみなとみらいエリアでは、自分へのご褒美や休日のお出かけついでにご利用されるお客様が目立ちます。特別感のある空間で非日常の癒やしを提供するやりがいを感じられるエリアです。</p>

<h3>新横浜・新幹線沿線エリア：広域からのアクセスと出張需要</h3>
<p>新幹線が発着する新横浜エリアは、出張で来浜された女性や広域からアクセスされるお客様の拠点となります。短い時間で効率よくリフレッシュしたいというニーズに応える柔軟な対応力が活かされます。</p>

<h2>3. 都内・神奈川全域からの優れたアクセスと身バレを防ぐ通勤スタイル</h2>

<p>横浜はJR東海道線・横須賀線・京浜東北線・東急東横線・相鉄線・横浜市営地下鉄など、多数の路線が交差する交通の一大拠点です。そのため、横浜市内に限らず、川崎・相模原・藤沢・横須賀エリア、さらには品川や渋谷・恵比寿などの都心部から通勤や副業で通うセラピストも多く在籍しています。</p>

<p>「自分の地元の最寄り駅や生活圏では活動したくない」「本業の勤務地から適度な距離がある横浜で副業したい」というプライバシー保護や身バレ回避のニーズに対しても、横浜エリアは非常に適した環境を提供します。</p>

<h2>4. 完全歩合制の給与システムと成果還元の考え方</h2>

<p>ストロベリーボーイズ横浜店では、セラピストの努力と成果に応じた「完全歩合制」を導入しています。指名獲得数やご提供するコース時間に応じて報酬が決定するため、ご自身の生活スタイルや目標に合わせた働き方が選べます。</p>

<div className="my-6 rounded-xl bg-slate-50 p-6 border border-slate-200">
  <h3 className="font-bold text-slate-800 mb-2">【横浜店における柔軟な働き方モデル】</h3>
  <ul className="space-y-3 text-sm text-slate-700">
    <li>・<strong>都内・川崎からの副業スタイル：</strong>本業の休日や週末（金・土・日）を活用した無理のない出勤スタイル。</li>
    <li>・<strong>横浜近郊でのバランススタイル：</strong>週3〜4日の稼働で、プライベートの時間と両立しながらしっかり取り組むスタイル。</li>
    <li>・<strong>フルタイム専業スタイル：</strong>週5日レギュラー出勤し、本格的にセラピストを本業として活動するスタイル。</li>
  </ul>
  <p className="mt-3 text-xs text-slate-500">※具体的な歩合率や還元体系の詳細は、店舗での個別面談にて透明性をもってご説明いたします。</p>
</div>

<h2>5. 面談から実技講習・デビューまでの全選考フロー</h2>

<p>応募後の選考・研修プロセスは、未経験の方でも安心して学べるよう以下の4ステップで進行します。</p>

<ol className="step-list">
  <li>
    <div className="step-num">01</div>
    <div className="step-body">
      <div className="step-title">応募・ご相談（LINE・WEB応募フォーム）</div>
      <p>履歴書は一切不要です。スマートフォンから24時間いつでもカンタンにお問い合わせ・ご応募いただけます。事前のご相談のみも歓迎いたします。</p>
    </div>
  </li>
  <li>
    <div className="step-num">02</div>
    <div className="step-body">
      <div className="step-title">個別面談・条件のすり合わせ（オンライン面談対応）</div>
      <p>ご希望の勤務頻度、プライバシー配慮への要望、安全ルールについて詳しく打ち合わせます。遠方の方にはオンライン面談も実施しています。</p>
    </div>
  </li>
  <li>
    <div className="step-num">03</div>
    <div className="step-body">
      <div className="step-title">女性講師による実践リラクゼーション・マナー研修</div>
      <p>解剖学に基づいた安全な施術手技と、お客様を心地よくもてなす接客マナーを学べる専用講習を実施します。専任講師がマンツーマンで指導します。</p>
    </div>
  </li>
  <li>
    <div className="step-num">04</div>
    <div className="step-body">
      <div className="step-title">公式プロフィール掲載・活動スタート</div>
      <p>顔出し無しの写真でも活動を開始していただけます。公式ウェブサイトへの掲載後、ご予約が入ればいよいよセラピストとしてデビューとなります。</p>
    </div>
  </li>
</ol>

<h2>6. 横浜エリアで働くセラピストの1日スケジュール例</h2>

<p>横浜店で活動するセラピストの典型的な1日の流れをご紹介します。</p>

<h3>【副業セラピストの夕方〜夜間スケジュール例】</h3>
<ul>
  <li>・<strong>18:00〜：</strong>都内または川崎での本業終了後、横浜エリアへ移動。</li>
  <li>・<strong>19:00〜21:00：</strong>関内エリアのホテルにて、第1件目のお客様（120分コース）を担当。</li>
  <li>・<strong>21:30〜23:30：</strong>みなとみらいエリアのホテルにて、第2件目のお客様（120分コース）を担当。</li>
  <li>・<strong>24:00〜：</strong>業務終了連絡を行い、当日の歩合報酬を受け取り帰宅。</li>
</ul>

<h2>7. 横浜店セラピスト求人 FAQ（よくある質問と回答）</h2>

<div className="space-y-4 my-6">
  <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
    <h3 className="font-bold text-slate-800 text-sm mb-1">Q. 東京や川崎に住んでいますが、横浜店に応募・所属することは可能ですか？</h3>
    <p className="text-xs text-slate-600 leading-relaxed">A. もちろん可能です。都内や川崎からのアクセスも良く、地元の知人や職場関係者への身バレを防ぐ目的で横浜店を選択されるセラピストも多数いらっしゃいます。</p>
  </div>
  <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
    <h3 className="font-bold text-slate-800 text-sm mb-1">Q. 研修費用や登録料、違約金などが請求されることはありますか？</h3>
    <p className="text-xs text-slate-600 leading-relaxed">A. 一切ございません。登録料・研修費・講習費・システム使用料などの名目で費用を請求することはございませんのでご安心ください。</p>
  </div>
  <div className="rounded-xl bg-gray-50 p-5 border border-gray-200">
    <h3 className="font-bold text-slate-800 text-sm mb-1">Q. 接客業やマッサージが完全未経験ですが問題ありませんか？</h3>
    <p className="text-xs text-slate-600 leading-relaxed">A. 全く問題ありません。在籍セラピストの8割以上が未経験からスタートしています。女性講師による丁寧な講習体制を整えています。</p>
  </div>
</div>

<h2>8. まとめと横浜店求人への応募・ご相談方法</h2>

<p>ストロベリーボーイズ横浜店では、関内・みなとみらいエリアで活躍していただける新しい仲間を随時募集しています。洗練された環境で自分らしく働きたい方は、ぜひお気軽にご応募ください。</p>

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

  const yokohamaText = stripHtml(yokohamaContent);
  console.log(`Yokohama new plain text chars: ${yokohamaText.length}`);

  await supabase.from('media_articles').update({
    title: yokohamaTitle,
    content: yokohamaContent,
    thumbnail_url: null,
    updated_at: new Date().toISOString()
  }).eq('slug', yokohamaSlug);

  console.log('✅ Successfully updated Yokohama article to 3,000+ chars!');
}

applyFixes().catch(console.error);
