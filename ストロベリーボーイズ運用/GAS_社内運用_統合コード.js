// ============================================================
// ストロベリーボーイズ 社内運用管理（統合版）
// SEOデータ収集 + SNS管理 + ダッシュボード + インテリジェンス
// ============================================================
//
// 【設置手順】
// 1. このコードを コード.gs に貼り付け
// 2. 左メニュー「サービス」→「+」→「Google Analytics Data API」追加
// 3. 左の⚙️設定 → GCPプロジェクト → 673051079201 に変更
// 4. appsscript.json を設定（マニフェスト表示ON）
// 5. 「setupAll」を実行 → 全シート構築
// 6. 「dailyDataCollection」を実行 → データ取得テスト
// 7. 「createDailyTrigger」を実行 → 毎朝6時自動化
//
// ============================================================


// ===== 設定値 =====
var SITE_URL = 'https://www.sutoroberrys.jp/';
var GA4_PROPERTY_ID = '526595944';

// クライアント共有用スプレッドシート（ダッシュボード・KW順位を同期）
var CLIENT_SHEET_ID = '1dwsviubjpv2gQpxLOXVJCGRYxMinOb1NOoAY54GnRH0';

// ===== ターゲットキーワード =====
var TARGET_KEYWORDS = [
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
  '女風 横浜',
  '女風 福岡',
  '女風 博多',
];


// ============================================================
// 初期セットアップ（1回だけ実行）
// ============================================================
function setupAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createPostLogSheet(ss);
  createIntelligenceSheet(ss);
  createAIWorkflowSheet(ss);
  formatAllSheets(ss);
  Logger.log('✅ 全シート構築完了！次に dailyDataCollection を実行してください');
}


// ============================================================
// メイン: 全データ一括取得（トリガーから毎朝呼ばれる）
// ============================================================
function dailyDataCollection() {
  Logger.log('=== データ収集開始: ' + new Date() + ' ===');
  fetchSearchConsoleData();
  fetchGA4Data();
  fetchGA4TrafficSources();
  updateTargetKWRanking();
  refreshDashboard();
  syncToClientSheet();
  Logger.log('=== 全データ取得完了: ' + new Date() + ' ===');
}


// ============================================================
// Search Console データ取得（REST API / 過去28日間）
// ============================================================
function fetchSearchConsoleData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('SearchConsole');
  if (!sheet) {
    sheet = ss.insertSheet('SearchConsole');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['取得日', '対象日', 'クエリ', 'クリック数', '表示回数', 'CTR', '平均順位', 'ターゲットKW']);
    var headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(3, 250);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 1 * 86400000);
  var startDate = new Date(today.getTime() - 28 * 86400000);

  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/'
    + encodeURIComponent(SITE_URL) + '/searchAnalytics/query';

  var payload = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dimensions: ['query', 'date'],
    rowLimit: 1000,
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiUrl, options);
    if (response.getResponseCode() !== 200) {
      Logger.log('Search Console APIエラー (HTTP ' + response.getResponseCode() + '): ' + response.getContentText());
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
      return [fetchDate, date, query, row.clicks, row.impressions,
        (row.ctr * 100).toFixed(2) + '%', row.position.toFixed(1), isTarget];
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 8).setValues(rows);
    Logger.log('Search Console: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('Search Consoleエラー: ' + e.message);
  }
}


// ============================================================
// GA4 基本データ取得
// ============================================================
function fetchGA4Data() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4');
  if (!sheet) { sheet = ss.insertSheet('GA4'); }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['取得日', '対象日', 'アクティブユーザー', 'セッション数', 'PV数', '平均セッション時間(秒)', '新規ユーザー率']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 86400000);
  var startDate = new Date(today.getTime() - 3 * 86400000);

  var request = AnalyticsData.newRunReportRequest();
  request.dateRanges = [AnalyticsData.newDateRange()];
  request.dateRanges[0].startDate = formatDate(startDate);
  request.dateRanges[0].endDate = formatDate(endDate);
  request.dimensions = [{ name: 'date' }];
  request.metrics = [
    { name: 'activeUsers' }, { name: 'sessions' },
    { name: 'screenPageViews' }, { name: 'averageSessionDuration' },
    { name: 'newUsers' },
  ];

  try {
    var response = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
    if (!response.rows) { Logger.log('GA4: データなし'); return; }

    var fetchDate = formatDate(today);
    var rows = response.rows.map(function(row) {
      var d = row.dimensionValues[0].value;
      var dateStr = d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8);
      var m = row.metricValues;
      var activeUsers = parseInt(m[0].value);
      var newUsers = parseInt(m[4].value);
      var newRate = activeUsers > 0 ? ((newUsers / activeUsers) * 100).toFixed(1) + '%' : '0%';
      return [fetchDate, dateStr, activeUsers, parseInt(m[1].value),
        parseInt(m[2].value), parseFloat(m[3].value).toFixed(1), newRate];
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 7).setValues(rows);
    Logger.log('GA4: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('GA4エラー: ' + e.message);
  }
}


// ============================================================
// GA4 流入元別レポート
// ============================================================
function fetchGA4TrafficSources() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4_流入元');
  if (!sheet) {
    sheet = ss.insertSheet('GA4_流入元');
    sheet.appendRow(['取得日', 'チャネル', 'ソース/メディア', 'セッション数', 'ユーザー数']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 86400000);
  var startDate = new Date(today.getTime() - 7 * 86400000);

  var request = AnalyticsData.newRunReportRequest();
  request.dateRanges = [AnalyticsData.newDateRange()];
  request.dateRanges[0].startDate = formatDate(startDate);
  request.dateRanges[0].endDate = formatDate(endDate);
  request.dimensions = [{ name: 'sessionDefaultChannelGroup' }, { name: 'sessionSourceMedium' }];
  request.metrics = [{ name: 'sessions' }, { name: 'activeUsers' }];
  request.orderBys = [{ metric: { metricName: 'sessions' }, desc: true }];
  request.limit = 50;

  try {
    var response = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
    if (!response.rows) return;

    var fetchDate = formatDate(today);
    var rows = response.rows.map(function(r) {
      return [fetchDate, r.dimensionValues[0].value, r.dimensionValues[1].value,
        parseInt(r.metricValues[0].value), parseInt(r.metricValues[1].value)];
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, rows.length, 5).setValues(rows);
    Logger.log('GA4流入元: ' + rows.length + '行追加');
  } catch (e) {
    Logger.log('GA4流入元エラー: ' + e.message);
  }
}


// ============================================================
// ターゲットKW順位サマリー（過去7日間）
// ============================================================
function updateTargetKWRanking() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ターゲットKW順位');
  if (!sheet) {
    sheet = ss.insertSheet('ターゲットKW順位');
    sheet.appendRow(['取得日'].concat(TARGET_KEYWORDS));
    var headerRange = sheet.getRange(1, 1, 1, TARGET_KEYWORDS.length + 1);
    headerRange.setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF').setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(1);
  }

  var today = new Date();
  var endDate = new Date(today.getTime() - 86400000);
  var startDate = new Date(today.getTime() - 7 * 86400000);

  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/'
    + encodeURIComponent(SITE_URL) + '/searchAnalytics/query';

  var payload = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    dimensions: ['query'],
    rowLimit: 500,
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
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
// X投稿ログシート
// ============================================================
function createPostLogSheet(ss) {
  var sheet = ss.getSheetByName('📱 X投稿ログ');
  if (sheet) { Logger.log('📱 X投稿ログ: 既存スキップ'); return; }
  sheet = ss.insertSheet('📱 X投稿ログ');

  sheet.getRange('A1:I1').merge().setValue('X（Twitter）投稿ログ')
    .setFontSize(14).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1DA1F2').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  sheet.getRange('A2:I2').merge()
    .setValue('💡 毎日の投稿データをここに記録 → ダッシュボードに自動反映されます')
    .setFontSize(9).setFontColor('#666666').setBackground('#f0f8ff');

  var headers = ['日付', '時間帯', 'ピラー', '投稿テキスト（冒頭40字）', 'Imp', 'Eng', 'いいね', 'RT', 'ER(%)'];
  sheet.getRange(3, 1, 1, 9).setValues([headers])
    .setFontWeight('bold').setBackground('#1DA1F2').setFontColor('#FFFFFF').setHorizontalAlignment('center');
  sheet.setFrozenRows(3);

  var pillarRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['共感・エンパワメント', 'ブランド・キャスト紹介', 'お役立ち・コラム', 'キャンペーン・イベント', 'インタラクション'])
    .setAllowInvalid(false).build();
  sheet.getRange(4, 3, 500, 1).setDataValidation(pillarRule);

  var timeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['朝(7時)', '昼(12時)', '夕(19時)', '夜1(22時)', '夜2(23時)'])
    .setAllowInvalid(false).build();
  sheet.getRange(4, 2, 500, 1).setDataValidation(timeRule);

  for (var i = 4; i <= 103; i++) {
    sheet.getRange(i, 9).setFormula('=IF(E' + i + '>0, ROUND(F' + i + '/E' + i + '*100, 2), "")');
  }

  var erRange = sheet.getRange(4, 9, 500, 1);
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThanOrEqualTo(3)
      .setBackground('#C8E6C9').setFontColor('#1B5E20').setRanges([erRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(1)
      .setBackground('#FFCDD2').setFontColor('#B71C1C').setRanges([erRange]).build(),
  ]);

  sheet.setColumnWidth(1, 100); sheet.setColumnWidth(2, 100); sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 300); sheet.setColumnWidth(5, 80); sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 70); sheet.setColumnWidth(8, 60); sheet.setColumnWidth(9, 80);
  sheet.getRange(3, 1, 1, 9).createFilter();
  sheet.getRange(4, 5, 500, 2).setNumberFormat('#,##0');

  Logger.log('📱 X投稿ログシート作成完了');
}


// ============================================================
// インテリジェンスシート
// ============================================================
function createIntelligenceSheet(ss) {
  var sheet = ss.getSheetByName('🧠 インテリジェンス');
  if (sheet) { Logger.log('🧠 インテリジェンス: 既存スキップ'); return; }
  sheet = ss.insertSheet('🧠 インテリジェンス');

  sheet.getRange('A1:G1').merge().setValue('マーケットインテリジェンス')
    .setFontSize(14).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#6A1B9A').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  // セクション1: 競合バズ分析
  sheet.getRange('A3:G3').merge().setValue('🔥 競合バズ投稿分析（Grok収集 / 週2回）')
    .setFontSize(12).setFontWeight('bold').setBackground('#F3E5F5').setFontColor('#4A148C');
  sheet.getRange(4, 1, 1, 7).setValues([['日付', 'アカウント', 'バズ要因', '推定Imp', '活用ポイント', '自社転用案', 'ステータス']])
    .setFontWeight('bold').setBackground('#CE93D8').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未対応', '検討中', '採用', '見送り']).setAllowInvalid(true).build();
  sheet.getRange(5, 7, 14, 1).setDataValidation(statusRule);

  // セクション2: トレンド・時事
  sheet.getRange('A20:G20').merge().setValue('📰 トレンド・時事ネタ（Perplexity収集 / 週1回）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E3F2FD').setFontColor('#0D47A1');
  sheet.getRange(21, 1, 1, 7).setValues([['日付', 'カテゴリ', '概要', 'ソースURL', '投稿転用案', 'ピラー', 'ステータス']])
    .setFontWeight('bold').setBackground('#90CAF9').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var catRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['業界トレンド', 'メンタルヘルス', 'セルフケア', '地域情報（横浜）', '地域情報（福岡）', '季節イベント', 'その他'])
    .setAllowInvalid(true).build();
  sheet.getRange(22, 2, 14, 1).setDataValidation(catRule);
  sheet.getRange(22, 7, 14, 1).setDataValidation(statusRule);

  // セクション3: Xアルゴリズム変動ログ
  sheet.getRange('A37:G37').merge().setValue('⚙️ Xアルゴリズム変動ログ（Grok確認 / 月2回）')
    .setFontSize(12).setFontWeight('bold').setBackground('#FFF3E0').setFontColor('#E65100');
  sheet.getRange(38, 1, 1, 7).setValues([['確認日', '変更内容', '影響度', '影響範囲', '対応アクション', '対応状況', '効果']])
    .setFontWeight('bold').setBackground('#FFB74D').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var impactRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['高', '中', '低']).setAllowInvalid(true).build();
  sheet.getRange(39, 3, 10, 1).setDataValidation(impactRule);

  var doneRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未対応', '対応中', '完了']).setAllowInvalid(true).build();
  sheet.getRange(39, 6, 10, 1).setDataValidation(doneRule);

  // セクション4: Grok vs Perplexity 使い分けガイド
  sheet.getRange('A52:G52').merge().setValue('📖 Grok vs Perplexity 使い分けガイド')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#283593');
  sheet.getRange(53, 1, 1, 4).setValues([['用途', '最適ツール', '理由', '頻度']])
    .setFontWeight('bold').setBackground('#9FA8DA').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var guideData = [
    ['競合バズ投稿分析', 'Grok', 'X内部データにアクセス可能', '週2回'],
    ['Xアルゴリズム最新動向', 'Grok', 'アルゴリズム変更をいち早く反映', '月2回'],
    ['ターゲット層の話題', 'Grok', 'リアルタイムX会話トレンド分析', '週1回'],
    ['業界トレンド・市場データ', 'Perplexity', '引用付きで信頼性が高い', '週1回'],
    ['横浜/福岡の地域情報', 'Perplexity', '地域情報の網羅性が高い', '月2回'],
    ['記事一次情報・統計', 'Perplexity', '学術・政府統計に強い', '記事執筆時'],
  ];
  sheet.getRange(54, 1, guideData.length, 4).setValues(guideData);

  sheet.setColumnWidth(1, 120); sheet.setColumnWidth(2, 130); sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 100); sheet.setColumnWidth(5, 250); sheet.setColumnWidth(6, 150); sheet.setColumnWidth(7, 100);

  Logger.log('🧠 インテリジェンスシート作成完了');
}


// ============================================================
// AI運用フローシート
// ============================================================
function createAIWorkflowSheet(ss) {
  var sheet = ss.getSheetByName('🤖 AI運用フロー');
  if (sheet) { Logger.log('🤖 AI運用フロー: 既存スキップ'); return; }
  sheet = ss.insertSheet('🤖 AI運用フロー');

  sheet.getRange('A1:F1').merge().setValue('AI自動化 運用フロー')
    .setFontSize(14).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#00695C').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  // 毎日の運用フロー
  sheet.getRange('A3:F3').merge().setValue('📅 毎日の運用フロー')
    .setFontSize(12).setFontWeight('bold').setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.getRange(4, 1, 1, 6).setValues([['時間', '担当', 'タスク', '詳細', '所要時間', 'チェック']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var dailyFlow = [
    ['6:00', '🤖 自動', 'データ収集', 'GASがSearch Console/GA4データを自動取得', '-', false],
    ['7:00', '🤖 自動', 'X投稿案生成', 'Coworkが5本の投稿案を.mdで出力', '-', false],
    ['7:00-7:30', '👤 手動(5分)', '投稿案レビュー', '投稿案を確認、朝の投稿を実行', '5分', false],
    ['12:00', '👤 手動(1分)', '昼投稿', '予定の投稿を実行', '1分', false],
    ['19:00', '👤 手動(1分)', '夕方投稿', '予定の投稿を実行', '1分', false],
    ['22:00', '👤 手動(1分)', '夜投稿①', '予定の投稿を実行', '1分', false],
    ['23:00', '👤 手動(1分)', '夜投稿②', '予定の投稿を実行', '1分', false],
    ['翌朝', '👤 手動(3分)', 'データ記録', 'X Analyticsを「📱 X投稿ログ」に転記', '3分', false],
  ];

  sheet.getRange(5, 1, dailyFlow.length, 6).setValues(dailyFlow)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  for (var d = 5; d < 5 + dailyFlow.length; d++) {
    if (dailyFlow[d - 5][1].indexOf('自動') !== -1) {
      sheet.getRange(d, 1, 1, 6).setBackground('#E8F5E9');
    }
  }

  var checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(5, 6, dailyFlow.length, 1).setDataValidation(checkboxRule);

  // 週次フロー
  sheet.getRange('A16:F16').merge().setValue('📊 週次インテリジェンス収集フロー')
    .setFontSize(12).setFontWeight('bold').setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.getRange(17, 1, 1, 6).setValues([['頻度', 'ツール', 'タスク', '手順', '記録先', '所要時間']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var weeklyFlow = [
    ['週2回', 'Grok', '競合バズ分析', 'Grokにプロンプト → 結果を記録', '🧠 インテリジェンス', '10分'],
    ['週1回', 'Perplexity', 'トレンド収集', 'Perplexityで検索 → 記録', '🧠 インテリジェンス', '10分'],
    ['月2回', 'Grok', 'アルゴリズム確認', 'アルゴリズム変更確認 → 更新', '🧠 インテリジェンス', '5分'],
    ['週1回', '-', 'PDCA振り返り', '投稿ログのER分析 → 改善特定', '📱 X投稿ログ', '15分'],
  ];
  sheet.getRange(18, 1, weeklyFlow.length, 6).setValues(weeklyFlow).setHorizontalAlignment('center');

  // PDCAサイクル
  sheet.getRange('A25:F25').merge().setValue('🔄 PDCAサイクル記録（週次振り返り）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.getRange(26, 1, 1, 6).setValues([['週', 'Plan（計画）', 'Do（実行結果）', 'Check（分析）', 'Act（改善策）', '次週の重点']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF').setHorizontalAlignment('center').setWrap(true);
  sheet.getRange(27, 1, 50, 6).setWrap(true);

  sheet.setColumnWidth(1, 100); sheet.setColumnWidth(2, 160); sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 200); sheet.setColumnWidth(5, 150); sheet.setColumnWidth(6, 100);

  Logger.log('🤖 AI運用フローシート作成完了');
}


// ============================================================
// データシートのフォーマット整備
// ============================================================
function formatAllSheets(ss) {
  var scSheet = ss.getSheetByName('SearchConsole');
  if (scSheet && scSheet.getLastRow() > 1) {
    if (!scSheet.getFilter()) scSheet.getRange(1, 1, scSheet.getLastRow(), 8).createFilter();
  }

  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    if (!ga4Sheet.getFilter()) ga4Sheet.getRange(1, 1, ga4Sheet.getLastRow(), 7).createFilter();
  }

  var kwSheet = ss.getSheetByName('ターゲットKW順位');
  if (kwSheet && kwSheet.getLastRow() > 1) {
    var kwLastRow = kwSheet.getLastRow();
    var kwLastCol = kwSheet.getLastColumn();
    var dataRange = kwSheet.getRange(2, 2, Math.max(kwLastRow - 1, 1), Math.max(kwLastCol - 1, 1));
    kwSheet.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(0, 3)
        .setBackground('#C8E6C9').setFontColor('#1B5E20').setRanges([dataRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenNumberBetween(3.1, 10)
        .setBackground('#FFF9C4').setFontColor('#F57F17').setRanges([dataRange]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(10)
        .setBackground('#FFCDD2').setFontColor('#B71C1C').setRanges([dataRange]).build(),
    ]);
  }
  Logger.log('フォーマット整備完了');
}


// ============================================================
// 統合ダッシュボード
// ============================================================
function refreshDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('📊 ダッシュボード');
  if (!sheet) { sheet = ss.insertSheet('📊 ダッシュボード', 0); }
  sheet.clear();

  // タイトル
  sheet.getRange('A1:H1').merge().setValue('ストロベリーボーイズ 社内統合ダッシュボード')
    .setFontSize(18).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1a1a2e').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 50);
  sheet.getRange('A2:H2').merge()
    .setValue('SEO × SNS 統合レポート ｜ 最終更新: ' + formatDate(new Date()))
    .setFontSize(10).setFontColor('#666666').setHorizontalAlignment('center').setBackground('#f0f0f0');

  // セクションA: GA4
  var row = 4;
  sheet.getRange('A' + row + ':H' + row).merge().setValue('📈 サイトパフォーマンス（GA4）')
    .setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e').setBackground('#e8eaf6');

  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    sheet.getRange(5, 1, 1, 6).setValues([['日付', 'ユーザー数', 'セッション数', 'PV数', '平均滞在時間', '新規率']])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');
    var ga4Data = ga4Sheet.getDataRange().getValues();
    var latest = {};
    for (var i = 1; i < ga4Data.length; i++) latest[ga4Data[i][1]] = ga4Data[i];
    var dates = Object.keys(latest).sort().reverse().slice(0, 5);
    var r = 6, tU = 0, tS = 0, tP = 0;
    dates.forEach(function(date) {
      var d = latest[date];
      sheet.getRange(r, 1, 1, 6).setValues([[d[1], d[2], d[3], d[4], d[5] + '秒', d[6]]]).setHorizontalAlignment('center');
      if (r % 2 === 0) sheet.getRange(r, 1, 1, 6).setBackground('#f5f5f5');
      tU += Number(d[2]) || 0; tS += Number(d[3]) || 0; tP += Number(d[4]) || 0;
      r++;
    });
    sheet.getRange(r, 1, 1, 6).setValues([['合計', tU, tS, tP, '-', '-']])
      .setFontWeight('bold').setBackground('#e8eaf6').setHorizontalAlignment('center');
  }

  // セクションB: SNS
  row = 13;
  sheet.getRange('A' + row + ':H' + row).merge().setValue('📱 X（SNS）パフォーマンス')
    .setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e').setBackground('#E3F2FD');

  var postSheet = ss.getSheetByName('📱 X投稿ログ');
  if (postSheet && postSheet.getLastRow() > 3) {
    var postData = postSheet.getDataRange().getValues();
    var tPosts = 0, tImp = 0, tEng = 0, tLikes = 0, tRT = 0;
    for (var p = 3; p < postData.length; p++) {
      if (!postData[p][0] || String(postData[p][0]).indexOf('サンプル') !== -1) continue;
      tPosts++; tImp += Number(postData[p][4]) || 0; tEng += Number(postData[p][5]) || 0;
      tLikes += Number(postData[p][6]) || 0; tRT += Number(postData[p][7]) || 0;
    }
    sheet.getRange(row + 1, 1, 1, 2).setValues([['指標', '値']])
      .setFontWeight('bold').setBackground('#90CAF9').setFontColor('#FFFFFF').setHorizontalAlignment('center');
    var avgER = tImp > 0 ? (tEng / tImp * 100).toFixed(2) + '%' : '0%';
    sheet.getRange(row + 2, 1, 5, 2).setValues([
      ['総投稿数', tPosts], ['合計Imp', tImp], ['合計Eng', tEng], ['平均ER', avgER], ['合計RT', tRT]
    ]).setHorizontalAlignment('center');
  } else {
    sheet.getRange(row + 1, 1).setValue('💡 「📱 X投稿ログ」にデータを入力すると集計されます').setFontColor('#999999');
  }

  // セクションC: KW順位
  row = 22;
  sheet.getRange('A' + row + ':H' + row).merge().setValue('🎯 ターゲットキーワード順位')
    .setFontSize(14).setFontWeight('bold').setFontColor('#1a1a2e').setBackground('#e8eaf6');

  var kwSheet = ss.getSheetByName('ターゲットKW順位');
  if (kwSheet && kwSheet.getLastRow() > 1) {
    sheet.getRange(row + 1, 1, 1, 3).setValues([['キーワード', '現在の順位', 'ステータス']])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');
    var kwData = kwSheet.getDataRange().getValues();
    var latestKW = kwData[kwData.length - 1];
    var kwR = row + 2;
    for (var m = 1; m < kwData[0].length; m++) {
      var rank = latestKW[m];
      var status = '圏外', bg = '#FFEBEE';
      if (rank !== '-' && rank !== '' && rank !== null) {
        var rn = parseFloat(rank);
        if (rn <= 3) { status = '🥇 上位表示'; bg = '#E8F5E9'; }
        else if (rn <= 10) { status = '✅ 1ページ目'; bg = '#FFF9C4'; }
        else if (rn <= 20) { status = '📈 改善中'; bg = '#FFF3E0'; }
        else { status = '⚠️ 要改善'; bg = '#FFEBEE'; }
      }
      sheet.getRange(kwR, 1, 1, 3).setValues([[kwData[0][m], rank, status]])
        .setHorizontalAlignment('center').setBackground(bg);
      kwR++;
    }
  }

  sheet.setColumnWidth(1, 200); sheet.setColumnWidth(2, 150); sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 130); sheet.setColumnWidth(5, 130); sheet.setColumnWidth(6, 100);

  Logger.log('📊 ダッシュボード更新完了');
}


// ============================================================
// クライアント共有シートにサマリーを同期
// ============================================================
function syncToClientSheet() {
  try {
    var clientSS = SpreadsheetApp.openById(CLIENT_SHEET_ID);
    var srcSS = SpreadsheetApp.getActiveSpreadsheet();

    // --- ダッシュボードを同期 ---
    var srcDash = srcSS.getSheetByName('📊 ダッシュボード');
    var dstDash = clientSS.getSheetByName('📊 ダッシュボード');
    if (srcDash && dstDash) {
      var data = srcDash.getDataRange().getValues();
      dstDash.clear();
      if (data.length > 0) {
        dstDash.getRange(1, 1, data.length, data[0].length).setValues(data);
      }
      dstDash.getRange('A1:H1').merge().setFontSize(18).setFontWeight('bold')
        .setFontColor('#FFFFFF').setBackground('#1a1a2e').setHorizontalAlignment('center');
      dstDash.getRange('A2:H2').merge().setFontSize(10).setFontColor('#666666')
        .setHorizontalAlignment('center').setBackground('#f0f0f0');
    }

    // --- 生データシートを同期（なければ自動作成） ---
    var dataSheets = ['SearchConsole', 'GA4', 'GA4_流入元', 'ターゲットKW順位'];
    dataSheets.forEach(function(sheetName) {
      var src = srcSS.getSheetByName(sheetName);
      if (!src) {
        Logger.log('同期スキップ（ソースなし）: ' + sheetName);
        return;
      }

      var srcData = src.getDataRange().getValues();
      if (srcData.length === 0) {
        Logger.log('同期スキップ（データなし）: ' + sheetName);
        return;
      }

      // クライアント側にシートがなければ作成
      var dst = clientSS.getSheetByName(sheetName);
      if (!dst) {
        dst = clientSS.insertSheet(sheetName);
        Logger.log('📄 クライアント側にシート作成: ' + sheetName);
      }

      // データを上書き
      dst.clear();
      dst.getRange(1, 1, srcData.length, srcData[0].length).setValues(srcData);

      // ヘッダー行をフォーマット
      dst.getRange(1, 1, 1, srcData[0].length)
        .setFontWeight('bold')
        .setBackground('#2B5797')
        .setFontColor('#FFFFFF');
      dst.setFrozenRows(1);

      Logger.log('✅ 同期完了: ' + sheetName + '（' + srcData.length + '行）');
    });

    Logger.log('📤 クライアントシート同期完了（全シート）');
  } catch (e) {
    Logger.log('クライアントシート同期エラー: ' + e.message);
  }
}


// ============================================================
// トリガー設定
// ============================================================
function createDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'dailyDataCollection') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('dailyDataCollection')
    .timeBased().atHour(6).everyDays(1).create();

  Logger.log('毎朝6時の自動実行トリガーを設定しました');
}


// ============================================================
// ユーティリティ
// ============================================================
function formatDate(d) {
  return Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy-MM-dd');
}

function testSearchConsole() { fetchSearchConsoleData(); }
function testGA4() { fetchGA4Data(); fetchGA4TrafficSources(); }
function debugSearchConsole() {
  var today = new Date();
  var endDate = new Date(today.getTime() - 1 * 86400000);
  var startDate = new Date(today.getTime() - 28 * 86400000);
  var apiUrl = 'https://www.googleapis.com/webmasters/v3/sites/'
    + encodeURIComponent(SITE_URL) + '/searchAnalytics/query';
  var payload = { startDate: formatDate(startDate), endDate: formatDate(endDate), dimensions: ['query'], rowLimit: 10 };
  var options = { method: 'post', contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload), muteHttpExceptions: true };
  var response = UrlFetchApp.fetch(apiUrl, options);
  Logger.log('HTTPステータス: ' + response.getResponseCode());
  Logger.log('レスポンス: ' + response.getContentText());
}
