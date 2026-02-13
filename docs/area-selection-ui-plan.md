# エリア選択UI改善 実装計画書

## 📋 プロジェクト概要

### 目的

現在のテキストベースの地域選択UIを、SVG地図を活用した直感的な2段階選択UIに刷新する。

- **現状の課題**: 市名の羅列で視認性が低く、地理的位置関係が分からない
- **改善後**: 地図でエリアを視覚的に選択 → 市を選択 → ホテル一覧へスムーズに遷移

### スコープ（MVP）

- ✅ 福岡県のエリア選択（将来的に神奈川県も対応）
- ✅ SVG地図によるエリア選択（市境界は描かない）
- ✅ 市はリスト/チップで選択
- ✅ 0件の市は非表示（UIノイズ削減）
- ✅ モバイルファースト設計

---

## 🎯 成功指標（KPI）

### 定量指標

- エリア選択 → 市選択 → ホテル一覧 の完遂率 **+30%**
- 地域選択画面からの離脱率 **-20%**
- 目的の市に到達するまでの平均操作回数 **3回以下**

### 定性指標

- 「場所が分かりやすい」というユーザーフィードバック
- 地理に不慣れなユーザーでも迷わず選択できる

---

## 🗺️ データ構造設計

### 1. エリアマスター（areas.ts）

```typescript
export interface Area {
  id: string; // 'fukuoka-city', 'kitakyushu', 'chikuho'
  name: string; // '福岡市', '北九州市', '筑豊'
  prefectureId: string; // 'fukuoka'
  svgRegionKey: string; // SVG内のpath要素のid
  cityIds: string[]; // 所属する市のIDリスト
  displayOrder: number; // 表示順
}

export const FUKUOKA_AREAS: Area[] = [
  {
    id: 'fukuoka-city',
    name: '福岡市',
    prefectureId: 'fukuoka',
    svgRegionKey: 'fukuoka-city-region',
    cityIds: ['hakata', 'chuo', 'minami', 'nishi', 'sawara', 'jonan', 'higashi'],
    displayOrder: 1,
  },
  {
    id: 'kitakyushu',
    name: '北九州市',
    prefectureId: 'fukuoka',
    svgRegionKey: 'kitakyushu-region',
    cityIds: [
      'kokura-kita',
      'kokura-minami',
      'moji',
      'tobata',
      'wakamatsu',
      'yahata-higashi',
      'yahata-nishi',
    ],
    displayOrder: 2,
  },
  {
    id: 'chikuho',
    name: '筑豊',
    prefectureId: 'fukuoka',
    svgRegionKey: 'chikuho-region',
    cityIds: ['iizuka', 'tagawa', 'nogata'],
    displayOrder: 3,
  },
  {
    id: 'chikugo',
    name: '筑後',
    prefectureId: 'fukuoka',
    svgRegionKey: 'chikugo-region',
    cityIds: ['kurume', 'omuta', 'yanagawa', 'okawa'],
    displayOrder: 4,
  },
  {
    id: 'fukuoka-other',
    name: 'その他福岡県',
    prefectureId: 'fukuoka',
    svgRegionKey: 'fukuoka-other-region',
    cityIds: ['kasuga', 'onojo', 'dazaifu', 'munakata'],
    displayOrder: 5,
  },
];
```

### 2. 市マスター（cities.ts）

```typescript
export interface City {
  id: string; // 'hakata', 'chuo'
  name: string; // '博多区', '中央区'
  areaId: string; // 'fukuoka-city'
  isPopular?: boolean; // 人気市フラグ
}

export const FUKUOKA_CITIES: City[] = [
  { id: 'hakata', name: '博多区', areaId: 'fukuoka-city', isPopular: true },
  { id: 'chuo', name: '中央区', areaId: 'fukuoka-city', isPopular: true },
  { id: 'kokura-kita', name: '小倉北区', areaId: 'kitakyushu', isPopular: true },
  // ... 他の市
];
```

### 3. ホテル件数集計API

```typescript
// GET /api/hotels/count?prefecture=fukuoka
{
  byArea: {
    'fukuoka-city': 45,
    'kitakyushu': 23,
    'chikuho': 8,
    'chikugo': 12,
    'fukuoka-other': 5
  },
  byCity: {
    'hakata': 18,
    'chuo': 15,
    'kokura-kita': 12,
    // ...
  }
}
```

---

## 🎨 UI/UX設計

### 画面構成

```
┌─────────────────────────────────────┐
│ 📍 福岡店のエリアから探す            │
│ 地図からエリアを選んでください       │
├─────────────────────────────────────┤
│ 🔍 [市名で検索...]                  │ ← MVP+（任意）
├─────────────────────────────────────┤
│                                     │
│      [福岡県SVG地図]                │
│      - エリアごとに色分け           │
│      - ホバーでハイライト           │
│      - タップで選択                 │
│      - 件数バッジ表示               │
│                                     │
├─────────────────────────────────────┤
│ 📋 エリア一覧（地図と連動）         │
│ [福岡市 45件] [北九州市 23件] ...   │
└─────────────────────────────────────┘

↓ エリア選択後

┌─────────────────────────────────────┐
│ ← 戻る | 福岡市 のホテルを探す      │
├─────────────────────────────────────┤
│ 🏙️ 人気エリア                       │
│ [博多区 18件] [中央区 15件]         │
├─────────────────────────────────────┤
│ 📍 すべての市区                     │
│ [博多区 18] [中央区 15] [南区 7]   │
│ [西区 3] [早良区 2] ...             │
└─────────────────────────────────────┘
```

### インタラクション仕様

#### ステップ1: エリア選択

- **地図操作**:
  - ホバー: エリアがハイライト + ツールチップ表示（エリア名・件数）
  - クリック: エリア選択 → ステップ2へ遷移
  - 選択状態: 太い枠線 + 影 + 色変化
- **リスト操作**:
  - エリアチップをクリック → 同様にステップ2へ
  - 地図と連動（チップホバー → 地図もハイライト）

#### ステップ2: 市選択

- **表示形式**: チップ形式（グリッドレイアウト）
- **人気市**: 上部に別枠で表示（⭐アイコン付き）
- **ソート**: 件数降順
- **0件市**: 非表示（データノイズ削減）
- **戻る導線**: ヘッダーに「← 戻る」ボタン

---

## 🏗️ 実装計画

### フェーズ1: データ準備（Day 1）

#### 1.1 マスターデータ作成

- [ ] `src/data/areas.ts` - エリアマスター
- [ ] `src/data/cities.ts` - 市マスター
- [ ] 既存の `lh_areas`, `lh_cities` テーブルとの整合性確認

#### 1.2 SVG地図作成

- [ ] 福岡県の簡易SVG地図を作成
  - エリアごとにpath要素を分割
  - id属性でエリアと紐付け（例: `id="fukuoka-city-region"`）
  - 最適化（不要な詳細を削除、ファイルサイズ削減）
- [ ] `public/maps/fukuoka.svg` に配置

#### 1.3 集計API実装

- [ ] `src/app/api/hotels/count/route.ts` 作成
- [ ] エリア別・市別のホテル件数を集計
- [ ] ISRでキャッシュ（revalidate: 3600）

### フェーズ2: コンポーネント実装（Day 2-3）

#### 2.1 地図コンポーネント

```typescript
// src/components/lovehotels/AreaMap.tsx
interface AreaMapProps {
  areas: Area[];
  counts: Record<string, number>;
  selectedAreaId?: string;
  onAreaSelect: (areaId: string) => void;
}
```

**実装ポイント**:

- SVGをインラインで埋め込み（動的スタイル適用のため）
- `<path>` 要素にイベントハンドラ設定
- ホバー時のツールチップ表示
- レスポンシブ対応（viewBox活用）

#### 2.2 エリア選択コンポーネント

```typescript
// src/components/lovehotels/AreaSelector.tsx
```

**機能**:

- 地図とリストの統合表示
- ステップ管理（area/city）
- 状態管理（selectedAreaId, selectedCityId）

#### 2.3 市選択コンポーネント

```typescript
// src/components/lovehotels/CitySelector.tsx
```

**機能**:

- 人気市の優先表示
- チップ形式のグリッドレイアウト
- 件数バッジ表示
- 0件市のフィルタリング

### フェーズ3: ページ統合（Day 4）

#### 3.1 地域選択ページ更新

- [ ] 既存の地域選択ページを新UIに置き換え
- [ ] URLパラメータ管理（`?step=city&area=fukuoka-city`）
- [ ] 遷移先の調整（`/hotel/[area]/[city]`）

#### 3.2 モバイル最適化

- [ ] ボトムシート実装（市選択時）
- [ ] タップ領域の拡大（最小44x44px）
- [ ] スクロール最適化

### フェーズ4: 仕上げ（Day 5）

#### 4.1 アクセシビリティ

- [ ] キーボード操作対応
- [ ] ARIA属性の追加
- [ ] スクリーンリーダー対応

#### 4.2 パフォーマンス

- [ ] SVGの遅延ロード
- [ ] 画像最適化
- [ ] APIキャッシュ確認

#### 4.3 テスト

- [ ] 各エリア選択のテスト
- [ ] 0件エリアの挙動確認
- [ ] モバイル実機テスト

---

## 📁 ファイル構成

```
src/
├── data/
│   ├── areas.ts              # エリアマスター
│   └── cities.ts             # 市マスター
├── components/
│   └── lovehotels/
│       ├── AreaMap.tsx       # SVG地図コンポーネント
│       ├── AreaSelector.tsx  # エリア選択メイン
│       ├── CitySelector.tsx  # 市選択
│       └── AreaTooltip.tsx   # ツールチップ
├── app/
│   ├── api/
│   │   └── hotels/
│   │       └── count/
│   │           └── route.ts  # 件数集計API
│   └── (protected)/
│       └── store/
│           └── [slug]/
│               └── hotel/
│                   └── area-select/
│                       └── page.tsx  # 地域選択ページ
└── public/
    └── maps/
        ├── fukuoka.svg       # 福岡県地図
        └── kanagawa.svg      # 神奈川県地図（将来）
```

---

## 🎨 デザイン仕様

### カラーパレット

- **未選択エリア**: `#F3F4F6` (gray-100)
- **ホバー**: `#FEE2E2` (rose-100) + 影
- **選択中**: `#F43F5E` (rose-500) + 太枠 + 影
- **件数バッジ**: `#DC2626` (red-600) 背景 + 白文字

### タイポグラフィ

- **エリア名**: 16px, font-black
- **件数**: 12px, font-bold
- **市名**: 14px, font-bold

### アニメーション

- ホバー: `transition-all duration-200`
- 選択: `scale-105` + `shadow-xl`
- ステップ遷移: `slide-in-from-right`

---

## 🚀 MVP後の拡張案

### Phase 2（優先度: 中）

- [ ] 市名検索機能
- [ ] 市境界のミニマップ表示
- [ ] 「近くのホテル」提案（0件時）

### Phase 3（優先度: 低）

- [ ] 神奈川県対応
- [ ] エリアズーム機能
- [ ] お気に入りエリア保存

---

## ⚠️ リスク管理

### 技術リスク

| リスク                 | 影響               | 対策                       |
| ---------------------- | ------------------ | -------------------------- |
| SVGが複雑で重い        | パフォーマンス低下 | 簡略化、遅延ロード         |
| 小さいエリアの誤タップ | UX低下             | タップ領域拡大、リスト併用 |
| データ不整合           | 表示エラー         | バリデーション強化         |

### スケジュールリスク

- SVG作成に時間がかかる可能性 → 既存の地図素材を活用
- モバイル最適化に工数 → 早めにプロトタイプ確認

---

## ✅ 完了条件

- [ ] 福岡県の全エリアが地図から選択可能
- [ ] 市選択後、正しいホテル一覧に遷移
- [ ] モバイルで快適に操作可能
- [ ] 0件の市が非表示になっている
- [ ] ページ読み込みが3秒以内
- [ ] アクセシビリティチェック合格

---

## 📊 実装優先度

### 🔴 Must Have（MVP必須）

1. SVG地図によるエリア選択
2. 市チップ選択
3. ホテル件数表示
4. 0件市の非表示
5. モバイル対応

### 🟡 Should Have（MVP+）

1. 市名検索
2. 人気市の優先表示
3. ツールチップ
4. アニメーション

### 🟢 Nice to Have（将来）

1. 市境界ミニマップ
2. ズーム機能
3. 他県対応

---

この計画書に基づいて実装を進めます。まずはフェーズ1のデータ準備から開始しましょうか？
