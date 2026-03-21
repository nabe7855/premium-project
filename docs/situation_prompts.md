# 希望シチュエーション用 イラスト生成プロンプト計画

マッチングページの「希望シチュエーション」8項目それぞれを表すイラストを作成するためのAI画像生成プロンプトです。顔タイプ（いちご系男子）同様、女性ユーザーに好まれる「親しみやすさ」「清潔感」「透明感のあるイケメン」をベースにしつつ、各シチュエーションの「感情・体験」が直感的に伝わる構図や表情を指定します。

## 🎯 共通ベースプロンプト
すべての画像でトーン＆マナー（画風・品質）を統一するため、以下のベースプロンプトを先頭に配置します。

**ベースプロンプト:**
```text
masterpiece, best quality, highres, illustration, anime style, 1boy, extremely handsome Japanese young man, clean and neat appearance, approachable and welcoming expression, soft studio lighting, pastel and warm color palette, highly detailed face, beautiful eyes
```

---

## 🍓 各シチュエーション別プロンプト

### 1. ドキドキしたい（Want my heart to pound）
**コンセプト:** 距離が近く、少しだけ強引で男らしい視線。壁ドンや耳元で囁くような「キュン」とするシチュエーション。
**追加プロンプト:**
```text
close up, looking into viewer's eyes with an intense and sweet gaze, slightly smirk, leaning forward, hand near wall (kabedon pose), sensual atmosphere, romantic lighting, dark hair, stylish jacket
```

### 2. 癒されたい（Want to be healed）
**コンセプト:** ふんわりとした包容力。温かい飲み物を持ちながら、ソファでリラックスして微笑みかけてくれる安心感。
**追加プロンプト:**
```text
soft and gentle smile, holding a warm mug of coffee, sitting on a comfy sofa, relaxing atmosphere, wearing a fluffy oversized knit sweater, warm morning sunlight, pastel tones, fluffy hair
```

### 3. 元気になりたい（Want to get energized）
**コンセプト:** 太陽のような明るい笑顔とエネルギッシュな反応。ハイタッチしてくれるような快活で爽やかなイメージ。
**追加プロンプト:**
```text
bright and confident big smile, cheerful expression, energetic vibe, reaching out hand for a high-five, wearing casual sporty clothes, clear blue sky background, refreshing lighting, dynamic pose
```

### 4. 甘やかされたい（Want to be spoiled）
**コンセプト:** 全部受け入れてよしよししてくれるような、圧倒的な甘やかし度。頭を撫でてくれるような仕草と優しい視線。
**追加プロンプト:**
```text
extremely gentle and pampering expression, warm affectionate smile, reaching out hand to pat viewer's head, soft eye contact, cozy room background, wearing loose comfortable clothes, soft fuzzy lighting
```

### 5. 落ち着きたい（Want to relax / calm down）
**コンセプト:** 一緒にいて無言でも心地よい大人の余裕。本を片手に傍で静かに見守ってくれるような、落ち着いた空気感。
**追加プロンプト:**
```text
calm and mature expression, slight peaceful smile, holding a book, sitting in a quiet aesthetic cafe, wearing a neat cardigan, evening soft lighting, intellectual and relaxing atmosphere
```

### 6. しゃべりたい（Want to talk）
**コンセプト:** 「うんうん」と真剣に話を聞いてくれる、聞き上手な相槌。カフェのテーブル越しで目が合い、興味津々な表情。
**追加プロンプト:**
```text
attentive listening expression, gentle eye contact, leaning forward slightly across a cafe table, hand on chin, highly responsive and warm face, wearing smart casual clothes, blurred aesthetic background
```

### 7. 励まされたい（Want to be encouraged）
**コンセプト:** 落ち込んだ時に「大丈夫だよ」と力強くも優しく背中を押してくれる。ガッツポーズや親指を立てる仕草。
**追加プロンプト:**
```text
reassuring and supportive smile, looking straight into viewer's eyes with kindness, giving a thumbs up or gentle fist bump, sincere expression, warm golden hour lighting, encouraging atmosphere
```

### 8. リードされたい（Want to be led）
**コンセプト:** 迷わずエスコートしてくれる頼もしさ。「こっちだよ」と手を差し伸べてくれる、自信に満ちたスマートな立ち振る舞い。
**追加プロンプト:**
```text
confident and smart expression, mature handsome face, reaching out hand to escort the viewer, charming smile, wearing a perfectly fitted stylish suit or long coat, elegant and classy atmosphere, city lights background
```

---

## 🎨 今後の進行ステップ（提案）

1. **画像生成の実行**
   上記のプロンプトを用いて、画像生成AI（Midjourney、NovelAI、Nijijourney等）で各シチュエーションにつき数枚生成し、一番イメージに合うものを選定します。
2. **画像のトリミング・保存**
   生成された画像を正方形または縦長などの統一された比率にトリミングし、`public/シチュエーション/` 等のディレクトリに保存します。
3. **UIへの組み込み**
   `DiagnosisSection.tsx` の「希望シチュエーション」項目を、今回実装した顔タイプ（イラストから選ぶモーダル）と同じように「画像を選択肢として表示する」形式にアップデートします。
