// ============================================================
// SEO × SNS 統合シート追加コード
// ============================================================
//
// 【追加手順】
// Apps Scriptで「ファイル」→「+」→「スクリプト」で
// 新しいファイルを作成（名前: SNS統合）
// このコードを丸ごと貼り付けて保存
// 関数選択で「setupSNSIntegration」を選んで ▶実行
// ============================================================


// ============================================================
// メイン: SNS統合シート一括構築
// ============================================================
function setupSNSIntegration() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  createPostLogSheet(ss);
  createIntelligenceSheet(ss);
  createAIWorkflowSheet(ss);
  updateIntegratedDashboard(ss);

  Logger.log('✅ SEO × SNS 統合シート構築完了');
}


// ============================================================
// 1. X投稿ログシート
// ============================================================
function createPostLogSheet(ss) {
  var sheet = ss.getSheetByName('📱 X投稿ログ');
  if (sheet) {
    // 既存データ保持のためスキップ
    Logger.log('📱 X投稿ログ: 既存シートをスキップ');
    return;
  }
  sheet = ss.insertSheet('📱 X投稿ログ');

  // --- タイトル ---
  sheet.getRange('A1:I1').merge()
    .setValue('X（Twitter）投稿ログ')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#1DA1F2')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  // --- 入力ガイド ---
  sheet.getRange('A2:I2').merge()
    .setValue('💡 毎日の投稿データをここに記録 → ダッシュボードに自動反映されます')
    .setFontSize(9).setFontColor('#666666').setBackground('#f0f8ff');

  // --- ヘッダー ---
  var headers = [
    '日付', '時間帯', 'ピラー', '投稿テキスト（冒頭40字）',
    'Imp', 'Eng', 'いいね', 'RT', 'ER(%)'
  ];
  sheet.getRange(3, 1, 1, 9).setValues([headers])
    .setFontWeight('bold').setBackground('#1DA1F2').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');
  sheet.setFrozenRows(3);

  // --- ピラーのデータ入力規則 ---
  var pillarRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      '共感・エンパワメント',
      'ブランド・キャスト紹介',
      'お役立ち・コラム',
      'キャンペーン・イベント',
      'インタラクション'
    ])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(4, 3, 500, 1).setDataValidation(pillarRule);

  // --- 時間帯のデータ入力規則 ---
  var timeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['朝(7時)', '昼(12時)', '夕(19時)', '夜1(22時)', '夜2(23時)'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange(4, 2, 500, 1).setDataValidation(timeRule);

  // --- ER自動計算式（4行目から503行目まで） ---
  for (var i = 4; i <= 103; i++) {
    sheet.getRange(i, 9).setFormula(
      '=IF(E' + i + '>0, ROUND(F' + i + '/E' + i + '*100, 2), "")'
    );
  }

  // --- 条件付き書式: ER 3%以上を緑 ---
  var erRange = sheet.getRange(4, 9, 500, 1);
  var highER = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(3)
    .setBackground('#C8E6C9').setFontColor('#1B5E20')
    .setRanges([erRange]).build();
  var lowER = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(1)
    .setBackground('#FFCDD2').setFontColor('#B71C1C')
    .setRanges([erRange]).build();
  sheet.setConditionalFormatRules([highER, lowER]);

  // --- 列幅 ---
  sheet.setColumnWidth(1, 100);  // 日付
  sheet.setColumnWidth(2, 100);  // 時間帯
  sheet.setColumnWidth(3, 160);  // ピラー
  sheet.setColumnWidth(4, 300);  // テキスト
  sheet.setColumnWidth(5, 80);   // Imp
  sheet.setColumnWidth(6, 80);   // Eng
  sheet.setColumnWidth(7, 70);   // いいね
  sheet.setColumnWidth(8, 60);   // RT
  sheet.setColumnWidth(9, 80);   // ER

  // --- フィルター ---
  sheet.getRange(3, 1, 1, 9).createFilter();

  // --- 数値フォーマット ---
  sheet.getRange(4, 5, 500, 2).setNumberFormat('#,##0');

  // --- サンプルデータ（使い方の参考） ---
  sheet.getRange(4, 1, 1, 8).setValues([[
    formatDate(new Date()), '朝(7時)', '共感・エンパワメント',
    '（サンプル）自分へのご褒美、大切にしてますか？...',
    150, 8, 5, 1
  ]]).setFontColor('#999999');

  Logger.log('📱 X投稿ログシート作成完了');
}


// ============================================================
// 2. インテリジェンスシート
// ============================================================
function createIntelligenceSheet(ss) {
  var sheet = ss.getSheetByName('🧠 インテリジェンス');
  if (sheet) {
    Logger.log('🧠 インテリジェンス: 既存シートをスキップ');
    return;
  }
  sheet = ss.insertSheet('🧠 インテリジェンス');

  // --- タイトル ---
  sheet.getRange('A1:G1').merge()
    .setValue('マーケットインテリジェンス')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#6A1B9A')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  // ===== セクション1: 競合バズ分析（Grok収集） =====
  var row = 3;
  sheet.getRange('A' + row + ':G' + row).merge()
    .setValue('🔥 競合バズ投稿分析（Grok収集 / 週2回）')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#F3E5F5').setFontColor('#4A148C');
  sheet.setRowHeight(row, 32);

  row = 4;
  var buzzHeaders = ['日付', 'アカウント', 'バズ要因', '推定Imp', '活用ポイント', '自社転用案', 'ステータス'];
  sheet.getRange(row, 1, 1, 7).setValues([buzzHeaders])
    .setFontWeight('bold').setBackground('#CE93D8').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  // ステータスのドロップダウン
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未対応', '検討中', '採用', '見送り'])
    .setAllowInvalid(false).build();
  sheet.getRange(5, 7, 100, 1).setDataValidation(statusRule);

  // 条件付き書式
  var adoptedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('採用')
    .setBackground('#E8F5E9').setFontColor('#1B5E20')
    .setRanges([sheet.getRange(5, 7, 100, 1)]).build();
  sheet.setConditionalFormatRules([adoptedRule]);

  // サンプル
  sheet.getRange(5, 1, 1, 7).setValues([[
    '（サンプル）', '@competitor_xx', '共感ストーリー型',
    '5,000+', 'ストーリーテリングが効果的', '自社キャストの成長ストーリーに転用', '検討中'
  ]]).setFontColor('#999999');

  // ===== セクション2: トレンド・時事（Perplexity） =====
  row = 20;
  sheet.getRange('A' + row + ':G' + row).merge()
    .setValue('📰 トレンド・時事ネタ（Perplexity収集 / 週1回）')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#E3F2FD').setFontColor('#0D47A1');
  sheet.setRowHeight(row, 32);

  row = 21;
  var trendHeaders = ['日付', 'カテゴリ', '概要', 'ソースURL', '投稿転用案', 'ピラー', 'ステータス'];
  sheet.getRange(row, 1, 1, 7).setValues([trendHeaders])
    .setFontWeight('bold').setBackground('#90CAF9').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  // カテゴリのドロップダウン
  var catRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['業界トレンド', 'メンタルヘルス', 'セルフケア', '地域情報（横浜）', '地域情報（福岡）', '季節イベント', 'その他'])
    .setAllowInvalid(false).build();
  sheet.getRange(22, 2, 100, 1).setDataValidation(catRule);

  sheet.getRange(22, 7, 100, 1).setDataValidation(statusRule);

  // ===== セクション3: Xアルゴリズム変動ログ =====
  row = 37;
  sheet.getRange('A' + row + ':G' + row).merge()
    .setValue('⚙️ Xアルゴリズム変動ログ（Grok確認 / 月2回）')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#FFF3E0').setFontColor('#E65100');
  sheet.setRowHeight(row, 32);

  row = 38;
  var algoHeaders = ['確認日', '変更内容', '影響度', '影響範囲', '対応アクション', '対応状況', '効果'];
  sheet.getRange(row, 1, 1, 7).setValues([algoHeaders])
    .setFontWeight('bold').setBackground('#FFB74D').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  // 影響度のドロップダウン
  var impactRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['高', '中', '低'])
    .setAllowInvalid(false).build();
  sheet.getRange(39, 3, 50, 1).setDataValidation(impactRule);

  var doneRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未対応', '対応中', '完了'])
    .setAllowInvalid(false).build();
  sheet.getRange(39, 6, 50, 1).setDataValidation(doneRule);

  // ===== セクション4: Grok vs Perplexity 使い分けガイド =====
  row = 52;
  sheet.getRange('A' + row + ':G' + row).merge()
    .setValue('📖 Grok vs Perplexity 使い分けガイド')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#E8EAF6').setFontColor('#283593');
  sheet.setRowHeight(row, 32);

  row = 53;
  sheet.getRange(row, 1, 1, 4).setValues([['用途', '最適ツール', '理由', '頻度']])
    .setFontWeight('bold').setBackground('#9FA8DA').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  var guideData = [
    ['競合バズ投稿分析', 'Grok', 'X内部データにアクセス可能、リアルタイムX投稿に強い', '週2回'],
    ['Xアルゴリズム最新動向', 'Grok', 'X関連AIなのでアルゴリズム変更をいち早く反映', '月2回'],
    ['ターゲット層の話題・関心', 'Grok', 'リアルタイムのX上での会話トレンド分析', '週1回'],
    ['業界トレンド・市場データ', 'Perplexity', '引用付きで信頼性が高い、リサーチ向きデータ', '週1回'],
    ['横浜/福岡の地域情報', 'Perplexity', '地域情報の網羅性が高い、ソースURL確認可能', '月2回'],
    ['記事一次情報・統計', 'Perplexity', '学術・政府統計へのアクセスに強い', '記事執筆時'],
  ];
  sheet.getRange(54, 1, guideData.length, 4).setValues(guideData);

  // 交互行の背景色
  for (var g = 54; g < 54 + guideData.length; g++) {
    if (g % 2 === 0) {
      sheet.getRange(g, 1, 1, 4).setBackground('#f5f5f5');
    }
  }

  // 列幅
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 130);
  sheet.setColumnWidth(3, 250);
  sheet.setColumnWidth(4, 100);
  sheet.setColumnWidth(5, 250);
  sheet.setColumnWidth(6, 150);
  sheet.setColumnWidth(7, 100);

  Logger.log('🧠 インテリジェンスシート作成完了');
}


// ============================================================
// 3. AI運用フローシート
// ============================================================
function createAIWorkflowSheet(ss) {
  var sheet = ss.getSheetByName('🤖 AI運用フロー');
  if (sheet) {
    Logger.log('🤖 AI運用フロー: 既存シートをスキップ');
    return;
  }
  sheet = ss.insertSheet('🤖 AI運用フロー');

  // --- タイトル ---
  sheet.getRange('A1:F1').merge()
    .setValue('AI自動化 運用フロー')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#00695C')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 40);

  // ===== 毎日の運用フロー =====
  var row = 3;
  sheet.getRange('A' + row + ':F' + row).merge()
    .setValue('📅 毎日の運用フロー')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.setRowHeight(row, 32);

  row = 4;
  sheet.getRange(row, 1, 1, 6)
    .setValues([['時間', '担当', 'タスク', '詳細', '所要時間', 'チェック']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  var dailyFlow = [
    ['6:00', '🤖 自動', 'データ収集', 'GASがSearch Console/GA4データをスプレッドシートに自動取得', '-', '☐'],
    ['7:00', '🤖 自動', 'X投稿案生成', 'Coworkスケジュールタスクが5本の投稿案を.mdで出力', '-', '☐'],
    ['7:00-7:30', '👤 手動(5分)', '投稿案レビュー', '生成された投稿案を確認、朝の投稿を実行', '5分', '☐'],
    ['12:00', '👤 手動(1分)', '昼投稿', '予定の投稿を実行', '1分', '☐'],
    ['19:00', '👤 手動(1分)', '夕方投稿', '予定の投稿を実行', '1分', '☐'],
    ['22:00', '👤 手動(1分)', '夜投稿①', '予定の投稿を実行', '1分', '☐'],
    ['23:00', '👤 手動(1分)', '夜投稿②', '予定の投稿を実行', '1分', '☐'],
    ['翌朝', '👤 手動(3分)', 'データ記録', 'X Analyticsの数値を「📱 X投稿ログ」に転記', '3分', '☐'],
  ];

  sheet.getRange(5, 1, dailyFlow.length, 6).setValues(dailyFlow)
    .setHorizontalAlignment('center').setVerticalAlignment('middle');

  // 自動タスクの背景色
  for (var d = 5; d < 5 + dailyFlow.length; d++) {
    if (dailyFlow[d - 5][1].indexOf('自動') !== -1) {
      sheet.getRange(d, 1, 1, 6).setBackground('#E8F5E9');
    } else {
      sheet.getRange(d, 1, 1, 6).setBackground(d % 2 === 0 ? '#f5f5f5' : '#FFFFFF');
    }
  }

  // チェックボックス
  var checkboxRule = SpreadsheetApp.newDataValidation()
    .requireCheckbox()
    .build();
  sheet.getRange(5, 6, dailyFlow.length, 1).setDataValidation(checkboxRule);

  // ===== 週次インテリジェンス収集フロー =====
  row = 16;
  sheet.getRange('A' + row + ':F' + row).merge()
    .setValue('📊 週次インテリジェンス収集フロー')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.setRowHeight(row, 32);

  row = 17;
  sheet.getRange(row, 1, 1, 6)
    .setValues([['頻度', 'ツール', 'タスク', '手順', '記録先', '所要時間']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center');

  var weeklyFlow = [
    ['週2回', 'Grok', '競合バズ分析', 'Grokにプロンプト → 結果を記録', '🧠 インテリジェンス > 競合バズ', '10分'],
    ['週1回', 'Perplexity', 'トレンド収集', 'Perplexityで業界・地域トレンド検索 → 記録', '🧠 インテリジェンス > トレンド', '10分'],
    ['月2回', 'Grok', 'アルゴリズム確認', 'Grokでアルゴリズム変更確認 → 運用ルール更新', '🧠 インテリジェンス > アルゴリズム', '5分'],
    ['週1回', '-', 'PDCA振り返り', '投稿ログのER分析 → 次週の改善ポイント特定', '📱 X投稿ログで分析', '15分'],
  ];

  sheet.getRange(18, 1, weeklyFlow.length, 6).setValues(weeklyFlow)
    .setHorizontalAlignment('center');

  for (var w = 18; w < 18 + weeklyFlow.length; w++) {
    sheet.getRange(w, 1, 1, 6).setBackground(w % 2 === 0 ? '#f5f5f5' : '#FFFFFF');
  }

  // ===== PDCAサイクル記録 =====
  row = 25;
  sheet.getRange('A' + row + ':F' + row).merge()
    .setValue('🔄 PDCAサイクル記録（週次振り返り）')
    .setFontSize(12).setFontWeight('bold')
    .setBackground('#E0F2F1').setFontColor('#004D40');
  sheet.setRowHeight(row, 32);

  row = 26;
  sheet.getRange(row, 1, 1, 6)
    .setValues([['週', 'Plan（計画）', 'Do（実行結果）', 'Check（分析）', 'Act（改善策）', '次週の重点']])
    .setFontWeight('bold').setBackground('#80CBC4').setFontColor('#FFFFFF')
    .setHorizontalAlignment('center').setWrap(true);

  // サンプル
  sheet.getRange(27, 1, 1, 6).setValues([[
    '（サンプル）4/14-4/20',
    '共感系を朝に集中投稿',
    'Imp平均150、ER 2.1%',
    '夜の方がER高い傾向',
    '共感系を22時に変更',
    '時間帯最適化テスト'
  ]]).setFontColor('#999999').setWrap(true);

  // 列幅
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 200);
  sheet.setColumnWidth(5, 100);
  sheet.setColumnWidth(6, 100);

  // 全セルの折り返し
  sheet.getRange(27, 1, 50, 6).setWrap(true);

  Logger.log('🤖 AI運用フローシート作成完了');
}


// ============================================================
// 4. 統合ダッシュボード更新（SEO + SNS）
// ============================================================
function updateIntegratedDashboard(ss) {
  var sheet = ss.getSheetByName('📊 ダッシュボード');
  if (!sheet) {
    sheet = ss.insertSheet('📊 ダッシュボード', 0);
  }
  sheet.clear();

  // --- タイトル ---
  sheet.getRange('A1:H1').merge()
    .setValue('ストロベリーボーイズ 統合ダッシュボード')
    .setFontSize(18).setFontWeight('bold')
    .setFontColor('#FFFFFF').setBackground('#1a1a2e')
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 50);

  sheet.getRange('A2:H2').merge()
    .setValue('SEO × SNS 統合レポート ｜ 最終更新: ' + formatDate(new Date()))
    .setFontSize(10).setFontColor('#666666')
    .setHorizontalAlignment('center').setBackground('#f0f0f0');

  // ============================
  // セクションA: サイトパフォーマンス（GA4）
  // ============================
  var row = 4;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📈 サイトパフォーマンス（GA4）')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(row, 35);

  var ga4Sheet = ss.getSheetByName('GA4');
  if (ga4Sheet && ga4Sheet.getLastRow() > 1) {
    var ga4Headers = ['日付', 'ユーザー数', 'セッション数', 'PV数', '平均滞在時間', '新規率'];
    sheet.getRange(5, 1, 1, 6).setValues([ga4Headers])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');

    var ga4Data = ga4Sheet.getDataRange().getValues();
    var latestGA4 = {};
    for (var i = 1; i < ga4Data.length; i++) {
      latestGA4[ga4Data[i][1]] = ga4Data[i];
    }
    var ga4Dates = Object.keys(latestGA4).sort().reverse().slice(0, 5);
    var ga4Row = 6;
    var totU = 0, totS = 0, totPV = 0;

    ga4Dates.forEach(function(date) {
      var d = latestGA4[date];
      sheet.getRange(ga4Row, 1, 1, 6).setValues([[
        d[1], d[2], d[3], d[4], d[5] + '秒', d[6]
      ]]).setHorizontalAlignment('center');
      if (ga4Row % 2 === 0) sheet.getRange(ga4Row, 1, 1, 6).setBackground('#f5f5f5');
      totU += Number(d[2]) || 0;
      totS += Number(d[3]) || 0;
      totPV += Number(d[4]) || 0;
      ga4Row++;
    });

    sheet.getRange(ga4Row, 1, 1, 6).setValues([['合計', totU, totS, totPV, '-', '-']])
      .setFontWeight('bold').setBackground('#e8eaf6').setHorizontalAlignment('center');
    sheet.getRange(6, 2, ga4Row - 5, 3).setNumberFormat('#,##0');
  }

  // ============================
  // セクションB: SNSパフォーマンス（X投稿ログから集計）
  // ============================
  row = 13;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📱 X（SNS）パフォーマンス')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#E3F2FD');
  sheet.setRowHeight(row, 35);

  var postSheet = ss.getSheetByName('📱 X投稿ログ');
  if (postSheet && postSheet.getLastRow() > 3) {
    var postData = postSheet.getDataRange().getValues();

    // 集計
    var totalPosts = 0, totalImp = 0, totalEng = 0, totalLikes = 0, totalRT = 0;
    var pillarStats = {};

    for (var p = 3; p < postData.length; p++) {
      if (!postData[p][0] || String(postData[p][0]).indexOf('サンプル') !== -1) continue;
      totalPosts++;
      totalImp += Number(postData[p][4]) || 0;
      totalEng += Number(postData[p][5]) || 0;
      totalLikes += Number(postData[p][6]) || 0;
      totalRT += Number(postData[p][7]) || 0;

      var pillar = postData[p][2];
      if (pillar) {
        if (!pillarStats[pillar]) {
          pillarStats[pillar] = { posts: 0, imp: 0, eng: 0 };
        }
        pillarStats[pillar].posts++;
        pillarStats[pillar].imp += Number(postData[p][4]) || 0;
        pillarStats[pillar].eng += Number(postData[p][5]) || 0;
      }
    }

    // KPIカード
    var snsHeaders = ['指標', '値'];
    sheet.getRange(row + 1, 1, 1, 2).setValues([snsHeaders])
      .setFontWeight('bold').setBackground('#90CAF9').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');

    var avgER = totalImp > 0 ? (totalEng / totalImp * 100).toFixed(2) + '%' : '0%';
    var avgImp = totalPosts > 0 ? Math.round(totalImp / totalPosts) : 0;

    var snsKPIs = [
      ['総投稿数', totalPosts],
      ['合計インプレッション', totalImp],
      ['合計エンゲージメント', totalEng],
      ['平均ER', avgER],
      ['平均Imp/投稿', avgImp],
      ['合計いいね', totalLikes],
      ['合計RT', totalRT],
    ];

    sheet.getRange(row + 2, 1, snsKPIs.length, 2).setValues(snsKPIs)
      .setHorizontalAlignment('center');
    sheet.getRange(row + 2, 2, snsKPIs.length, 1).setNumberFormat('#,##0');

    // ピラー別パフォーマンス
    var pillarRow = row + 10;
    sheet.getRange('A' + pillarRow + ':H' + pillarRow).merge()
      .setValue('🏷️ ピラー別パフォーマンス')
      .setFontSize(12).setFontWeight('bold').setBackground('#E3F2FD');

    sheet.getRange(pillarRow + 1, 1, 1, 4)
      .setValues([['ピラー', '投稿数', '平均Imp', '平均ER']])
      .setFontWeight('bold').setBackground('#90CAF9').setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');

    var pillarRowNum = pillarRow + 2;
    Object.keys(pillarStats).forEach(function(key) {
      var ps = pillarStats[key];
      var pAvgImp = ps.posts > 0 ? Math.round(ps.imp / ps.posts) : 0;
      var pAvgER = ps.imp > 0 ? (ps.eng / ps.imp * 100).toFixed(2) + '%' : '0%';
      sheet.getRange(pillarRowNum, 1, 1, 4).setValues([[key, ps.posts, pAvgImp, pAvgER]])
        .setHorizontalAlignment('center');
      if (pillarRowNum % 2 === 0) sheet.getRange(pillarRowNum, 1, 1, 4).setBackground('#f5f5f5');
      pillarRowNum++;
    });
  } else {
    sheet.getRange(row + 1, 1).setValue('💡 「📱 X投稿ログ」にデータを入力すると、ここに自動集計されます')
      .setFontColor('#999999');
  }

  // ============================
  // セクションC: 流入元ランキング
  // ============================
  row = 30;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🔍 流入元ランキング（直近7日間）')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(row, 35);

  var srcSheet = ss.getSheetByName('GA4_流入元');
  if (srcSheet && srcSheet.getLastRow() > 1) {
    var srcData = srcSheet.getDataRange().getValues();
    var latestFetchDate = '';
    for (var j = srcData.length - 1; j >= 1; j--) {
      if (srcData[j][0]) { latestFetchDate = srcData[j][0]; break; }
    }

    sheet.getRange(row + 1, 1, 1, 5)
      .setValues([['順位', 'チャネル', 'ソース/メディア', 'セッション数', '構成比']])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');

    var filtered = [];
    var totalSrc = 0;
    for (var k = 1; k < srcData.length; k++) {
      if (srcData[k][0] === latestFetchDate) {
        filtered.push(srcData[k]);
        totalSrc += Number(srcData[k][3]) || 0;
      }
    }
    filtered.sort(function(a, b) { return (b[3] || 0) - (a[3] || 0); });

    var srcRowNum = row + 2;
    filtered.slice(0, 8).forEach(function(r, idx) {
      var ratio = totalSrc > 0 ? ((Number(r[3]) / totalSrc) * 100).toFixed(1) + '%' : '0%';
      sheet.getRange(srcRowNum, 1, 1, 5).setValues([[idx + 1, r[1], r[2], r[3], ratio]])
        .setHorizontalAlignment('center');
      if (srcRowNum % 2 === 0) sheet.getRange(srcRowNum, 1, 1, 5).setBackground('#f5f5f5');
      srcRowNum++;
    });
  }

  // ============================
  // セクションD: ターゲットKW順位
  // ============================
  row = 42;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🎯 ターゲットキーワード順位')
    .setFontSize(14).setFontWeight('bold')
    .setFontColor('#1a1a2e').setBackground('#e8eaf6');
  sheet.setRowHeight(row, 35);

  var kwSheet = ss.getSheetByName('ターゲットKW順位');
  if (kwSheet && kwSheet.getLastRow() > 1) {
    var kwData = kwSheet.getDataRange().getValues();
    var kwHeaders2 = kwData[0];
    var latestKW = kwData[kwData.length - 1];

    sheet.getRange(row + 1, 1, 1, 3)
      .setValues([['キーワード', '現在の順位', 'ステータス']])
      .setFontWeight('bold').setBackground('#c5cae9').setHorizontalAlignment('center');

    var kwRowNum = row + 2;
    for (var m = 1; m < kwHeaders2.length; m++) {
      var rank = latestKW[m];
      var status = '';
      var bgColor = '#FFFFFF';

      if (rank === '-' || rank === '' || rank === null) {
        status = '圏外'; bgColor = '#FFEBEE';
      } else {
        var rankNum = parseFloat(rank);
        if (rankNum <= 3) { status = '🥇 上位表示'; bgColor = '#E8F5E9'; }
        else if (rankNum <= 10) { status = '✅ 1ページ目'; bgColor = '#FFF9C4'; }
        else if (rankNum <= 20) { status = '📈 改善中'; bgColor = '#FFF3E0'; }
        else { status = '⚠️ 要改善'; bgColor = '#FFEBEE'; }
      }

      sheet.getRange(kwRowNum, 1, 1, 3).setValues([[kwHeaders2[m], rank, status]])
        .setHorizontalAlignment('center').setBackground(bgColor);
      kwRowNum++;
    }
  }

  // 凡例
  var legendRow = kwRowNum + 2;
  sheet.getRange('A' + legendRow).setValue('【順位の見方】').setFontWeight('bold');
  sheet.getRange('A' + (legendRow + 1)).setValue('🥇 1〜3位 = 上位表示').setBackground('#E8F5E9');
  sheet.getRange('A' + (legendRow + 2)).setValue('✅ 4〜10位 = 1ページ目').setBackground('#FFF9C4');
  sheet.getRange('A' + (legendRow + 3)).setValue('📈 11〜20位 = 改善中').setBackground('#FFF3E0');
  sheet.getRange('A' + (legendRow + 4)).setValue('⚠️ 21位以降 or 圏外 = 要改善').setBackground('#FFEBEE');

  // 列幅
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 100);

  Logger.log('📊 統合ダッシュボード更新完了');
}
