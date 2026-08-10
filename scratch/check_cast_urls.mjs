import { execSync } from 'child_process';

function checkCastUrls() {
  console.log('=== CHECKING CAST URLS RELATIONSHIP ===\n');

  const castUrl = 'https://www.sutoroberrys.jp/store/fukuoka/cast';
  const castListUrl = 'https://www.sutoroberrys.jp/store/fukuoka/cast-list';

  try {
    const castHeaders = execSync(`curl.exe -i -s "${castUrl}"`, { encoding: 'utf8' }).slice(0, 800);
    console.log('--- /store/fukuoka/cast Raw Headers ---');
    console.log(castHeaders);

    const castListHeaders = execSync(`curl.exe -i -s "${castListUrl}"`, { encoding: 'utf8' }).slice(0, 800);
    console.log('\n--- /store/fukuoka/cast-list Raw Headers ---');
    console.log(castListHeaders);
  } catch (e) {
    console.error(e);
  }
}

checkCastUrls();
