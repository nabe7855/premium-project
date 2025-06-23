import { Cast } from '@/types/cast';
import { fetchFromStrapi } from './fetchFromStrapi';

export const getAllCasts = async (): Promise<Cast[]> => {
  const response = await fetchFromStrapi('casts?populate=Image');

  const casts = response.data.map((item: any) => ({
    id: item.id,
    name: item.name,
    customID: item.customID,
    age: item.age,
    height: item.height,
    weight: item.weight,
    catchCopy: item.catchCopy,
    Image: item.Image?.map((img: any) => ({
      url: img.url,
    })) || [],
  }));

  return casts;
};
