export const fetchFromStrapi = async (endpoint: string) => {
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ;
  
    if (!API_URL) throw new Error('❌ STRAPI_API_URL が未定義です');
  
    const res = await fetch(`${API_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
  
    if (!res.ok) {
      const errorBody = await res.text();
      console.error('❌ Strapiからの取得に失敗:', res.status, errorBody);
      throw new Error('Strapi API fetch failed');
    }
  
    const data = await res.json();
    return data;
  };