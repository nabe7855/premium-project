// ============================================================
// ストロベリーボーイズ SEO・X自動レポート
// Google Apps Script（GAS）コード一式
// ============================================================
//
// 【設置手順】
// 1. Google Sheetsで新しいスプレッドシートを作成
//    → 名前: 「SEO自動レポート_ストロベリーボーイズ」
//
// 2. 拡張機能 → Apps Script を開く
//
// 3. このファイルの中身を全てコピーして、
//    Apps Scriptのエディタに貼り付ける
//    （デフォルトの function myFunction(){} は消してOK）
//
// 4. 左メニュー「サービス」→「+」で以下を追加:
//    ・「Google Analytics Data API」
//       → 識別子はデフォルト「AnalyticsData」のまま
//    ※ Search ConsoleはREST API方式なのでサービス追加不要！
//
// 5. 上部の関数選択で「dailyDataCollection」を選んで ▶実行
//    → 初回は権限承認ダイアログが出るので許可する
//    → 「詳細」→「（安全でない）に移動」→ 許可
//
// 6. データが入ったのを確認したら、
//    関数選択で「createDailyTrigger」を選んで ▶実行
//    → 毎朝6時に自動実行されるようになります
//
// ============================================================


// ===== 設定値（もりさんの環境に合わせて設定済み） =====
const SITE_URL = 'https://www.sutoroberrys.jp/';
const GA4_PROPERTY_ID = '526595944';

// ===== ターゲットキーワード（追跡したいKW） =====
const TARGET_KEYWORDS = [
  '女性用風俗 横浜',
  '女性用風俗 福岡',
  '女性用風俗 神奈川',
  '女性用風俗 博多',
  '女性向け 風俗 横浜',
  '女性向け 風俗 福岡',
  '女性向け リラクゼーション 横浜',
  '女性向け リラクゼーション 福岡',
  'ストロベリーボーイズ',
  'レディースコミック 横浜',
  'レディースコミック 福岡',
];


// ============================================================
// 1. Search Console データ取得（REST API方式）
//    ※ サービス追加不要。OAuthトークンで認証します。
// ============================================================

function fetchSearchConsoleData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('SearchConsole');
  if (!sheet) {
    sheet = ss.insertSheet('SearchConsole');
  }

  // ヘッダーがなければ作成
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '取得日', '対象日', 'クエリ',
      'クリック数', '表示回数', 'CTR', '平均順位',
      'ターゲットKW'
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2B5797');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 100);
    sheet.setColumnWidth(3, 250);
    sheet.setColumnWidth(8, 100);
  }

  // 過去3日分を取得（当日は未確定のため除外）
  var today = new Date();
  var endDate = new Date(today.getTime() - 1 * 86400000);
  var startDate = new Date(today.getTime() - 3 * 86400000);

  // Search Console API を UrlFetchApp で直接呼び出し
  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/'
    + encodeURIComponent(SITE_URL)
    + '/searchAnalytics/query';

  var payload = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dimensions: ['query', 'date'],
    rowLimit: 1000,
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiUrl, options);
    var code = response.getResponseCode();

    if (code !== 200) {
      Logger.log('Search Console APIエラー (HTTP ' + code + '): ' + response.getContentText());
      return;
    }

    var data = JSON.parse(response.getContentText());

    if (!data.rows || data.rows.length === 0) {
      Logger.log('Search Console: データなし');
      return;
    }

    var fetchDate = formatDate(today);
    var rows = data.rows.map(function(row) {
      var query = row.keys[0];
      var date = row.keys[1];
      var isTarget = TARGET_KEYWORDS.some(function(kw) {
        return query.indexOf(kw) !== -1;
      }) ? 'YES' : '';
      return [
        fetchDate, date, query,
        row.clicks,
        row.impressions,
        (row.ctr * 100).toFixed(2) + '%',
        row.position.toFixed(1),
        isTarget
      ];
    });

    // 一括書き込み（高速）
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 8).setValues(rows);

    Logger.log('Search Console: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('Search Consoleエラー: ' + e.message);
  }
}


// ============================================================
// 2. GA4 基本データ取得（PV・ユーザー数・セッション）
//    ※ サービス「Google Analytics Data API」の追加が必要
// ============================================================

function fetchGA4Data() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4');
  if (!sheet) {
    sheet = ss.insertSheet('GA4');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      '取得日', '対象日',
      'アクティブユーザー', 'セッション数',
      'PV数', '平均セッション時間(秒)',
      '新規ユーザー率'
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 7);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2B5797');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 86400000);
  var startDate = new Date(today.getTime() - 3 * 86400000);

  var request = AnalyticsData.newRunReportRequest();
  request.dateRanges = [AnalyticsData.newDateRange()];
  request.dateRanges[0].startDate = formatDate(startDate);
  request.dateRanges[0].endDate = formatDate(endDate);

  request.dimensions = [
    { name: 'date' },
  ];

  request.metrics = [
    { name: 'activeUsers' },
    { name: 'sessions' },
    { name: 'screenPageViews' },
    { name: 'averageSessionDuration' },
    { name: 'newUsers' },
  ];

  try {
    var response = AnalyticsData.Properties.runReport(
      request,
      'properties/' + GA4_PROPERTY_ID
    );

    if (!response.rows) {
      Logger.log('GA4: データなし');
      return;
    }

    var fetchDate = formatDate(today);
    var rows = response.rows.map(function(row) {
      var d = row.dimensionValues[0].value;
      var dateStr = d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8);
      var m = row.metricValues;
      var activeUsers = parseInt(m[0].value);
      var newUsers = parseInt(m[4].value);
      var newRate = activeUsers > 0
        ? ((newUsers / activeUsers) * 100).toFixed(1) + '%'
        : '0%';
      return [
        fetchDate, dateStr,
        activeUsers,
        parseInt(m[1].value),
        parseInt(m[2].value),
        parseFloat(m[3].value).toFixed(1),
        newRate
      ];
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 7).setValues(rows);
    Logger.log('GA4: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('GA4エラー: ' + e.message);
  }
}


// ============================================================
// 3. GA4 流入元別レポート
// ============================================================

function fetchGA4TrafficSources() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4_流入元');
  if (!sheet) {
    sheet = ss.insertSheet('GA4_流入元');
    sheet.appendRow([
      '取得日', 'チャネル', 'ソース/メディア',
      'セッション数', 'ユーザー数'
    ]);
    var headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2B5797');
    headerRange.setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 86400000);
  var startDate = new Date(today.getTime() - 7 * 86400000);

  var request = AnalyticsData.newRunReportRequest();
  request.dateRanges = [AnalyticsData.newDateRange()];
  request.dateRanges[0].startDate = formatDate(startDate);
  request.dateRanges[0].endDate = formatDate(endDate);

  request.dimensions = [
    { name: 'sessionDefaultChannelGroup' },
    { name: 'sessionSourceMedium' },
  ];
  request.metrics = [
    { name: 'sessions' },
    { name: 'activeUsers' },
  ];
  request.orderBys = [{
    metric: { metricName: 'sessions' },
    desc: true
  }];
  request.limit = 50;

  try {
    var response = AnalyticsData.Properties.runReport(
      request,
      'properties/' + GA4_PROPERTY_ID
    );

    if (!response.rows) return;

    var fetchDate = formatDate(today);
    var rows = response.rows.map(function(r) {
      return [
        fetchDate,
        r.dimensionValues[0].value,
        r.dimensionValues[1].value,
        parseInt(r.metricValues[0].value),
        parseInt(r.metricValues[1].value),
      ];
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 5).setValues(rows);
    Logger.log('GA4流入元: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('GA4流入元エラー: ' + e.message);
  }
}


// ============================================================
// 4. ターゲットKW順位サマリー（REST API方式）
// ============================================================

function updateTargetKWRanking() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ターゲットKW順位');
  if (!sheet) {
    sheet = ss.insertSheet('ターゲットKW順位');
    var headers = ['取得日'].concat(TARGET_KEYWORDS);
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2B5797');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(1);
  }

  var today = new Date();
  var yesterday = new Date(today.getTime() - 86400000);
  var yesterdayStr = formatDate(yesterday);

  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/'
    + encodeURIComponent(SITE_URL)
    + '/searchAnalytics/query';

  var payload = {
    startDate: yesterdayStr,
    endDate: yesterdayStr,
    dimensions: ['query'],
    rowLimit: 500,
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiUrl, options);
    if (response.getResponseCode() !== 200) {
      Logger.log('KW順位APIエラー: ' + response.getContentText());
      return;
    }

    var data = JSON.parse(response.getContentText());
    var rankings = {};

    if (data.rows) {
      data.rows.forEach(function(row) {
        var query = row.keys[0];
        TARGET_KEYWORDS.forEach(function(kw) {
          if (query.indexOf(kw) !== -1) {
            if (!rankings[kw] || row.position < rankings[kw]) {
              rankings[kw] = row.position;
            }
          }
        });
      });
    }

    var rowData = [formatDate(today)];
    TARGET_KEYWORDS.forEach(function(kw) {
      rowData.push(rankings[kw] ? rankings[kw].toFixed(1) : '-');
    });

    sheet.appendRow(rowData);
    Logger.log('KW順位サマリー更新完了');
  } catch (e) {
    Logger.log('KW順位エラー: ' + e.message);
  }
}


// ============================================================
// メイン: 全データ一括取得（トリガーから呼ばれる）
// ============================================================

function dailyDataCollection() {
  Logger.log('=== データ収集開始: ' + new Date() + ' ===');

  // Search Console（REST API方式）
  fetchSearchConsoleData();

  // GA4 基本データ
  fetchGA4Data();

  // GA4 流入元
  fetchGA4TrafficSources();

  // ターゲットKW順位サマリー（REST API方式）
  updateTargetKWRanking();

  Logger.log('=== 全データ取得完了: ' + new Date() + ' ===');
}


// ============================================================
// トリガー設定（1回だけ実行）
// ============================================================

function createDailyTrigger() {
  // 既存の同名トリガーを削除
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'dailyDataCollection') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 毎朝6時に実行（Coworkスケジュールタスク7時の前に完了）
  ScriptApp.newTrigger('dailyDataCollection')
    .timeBased()
    .atHour(6)
    .everyDays(1)
    .create();

  Logger.log('毎朝6時の自動実行トリガーを設定しました');
}


// ============================================================
// ユーティリティ
// ============================================================

function formatDate(d) {
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy-MM-dd');
}


// ============================================================
// テスト用: 手動で個別実行する場合
// ============================================================

function testSearchConsole() {
  fetchSearchConsoleData();
}

function testGA4() {
  fetchGA4Data();
  fetchGA4TrafficSources();
}

function testKWRanking() {
  updateTargetKWRanking();
}
