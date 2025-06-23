export const fetchFromStrapi = async (endpoint: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!baseUrl) {
      throw new Error('❌ 環境変数 NEXT_PUBLIC_STRAPI_API_URL が設定されていません');
    }
  
    const res = await fetch(`${baseUrl}/api/${endpoint}`);
  
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("❌ Strapiからの取得に失敗:", res.status, errorBody);
      throw new Error("Strapi API fetch failed");
    }
  
    const data = await res.json();
    return data; // ✅ 必要な構造に応じてここは CastListPage 側で対応すればOK
  };
  