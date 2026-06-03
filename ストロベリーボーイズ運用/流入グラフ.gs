// ============================================================
// クライアント向け「流入グラフ」自動生成
// ============================================================
// 目的: 数字が苦手なクライアントでも、サイトへの流入が
//       「増えているか／減っているか」を一目で判断できるようにする。
//
// ★重要：データの重複に対応済み★
//   過去に関数を再実行した等で、同じ「対象日」が複数の「取得日」で
//   ダブって入っていても、対象日ごとに「最新の取得日」の1件だけを
//   採用して集計します（再実行による二重計上を防止）。
//
// 【設置手順】
// 1. Apps Scriptで「ファイル」→「＋」→「スクリプト」で新規ファイル作成
//    （ファイル名: 流入グラフ）
// 2. このコードを丸ごと貼り付けて保存
// 3. 関数選択で「buildTrafficCharts」を選び ▶実行（初回は承認が必要）
// 4. 自動更新したい場合は、dailyDataCollection の最後の行に
//        buildTrafficCharts();
//    を1行追加（毎朝のデータ収集後に自動でグラフ更新）
//
// ※ 関数名は既存の refreshDashboard 等と重複しないよう独自名にしています。
// ============================================================

var CHART_SHEET  = '📈 流入グラフ';
var HELPER_SHEET = '_chartData';

function buildTrafficCharts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- 出力シート準備（既存グラフは消してから作り直す） ---
  var dash = ss.getSheetByName(CHART_SHEET);
  if (dash) {
    dash.getCharts().forEach(function(c){ dash.removeChart(c); });
    dash.clear();
  } else {
    dash = ss.insertSheet(CHART_SHEET, 0); // 先頭タブに
  }

  var helper = ss.getSheetByName(HELPER_SHEET);
  if (helper) { helper.clear(); helper.showSheet(); }
  else { helper = ss.insertSheet(HELPER_SHEET); }

  // --- データ集計（重複除去込み） ---
  var ga4 = dedupeGA4(ss.getSheetByName('GA4'));               // [{date,users,sessions,pv}]
  var sc  = dedupeSCClicks(ss.getSheetByName('SearchConsole')); // [{date,clicks,impressions}]

  // --- グラフ元データをヘルパーシートに整形して書き出し ---
  helper.getRange(1,1,1,2).setValues([['日付','セッション数']]);
  if (ga4.length) {
    helper.getRange(2,1,ga4.length,2).setValues(
      ga4.map(function(r){ return [r.date, r.sessions]; }));
  }
  helper.getRange(1,4,1,2).setValues([['日付','クリック数']]);
  if (sc.length) {
    helper.getRange(2,4,sc.length,2).setValues(
      sc.map(function(r){ return [r.date, r.clicks]; }));
  }

  // --- タイトル ---
  dash.getRange('A1').setValue('ストロベリーボーイズ｜流入トレンド');
  dash.getRange('A1:H1').merge()
    .setFontSize(18).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#1a1a2e')
    .setHorizontalAlignment('center');
  dash.setRowHeight(1, 50);
  dash.getRange('A2:H2').merge()
    .setValue('最終更新: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy/MM/dd HH:mm'))
    .setFontColor('#888888').setHorizontalAlignment('center');

  // --- ① 判定バナー（セッション前週比で増減を判定） ---
  drawVerdictBanner(dash, 4, weekOverWeek(ga4, 'sessions'));

  // --- ② KPIカード ---
  drawKpiCards(dash, 7, ga4, sc);

  // --- ③ セッション推移グラフ ---
  dash.getRange('A11:H11').merge()
    .setValue('■ サイト全体のセッション数（流入）の推移')
    .setFontSize(13).setFontWeight('bold').setBackground('#e8eaf6');
  if (ga4.length) {
    dash.insertChart(
      dash.newChart().setChartType(Charts.ChartType.LINE)
        .addRange(helper.getRange(1,1,ga4.length+1,2))
        .setPosition(12, 1, 5, 5)
        .setOption('title', 'セッション数の推移（日別・重複除去済み）')
        .setOption('width', 760).setOption('height', 340)
        .setOption('legend', {position:'none'})
        .setOption('colors', ['#3949ab'])
        .setOption('pointSize', 5).setOption('lineWidth', 3)
        .setOption('curveType', 'function')
        .build());
  }

  // --- ④ 検索クリック推移グラフ ---
  dash.getRange('A30:H30').merge()
    .setValue('■ 検索からの流入（クリック数）の推移')
    .setFontSize(13).setFontWeight('bold').setBackground('#e8eaf6');
  if (sc.length) {
    dash.insertChart(
      dash.newChart().setChartType(Charts.ChartType.LINE)
        .addRange(helper.getRange(1,4,sc.length+1,2))
        .setPosition(31, 1, 5, 5)
        .setOption('title', '検索クリック数の推移（日別・重複除去済み）')
        .setOption('width', 760).setOption('height', 340)
        .setOption('legend', {position:'none'})
        .setOption('colors', ['#00897b'])
        .setOption('pointSize', 5).setOption('lineWidth', 3)
        .setOption('curveType', 'function')
        .build());
  }

  dash.setColumnWidth(1, 150);
  helper.hideSheet();      // 元データシートは隠す
  SpreadsheetApp.flush();
  Logger.log('✅ 流入グラフ作成完了（GA4 ' + ga4.length + '日分 / SC ' + sc.length + '日分）');
}

// ---- 判定バナー ----
function drawVerdictBanner(sheet, row, w) {
  var msg, bg, fc;
  if (w.pct === null) {
    msg = 'データがもう少し溜まると前週比を表示します';            bg='#eeeeee'; fc='#555555';
  } else if (w.pct >= 3) {
    msg = '📈 流入は増えています（前週比 ' + fmtPct(w.pct) + '）';    bg='#C8E6C9'; fc='#1B5E20';
  } else if (w.pct <= -3) {
    msg = '📉 流入は減っています（前週比 ' + fmtPct(w.pct) + '）';    bg='#FFCDD2'; fc='#B71C1C';
  } else {
    msg = '➡️ 流入はほぼ横ばいです（前週比 ' + fmtPct(w.pct) + '）';  bg='#FFF9C4'; fc='#F57F17';
  }
  sheet.getRange(row,1,1,8).merge().setValue(msg)
    .setFontSize(16).setFontWeight('bold')
    .setBackground(bg).setFontColor(fc).setHorizontalAlignment('center');
  sheet.setRowHeight(row, 48);
}

// ---- KPIカード（3枚） ----
function drawKpiCards(sheet, row, ga4, sc) {
  var cards = [
    {label:'直近7日 セッション',   w:weekOverWeek(ga4,'sessions')},
    {label:'直近7日 ユーザー',     w:weekOverWeek(ga4,'users')},
    {label:'直近7日 検索クリック', w:weekOverWeek(sc,'clicks')}
  ];
  var col = 1;
  cards.forEach(function(c){
    sheet.getRange(row,   col,1,2).merge().setValue(c.label)
      .setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold')
      .setHorizontalAlignment('center');
    sheet.getRange(row+1, col,1,2).merge().setValue(c.w.recent).setNumberFormat('#,##0')
      .setFontSize(22).setFontWeight('bold').setBackground('#f5f5f5')
      .setHorizontalAlignment('center');
    var t = (c.w.pct===null) ? '前週比 —'
          : '前週比 ' + (c.w.pct>=0?'▲ ':'▼ ') + fmtPct(c.w.pct);
    var fc = (c.w.pct===null) ? '#888888' : (c.w.pct>=0 ? '#1B5E20' : '#B71C1C');
    sheet.getRange(row+2, col,1,2).merge().setValue(t)
      .setFontColor(fc).setFontWeight('bold').setBackground('#f5f5f5')
      .setHorizontalAlignment('center');
    col += 3;
  });
}

// ---- GA4 重複除去：対象日(B列)ごとに取得日(A列)が最新の1件のみ ----
function dedupeGA4(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getDataRange().getValues();
  var map = {};
  for (var i=1;i<data.length;i++){
    var fetch  = toDateKey(data[i][0]);  // A: 取得日
    var target = toDateKey(data[i][1]);  // B: 対象日
    if (!target) continue;
    if (!map[target] || fetch > map[target].fetch) {
      map[target] = { fetch:fetch, users:num(data[i][2]), sessions:num(data[i][3]), pv:num(data[i][4]) };
    }
  }
  return Object.keys(map).sort().map(function(k){
    return { date:k, users:map[k].users, sessions:map[k].sessions, pv:map[k].pv };
  });
}

// ---- SearchConsole 重複除去：対象日ごとに最新取得日の行だけクリック合算 ----
function dedupeSCClicks(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  var data = sheet.getDataRange().getValues();
  var maxFetch = {};                         // 対象日 → 最新取得日
  for (var i=1;i<data.length;i++){
    var t = toDateKey(data[i][1]), f = toDateKey(data[i][0]);
    if (!t) continue;
    if (!maxFetch[t] || f > maxFetch[t]) maxFetch[t] = f;
  }
  var agg = {};
  for (var j=1;j<data.length;j++){
    var t2 = toDateKey(data[j][1]), f2 = toDateKey(data[j][0]);
    if (!t2 || f2 !== maxFetch[t2]) continue; // 最新取得バッチの行のみ採用
    if (!agg[t2]) agg[t2] = { clicks:0, impressions:0 };
    agg[t2].clicks      += num(data[j][3]);   // D: クリック数
    agg[t2].impressions += num(data[j][4]);   // E: 表示回数
  }
  return Object.keys(agg).sort().map(function(k){
    return { date:k, clicks:agg[k].clicks, impressions:agg[k].impressions };
  });
}

// ---- 前週比：直近7データ点 vs その前7データ点 ----
function weekOverWeek(series, field) {
  var n = series.length;
  if (n < 2) return { recent: n?series[n-1][field]:0, prev:0, pct:null };
  var recent = series.slice(Math.max(0, n-7));
  var prev   = series.slice(Math.max(0, n-14), Math.max(0, n-7));
  var sr = recent.reduce(function(a,b){ return a+(b[field]||0); }, 0);
  var sp = prev.reduce(function(a,b){ return a+(b[field]||0); }, 0);
  return { recent:sr, prev:sp, pct: sp>0 ? ((sr-sp)/sp*100) : null };
}

// ---- ユーティリティ ----
function toDateKey(v){
  if (v === '' || v === null || v === undefined) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  var s = String(v).trim().replace(/\//g,'-');
  var p = s.split('-');
  if (p.length === 3) return p[0] + '-' + ('0'+p[1]).slice(-2) + '-' + ('0'+p[2]).slice(-2);
  return s;
}
function num(v){ var n = Number(String(v).replace(/[^0-9.\-]/g,'')); return isNaN(n)?0:n; }
function fmtPct(p){ return (p>=0?'+':'') + p.toFixed(1) + '%'; }
