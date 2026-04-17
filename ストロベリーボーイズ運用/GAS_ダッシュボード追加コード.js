// ============================================================
// クライアント向けダッシュボード＆フォーマット整備
// ============================================================
//
// 【追加手順】
// Apps Scriptで「ファイル」→「+」→「スクリプト」で
// 新しいファイルを作成（名前: ダッシュボード）
// このコードを丸ごと貼り付けて保存
// 関数選択で「setupClientDashboard」を選んで ▶実行
// ============================================================


// ============================================================
// メイン: クライアント向けダッシュボード構築
// ============================================================
function setupClientDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 全データシートにフィルター＆フォーマット適用
  formatAllSheets(ss);

  // 2. ダッシュボードシート作成
  createDashboardSheet(ss);

  // 3. 週次サマリーシート作成
  createWeeklySummarySheet(ss);

  Logger.log('✅ クライアント向けダッシュボード構築完了');
}


// ============================================================
// 全シートのフォーマット整備
// ============================================================
function formatAllSheets(ss) {

  // --- SearchConsole シート ---
  var scSheet = ss.getSheetByName('SearchConsole');
  if (scSheet && scSheet.getLastRow() > 1) {
    // フィルター設定
    var scRange = scSheet.getRange(1, 1, scSheet.getLastRow(), 8);
    if (!scSheet.getFilter()) {
      scRange.createFilter();
    }
    // 数値フォーマット
    var lastRow = scSheet.getLastRow();
    scSheet.getRange(2, 4, lastRow - 1, 1).setNumberFormat('#,##0');   // クリック
    scSheet.getRange(2, 5, lastRow - 1, 1).setNumberFormat('#,##0');   // 表示回数
    // 条件付き書式: ターゲットKW = YES の行をハイライト
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('YES')
      .setBackground('#E8F5E9')
      .setRanges([scSheet.getRange(2, 8, Math.max(lastRow - 1, 1), 1)])
      .build();
    var rules = scSheet.getConditionalFormatRules();
    rules.push(rule);
    scSheet.setConditionalFormatRules(rules);
    // 列幅調整
    scSheet.autoResizeColumns(1, 8);
    Logger.log('SearchConsole フォーマット完了');
  }

  // --- GA4 シート ---
  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    var ga4Range = ga4Sheet.getRange(1, 1, ga4Sheet.getLastRow(), 7);
    if (!ga4Sheet.getFilter()) {
      ga4Range.createFilter();
    }
    var lr = ga4Sheet.getLastRow();
    ga4Sheet.getRange(2, 3, lr - 1, 1).setNumberFormat('#,##0');  // ユーザー
    ga4Sheet.getRange(2, 4, lr - 1, 1).setNumberFormat('#,##0');  // セッション
    ga4Sheet.getRange(2, 5, lr - 1, 1).setNumberFormat('#,##0');  // PV
    ga4Sheet.autoResizeColumns(1, 7);
    Logger.log('GA4 フォーマット完了');
  }

  // --- GA4_流入元 シート ---
  var srcSheet = ss.getSheetByName('GA4_流入元');
  if (srcSheet && srcSheet.getLastRow() > 1) {
    var srcRange = srcSheet.getRange(1, 1, srcSheet.getLastRow(), 5);
    if (!srcSheet.getFilter()) {
      srcRange.createFilter();
    }
    var lr2 = srcSheet.getLastRow();
    srcSheet.getRange(2, 4, lr2 - 1, 1).setNumberFormat('#,##0');
    srcSheet.getRange(2, 5, lr2 - 1, 1).setNumberFormat('#,##0');
    srcSheet.autoResizeColumns(1, 5);
    Logger.log('GA4_流入元 フォーマット完了');
  }

  // --- ターゲットKW順位 シート ---
  var kwSheet = ss.getSheetByName('ターゲットKW順位');
  if (kwSheet && kwSheet.getLastRow() > 1) {
    // 順位の条件付き書式（1-3位: 緑、4-10位: 黄、11位以降: 赤）
    var kwLastRow = kwSheet.getLastRow();
    var kwLastCol = kwSheet.getLastColumn();
    var dataRange = kwSheet.getRange(2, 2, Math.max(kwLastRow - 1, 1), Math.max(kwLastCol - 1, 1));

    var greenRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0, 3)
      .setBackground('#C8E6C9')
      .setFontColor('#1B5E20')
      .setRanges([dataRange])
      .build();
    var yellowRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(3.1, 10)
      .setBackground('#FFF9C4')
      .setFontColor('#F57F17')
      .setRanges([dataRange])
      .build();
    var redRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(10)
      .setBackground('#FFCDD2')
      .setFontColor('#B71C1C')
      .setRanges([dataRange])
      .build();

    kwSheet.setConditionalFormatRules([greenRule, yellowRule, redRule]);
    kwSheet.autoResizeColumns(1, kwLastCol);
    Logger.log('ターゲットKW順位 フォーマット完了');
  }
}


// ============================================================
// ダッシュボード（サマリー）シート作成
// ============================================================
function createDashboardSheet(ss) {
  var sheet = ss.getSheetByName('📊 ダッシュボード');
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet('📊 ダッシュボード', 0);  // 最初のタブに
  }

  // --- タイトル ---
  sheet.getRange('A1').setValue('ストロベリーボーイズ SEOレポート');
  sheet.getRange('A1:H1').merge()
    .setFontSize(18).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#1a1a2e')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 50);

  sheet.getRange('A2').setValue('最終更新: ' + formatDate(new Date()));
  sheet.getRange('A2:H2').merge()
    .setFontSize(10).setFontColor('#666666')
    .setHorizontalAlignment('center').setBackground('#f0f0f0');

  // --- セクション1: GA4 サイトパフォーマンス ---
  sheet.getRange('A4').setValue('📈 サイトパフォーマンス（直近3日間）');
  sheet.getRange('A4:H4').merge()
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(4, 35);

  // GA4データを取得して表示
  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    // ヘッダー
    var metricHeaders = ['日付', 'ユーザー数', 'セッション数', 'PV数', '平均滞在時間', '新規率'];
    sheet.getRange(5, 1, 1, 6).setValues([metricHeaders])
      .setFontWeight('bold').setBackground('#c5cae9').setFontColor('#1a1a2e')
      .setHorizontalAlignment('center');

    // 直近3日分のデータ（重複除去して最新のみ）
    var ga4Data = ga4Sheet.getDataRange().getValues();
    var latestData = {};
    for (var i = 1; i < ga4Data.length; i++) {
      var dateKey = ga4Data[i][1];
      latestData[dateKey] = ga4Data[i];
    }

    var sortedDates = Object.keys(latestData).sort().reverse().slice(0, 3);
    var rowNum = 6;
    var totalUsers = 0, totalSessions = 0, totalPV = 0;

    sortedDates.forEach(function(date) {
      var d = latestData[date];
      sheet.getRange(rowNum, 1, 1, 6).setValues([[
        d[1], d[2], d[3], d[4], d[5] + '秒', d[6]
      ]]).setHorizontalAlignment('center');

      // 偶数行に背景色
      if (rowNum % 2 === 0) {
        sheet.getRange(rowNum, 1, 1, 6).setBackground('#f5f5f5');
      }

      totalUsers += Number(d[2]) || 0;
      totalSessions += Number(d[3]) || 0;
      totalPV += Number(d[4]) || 0;
      rowNum++;
    });

    // 合計行
    sheet.getRange(rowNum, 1, 1, 6).setValues([[
      '合計', totalUsers, totalSessions, totalPV, '-', '-'
    ]]).setFontWeight('bold').setBackground('#e8eaf6').setHorizontalAlignment('center');
    rowNum++;

    // 数値フォーマット
    sheet.getRange(6, 2, rowNum - 6, 3).setNumberFormat('#,##0');
  }

  // --- セクション2: 流入元ランキング ---
  var srcRow = 12;
  sheet.getRange('A' + srcRow).setValue('🔍 流入元ランキング（直近7日間）');
  sheet.getRange('A' + srcRow + ':H' + srcRow).merge()
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(srcRow, 35);

  var srcSheet = ss.getSheetByName('GA4_流入元');
  if (srcSheet && srcSheet.getLastRow() > 1) {
    // 最新の取得日のデータのみ取得
    var srcData = srcSheet.getDataRange().getValues();
    var latestFetchDate = '';
    for (var j = srcData.length - 1; j >= 1; j--) {
      if (srcData[j][0]) {
        latestFetchDate = srcData[j][0];
        break;
      }
    }

    var srcHeaders = ['順位', 'チャネル', 'ソース/メディア', 'セッション数', 'ユーザー数', '構成比'];
    sheet.getRange(srcRow + 1, 1, 1, 6).setValues([srcHeaders])
      .setFontWeight('bold').setBackground('#c5cae9').setFontColor('#1a1a2e')
      .setHorizontalAlignment('center');

    var filteredSrc = [];
    var totalSrcSessions = 0;
    for (var k = 1; k < srcData.length; k++) {
      if (srcData[k][0] === latestFetchDate) {
        filteredSrc.push(srcData[k]);
        totalSrcSessions += Number(srcData[k][3]) || 0;
      }
    }

    // セッション数でソート
    filteredSrc.sort(function(a, b) { return (b[3] || 0) - (a[3] || 0); });

    var srcRowNum = srcRow + 2;
    filteredSrc.slice(0, 10).forEach(function(row, idx) {
      var ratio = totalSrcSessions > 0
        ? ((Number(row[3]) / totalSrcSessions) * 100).toFixed(1) + '%'
        : '0%';
      sheet.getRange(srcRowNum, 1, 1, 6).setValues([[
        idx + 1, row[1], row[2], row[3], row[4], ratio
      ]]).setHorizontalAlignment('center');

      if (srcRowNum % 2 === 0) {
        sheet.getRange(srcRowNum, 1, 1, 6).setBackground('#f5f5f5');
      }
      srcRowNum++;
    });

    sheet.getRange(srcRow + 2, 4, filteredSrc.length, 2).setNumberFormat('#,##0');
  }

  // --- セクション3: ターゲットKW順位 ---
  var kwRow = 25;
  sheet.getRange('A' + kwRow).setValue('🎯 ターゲットキーワード順位');
  sheet.getRange('A' + kwRow + ':H' + kwRow).merge()
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(kwRow, 35);

  var kwSheet = ss.getSheetByName('ターゲットKW順位');
  if (kwSheet && kwSheet.getLastRow() > 1) {
    var kwData = kwSheet.getDataRange().getValues();
    var kwHeaders = kwData[0];
    var latestKW = kwData[kwData.length - 1];

    // 縦表示（見やすいように）
    var kwDisplayHeaders = ['キーワード', '現在の順位', 'ステータス'];
    sheet.getRange(kwRow + 1, 1, 1, 3).setValues([kwDisplayHeaders])
      .setFontWeight('bold').setBackground('#c5cae9').setFontColor('#1a1a2e')
      .setHorizontalAlignment('center');

    var kwRowNum = kwRow + 2;
    for (var m = 1; m < kwHeaders.length; m++) {
      var rank = latestKW[m];
      var status = '';
      var bgColor = '#FFFFFF';

      if (rank === '-' || rank === '' || rank === null) {
        status = '圏外';
        bgColor = '#FFEBEE';
      } else {
        var rankNum = parseFloat(rank);
        if (rankNum <= 3) {
          status = '🥇 上位表示';
          bgColor = '#E8F5E9';
        } else if (rankNum <= 10) {
          status = '✅ 1ページ目';
          bgColor = '#FFF9C4';
        } else if (rankNum <= 20) {
          status = '📈 改善中';
          bgColor = '#FFF3E0';
        } else {
          status = '⚠️ 要改善';
          bgColor = '#FFEBEE';
        }
      }

      sheet.getRange(kwRowNum, 1, 1, 3).setValues([[
        kwHeaders[m], rank, status
      ]]).setHorizontalAlignment('center').setBackground(bgColor);
      kwRowNum++;
    }
  }

  // --- 凡例 ---
  var legendRow = kwRow + 15;
  sheet.getRange('A' + legendRow).setValue('【順位の見方】');
  sheet.getRange('A' + legendRow).setFontWeight('bold');
  sheet.getRange('A' + (legendRow + 1)).setValue('🥇 1〜3位 = 上位表示（理想的）');
  sheet.getRange('A' + (legendRow + 1)).setBackground('#E8F5E9');
  sheet.getRange('A' + (legendRow + 2)).setValue('✅ 4〜10位 = 1ページ目（良好）');
  sheet.getRange('A' + (legendRow + 2)).setBackground('#FFF9C4');
  sheet.getRange('A' + (legendRow + 3)).setValue('📈 11〜20位 = 2ページ目（改善中）');
  sheet.getRange('A' + (legendRow + 3)).setBackground('#FFF3E0');
  sheet.getRange('A' + (legendRow + 4)).setValue('⚠️ 21位以降 or 圏外 = 要改善');
  sheet.getRange('A' + (legendRow + 4)).setBackground('#FFEBEE');

  // 列幅設定
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 100);

  Logger.log('📊 ダッシュボードシート作成完了');
}


// ============================================================
// 週次サマリーシート
// ============================================================
function createWeeklySummarySheet(ss) {
  var sheet = ss.getSheetByName('📋 週次サマリー');
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet('📋 週次サマリー', 1);
  }

  // タイトル
  sheet.getRange('A1').setValue('週次パフォーマンスサマリー');
  sheet.getRange('A1:F1').merge()
    .setFontSize(16).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#1a1a2e')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 45);

  // GA4の週間集計
  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    var ga4Data = ga4Sheet.getDataRange().getValues();

    // 日付ごとの最新データを取得（重複除去）
    var dailyData = {};
    for (var i = 1; i < ga4Data.length; i++) {
      var dateKey = ga4Data[i][1];
      dailyData[dateKey] = {
        users: Number(ga4Data[i][2]) || 0,
        sessions: Number(ga4Data[i][3]) || 0,
        pv: Number(ga4Data[i][4]) || 0,
        duration: parseFloat(ga4Data[i][5]) || 0,
      };
    }

    var dates = Object.keys(dailyData).sort().reverse();

    // 直近7日間のサマリー
    sheet.getRange('A3').setValue('📈 直近データサマリー');
    sheet.getRange('A3:F3').merge()
      .setFontSize(13).setFontWeight('bold').setBackground('#e8eaf6');

    var summaryHeaders = ['指標', '値', '備考'];
    sheet.getRange(4, 1, 1, 3).setValues([summaryHeaders])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');

    var recentDates = dates.slice(0, 7);
    var sumUsers = 0, sumSessions = 0, sumPV = 0, sumDuration = 0, count = 0;
    recentDates.forEach(function(d) {
      sumUsers += dailyData[d].users;
      sumSessions += dailyData[d].sessions;
      sumPV += dailyData[d].pv;
      sumDuration += dailyData[d].duration;
      count++;
    });

    var avgDuration = count > 0 ? (sumDuration / count).toFixed(1) : 0;
    var avgPVperSession = sumSessions > 0 ? (sumPV / sumSessions).toFixed(2) : 0;

    var summaryData = [
      ['合計ユーザー数', sumUsers, recentDates.length + '日間の合計'],
      ['合計セッション数', sumSessions, ''],
      ['合計ページビュー', sumPV, ''],
      ['1日あたりユーザー', count > 0 ? Math.round(sumUsers / count) : 0, '平均値'],
      ['1日あたりPV', count > 0 ? Math.round(sumPV / count) : 0, '平均値'],
      ['平均滞在時間', avgDuration + '秒', '全期間平均'],
      ['PV/セッション', avgPVperSession, '回遊率の指標'],
    ];

    sheet.getRange(5, 1, summaryData.length, 3).setValues(summaryData)
      .setHorizontalAlignment('center');
    sheet.getRange(5, 2, summaryData.length, 1).setNumberFormat('#,##0');

    // 交互行の背景色
    for (var r = 5; r < 5 + summaryData.length; r++) {
      if (r % 2 === 1) {
        sheet.getRange(r, 1, 1, 3).setBackground('#f5f5f5');
      }
    }

    // 日別推移テーブル
    var trendRow = 14;
    sheet.getRange('A' + trendRow).setValue('📊 日別推移');
    sheet.getRange('A' + trendRow + ':F' + trendRow).merge()
      .setFontSize(13).setFontWeight('bold').setBackground('#e8eaf6');

    var trendHeaders = ['日付', 'ユーザー', 'セッション', 'PV', '滞在時間(秒)'];
    sheet.getRange(trendRow + 1, 1, 1, 5).setValues([trendHeaders])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');

    var trendRowNum = trendRow + 2;
    recentDates.forEach(function(d) {
      var dd = dailyData[d];
      sheet.getRange(trendRowNum, 1, 1, 5).setValues([[
        d, dd.users, dd.sessions, dd.pv, dd.duration.toFixed(1)
      ]]).setHorizontalAlignment('center');

      if (trendRowNum % 2 === 0) {
        sheet.getRange(trendRowNum, 1, 1, 5).setBackground('#f5f5f5');
      }
      trendRowNum++;
    });

    sheet.getRange(trendRow + 2, 2, recentDates.length, 3).setNumberFormat('#,##0');
  }

  // 列幅
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 130);

  Logger.log('📋 週次サマリーシート作成完了');
}


// ============================================================
// ダッシュボード自動更新（dailyDataCollectionの後に追加可能）
// ============================================================
function refreshDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  createDashboardSheet(ss);
  createWeeklySummarySheet(ss);
  Logger.log('ダッシュボード更新完了');
}
