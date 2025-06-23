export interface Cast {
    id: number;
    customID: string;
    name: string;
    catchCopy?: string;
    age?: number;
    height?: number;
    weight?: number;
    Image?: {
      url: string;
      width?: number;
      height?: number;
      mime?: string;
    }[]; // ← 複数画像に対応した配列型
  }
  