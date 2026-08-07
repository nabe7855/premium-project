import { execSync } from 'child_process';

const doublePathUrlRaw = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/diary/diary/28a3d81e-6a89-4667-80e2-e273bdc9872a-1000008856.jpg';
const doublePathUrlTransformed = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/diary/28a3d81e-6a89-4667-80e2-e273bdc9872a-1000008856.jpg?width=800&quality=75&resize=contain&format=webp';

const singlePathUrlRaw = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/diary/28a3d81e-6a89-4667-80e2-e273bdc9872a-1000008856.jpg';
const singlePathUrlTransformed = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/diary/28a3d81e-6a89-4667-80e2-e273bdc9872a-1000008856.jpg?width=800&quality=75&resize=contain&format=webp';

function getHeaders(url) {
  try {
    const out = execSync(`curl.exe -sI "${url}"`, { encoding: 'utf8' });
    return out;
  } catch (err) {
    return err.message;
  }
}

console.log('=== (1) DOUBLE PATH (diary/diary) RAW ===');
console.log(getHeaders(doublePathUrlRaw));

console.log('=== (2) DOUBLE PATH (diary/diary) TRANSFORMED ===');
console.log(getHeaders(doublePathUrlTransformed));

console.log('=== (3) SINGLE PATH (diary/) RAW ===');
console.log(getHeaders(singlePathUrlRaw));

console.log('=== (4) SINGLE PATH (diary/) TRANSFORMED ===');
console.log(getHeaders(singlePathUrlTransformed));
