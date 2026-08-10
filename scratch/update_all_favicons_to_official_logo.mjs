import fs from 'fs';
import path from 'path';

const officialLogo = 'C:\\Users\\nabe7\\.gemini\\antigravity\\brain\\05249213-5ec4-4daa-842a-ba7a34d81fe9\\.user_uploaded\\media_1786215951094.png';
const publicDir = path.join(process.cwd(), 'public');
const appDir = path.join(process.cwd(), 'src', 'app');

console.log('=== UPDATING ALL FAVICON & SITE ICON FILES TO OFFICIAL LOGO ===\n');

// 1. Update public/favicon.png
fs.copyFileSync(officialLogo, path.join(publicDir, 'favicon.png'));
console.log('✅ Updated public/favicon.png');

// 2. Update public/favicon.ico
fs.copyFileSync(officialLogo, path.join(publicDir, 'favicon.ico'));
console.log('✅ Updated public/favicon.ico');

// 3. Update public/apple-touch-icon.png
fs.copyFileSync(officialLogo, path.join(publicDir, 'apple-touch-icon.png'));
console.log('✅ Updated public/apple-touch-icon.png');

// 4. Update src/app/icon.png
fs.copyFileSync(officialLogo, path.join(appDir, 'icon.png'));
console.log('✅ Updated src/app/icon.png');

// 5. Update src/app/apple-icon.png
fs.copyFileSync(officialLogo, path.join(appDir, 'apple-icon.png'));
console.log('✅ Updated src/app/apple-icon.png');

// 6. Update src/app/favicon.ico
fs.copyFileSync(officialLogo, path.join(appDir, 'favicon.ico'));
console.log('✅ Updated src/app/favicon.ico');

console.log('\n=== ALL FAVICONS SUCCESSFULLY UPDATED ===');
