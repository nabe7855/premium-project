"use client";

import CastCard from "@/components/cards/CastCard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-2xl font-bold">キャスト一覧（テスト表示）</h1>
      <CastCard
        name="さくら"
        age={22}
        imageUrl="https://placekitten.com/160/160"
        customID="sample-id"
      />
    </div>
  );
}
