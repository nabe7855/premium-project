import fetch from 'node-fetch';
import fs from 'fs';

async function downloadAndMeasure() {
  const originalUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/store-top/fukuoka/header_1777264921146.webp';
  const optimizedUrl = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/render/image/public/banners/store-top/fukuoka/header_1777264921146.webp?width=400&quality=70&resize=contain';

  try {
    const originalRes = await fetch(originalUrl);
    const originalBuffer = await originalRes.buffer();
    console.log('Original hex:', originalBuffer.slice(0, 16).toString('hex'));

    const optRes = await fetch(optimizedUrl);
    const optBuffer = await optRes.buffer();
    console.log('Optimized hex:', optBuffer.slice(0, 16).toString('hex'));

    if (originalBuffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
      const width = originalBuffer.readUInt32BE(16);
      const height = originalBuffer.readUInt32BE(20);
      console.log(`Original dimensions (PNG): ${width} x ${height}`);
    } else {
      console.log('Original is not a standard PNG.');
    }

    if (optBuffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
      const width = optBuffer.readUInt32BE(16);
      const height = optBuffer.readUInt32BE(20);
      console.log(`Optimized dimensions (PNG): ${width} x ${height}`);
    } else {
      console.log('Optimized is not a standard PNG.');
    }
  } catch (e) {
    console.error(e);
  }
}

downloadAndMeasure();
