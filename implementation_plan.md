# Update Hero Section in test8

Update the hero section statistics grid to include new items, update text, and increase display size.

## User Review Required

> [!IMPORTANT]
>
> - "副業、兼業ＯＫ" text is marked as "under consideration" by the user. I have used "副業・兼業" as label and "大歓迎" as value for now as a placeholder for "OK".
> - "勤務時間" value changed from "3h/日〜" to "自由出勤".

## Proposed Changes

### [Recruit2 Component]

#### [MODIFY] [HeroCollage.tsx](file:///c:/Users/nabe7/Documents/Projects/premium-project/src/components/recruit2/sections/HeroCollage.tsx)

- Update the `Stats Grid` container:
  - Change `md:grid-cols-4` to `md:grid-cols-3` to accommodate 6 items in 2 rows.
- Update the items array:
  1.  `{ label: '割引', val: '全て店舗負担' }` (Was: 未経験月収 60万円〜)
  2.  `{ label: '勤務時間', val: '自由出勤' }` (Was: 勤務時間 3h/日〜)
  3.  `{ label: 'お酒/ノルマ', val: '一切なし' }` (Unchanged)
  4.  `{ label: '全額日払い', val: '当日OK' }` (Unchanged)
  5.  `{ label: '副業・兼業', val: '大歓迎' }` (New) -> logic: "副業、兼業ＯＫ" split into label/value
  6.  `{ label: '移籍・掛け持ちOK', val: '経験者優遇' }` (New)
- Increase styling sizes:
  - Container padding: `p-3` -> `p-4`, `sm:p-4` -> `sm:p-6`
  - Label text size: `text-[10px]` -> `text-xs`, `sm:text-xs` -> `sm:text-sm`
  - Value text size: `text-base` -> `text-xl`, `sm:text-lg` -> `sm:text-2xl`, `md:text-xl` -> `md:text-3xl`

## Verification Plan

### Manual Verification

- Run `npm run dev` and navigate to `http://localhost:3000/#/test8` (HashRouter used in test8/page.tsx).
- Check the Hero section.
- Verify 6 items are displayed.
- Verify text content matches the request.
- Verify the size is larger than before.
