// ============================================================
// AI運用フロー 詳細版（プロンプト・アクション手順付き）
// ============================================================
//
// 【使い方】
// 社内運用管理シートのApps Scriptに追加
// 「rebuildWorkflowSheet」を実行
// → 🤖 AI運用フロー シートが詳細版に置き換わります
// ============================================================

function rebuildWorkflowSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('🤖 AI運用フロー');
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet('🤖 AI運用フロー');

  // ===================================================
  // タイトル
  // ===================================================
  sheet.getRange('A1:H1').merge().setValue('AI運用フロー & アクションプラン（完全版）')
    .setFontSize(16).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1a1a2e').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 45);
  sheet.getRange('A2:H2').merge()
    .setValue('💡 このシートを見れば、毎日・毎週やることが全てわかります。プロンプトはコピペでOK。')
    .setFontSize(10).setFontColor('#666666').setBackground('#f0f0f0').setWrap(true);

  // ===================================================
  // セクション1: 毎日の運用フロー（詳細版）
  // ===================================================
  var row = 4;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📅 毎日の運用フロー')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange(row, 1, 1, 7)
    .setValues([['時間', '担当', 'タスク', '具体的なアクション', 'ツール/場所', '所要時間', '✓']])
    .setFontWeight('bold').setBackground('#3F51B5').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var dailyTasks = [
    ['6:00', '🤖 自動', 'SEOデータ収集',
      'GASが自動実行。Search Console（過去28日）とGA4（過去3日）のデータをスプレッドシートに書き込み。ダッシュボード更新→クライアントシート同期まで全自動。',
      'GAS（自動）', '-', false],
    ['7:00', '🤖 自動', 'X投稿案5本生成',
      'Coworkスケジュールタスクが自動実行。SEOデータ+トレンド情報を考慮した5本の投稿案を.mdファイルで出力。',
      'Cowork（自動）', '-', false],
    ['7:00〜7:30', '👤 手動', '① 投稿案レビュー',
      '1. Coworkの出力フォルダを開く\n2. 5本の投稿案を確認\n3. 今日のスケジュールに合わせて投稿順を決定\n4. 必要に応じて文言を微調整',
      'Cowork出力フォルダ', '5分', false],
    ['7:30', '👤 手動', '② 朝の投稿実行',
      '1. Xアプリを開く\n2. 朝用の投稿をコピペ\n3. 画像があれば添付\n4. 投稿',
      'X（Twitter）', '1分', false],
    ['12:00', '👤 手動', '③ 昼の投稿実行',
      '昼用の投稿をコピペ → 投稿',
      'X（Twitter）', '1分', false],
    ['19:00', '👤 手動', '④ 夕方の投稿実行',
      '夕方用の投稿をコピペ → 投稿',
      'X（Twitter）', '1分', false],
    ['22:00', '👤 手動', '⑤ 夜の投稿実行①',
      '夜用の投稿をコピペ → 投稿',
      'X（Twitter）', '1分', false],
    ['23:00', '👤 手動', '⑥ 夜の投稿実行②',
      '夜用の投稿をコピペ → 投稿（残りがあれば）',
      'X（Twitter）', '1分', false],
    ['翌朝', '👤 手動', '⑦ 投稿データ記録',
      '1. X Analyticsを開く（analytics.twitter.com）\n2. 昨日の各投稿のImp・Eng・いいね・RTを確認\n3. 社内シートの「📱 X投稿ログ」に転記\n4. ピラーと時間帯をドロップダウンから選択',
      '📱 X投稿ログ', '3分', false],
    ['昼 or 夜', '👤 手動', '⑧ フォロー（5〜10人）',
      '↓下の「Grokフォロー候補取得プロンプト」を使用\n1. Grokにプロンプトを送信→候補リストを取得\n2. リストからプロフィールを確認\n3. 20〜40代女性のアカウントを1日5〜10人フォロー\n\n⚠️ 1日10人以内厳守（凍結リスク回避）\n⚠️ 鍵アカ、非アクティブはスキップ',
      'Grok → X', '3分', false],
    ['昼 or 夜', '👤 手動', '⑨ いいね＆リプライ巡回',
      '↓下の「Grokエンゲージメント候補取得プロンプト」を使用\n1. Grokにプロンプトを送信→候補ツイートを取得\n2. ターゲット層の投稿に「いいね」を10〜20件\n3. 特に共感できる投稿に温かいリプライを3〜5件\n\n⚠️ 営業感ゼロで。共感・応援のみ。',
      'Grok → X', '5〜10分', false],
    ['週2〜3回', '👤 手動', '⑩ 引用RT',
      '【やり方】\n1. セルフケア・メンタルヘルス・女性エンパワメント系の投稿を見つける\n2. 引用RTで自社の見解やメッセージを添える\n\n【引用RT例】\n元投稿：「たまには自分を甘やかしてもいいよね」\n→ 引用：「本当にそう思います。頑張っている自分にご褒美をあげることは、わがままじゃなくて"必要なケア"。ストロベリーボーイズは、そんな女性の味方でありたいと思っています🍓」',
      'X（Twitter）', '3分', false],
  ];

  var dailyStartRow = row + 1;
  sheet.getRange(dailyStartRow, 1, dailyTasks.length, 7).setValues(dailyTasks)
    .setVerticalAlignment('top').setWrap(true);

  // チェックボックス
  var cb = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  sheet.getRange(dailyStartRow, 7, dailyTasks.length, 1).setDataValidation(cb);

  // 自動タスク色分け
  for (var i = dailyStartRow; i < dailyStartRow + dailyTasks.length; i++) {
    if (dailyTasks[i - dailyStartRow][1].indexOf('自動') !== -1) {
      sheet.getRange(i, 1, 1, 7).setBackground('#E8F5E9');
    } else if (i % 2 === 0) {
      sheet.getRange(i, 1, 1, 7).setBackground('#f5f5f5');
    }
  }

  // ===================================================
  // Grokプロンプト: フォロー候補 & エンゲージメント候補
  // ===================================================
  row = dailyStartRow + dailyTasks.length + 1;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🎯 Grokで取得：フォロー候補 & エンゲージメント候補（⑧⑨で使うプロンプト）')
    .setFontSize(13).setFontWeight('bold').setBackground('#FFF3E0').setFontColor('#E65100');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('毎日 or 隔日、Grok（grok.x.ai）に以下のプロンプトを送信してターゲットリストを取得。Grokは X のリアルタイムデータにアクセスできるので、手動で探すより早くて精度が高い。')
    .setWrap(true).setFontColor('#666666').setBackground('#FFF8E1');

  // --- フォロー候補取得プロンプト ---
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('👥 フォロー候補取得プロンプト（Grok / 週2〜3回）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8F5E9').setFontColor('#1B5E20');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. Grok（grok.x.ai）を開く\n2. 以下のプロンプトをコピペして送信\n3. 結果のアカウントリストをチェック → プロフィール確認 → フォロー\n4. 1日5〜10人まで。鍵アカ・非アクティブはスキップ')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E8F5E9');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('X（Twitter）で以下の条件に合うアカウントを10〜15個見つけてください。\n\n【ターゲット条件】\n・20〜40代の女性（プロフィールや投稿内容から推定）\n・横浜、神奈川、福岡、博多エリアに関連がありそう（プロフィールに地名が入っている、地域の話題を投稿している等）\n・以下のいずれかに該当する：\n  - セルフケア、癒し、リラクゼーション、美容に興味がある\n  - 「疲れた」「癒されたい」「ご褒美」系の投稿をしている\n  - 女性向けサービス（エステ、マッサージ等）を利用している\n  - 競合アカウント（女性用風俗、レディースコミック系）をフォローしている\n\n【除外条件】\n・鍵アカウント\n・3ヶ月以上投稿がないアカウント\n・明らかな業者・スパムアカウント\n\n【出力形式】\n各アカウントについて以下をリストアップ：\n1. @ユーザー名\n2. プロフィール概要（一言）\n3. 最近の投稿内容（1つ）\n4. フォローすべき理由（ターゲットとしての適合度）')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#4CAF50', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 280);

  // --- エンゲージメント候補取得プロンプト ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('💬 いいね＆リプライ候補取得プロンプト（Grok / 毎日 or 隔日）')
    .setFontSize(12).setFontWeight('bold').setBackground('#FCE4EC').setFontColor('#880E4F');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. Grok（grok.x.ai）を開く\n2. 以下のプロンプトをコピペして送信\n3. 結果のツイートリストをチェック → いいね＆リプライ\n4. リプライは営業感ゼロで、共感・応援のみ')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FCE4EC');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('X（Twitter）で直近24時間以内に投稿された、以下の条件に合うツイートを10〜15件見つけてください。\n\n【検索条件】\n以下のキーワード・テーマに関連する投稿：\n・「疲れた」「癒されたい」「自分にご褒美」「ストレス」「リフレッシュしたい」\n・「横浜」「福岡」「博多」×「リラックス」「癒し」「おすすめ」\n・セルフケア、メンタルヘルス、一人時間、自分磨き\n・仕事や人間関係の疲れ、頑張った自分を褒めたい系\n\n【投稿者の条件】\n・20〜40代女性と思われるアカウント\n・フォロワー数50〜5000人程度（個人アカウント）\n・直近1週間以内にアクティブ\n\n【出力形式】\n各ツイートについて：\n1. @ユーザー名\n2. ツイート内容（そのまま引用）\n3. おすすめのリアクション：\n   - 「いいねのみ」 or 「いいね＋リプライ推奨」\n4. リプライする場合の例文（営業感ゼロ、共感・応援トーンで。絵文字1〜2個まで。30字以内）\n\n※ストロベリーボーイズの宣伝は絶対にしない。純粋な共感・応援のみ。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#E91E63', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 320);

  // --- 引用RT候補取得プロンプト ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🔄 引用RT候補取得プロンプト（Grok / 週2〜3回）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E3F2FD').setFontColor('#0D47A1');

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('X（Twitter）で直近1週間以内に投稿された、引用RTに適したツイートを5件見つけてください。\n\n【検索テーマ】\n・セルフケア、自分を大切にすること\n・女性のエンパワメント、自己肯定感\n・メンタルヘルス、ストレスケア\n・「頑張りすぎなくていい」「自分にご褒美」系のメッセージ\n・横浜や福岡の魅力、おすすめスポット\n\n【投稿の条件】\n・いいね10件以上（ある程度共感を集めている投稿）\n・ポジティブなメッセージ性がある\n・ストロベリーボーイズのブランドメッセージ（女性の癒し・自分時間の応援）と親和性が高い\n\n【出力形式】\n各ツイートについて：\n1. @ユーザー名\n2. ツイート内容（そのまま引用）\n3. いいね数・RT数\n4. 引用RTで添えるコメント案（ストロベリーボーイズとして。温かく、ブランドメッセージに沿った内容。50〜100字。最後に🍓をつける）')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#2196F3', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 280);

  // ===================================================
  // セクション2: 週次タスク（Grokプロンプト付き）
  // ===================================================
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📊 週次インテリジェンス収集（プロンプト付き）')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  // --- タスク2-1: Grok 競合バズ分析 ---
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🔥 タスク①: 競合バズ分析（Grok / 週2回：月曜・木曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#F3E5F5').setFontColor('#4A148C');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. Grok（grok.x.ai）を開く\n2. 以下のプロンプトをコピペして送信\n3. 結果を「🧠 インテリジェンス」シートの「競合バズ投稿分析」セクションに記録\n4. ステータスを「未対応」にして、使えそうなものは「採用」に変更')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FCE4EC');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('女性向け風俗（レディースコミック、女性用風俗）業界のX（Twitter）で、直近1週間でバズった投稿（いいね100以上 or RT50以上）を5つ教えてください。\n\n各投稿について以下を分析してください：\n- アカウント名\n- 投稿内容の要約\n- バズった要因（なぜ伸びたか）\n- 推定インプレッション数\n- 「ストロベリーボーイズ」（横浜・福岡の女性向け風俗店）の投稿に転用するならどうアレンジすべきか\n\n※該当がない場合は、女性向けリラクゼーション、セルフケア、メンタルヘルス系のアカウントで伸びている投稿を分析してください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#FFB74D', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 150);

  // --- タスク2-2: Perplexity トレンド収集 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📰 タスク②: トレンド・時事ネタ収集（Perplexity / 週1回：水曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E3F2FD').setFontColor('#0D47A1');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. Perplexity（perplexity.ai）を開く\n2. 以下のプロンプトをコピペして送信\n3. 結果を「🧠 インテリジェンス」シートの「トレンド・時事ネタ」セクションに記録\n4. 投稿に使えそうなネタは「投稿転用案」列にアイデアをメモ')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E3F2FD');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('以下のテーマについて、直近1〜2週間の最新トレンド・ニュース・話題を教えてください。各項目にソースURLを付けてください。\n\n1. 女性のセルフケア・メンタルヘルスに関する最新トレンド\n2. 横浜エリアの最新イベント・話題スポット（今週〜来週）\n3. 福岡エリアの最新イベント・話題スポット（今週〜来週）\n4. SNS（特にX/Twitter）で女性に人気のハッシュタグや話題\n5. 女性向けリラクゼーション・美容業界の最新動向\n\nそれぞれについて、「ストロベリーボーイズ」（横浜・福岡の女性向け風俗店）のX投稿ネタとして使えるかどうかも一言コメントしてください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#42A5F5', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 150);

  // --- タスク2-3: Grok アルゴリズム確認 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('⚙️ タスク③: Xアルゴリズム変動チェック（Grok / 月2回：第1・第3月曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#FFF3E0').setFontColor('#E65100');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. Grok（grok.x.ai）を開く\n2. 以下のプロンプトをコピペして送信\n3. 結果を「🧠 インテリジェンス」シートの「Xアルゴリズム変動ログ」セクションに記録\n4. 影響度が「高」の場合は投稿戦略を即座に調整')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF3E0');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('X（Twitter）のアルゴリズムについて、直近2週間で変更や調整があったか教えてください。\n\n特に以下の点について知りたいです：\n1. タイムラインの表示アルゴリズムに変更はあったか\n2. インプレッションやリーチに影響する要因の変化\n3. エンゲージメント（いいね、RT、リプライ）の重み付けの変化\n4. 画像・動画・テキストのみ投稿の表示優先度の変化\n5. ハッシュタグの効果に変化はあるか\n6. 投稿頻度や時間帯に関する最適化の変化\n\n変更があった場合、ビジネスアカウント（フォロワー1000人未満の成長フェーズ）が取るべき具体的な対応策も教えてください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#FF9800', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 150);

  // --- タスク2-4: SEOコンテンツ戦略提案 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📝 タスク④: SEOコンテンツ戦略提案（Perplexity + Claude / 毎週水曜 トレンド収集と同時）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8F5E9').setFontColor('#1B5E20');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【目的】SEOデータとトレンドを元に、サイトに追加すべきコンテンツ（ブログ記事・ニュース記事）を特定する\n【手順】\n1. まず「📊 ダッシュボード」のKW順位とGA4データを確認\n2. 順位が改善中（11〜20位）のKWを把握 → 記事で押し上げるチャンス\n3. Perplexityで以下のプロンプトを送信\n4. 結果から記事テーマを2〜3本ピックアップ\n5. 記事作成はClaude（Cowork）に依頼')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E8F5E9');
  sheet.setRowHeight(row, 100);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト（Perplexity）:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('以下のキーワードで上位表示を目指しているWebサイト（https://www.sutoroberrys.jp/）があります。\n\nターゲットKW:\n・女性用風俗 横浜\n・女性用風俗 福岡\n・女性向け リラクゼーション 横浜\n・女性向け リラクゼーション 福岡\n・女風 横浜\n・女風 福岡\n\n以下を調査してください：\n1. 各KWで現在上位表示（1〜10位）されているサイトは、どんなコンテンツ（記事・ページ）で順位を取っているか\n2. 上位サイトにあって、当サイトに不足していると思われるコンテンツテーマ\n3. 「女性用風俗」を検索する人が一緒に検索しそうな関連キーワード・疑問\n4. 今すぐ書くべきブログ記事のテーマを優先度順に5本提案（タイトル案＋概要200字＋狙うKW付き）\n5. ニュース性のある記事ネタ（季節・トレンドに合わせたタイムリーな話題）を3本提案')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#4CAF50', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 220);

  row += 2;
  sheet.getRange('A' + row).setValue('📋 記事作成依頼プロンプト（Claude / Cowork）:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('以下のテーマでSEOブログ記事を書いてください。\n\n【記事テーマ】（Perplexityの提案から選んだテーマをここに入れる）\n【ターゲットKW】（狙うキーワードをここに入れる）\n【文字数】2000〜3000字\n【トーン】温かく、安心感があり、女性が読みやすい文体。専門用語は避ける。\n【構成】\n・導入（共感から入る）\n・本文（見出しH2を3〜4つ）\n・まとめ（行動を促す一文）\n・内部リンク：トップページ、予約ページへの自然な誘導\n【SEO要件】\n・タイトルにKWを含める\n・メタディスクリプション（120字）も作成\n・見出しにKWまたは関連語を含める\n\nサイト情報: ストロベリーボーイズ（https://www.sutoroberrys.jp/）横浜・福岡の女性向け風俗')
    .setWrap(true).setVerticalAlignment('top').setBackground('#F3E5F5')
    .setBorder(true, true, true, true, false, false, '#9C27B0', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 220);

  // --- SEOコンテンツ管理テーブル ---
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📋 SEOコンテンツ管理テーブル')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8F5E9');
  row++;
  var seoTableHeaderRow = row;
  sheet.getRange(row, 1, 1, 7)
    .setValues([['提案日', '記事テーマ', '狙うKW', '記事ステータス', '公開日', '公開URL', '効果（3ヶ月後）']])
    .setFontWeight('bold').setBackground('#4CAF50').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var articleStatusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['アイデア', '執筆中', 'レビュー中', '公開済み', '見送り']).setAllowInvalid(true).build();
  sheet.getRange(seoTableHeaderRow + 1, 4, 20, 1).setDataValidation(articleStatusRule);
  sheet.getRange(seoTableHeaderRow + 1, 1, 20, 7).setWrap(true);

  // サンプル
  sheet.getRange(seoTableHeaderRow + 1, 1, 1, 7).setValues([[
    '（例）', '初めての女性用風俗ガイド｜横浜で安心して利用するために', '女性用風俗 横浜',
    'アイデア', '', '', ''
  ]]).setFontColor('#999999');

  // --- タスク2-5: PDCA振り返り ---
  row = seoTableHeaderRow + 22;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🔄 タスク⑤: 週次PDCA振り返り（毎週金曜 / 15分）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E0F2F1').setFontColor('#004D40');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【手順】\n1. 「📱 X投稿ログ」を開く\n2. 今週の投稿データをフィルターで絞り込む\n3. 以下の観点で分析する：\n   - ER（エンゲージメント率）が高かった投稿の共通点は？\n   - どのピラーが一番反応良かった？\n   - どの時間帯が一番Imp高かった？\n   - 画像あり/なしで差はあった？\n4. 下のPDCA記録テーブルに結果を記入\n5. 来週の重点施策を決定')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E0F2F1');
  sheet.setRowHeight(row, 120);

  // ===================================================
  // セクション3: PDCA記録テーブル
  // ===================================================
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📝 PDCA記録テーブル')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  var pdcaHeaderRow = row;
  sheet.getRange(row, 1, 1, 6)
    .setValues([['週', 'Plan（今週の計画）', 'Do（実行結果）', 'Check（データ分析）', 'Act（改善策）', '次週の重点施策']])
    .setFontWeight('bold').setBackground('#3F51B5').setFontColor('#FFFFFF').setHorizontalAlignment('center').setWrap(true);

  // 記入ガイド
  row++;
  sheet.getRange(row, 1, 1, 6).setValues([[
    '例: 4/14-4/20',
    '例: 共感系を朝7時に集中\nインタラクション系を22時に',
    '例: 投稿10本\n平均Imp 180\n平均ER 2.3%',
    '例: 22時の共感系がER 4.2%で最高\n朝の投稿はImp低め',
    '例: 共感系を22時メインに変更\n朝はお役立ち系に切替',
    '例: 時間帯×ピラーの最適化テスト'
  ]]).setFontColor('#999999').setWrap(true).setVerticalAlignment('top');
  sheet.setRowHeight(row, 80);

  // 空行（記入用）16行
  var pdcaEmptyStart = row + 1;
  for (var pr = pdcaEmptyStart; pr < pdcaEmptyStart + 16; pr++) {
    sheet.getRange(pr, 1, 1, 6).setWrap(true);
    if (pr % 2 === 0) sheet.getRange(pr, 1, 1, 6).setBackground('#f5f5f5');
  }
  row = pdcaEmptyStart + 16;

  // ===================================================
  // セクション4: 週間スケジュールまとめ
  // ===================================================
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🗓️ 週間スケジュールまとめ')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange(row, 1, 1, 4)
    .setValues([['曜日', 'ルーティン（毎日）', '追加タスク', '所要時間']])
    .setFontWeight('bold').setBackground('#3F51B5').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var weekSchedule = [
    ['月曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '🔥 Grok競合バズ分析（隔週でアルゴリズム確認も）', '20分 + 10分'],
    ['火曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '-', '20分'],
    ['水曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '📰 Perplexityトレンド収集 + 📝 SEOコンテンツ戦略', '20分 + 15分'],
    ['木曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '🔥 Grok競合バズ分析 + 引用RT', '20分 + 10分'],
    ['金曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '🔄 週次PDCA振り返り', '20分 + 15分'],
    ['土曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '-', '20分'],
    ['日曜', '投稿5本 + データ記録 + フォロー/いいね巡回', '-', '20分'],
  ];

  var weekStartRow = row + 1;
  sheet.getRange(weekStartRow, 1, weekSchedule.length, 4).setValues(weekSchedule)
    .setHorizontalAlignment('center').setWrap(true);

  for (var ws = weekStartRow; ws < weekStartRow + weekSchedule.length; ws++) {
    if (weekSchedule[ws - weekStartRow][2] !== '-') {
      sheet.getRange(ws, 1, 1, 4).setBackground('#FFF8E1');
    } else if (ws % 2 === 0) {
      sheet.getRange(ws, 1, 1, 4).setBackground('#f5f5f5');
    }
  }

  // 合計時間
  row = weekStartRow + weekSchedule.length;
  sheet.getRange(row, 1, 1, 4).setValues([['合計', '', '', '週あたり約3時間']])
    .setFontWeight('bold').setBackground('#E8EAF6').setHorizontalAlignment('center');

  // ===================================================
  // セクション5: Cowork投稿案生成のプロンプト確認用
  // ===================================================
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🤖 Cowork自動投稿案のカスタマイズ')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【Coworkの投稿案をもっと良くしたい場合】\n\n投稿案の品質を改善するには、Coworkのスケジュールタスク（strawberry-boys-daily-x-posts）のプロンプトを修正します。\n以下のフィードバックを記録して、定期的にプロンプトを更新しましょう。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#F3E5F5');
  sheet.setRowHeight(row, 80);

  row += 2;
  var fbHeaderRow = row;
  sheet.getRange(row, 1, 1, 4)
    .setValues([['日付', 'フィードバック内容', '改善案', '反映済み？']])
    .setFontWeight('bold').setBackground('#CE93D8').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var fbRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未反映', '反映済み']).setAllowInvalid(true).build();
  sheet.getRange(fbHeaderRow + 1, 4, 20, 1).setDataValidation(fbRule);

  sheet.getRange(fbHeaderRow + 1, 1, 1, 4).setValues([[
    '（例）', '共感系の投稿が硬すぎる。もっとカジュアルに', 'プロンプトに「友達に話しかけるようなトーンで」を追加', '未反映'
  ]]).setFontColor('#999999').setWrap(true);

  // ===================================================
  // セクション6: 月次ディープリサーチ（ChatGPT / Gemini）
  // ===================================================
  row = fbHeaderRow + 22;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🔬 月次ディープリサーチ（ChatGPT / Gemini）')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('ChatGPTとGeminiのディープリサーチ機能を活用した深掘り調査。月1〜2回、まとまった時間（30分〜1時間）で実施。結果はPDCAや投稿戦略に反映。')
    .setWrap(true).setFontColor('#666666').setBackground('#f0f0f0');

  // --- タスク6-1: 競合サイト完全分析 ---
  row += 2;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🏢 リサーチ①: 競合完全分析（Gemini Deep Research / 毎月第1月曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8F5E9').setFontColor('#1B5E20');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【目的】競合の戦略を把握し、自社の差別化ポイントと改善点を特定する\n【手順】\n1. Gemini（gemini.google.com）を開き、Deep Researchモードを選択\n2. 以下のプロンプトを送信（調査に10〜20分かかる場合あり）\n3. 結果を確認し、重要な発見を「🧠 インテリジェンス」の競合バズセクションに追記\n4. 自社に取り入れるべき施策をPDCA記録に反映')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E8F5E9');
  sheet.setRowHeight(row, 100);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('以下の競合について、徹底的に調査・分析してください。\n\n【調査対象】女性向け風俗（レディースコミック）業界で、横浜・福岡エリアで営業している主要な競合店舗\n\n【調査項目】\n1. 主要競合のリストアップ（店名、エリア、URL）\n2. 各社のWebサイト分析（デザイン、コンテンツ構成、予約導線、SEO対策状況）\n3. 各社のSNS戦略（X/Instagram/TikTokの運用状況、投稿頻度、フォロワー数、エンゲージメント率）\n4. 料金体系の比較（基本料金、オプション、割引キャンペーン）\n5. 口コミ・レビューの傾向分析（どこが評価されているか、不満点は何か）\n6. 広告出稿状況（リスティング広告、ディスプレイ広告、SNS広告の有無）\n7. 各社の強み・弱みのSWOT分析\n\n【自社情報（比較用）】\n- 店名: ストロベリーボーイズ\n- エリア: 横浜・福岡\n- URL: https://www.sutoroberrys.jp/\n- 特徴: 女性向け風俗（レディースコミック）\n\n最後に、ストロベリーボーイズが競合に対して差別化できるポイントと、すぐに取り入れるべき改善施策を5つ提案してください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#4CAF50', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 250);

  // --- タスク6-2: ターゲット顧客の検索行動調査 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('👩 リサーチ②: ターゲット顧客の検索行動・心理調査（ChatGPT Deep Research / 毎月第2月曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#FCE4EC').setFontColor('#880E4F');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【目的】ターゲット層がどうやってサービスを探し、何を基準に選ぶかを理解する → コンテンツ戦略・SEO戦略に反映\n【手順】\n1. ChatGPT（chatgpt.com）を開き、Deep Researchを選択\n2. 以下のプロンプトを送信\n3. 結果を元に、SEOターゲットキーワードの見直し、サイトコンテンツの改善案を検討\n4. 新しいキーワード候補があれば、GASのTARGET_KEYWORDSに追加を検討')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FCE4EC');
  sheet.setRowHeight(row, 100);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('女性向け風俗（レディースコミック、女性用風俗）のサービスを利用する女性について、以下を徹底的に調査してください。\n\n【調査項目】\n1. 検索行動の分析\n   - どんなキーワードで検索するか（直接的なKW / 間接的なKW / 悩み系KW）\n   - Google以外の検索経路（SNS検索、口コミサイト、掲示板、YouTubeなど）\n   - 初めて利用する人と、リピーターで検索行動は違うか\n\n2. 顧客心理・カスタマージャーニー\n   - 興味を持つきっかけは何か\n   - 利用前の不安・心配事TOP10\n   - 店舗選びの基準（何を比較するか、決め手は何か）\n   - 利用後の行動（口コミ投稿、リピート、友人紹介など）\n\n3. ペルソナ分析\n   - 年齢層・職業・ライフスタイルの傾向\n   - 横浜エリアと福岡エリアで顧客層に違いはあるか\n\n4. コンテンツニーズ\n   - どんな情報があればサイトの信頼度が上がるか\n   - ブログやSNSでどんなコンテンツを見たいか\n   - 不安を解消するために必要な情報は何か\n\n【活用目的】\n- SEOキーワード戦略の最適化\n- Webサイトのコンテンツ改善\n- X（Twitter）の投稿テーマ設計\n\n調査結果を元に、ストロベリーボーイズ（横浜・福岡）が取り組むべき具体的なアクション5つを優先度順で提案してください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#E91E63', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 300);

  // --- タスク6-3: 地域別マーケット調査 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📍 リサーチ③: 地域別マーケット調査（ChatGPT or Gemini / 隔月：奇数月の第3月曜）')
    .setFontSize(12).setFontWeight('bold').setBackground('#E3F2FD').setFontColor('#0D47A1');

  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('【目的】横浜と福岡の市場環境の違いを把握し、エリア別の最適戦略を立てる\n【手順】\n1. ChatGPTまたはGeminiでDeep Researchを選択\n2. 以下のプロンプトを送信\n3. 結果をエリア別の施策に反映（投稿内容、広告配分、キャンペーン企画など）')
    .setWrap(true).setVerticalAlignment('top').setBackground('#E3F2FD');
  sheet.setRowHeight(row, 80);

  row++;
  sheet.getRange('A' + row).setValue('📋 コピペ用プロンプト:').setFontWeight('bold');
  row++;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('横浜エリアと福岡エリアについて、女性向けサービス（美容、リラクゼーション、エンターテインメント）のマーケット環境を比較調査してください。\n\n【調査項目】\n1. 基礎データ\n   - 20〜40代女性の人口推移\n   - 平均年収・可処分所得の比較\n   - 女性の一人暮らし率、未婚率\n\n2. 市場環境\n   - 女性向けサービス業の市場規模・成長率\n   - 主要な繁華街・商業エリアの特徴\n   - 女性の消費行動の地域差（横浜 vs 福岡）\n\n3. 競合環境\n   - 各エリアの競合密度（同業種の店舗数）\n   - 広告単価の相場差（リスティング広告のCPC比較）\n   - SEO難易度の違い（「女性用風俗 横浜」vs「女性用風俗 福岡」）\n\n4. 集客チャネル\n   - 各エリアで効果的な集客方法の違い\n   - SNS利用傾向の地域差（X、Instagram、TikTokの利用率）\n   - 口コミ・紹介の重要度の違い\n\n5. 季節・イベント\n   - 各エリアの主要イベントカレンダー（今後6ヶ月）\n   - 繁忙期・閑散期の違い\n   - イベントに合わせたキャンペーン企画案\n\n最後に、横浜と福岡それぞれに最適化されたマーケティング戦略を具体的に提案してください。')
    .setWrap(true).setVerticalAlignment('top').setBackground('#FFF8E1')
    .setBorder(true, true, true, true, false, false, '#2196F3', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(row, 280);

  // --- ディープリサーチ実施記録 ---
  row += 3;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('📋 ディープリサーチ実施記録')
    .setFontSize(12).setFontWeight('bold').setBackground('#E8EAF6');

  row++;
  var researchHeaderRow = row;
  sheet.getRange(row, 1, 1, 6)
    .setValues([['実施日', 'リサーチ種別', '使用ツール', '主要な発見', 'アクション', '反映状況']])
    .setFontWeight('bold').setBackground('#3F51B5').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var researchTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['競合分析', '顧客調査', '地域マーケット', 'その他']).setAllowInvalid(true).build();
  sheet.getRange(researchHeaderRow + 1, 2, 20, 1).setDataValidation(researchTypeRule);

  var toolRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ChatGPT Deep Research', 'Gemini Deep Research', 'Grok', 'Perplexity']).setAllowInvalid(true).build();
  sheet.getRange(researchHeaderRow + 1, 3, 20, 1).setDataValidation(toolRule);

  var reflectRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未反映', '一部反映', '反映済み']).setAllowInvalid(true).build();
  sheet.getRange(researchHeaderRow + 1, 6, 20, 1).setDataValidation(reflectRule);

  sheet.getRange(researchHeaderRow + 1, 1, 20, 6).setWrap(true);

  // ===================================================
  // セクション7: AI活用ツール一覧まとめ
  // ===================================================
  row = researchHeaderRow + 22;
  sheet.getRange('A' + row + ':H' + row).merge()
    .setValue('🛠️ AI活用ツール一覧')
    .setFontSize(14).setFontWeight('bold').setBackground('#E8EAF6').setFontColor('#1a1a2e');
  sheet.setRowHeight(row, 35);

  row++;
  sheet.getRange(row, 1, 1, 5)
    .setValues([['ツール', '用途', '頻度', '強み', '料金']])
    .setFontWeight('bold').setBackground('#3F51B5').setFontColor('#FFFFFF').setHorizontalAlignment('center');

  var toolList = [
    ['Grok（grok.x.ai）', '競合バズ分析、アルゴリズム変動', '週2〜3回', 'X内部データにアクセス可能、リアルタイム性', '課金済み'],
    ['Perplexity', 'トレンド収集、地域情報、統計データ、SEOコンテンツ戦略', '週1回', '引用・ソース付きで信頼性高い', '課金済み'],
    ['ChatGPT Deep Research', '顧客心理調査、SEO戦略立案', '月1回', '深い分析力、網羅的な調査', '課金済み'],
    ['Gemini Deep Research', '競合分析、市場調査', '月1回', 'Google検索との連携、最新情報に強い', '課金済み'],
    ['Claude（Cowork）', '投稿案自動生成、記事作成、データ分析、運用設計', '毎日自動', '長文コンテンツ、コード生成、自動化', '課金済み'],
    ['GAS（自動）', 'SEOデータ収集、ダッシュボード更新', '毎日自動', '完全自動、無料', '無料'],
  ];

  var toolStartRow = row + 1;
  sheet.getRange(toolStartRow, 1, toolList.length, 5).setValues(toolList).setWrap(true);

  for (var tl = toolStartRow; tl < toolStartRow + toolList.length; tl++) {
    if (tl % 2 === 1) sheet.getRange(tl, 1, 1, 5).setBackground('#f5f5f5');
  }

  // ===================================================
  // 列幅設定
  // ===================================================
  sheet.setColumnWidth(1, 100);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 400);
  sheet.setColumnWidth(5, 150);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 50);
  sheet.setColumnWidth(8, 50);

  Logger.log('🤖 AI運用フロー（詳細版）構築完了');
}
