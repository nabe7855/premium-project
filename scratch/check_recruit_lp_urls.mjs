import { execSync } from 'child_process';

function checkRecruitLpUrls() {
  console.log('=== CHECKING RECRUIT LP URLS ===\n');

  const urls = [
    'https://www.sutoroberrys.jp/store/fukuoka/recruit',
    'https://www.sutoroberrys.jp/store/fukuoka/Announcement-information/recruit',
    'https://www.sutoroberrys.jp/recruit'
  ];

  for (const u of urls) {
    try {
      const code = execSync(`curl.exe -o NUL -s -w "%{http_code}" "${u}"`, { encoding: 'utf8' }).trim();
      console.log(`URL: ${u} -> HTTP Status Code: ${code}`);
    } catch (e) {
      console.error(`URL: ${u} -> Error: ${e.message}`);
    }
  }
}

checkRecruitLpUrls();
