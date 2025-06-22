export interface Cast {
  id: number;
  name: string;
  customID: string;
}

interface RawCast {
  id: number;
  name: string;
  documentId: string;
}

export const getAllCasts = async (): Promise<Cast[]> => {
  const res = await fetch(
    "http://localhost:1337/api/casts?fields[0]=name&fields[1]=documentId"
  );

  if (!res.ok) throw new Error("キャストの取得に失敗しました");

  const json: { data: RawCast[] } = await res.json();

  return json.data.map((item) => ({
    id: item.id,
    name: item.name,
    customID: item.documentId,
  }));
};
