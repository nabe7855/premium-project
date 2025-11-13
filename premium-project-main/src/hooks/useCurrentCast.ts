import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthUser } from "@/types/cast-dashboard";

export function useCurrentCast(user: AuthUser | null) {
  const [castId, setCastId] = useState<string | null>(null);
  const [storeIds, setStoreIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchCast = async () => {
      const { data, error } = await supabase
        .from("casts")
        .select(`
          id,
          cast_store_memberships (
            store_id,
            is_main
          )
        `)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("❌ キャスト取得エラー:", error.message);
        return;
      }

      if (data) {
        setCastId(data.id);

        if (data.cast_store_memberships?.length > 0) {
          // メイン店舗を先頭に並び替え
          const sortedStores = data.cast_store_memberships.sort(
            (a: any, b: any) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0)
          );
          setStoreIds(sortedStores.map((m: any) => m.store_id));
        }
      }
    };

    fetchCast();
  }, [user]);

  return { castId, storeIds };
}
