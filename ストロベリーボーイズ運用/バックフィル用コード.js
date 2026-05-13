// ============================================================
// バックフィル用（一時的に使用 → 完了後に削除してOK）
// 4/24〜5/12 の欠損GA4データを一括取得
// ============================================================
//
// 【使い方】
// 1. このコードを コード.gs の一番下にコピペ
// 2. 関数選択で「backfillData」を選んで ▶実行
// 3. 完了後、このコードは削除してOK
//
// ※ Search Consoleは過去28日分を取得するので、
//   通常のdailyDataCollectionを1回実行すれば埋まります。
//   このバックフィルはGA4とGA4流入元の欠損を埋めるためのものです。
// ============================================================

function backfillData() {
  Logger.log('=== バックフィル開始 ===');

  // --- GA4基本データ: 4/24〜5/11を一括取得 ---
  backfillGA4();

  // --- GA4流入元: 週単位で3回に分けて取得 ---
  backfillGA4TrafficSources();

  // --- Search Console: 通常実行で過去28日取れるのでそのまま呼ぶ ---
  fetchSearchConsoleData();

  // --- KW順位・メディアSCも更新 ---
  updateTargetKWRanking();
  fetchMediaSCData();
  updateMediaKWRanking();

  // --- ダッシュボード更新 ---
  refreshDashboard();

  // --- クライアントシート同期 ---
  syncToClientSheet();

  Logger.log('=== バックフィル完了 ===');
}


function backfillGA4() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4');
  if (!sheet) { sheet = ss.insertSheet('GA4'); }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['取得日', '対象日', 'アクティブユーザー', 'セッション数', 'PV数', '平均セッション時間(秒)', '新規ユーザー率']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  // 4月24日〜昨日までを一括で取得
  var startDate = '2026-04-24';
  var endDate = formatDate(new Date(new Date().getTime() - 86400000)); // 昨日

  var request = AnalyticsData.newRunReportRequest();
  request.dateRanges = [AnalyticsData.newDateRange()];
  request.dateRanges[0].startDate = startDate;
  request.dateRanges[0].endDate = endDate;
  request.dimensions = [{ name: 'date' }];
  request.metrics = [
    { name: 'activeUsers' }, { name: 'sessions' },
    { name: 'screenPageViews' }, { name: 'averageSessionDuration' },
    { name: 'newUsers' },
  ];

  try {
    var response = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
    if (!response.rows) { Logger.log('GA4バックフィル: データなし'); return; }

    var fetchDate = formatDate(new Date());
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
    Logger.log('GA4バックフィル: ' + rows.length + '行追加（' + startDate + '〜' + endDate + '）');
  } catch (e) {
    Logger.log('GA4バックフィルエラー: ' + e.message);
  }
}


function backfillGA4TrafficSources() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('GA4_流入元');
  if (!sheet) {
    sheet = ss.insertSheet('GA4_流入元');
    sheet.appendRow(['取得日', 'チャネル', 'ソース/メディア', 'セッション数', 'ユーザー数']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#2B5797').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }

  // 週単位で分割して取得（API制限回避）
  var periods = [
    { start: '2026-04-24', end: '2026-04-30', label: '4月末' },
    { start: '2026-05-01', end: '2026-05-07', label: '5月第1週' },
    { start: '2026-05-08', end: formatDate(new Date(new Date().getTime() - 86400000)), label: '5月第2週' },
  ];

  var fetchDate = formatDate(new Date());

  periods.forEach(function(period) {
    var request = AnalyticsData.newRunReportRequest();
    request.dateRanges = [AnalyticsData.newDateRange()];
    request.dateRanges[0].startDate = period.start;
    request.dateRanges[0].endDate = period.end;
    request.dimensions = [{ name: 'sessionDefaultChannelGroup' }, { name: 'sessionSourceMedium' }];
    request.metrics = [{ name: 'sessions' }, { name: 'activeUsers' }];
    request.orderBys = [{ metric: { metricName: 'sessions' }, desc: true }];
    request.limit = 50;

    try {
      var response = AnalyticsData.Properties.runReport(request, 'properties/' + GA4_PROPERTY_ID);
      if (!response.rows) return;

      var rows = response.rows.map(function(r) {
        return [fetchDate + ' (' + period.label + ')',
          r.dimensionValues[0].value, r.dimensionValues[1].value,
          parseInt(r.metricValues[0].value), parseInt(r.metricValues[1].value)];
      });

      var lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, rows.length, 5).setValues(rows);
      Logger.log('GA4流入元バックフィル [' + period.label + ']: ' + rows.length + '行追加');
    } catch (e) {
      Logger.log('GA4流入元バックフィルエラー [' + period.label + ']: ' + e.message);
    }

    // API制限回避のため1秒待機
    Utilities.sleep(1000);
  });
}
