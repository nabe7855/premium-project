export interface CastImageFormat {
    ext: string;
    url: string;
    mime: string;
    name: string;
    width: number;
    height: number;
    size: number;
    sizeInBytes?: number;
    path?: string | null;
  }
  
  export interface CastImage {
    id: number;
    name: string;
    url: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: CastImageFormat;
      small?: CastImageFormat;
      medium?: CastImageFormat;
      large?: CastImageFormat;
    };
  }
  
  export interface Cast {
    id: number;
    customID: string;
    name: string;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    catchCopy?: string;
    Image: CastImage[];
  }
  