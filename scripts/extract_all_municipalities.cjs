const fs = require('fs');

// プロジェクトのルートにあるSVGから全てのパスを抽出
const svg = fs.readFileSync('Map_of_Fukuoka_Prefecture_Ja.svg', 'utf8');

// <path>タグを探して、dとid、そして inkscape:label (市町村名) を抽出する
// 1つずつ確実に回す
const paths = [];
const pathTags = svg.match(/<path[^>]*>/g) || [];

pathTags.forEach((tag) => {
  const idMatch = tag.match(/id="([^"]+)"/);
  const dMatch = tag.match(/d="([^"]+)"/);
  const labelMatch = tag.match(/inkscape:label="([^"]+)"/);

  if (idMatch && dMatch) {
    const id = idMatch[1];
    const d = dMatch[1].replace(/\n/g, ' ').trim();
    const name = labelMatch ? labelMatch[1] : id;

    // path1 (背景?) 以外を抽出
    if (id !== 'path1') {
      paths.push({
        id: id,
        name: name,
        d: d,
        color: '#f3f4f6', // 全て同じ薄いグレー
        hoverColor: '#d1d5db',
        labelX: 0,
        labelY: 0,
      });
    }
  }
});

// mapData.ts 形式で出力
const output = `export interface AreaPath {
  id: string;
  name: string;
  d: string;
  color: string;
  hoverColor: string;
  labelX: number;
  labelY: number;
}

export const FUKUOKA_AREA_PATHS: AreaPath[] = ${JSON.stringify(paths, null, 2)};
`;

fs.writeFileSync('src/data/lovehotels/mapData.ts', output);
console.log(`Extracted ${paths.length} paths to mapData.ts`);
