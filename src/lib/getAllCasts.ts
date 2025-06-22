// src/lib/getAllCasts.ts
export const getAllCasts = async () => {
    const res = await fetch("http://localhost:1337/api/casts?populate=image");
  
    if (!res.ok) throw new Error("キャストの取得に失敗しました");
  
    const data = await res.json();
  
    return data.data.map((item: any) => {
      const { customID, name, age, image } = item.attributes;
      return {
        id: item.id,
        customID,
        name,
        age,
        imageUrl: image?.data?.attributes?.url
          ? `http://localhost:1337${image.data.attributes.url}`
          : null,
      };
    });
  };
  