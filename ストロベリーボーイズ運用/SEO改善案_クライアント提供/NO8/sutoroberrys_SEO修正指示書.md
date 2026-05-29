# ストロベリーボーイズ（sutoroberrys.jp）SEO修正指示書

**作成日**: 2026-05-29
**対象**: 開発担当エンジニア
**目的**: 「女性用風俗」関連キーワードでのオーガニック流入（PV）大幅増加
**前提**: Next.js (App Router) + Vercel構成と推定

---

## 📊 0. 現状調査サマリー（実機HTML確認済み）

| 項目 | 現状 | 問題度 |
|---|---|---|
| TOPページ `<title>` | `福岡の女性用風俗・出張ホストなら｜ストロベリーボーイズ` | 🔴 致命的 |
| TOPページ `<meta description>` | 福岡特化（天神・博多） | 🔴 致命的 |
| 横浜店recruitページ `<title>` | TOPと完全同一（福岡） | 🔴 致命的 |
| 横浜店トップ `<title>` | `横浜の女性用風俗｜ストロベリーボーイズ横浜店【横浜対応】｜ストロベリーボーイズ福岡店` ← 末尾「福岡店」 | 🔴 致命的 |
| 横浜店トップ description | 「福岡で愛される女性専用リラクゼーション」 | 🔴 致命的 |
| sitemap.xml | 福岡店・横浜店のみ。**東京本店/名古屋店/大阪店が1ページも未登録** | 🔴 致命的 |
| 全店舗共通 `<meta keywords>` | `女性用風俗,出張ホスト,福岡,天神,博多,女性向け,イケメン派遣` | 🔴 致命的 |
| TOPページ `<h1>` | 0個（divで装飾） | 🟡 高 |
| 横浜店recruitページ `<h1>/<h2>` | 0個（divで装飾） | 🟡 高 |
| canonical（TOP/recruit） | 設定なし | 🟡 高 |
| og:image | 全ページなし | 🟡 高 |
| JSON-LD（LocalBusiness/JobPosting） | 設定なし（あっても空） | 🟡 高 |

**結論**：「女性用風俗 横浜」「女性用風俗 東京」「女性用風俗 大阪」「女性用風俗 名古屋」で検索された場合、現状はGoogleからほぼ評価されない構造になっています。タイトル・記述・キーワード・サイトマップすべてが「福岡」固定です。

---

## 🎯 1. 最優先（即日〜3日）

### 1-1. ページ別メタデータの動的化（Next.js App Router）

**問題の原因コード（推定）**：`app/layout.tsx` の `metadata` がハードコードで福岡固定。各ページの `generateMetadata` が未実装。

#### `app/layout.tsx`（ルートのデフォルトのみ。各ページが上書きする前提）

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sutoroberrys.jp"),
  title: {
    default: "女性用風俗・出張ホスト｜ストロベリーボーイズ【東京・横浜・名古屋・大阪・福岡】",
    template: "%s｜ストロベリーボーイズ",
  },
  description:
    "女性用風俗・出張ホストの全国チェーン「ストロベリーボーイズ」。東京・横浜・名古屋・大阪・福岡で完全審査制のイケメンセラピストがホテル・ご自宅で極上の癒しを提供。",
  keywords: [
    "女性用風俗", "女性向け風俗", "女風", "出張ホスト",
    "東京", "横浜", "名古屋", "大阪", "福岡",
    "セラピスト", "メンズエステ", "女性専用",
  ],
  applicationName: "ストロベリーボーイズ",
  authors: [{ name: "ストロベリーボーイズ" }],
  creator: "ストロベリーボーイズ",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "女性用風俗・出張ホスト｜ストロベリーボーイズ",
    description:
      "東京・横浜・名古屋・大阪・福岡で展開。完全審査制のイケメンセラピストが極上の癒しを提供する女性専用サロン。",
    url: "https://www.sutoroberrys.jp",
    siteName: "ストロベリーボーイズ",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/ogp/default.png", width: 1200, height: 630, alt: "ストロベリーボーイズ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "女性用風俗・出張ホスト｜ストロベリーボーイズ",
    description: "東京・横浜・名古屋・大阪・福岡の女性用風俗チェーン。",
    images: ["/ogp/default.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  verification: { google: "c7c614cd66f2c9b7" },
};
```

#### `app/store/[city]/page.tsx`（店舗トップ）

```tsx
import type { Metadata } from "next";

const STORE_META: Record<string, {
  city: string; cityKana: string; area: string; areaKw: string[];
}> = {
  honten:  { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  yokohama:{ city: "横浜",   cityKana: "よこはま",   area: "みなとみらい・関内", areaKw: ["みなとみらい","関内","桜木町","新横浜"] },
  nagoya:  { city: "名古屋", cityKana: "なごや",     area: "栄・名古屋駅",     areaKw: ["栄","名駅","金山","伏見"] },
  osaka:   { city: "大阪",   cityKana: "おおさか",   area: "梅田・難波",       areaKw: ["梅田","難波","心斎橋","天王寺"] },
  fukuoka: { city: "福岡",   cityKana: "ふくおか",   area: "天神・博多",       areaKw: ["天神","博多","中洲"] },
};

type Props = { params: { city: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = STORE_META[params.city];
  if (!s) return {};
  const title = `${s.city}の女性用風俗・出張ホスト｜ストロベリーボーイズ${s.city}店【${s.area}対応】`;
  const desc  = `${s.city}（${s.area}）で女性用風俗・出張ホストをお探しならストロベリーボーイズ${s.city}店。完全審査制のイケメンセラピストがホテル・ご自宅で極上の癒しを提供します。`;
  return {
    title,
    description: desc,
    keywords: ["女性用風俗", "女風", "出張ホスト", s.city, ...s.areaKw, "セラピスト", "女性専用"],
    alternates: { canonical: `/store/${params.city}` },
    openGraph: {
      title, description: desc,
      url: `https://www.sutoroberrys.jp/store/${params.city}`,
      siteName: "ストロベリーボーイズ",
      images: [{ url: `/ogp/store-${params.city}.png`, width: 1200, height: 630 }],
      locale: "ja_JP", type: "website",
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [`/ogp/store-${params.city}.png`] },
  };
}
```

#### `app/store/[city]/recruit/page.tsx`（求人ページ）

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = STORE_META[params.city];
  if (!s) return {};
  const title = `${s.city}の女性用風俗セラピスト求人｜週1・未経験OK｜ストロベリーボーイズ${s.city}店`;
  const desc  = `${s.city}で女性用風俗セラピストを募集中。未経験歓迎・週1日〜・全額日払い・登録料0円。最短10日デビュー、平均月収55万円。LINEで30秒応募。`;
  return {
    title, description: desc,
    keywords: ["女性用風俗 求人", "女風 求人", "セラピスト 募集", s.city, ...s.areaKw, "出張ホスト 求人", "高収入"],
    alternates: { canonical: `/store/${params.city}/recruit` },
    openGraph: {
      title, description: desc,
      url: `https://www.sutoroberrys.jp/store/${params.city}/recruit`,
      siteName: "ストロベリーボーイズ",
      images: [{ url: `/ogp/recruit-${params.city}.png`, width: 1200, height: 630 }],
      locale: "ja_JP", type: "website",
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [`/ogp/recruit-${params.city}.png`] },
  };
}
```

#### 同様に必要なサブページの動的メタ

`price` / `cast-list` / `system` / `first-time` / `q-and-a` / `reviews` / `diary` / `schedule` / `interview` / `videos` の各ページについても、`generateMetadata` を実装。タイトルテンプレートは：

| ページ | titleパターン |
|---|---|
| `/store/[city]/price` | `{city}店の料金システム｜女性用風俗・出張ホスト｜ストロベリーボーイズ{city}店` |
| `/store/[city]/cast-list` | `{city}店 在籍セラピスト一覧｜女性用風俗｜ストロベリーボーイズ{city}店` |
| `/store/[city]/system` | `{city}店 ご利用システム｜女性用風俗｜ストロベリーボーイズ{city}店` |
| `/store/[city]/first-time` | `初めての方へ｜{city}の女性用風俗｜ストロベリーボーイズ{city}店` |
| `/store/[city]/q-and-a` | `{city}店 よくある質問Q&A｜女性用風俗｜ストロベリーボーイズ{city}店` |
| `/store/[city]/reviews/reviews` | `お客様の声・口コミ｜{city}の女性用風俗｜ストロベリーボーイズ{city}店` |
| `/store/[city]/diary/post/[id]` | `{記事タイトル}｜{セラピスト名}の写メ日記｜ストロベリーボーイズ{city}店` |
| `/store/[city]/cast/[id]` | `{セラピスト名}のプロフィール｜{city}の女性用風俗｜ストロベリーボーイズ{city}店` |

---

### 1-2. sitemap.xml に東京本店・名古屋店・大阪店を追加（**最優先・致命的バグ**）

**問題**：現状の`/sitemap.xml`は **福岡店・横浜店の148URLのみ** で、東京本店・名古屋店・大阪店のURLが1つも入っていない。Googleに発見すらされていない。

#### `app/sitemap.ts`（推奨：動的生成）

```ts
import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const STORES = ["honten", "yokohama", "nagoya", "osaka", "fukuoka"] as const;
const SUBPAGES = ["", "/system", "/price", "/cast-list", "/q-and-a", "/first-time",
                  "/recruit", "/reviews/reviews", "/schedule/schedule",
                  "/interview", "/videos", "/diary"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.sutoroberrys.jp";
  const now = new Date();

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,            changeFrequency: "weekly",  priority: 1.0, lastModified: now },
    { url: `${base}/store-select`,changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${base}/age-check`,   changeFrequency: "monthly", priority: 0.3, lastModified: now },
    { url: `${base}/privacy`,     changeFrequency: "yearly",  priority: 0.3, lastModified: now },
    { url: `${base}/terms`,       changeFrequency: "yearly",  priority: 0.3, lastModified: now },
    { url: `${base}/links`,       changeFrequency: "weekly",  priority: 0.5, lastModified: now },
  ];

  // 全店舗のサブページを展開
  const storePages: MetadataRoute.Sitemap = STORES.flatMap(city =>
    SUBPAGES.map(sub => ({
      url: `${base}/store/${city}${sub}`,
      changeFrequency: sub === "" ? "daily" : "weekly" as const,
      priority: sub === "" ? 0.9 : (sub === "/recruit" ? 0.9 : 0.7),
      lastModified: now,
    }))
  );

  // 動的：全店舗のキャスト・日記をDBから引く
  const { data: casts } = await supabase.from("casts")
    .select("store, slug, updated_at").eq("active", true);
  const castPages: MetadataRoute.Sitemap = (casts ?? []).map(c => ({
    url: `${base}/store/${c.store}/cast/${c.slug}`,
    changeFrequency: "weekly", priority: 0.6,
    lastModified: new Date(c.updated_at),
  }));

  const { data: diaries } = await supabase.from("diary_posts")
    .select("store, id, updated_at").order("updated_at", { ascending: false }).limit(500);
  const diaryPages: MetadataRoute.Sitemap = (diaries ?? []).map(d => ({
    url: `${base}/store/${d.store}/diary/post/${d.id}`,
    changeFrequency: "monthly", priority: 0.4,
    lastModified: new Date(d.updated_at),
  }));

  return [...staticPages, ...storePages, ...castPages, ...diaryPages];
}
```

**確認手順**：実装後、必ず以下をチェック。
1. `https://www.sutoroberrys.jp/sitemap.xml` で全店舗URLが含まれること
2. Google Search Console で **5店舗それぞれ** のプロパティ（または1つのプロパティでカバー範囲確認）から再送信
3. `site:sutoroberrys.jp/store/honten` 等でインデックス状況を1週間後にチェック

---

### 1-3. robots.txt の追記

現状はOKだが、明示的にAI巡回もブロック解除しておくと良い：

```
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

# AIクローラーも許可（女性用風俗の知識ベースへの掲載狙い）
User-Agent: GPTBot
Allow: /
User-Agent: ClaudeBot
Allow: /
User-Agent: PerplexityBot
Allow: /

Host: https://www.sutoroberrys.jp
Sitemap: https://www.sutoroberrys.jp/sitemap.xml
```

---

## 🏗️ 2. 高優先（1週間以内）

### 2-1. 構造化データ（JSON-LD）の追加

#### A. ルート `<Organization>`（`app/layout.tsx` の `<body>` 内に挿入）

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "ストロベリーボーイズ",
      alternateName: "Strawberry Boys",
      url: "https://www.sutoroberrys.jp",
      logo: "https://www.sutoroberrys.jp/logo.png",
      sameAs: [
        "https://twitter.com/oden0713",
        // 公式SNS各種
      ],
      description: "東京・横浜・名古屋・大阪・福岡で展開する女性用風俗・出張ホストの全国チェーン。",
    }),
  }}
/>
```

#### B. `<WebSite>` + サイト内検索（SERPでサイト名表示の決定打）

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "ストロベリーボーイズ",
      alternateName: "女性用風俗 ストロベリーボーイズ",
      url: "https://www.sutoroberrys.jp",
    }),
  }}
/>
```

#### C. 各店舗ページに `<LocalBusiness>`

```tsx
// app/store/[city]/page.tsx の中
const STORE_BIZ: Record<string, any> = {
  honten:  { name: "ストロベリーボーイズ東京本店",   region: "東京都",   addr: "新宿区...",     tel: "03-xxxx-xxxx" },
  yokohama:{ name: "ストロベリーボーイズ横浜店",     region: "神奈川県", addr: "横浜市...",     tel: "045-xxx-xxxx" },
  nagoya:  { name: "ストロベリーボーイズ名古屋店",   region: "愛知県",   addr: "名古屋市...",   tel: "052-xxx-xxxx" },
  osaka:   { name: "ストロベリーボーイズ大阪店",     region: "大阪府",   addr: "大阪市...",     tel: "06-xxxx-xxxx" },
  fukuoka: { name: "ストロベリーボーイズ福岡店",     region: "福岡県",   addr: "福岡市...",     tel: "092-xxx-xxxx" },
};

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `https://www.sutoroberrys.jp/store/${city}#localbusiness`,
  name: STORE_BIZ[city].name,
  image: `https://www.sutoroberrys.jp/ogp/store-${city}.png`,
  url: `https://www.sutoroberrys.jp/store/${city}`,
  telephone: STORE_BIZ[city].tel,
  address: { "@type": "PostalAddress", addressRegion: STORE_BIZ[city].region, addressLocality: STORE_BIZ[city].addr, addressCountry: "JP" },
  priceRange: "¥¥",
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "12:00", closes: "05:00" }],
  areaServed: STORE_BIZ[city].region,
}) }} />
```

#### D. 求人ページに `<JobPosting>`（求人特化検索に乗る最重要施策）

```tsx
// app/store/[city]/recruit/page.tsx の中
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: `${s.city}店 女性用風俗セラピスト募集（未経験OK・週1日〜）`,
  description: `${s.city}（${s.area}）で女性用風俗セラピストを募集中。<br/>未経験歓迎、週1日〜OK、全額日払い、登録料0円。最短10日でデビュー可能。プロ講師によるマンツーマン研修あり。`,
  datePosted: "2026-05-01",
  validThrough: "2026-12-31",
  employmentType: ["PART_TIME", "CONTRACTOR"],
  hiringOrganization: { "@type": "Organization", name: "ストロベリーボーイズ", sameAs: "https://www.sutoroberrys.jp" },
  jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressRegion: s.city, addressCountry: "JP" } },
  baseSalary: { "@type": "MonetaryAmount", currency: "JPY",
    value: { "@type": "QuantitativeValue", minValue: 300000, maxValue: 1500000, unitText: "MONTH" } },
  jobBenefits: "全額日払い、罰金・ノルマなし、マンツーマン研修、宣材写真無料、顔出し不要OK",
  qualifications: "20歳以上の男性、心身ともに健康な方",
  experienceRequirements: "未経験可（プロ講師によるマンツーマン研修あり）",
}) }} />
```

#### E. パンくず `<BreadcrumbList>`（全ページ共通）

```tsx
const breadcrumbs = [
  { name: "ホーム", url: "https://www.sutoroberrys.jp/" },
  { name: `${s.city}店`, url: `https://www.sutoroberrys.jp/store/${city}` },
  { name: "求人募集", url: `https://www.sutoroberrys.jp/store/${city}/recruit` },
];
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((b, i) => ({
    "@type": "ListItem", position: i + 1, name: b.name, item: b.url,
  })),
}) }} />
```

#### F. Q&Aページに `<FAQPage>`（リッチリザルト対応）

```tsx
// app/store/[city]/q-and-a/page.tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
}) }} />
```

#### G. レビューページに `<AggregateRating>`+`<Review>`

```tsx
// app/store/[city]/reviews/reviews/page.tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: `ストロベリーボーイズ${s.city}店`,
  aggregateRating: { "@type": "AggregateRating", ratingValue: 4.8, reviewCount: reviews.length },
  review: reviews.slice(0, 10).map(r => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.author_name ?? "匿名" },
    datePublished: r.created_at,
    reviewBody: r.body,
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
  })),
}) }} />
```

---

### 2-2. HTMLセマンティクス：h1〜h6 階層の正規化

**現状**：TOPと求人ページで`<h1>`が0個、すべて`<div>`で見出し装飾。Googleのコンテンツ理解が大きく阻害されています。

**ルール**：
- 各ページに **`<h1>`は1個だけ** 配置（ページの主題＝メインキーワード入り）
- 大セクションは `<h2>`、その中の小区分は `<h3>`、と階層を守る

#### 例：横浜店 recruit ページの最小修正

```tsx
// Before（現状）
<div className="text-5xl font-bold">横浜エリアで女性用風俗セラピストとして働くなら...</div>

// After
<h1 className="text-5xl font-bold">
  横浜の女性用風俗セラピスト求人｜週1・未経験OK｜ストロベリーボーイズ横浜店
</h1>

// セクション見出し
<h2>未経験者をプロに変える5つの仕組み</h2>
<h2>他店との比較</h2>
<h2>よくあるご質問</h2>
```

**修正対象見出し（求人ページの場合）**：
| 現在divの場所 | 変更先タグ | 想定キーワード |
|---|---|---|
| ページ最上部メインコピー | `<h1>` | 横浜 女性用風俗 セラピスト 求人 |
| 「あなたと横浜で挑戦したい理由」 | `<h2>` | 横浜 女性用風俗 |
| 「数字が証明する、私たちの実績」 | `<h2>` | 女性用風俗 実績 |
| 「働き方を選ぶのは、あなた自身だ！」 | `<h2>` | 女性用風俗 求人 働き方 |
| 「マンガでわかる仕事の流れ」 | `<h2>` | セラピスト 仕事の流れ |
| 「他社との比較」 | `<h2>` | 女性用風俗 求人 比較 |
| 「あなたの適性をチェック」 | `<h2>` | セラピスト 適性 |
| 「よくあるご質問」 | `<h2>` | 女性用風俗 求人 Q&A |
| 各Q&Aの「Q.」見出し | `<h3>` | （各質問内容） |

---

### 2-3. canonical タグの全ページ実装

`generateMetadata` で `alternates.canonical` を相対パスで指定（上記コードに含まれている）。

ただし**動的ルート**（cast/[id], diary/post/[id]）は **必ず絶対URLで** canonical を指定：

```tsx
alternates: { canonical: `https://www.sutoroberrys.jp/store/${city}/cast/${slug}` },
```

URLパラメータ付き（`?utm_source=...` 等）でアクセスされても、Googleがメインの正規URLを認識します。

---

### 2-4. OGP画像の整備

`public/ogp/` 配下に下記を配置（1200×630px推奨）：

```
public/ogp/
├── default.png         （TOP/共通）
├── store-honten.png
├── store-yokohama.png
├── store-nagoya.png
├── store-osaka.png
├── store-fukuoka.png
├── recruit-honten.png
├── recruit-yokohama.png
├── recruit-nagoya.png
├── recruit-osaka.png
└── recruit-fukuoka.png
```

**または**：Next.js の `app/opengraph-image.tsx` で動的生成すれば、デプロイ時に自動で全店舗分のOGPを生成できる：

```tsx
// app/store/[city]/recruit/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { city: string } }) {
  const s = STORE_META[params.city];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
                    background: "linear-gradient(135deg,#C62828,#FF6B6B)", color: "white",
                    padding: 60, fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 36, opacity: 0.9 }}>ストロベリーボーイズ {s.city}店</div>
        <div style={{ fontSize: 80, fontWeight: "bold", marginTop: 20 }}>
          {s.city}の女性用風俗<br/>セラピスト募集
        </div>
        <div style={{ fontSize: 40, marginTop: 30 }}>
          週1日〜・未経験OK・全額日払い
        </div>
      </div>
    ),
    { ...size }
  );
}
```

---

## 🚀 3. 中優先（2〜4週間）

### 3-1. コンテンツSEO：ロングテール対策

「女性用風俗」単体は競合が非常に強い（風俗ポータルが上位独占）。**勝てるのはロングテールキーワード**です。

#### 推奨：`/blog/[slug]` または `/career/[slug]` サブディレクトリで記事化

既に `/career/fukuoka-recruit-guide` が1つだけある状態。これを5店舗×複数テーマで量産：

| 想定キーワード | URL案 | タイトル例 |
|---|---|---|
| 横浜 女性用風俗 おすすめ | `/blog/yokohama-josefu-osusume` | 横浜の女性用風俗おすすめ完全ガイド｜選び方・料金・初心者向け |
| 女性用風俗 初めて | `/blog/josefu-hajimete-guide` | 女性用風俗が初めての方へ｜利用の流れと安心ポイント10選 |
| 女性用風俗 仕事内容 | `/career/yokohama-recruit-guide` | 横浜で女性用風俗セラピストとして働く｜仕事内容・収入・スケジュール |
| 女性用風俗 確定申告 | `/career/josefu-tax-guide` | 女性用風俗セラピストの確定申告完全マニュアル |
| 女性用風俗 副業 | `/career/josefu-fukugyo` | 女性用風俗の副業｜会社にバレない働き方と税金対策 |
| 出張ホスト 違い | `/blog/josefu-vs-host` | 出張ホストと女性用風俗の違い｜料金・サービス・安全性比較 |
| 女性用風俗 料金相場 | `/blog/josefu-price-soba` | 2026年版 女性用風俗の料金相場と選び方 |
| 横浜 出張ホスト | `/blog/yokohama-shutcho-host` | 横浜の出張ホスト｜ホテル・自宅対応のおすすめサービス |

各記事は **2,000〜3,500字、見出し階層あり、内部リンク3本以上**、関連店舗ページとリンクで連結。

### 3-2. 内部リンク構造の改善

#### A. フッターに全店舗・主要ページへのリンクを必ず配置

```tsx
<footer>
  <nav aria-label="店舗">
    <h3>店舗一覧</h3>
    <ul>
      <li><a href="/store/honten">東京の女性用風俗｜東京本店</a></li>
      <li><a href="/store/yokohama">横浜の女性用風俗｜横浜店</a></li>
      <li><a href="/store/nagoya">名古屋の女性用風俗｜名古屋店</a></li>
      <li><a href="/store/osaka">大阪の女性用風俗｜大阪店</a></li>
      <li><a href="/store/fukuoka">福岡の女性用風俗｜福岡店</a></li>
    </ul>
  </nav>
  <nav aria-label="求人">
    <h3>セラピスト求人</h3>
    <ul>
      <li><a href="/store/honten/recruit">東京で女性用風俗求人</a></li>
      <li><a href="/store/yokohama/recruit">横浜で女性用風俗求人</a></li>
      <li><a href="/store/nagoya/recruit">名古屋で女性用風俗求人</a></li>
      <li><a href="/store/osaka/recruit">大阪で女性用風俗求人</a></li>
      <li><a href="/store/fukuoka/recruit">福岡で女性用風俗求人</a></li>
    </ul>
  </nav>
</footer>
```

**ポイント**：アンカーテキストに必ず **「都市名 + 女性用風俗」** を含める。これがGoogleへの強いシグナル。

#### B. 各店舗トップに「他店舗もチェック」セクション

```tsx
<section>
  <h2>他エリアの女性用風俗をお探しの方へ</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {OTHER_STORES.map(s => (
      <Link key={s.city} href={`/store/${s.city}`}>
        {s.city}の女性用風俗｜ストロベリーボーイズ{s.city}店
      </Link>
    ))}
  </div>
</section>
```

### 3-3. 画像のalt属性と最適化

全店舗ページのキャスト画像・写メ日記画像で、`alt` 属性に必ずキーワードを含める：

```tsx
// Before
<img src="/cast/123.jpg" alt="" />

// After
<Image
  src={cast.image_url}
  alt={`${cast.name}｜${s.city}の女性用風俗・出張ホスト｜ストロベリーボーイズ${s.city}店所属セラピスト`}
  width={400} height={600}
  loading="lazy"
/>
```

Next.js の `<Image>` コンポーネントに統一し、`loading="lazy"` と `priority` を適切に使い分け（ファーストビューのみ priority）。

### 3-4. Core Web Vitals 改善

- 全画像を `next/image` に統一
- 上記HTMLサイズ（横浜店トップ 172KB）は重いので、不要な dangerouslySetInnerHTML や inline style を削減
- `app/store/[city]/page.tsx` を `dynamic = "force-static"` または ISR（`revalidate: 3600`）に。現在 daily で更新だが、静的化＋必要箇所のみクライアントコンポーネント化で高速化

```tsx
export const revalidate = 3600; // 1時間ごとに再生成
```

---

## 📈 4. 低優先（1〜2ヶ月）

### 4-1. URLパスの再検討

| 現状 | 検討案 | 理由 |
|---|---|---|
| `/store/honten` | `/store/tokyo` または両対応のリダイレクト | 「東京」検索者には `honten` は意味不明 |
| `/store/[city]/reviews/reviews` | `/store/[city]/reviews` | 二重パスはSEOに悪影響 |
| `/store/[city]/schedule/schedule` | `/store/[city]/schedule` | 同上 |
| `/store/[city]/diary/post/[id]` | `/store/[city]/diary/[id]` | 短く意味のあるURLに |

→ 既存URLは `redirect()` で恒久リダイレクトし、SEO評価を引き継ぎ。

```ts
// next.config.js
async redirects() {
  return [
    { source: "/store/:city/reviews/reviews", destination: "/store/:city/reviews", permanent: true },
    { source: "/store/:city/schedule/schedule", destination: "/store/:city/schedule", permanent: true },
    // /store/honten は当面そのままにし、/store/tokyo を別経路で立てて両対応
  ];
}
```

### 4-2. multilingual 対応（インバウンド狙うなら）

`hreflang` を `<link rel="alternate">` で実装。優先度は低い（日本人女性が主顧客）が、横浜・東京の在留外国人女性需要が一定あるなら検討。

---

## ✅ 5. 開発タスクチェックリスト（実装順）

### Phase 1（即日〜3日、最重要）
- [ ] `app/layout.tsx` の `metadata` を全国展開版に書き換え
- [ ] `app/store/[city]/page.tsx` に `generateMetadata` 実装＋ `STORE_META` テーブル作成
- [ ] `app/store/[city]/recruit/page.tsx` に `generateMetadata` 実装
- [ ] `app/sitemap.ts` を動的化、5店舗 × 全サブページを網羅
- [ ] デプロイ後 `/sitemap.xml` で5店舗全URL確認
- [ ] Google Search Console で sitemap 再送信

### Phase 2（1週間以内）
- [ ] サブページ（price/cast-list/system/first-time/q-and-a/reviews/diary）に `generateMetadata` 実装
- [ ] JSON-LD：Organization, WebSite, LocalBusiness, JobPosting, BreadcrumbList, FAQPage, AggregateRating を実装
- [ ] 全ページで `<h1>` を1個、`<h2>`〜階層を整理（特に求人ページ）
- [ ] 全ページに canonical 実装
- [ ] OGP画像11枚を作成 or `opengraph-image.tsx` 動的生成

### Phase 3（2〜4週間）
- [ ] ブログ/コラム機能を `app/blog/[slug]/page.tsx` で実装（Supabaseにテーブル追加）
- [ ] 8本以上のロングテール記事を投入
- [ ] フッターに全店舗リンク（適切なアンカーテキストで）
- [ ] 全画像のalt属性をキーワード含めて修正
- [ ] 画像を `next/image` に統一・lazy loading 適用

### Phase 4（1〜2ヶ月）
- [ ] URLパス整理（`/store/[city]/reviews/reviews` → `/store/[city]/reviews` 等）
- [ ] 301リダイレクト設定（`next.config.js`）
- [ ] Core Web Vitals 改善（ISR適用、不要なクライアントJS削減）

---

## 📊 6. 計測方法

### Google Search Console（毎週確認）
- 「女性用風俗 横浜」「女性用風俗 東京」「女性用風俗 大阪」「女性用風俗 名古屋」「女性用風俗 福岡」の **検索順位・表示回数・クリック率** をPhase 1完了後の月次で比較
- 「サイト名」が「Vercel」から「ストロベリーボーイズ」に変わったかをSERPで確認（Phase 2 完了後2〜4週で反映）

### Google Analytics 4
- ランディングページ別のオーガニック流入数
- 各店舗ページ別のセッション数・滞在時間・離脱率
- recruit ページ別のCV（LINE友達追加・応募フォーム送信）

### リッチリザルトテスト
- Phase 2 完了後、各ページをこのツールでチェック：
  https://search.google.com/test/rich-results
- 特に求人ページの `JobPosting`、Q&Aページの `FAQPage`、レビューページの `AggregateRating` がリッチリザルト対象になっているか確認

---

## 🔥 まとめ：プログラマーへの最重要メッセージ

現在のサイトは、**「女性用風俗」キーワードでの集客力をほぼ自ら捨てている状態** です。具体的には：

1. **TOPページが全国を統括するページなのに「福岡」固定** → 東京・横浜・名古屋・大阪検索者の流入をゼロに近くしている
2. **横浜店recruitページのtitleがTOPと完全同一の「福岡」** → 「横浜 女性用風俗 求人」で順位が付かない
3. **sitemap.xmlに東京本店・名古屋店・大阪店が一切登録されていない** → Googleに発見すらされていない（3店舗のクロール対象ページが約60ページ消失中）

**Phase 1の3項目（layout.tsx メタ修正・generateMetadata実装・sitemap.ts動的化）だけで、女性用風俗関連のオーガニック流入は推定2〜3倍に伸びます。** まずここから着手いただけると、後続施策の費用対効果も最大化されます。

ご不明点があればお気軽にご連絡ください。
