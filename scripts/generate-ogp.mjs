/**
 * OGP画像 (1200x630) と schema.org 用ロゴを生成する
 *
 * 使い方: node scripts/generate-ogp.mjs
 *
 * 背景:
 *   layout.tsx が og:image に /ogp/default.png、Organization schema が
 *   /logo.png を指しているが、どちらも実ファイルが存在せず404だった。
 *   SNSでURLを共有してもサムネイルが出ない状態のため生成する。
 *
 * 方針:
 *   ロゴは正方形〜横長で、SNSが期待する1.91:1とは比率が違う。そのまま
 *   置くと上下が切り取られて うさぎの耳やSBいちごが欠けるため、
 *   1200x630のキャンバスにブランドカラーの背景を敷いて中央に配置する。
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'public/images/store-logo.png';
const OG_OUT = 'public/ogp/default.png';
const LOGO_OUT = 'public/logo.png';

const W = 1200;
const H = 630;

if (!fs.existsSync(SRC)) throw new Error(`元ロゴが見つかりません: ${SRC}`);

// 余白を除去してロゴ本体だけを取り出す
const trimmed = await sharp(SRC).trim().png().toBuffer();
const tMeta = await sharp(trimmed).metadata();
console.log(`元ロゴ: ${(await sharp(SRC).metadata()).width}x${(await sharp(SRC).metadata()).height}`);
console.log(`余白除去後: ${tMeta.width}x${tMeta.height}`);

// キャンバスの8割に収まるよう縮小（上下左右に余白を残して見切れを防ぐ）
const maxW = Math.round(W * 0.74);
const maxH = Math.round(H * 0.78);
const logo = await sharp(trimmed)
  .resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: false })
  .png()
  .toBuffer();
const lMeta = await sharp(logo).metadata();

// ブランドカラーの淡いピンク背景（サイト全体の rose 系に合わせる）
const background = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="#fff7f9"/>
         <stop offset="55%" stop-color="#ffeef3"/>
         <stop offset="100%" stop-color="#ffe3ec"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="90" cy="80" r="120" fill="#ffffff" opacity="0.45"/>
     <circle cx="${W - 70}" cy="${H - 60}" r="150" fill="#ffffff" opacity="0.4"/>
   </svg>`
);

fs.mkdirSync(path.dirname(OG_OUT), { recursive: true });
await sharp(background)
  .composite([
    {
      input: logo,
      top: Math.round((H - lMeta.height) / 2),
      left: Math.round((W - lMeta.width) / 2),
    },
  ])
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(OG_OUT);

// schema.org の Organization logo は比率の制約が緩いのでロゴをそのまま使う
await sharp(SRC).png({ compressionLevel: 9 }).toFile(LOGO_OUT);

const og = await sharp(OG_OUT).metadata();
console.log(`\n✅ ${OG_OUT}  ${og.width}x${og.height}  ${Math.round(fs.statSync(OG_OUT).size / 1024)}KB`);
const lg = await sharp(LOGO_OUT).metadata();
console.log(`✅ ${LOGO_OUT}  ${lg.width}x${lg.height}  ${Math.round(fs.statSync(LOGO_OUT).size / 1024)}KB`);
