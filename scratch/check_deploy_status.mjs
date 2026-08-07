import { execSync } from 'child_process';

async function waitForDeploy() {
  for (let i = 0; i < 10; i++) {
    console.log(`Checking deployment (attempt ${i + 1}/10)...`);
    const html = execSync(`curl.exe -s "https://www.sutoroberrys.jp/?v=${Date.now()}"`, { encoding: 'utf8' });
    if (html.includes('グループ累計')) {
      console.log('\n✅ DEPLOYMENT COMPLETED! FOUND "グループ累計" IN PRODUCTION HTML:');
      const matchPC = html.match(/<span[^>]*>[^<]*グループ累計[^<]*<\/span>/g);
      const matchSP = html.match(/<span[^>]*>[^<]*運営8年[^<]*<\/span>/g);
      console.log('PC Badge:', matchPC ? matchPC[0] : 'N/A');
      console.log('SP Badge:', matchSP ? matchSP[0] : 'N/A');
      return true;
    }
    await new Promise(r => setTimeout(r, 4000));
  }
  console.log('Timed out waiting for deploy.');
  return false;
}

waitForDeploy();
