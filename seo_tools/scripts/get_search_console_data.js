const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// 設定
const KEY_PATH = path.join(__dirname, '../credentials.json');
const OUTPUT_DIR = path.join(__dirname, '../data');
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

// プロパティURL（例: 'https://example.com/' または 'sc-domain:example.com'）
// セットアップ後にここを書き換えます
const SITE_URL = 'https://www.sutoroberrys.jp/';

async function getSearchConsoleData() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error('エラー: credentials.json が見つかりません。SETUP_GUIDE.md を確認してください。');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: SCOPES,
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  try {
    console.log(`${SITE_URL} のデータを取得中...`);

    // 直近30日のデータを取得
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await searchconsole.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query', 'page'],
        rowLimit: 1000,
      },
    });

    const rows = response.data.rows || [];
    const fileName = `search_data_${endDate}.json`;
    const outputPath = path.join(OUTPUT_DIR, fileName);

    fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2));
    console.log(`成功: ${rows.length} 件のデータを保存しました -> ${outputPath}`);
  } catch (error) {
    console.error('データ取得エラー:', error.message);
    if (error.message.includes('403')) {
      console.error(
        'ヒント: Search Console側でサービスアカウントに権限が与えられているか確認してください。',
      );
    }
  }
}

getSearchConsoleData();
