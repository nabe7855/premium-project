import { Cast, CastImage } from '@/types/cast';
import { fetchFromStrapi } from '@/lib/fetchFromStrapi';

type RawCast = {
  id: number;
  customID: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  catchCopy?: string;
  Image?: CastImage[];
};

export const getAllCasts = async (): Promise<Cast[]> => {
  const res = await fetchFromStrapi('casts?populate=Image');
  const rawData: RawCast[] = res.data;

  return rawData.map((item) => ({
    id: item.id,
    customID: item.customID,
    name: item.name,
    age: item.age ?? null,
    height: item.height ?? null,
    weight: item.weight ?? null,
    catchCopy: item.catchCopy ?? '',
    Image: item.Image ?? [],
  }));
};
