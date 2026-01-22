-- 全店舗分の料金データ投入SQL
-- 既存のすべての店舗（storesテーブル）に対して、料金設定が存在しない場合に
-- 福岡店（fukuoka）と同様の初期データを投入します。

DO $$
DECLARE
  v_store RECORD;
  v_price_config_id UUID;
  v_course_id UUID;
  v_existing_config_count INTEGER;
BEGIN
  -- すべての店舗に対してループ処理
  -- store_nameが存在しない可能性があるため、idとslugのみ取得
  FOR v_store IN SELECT id, slug FROM stores LOOP
    
    -- 既に料金設定があるか確認
    SELECT COUNT(*) INTO v_existing_config_count 
    FROM price_configs 
    WHERE store_id = v_store.id;
    
    IF v_existing_config_count = 0 THEN
      RAISE NOTICE 'Initializing price data for store: %', v_store.slug;

      -- 1. price_config作成
      INSERT INTO price_configs (store_id, hero_image_url)
      VALUES (v_store.id, '/料金ページトップ画像.jpg')
      RETURNING id INTO v_price_config_id;

      -- 2. コース作成（スタンダード）
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, designation_fee_note, notes, display_order
      ) VALUES (
        v_price_config_id, 'standard', 'スタンダードコース',
        '当店の基本となる施術コース。時間に合わせて最適な行程をご提供します。', '🍓',
        6000, 1000, '全セラピスト一律。特にご希望がなければ無料となります♫',
        E'120分コースは、2時間をかけてメインの施術行程をご堪能いただける当店のスタンダードコースです。非常にお得な料金設定となっております♡\n\n※60分コースについては施術時間が短いため、一部の施術のみとさせて頂きます。',
        0
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, sub_label, discount_info, display_order) VALUES
        (v_course_id, 60, 12000, NULL, NULL, 0),
        (v_course_id, 90, 16000, NULL, NULL, 1),
        (v_course_id, 120, 20000, NULL, '初回2,000円OFF', 2),
        (v_course_id, 150, 24000, NULL, '初回2,000円OFF', 3),
        (v_course_id, 180, 29000, NULL, '初回2,000円OFF', 4),
        (v_course_id, 240, 39000, NULL, '初回4,000円OFF', 5),
        (v_course_id, 300, 47000, NULL, '初回4,000円OFF', 6);

      -- お泊りコース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, designation_fee_note, notes, display_order
      ) VALUES (
        v_price_config_id, 'stay', 'お泊りコース',
        '通常の120分コースが含まれ、それ以外の時間はデートなどに。', '🎀',
        6000, 1000, NULL,
        '常識の範囲内でセラピストへ休息（5〜6時間目安の睡眠時間）を与えて頂けると幸いです。デート代・食事代は実費負担となります。',
        1
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 600, 55000, 0),
        (v_course_id, 720, 65000, 1),
        (v_course_id, 840, 75000, 2),
        (v_course_id, 960, 85000, 3),
        (v_course_id, 1080, 95000, 4);

      -- デートコース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, notes, display_order
      ) VALUES (
        v_price_config_id, 'date', 'デートコース',
        '外でのデートから始まり、気持ちがほぐれた所でホテルへ。', '🍰',
        6000, 1000,
        'いきなりホテルに入るのが抵抗ある方は、外でのデートからお楽しみください♫',
        2
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 180, 32000, 0),
        (v_course_id, 240, 42000, 1),
        (v_course_id, 300, 50000, 2);

      -- 新苺コース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, notes, display_order
      ) VALUES (
        v_price_config_id, 'new', '新苺コース（90分）',
        '入店してまもない新人さんを格安料金でご案内。', '🌱',
        6000, 1000,
        '新人セラピストを格安のご利用料金にてご案内させて頂きます♫',
        3
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 90, 10000, 0);

      -- カップルコース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, notes, display_order
      ) VALUES (
        v_price_config_id, 'couple', 'カップルコース',
        'お客様お二人と、当店セラピストの3名でのご案内。', '👩‍❤️‍👨',
        10000, 1000,
        'お客様のご要望通りにサービスを行います。非現実的なプレイをお楽しみください♡',
        4
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 60, 19000, 0),
        (v_course_id, 90, 28000, 1),
        (v_course_id, 120, 37000, 2);

      -- 3Pコース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, notes, display_order
      ) VALUES (
        v_price_config_id, '3p', '3Pコース',
        'お客様おひとりに対してセラピスト2名で施術する夢のコース。', '🍓🍓',
        10000, 1000,
        'お客様おひとりに対してセラピストが2名にて施術をする、極楽コースです☆',
        5
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 90, 30000, 0),
        (v_course_id, 120, 40000, 1);

      -- トラベルコース
      INSERT INTO courses (
        price_config_id, course_key, name, description, icon,
        extension_per_30min, designation_fee_first, notes, display_order
      ) VALUES (
        v_price_config_id, 'travel', 'トラベルコース',
        '旅行中ずっと一緒に過ごせる特別プラン。', '✈️',
        6000, 1000,
        '大変お得なコースのため、トラベルコースには施術は含まれておりません。',
        6
      ) RETURNING id INTO v_course_id;

      INSERT INTO course_plans (course_id, minutes, price, display_order) VALUES
        (v_course_id, 1440, 100000, 0),
        (v_course_id, 1800, 125000, 1),
        (v_course_id, 2160, 150000, 2),
        (v_course_id, 2880, 200000, 3),
        (v_course_id, 3600, 250000, 4);

      -- 送迎エリア
      INSERT INTO transport_areas (price_config_id, area, price, label, display_order) VALUES
        (v_price_config_id, '東京23区', 1000, '1,000円エリア', 0),
        (v_price_config_id, '東京23区外', 2000, '2,000円エリア', 1),
        (v_price_config_id, 'その他、関東近郊', 3000, '3,000円エリア', 2),
        (v_price_config_id, 'タクシー代', NULL, '応相談', 3);

      -- オプション
      INSERT INTO price_options (price_config_id, name, description, price, is_relative, display_order) VALUES
        (v_price_config_id, '指名料', '当店は全セラピスト一律の指名料金です♫ 特にご希望がなければ無料となります。', 1000, false, 0),
        (v_price_config_id, '洗体オプション', 'お風呂にてお客様のお身体を丁寧に、そしていやらしく洗体をさせて頂きます♡', 2000, true, 1),
        (v_price_config_id, 'ドMオプション', '「目一杯男性に虐められたい」その非日常の願望を叶えます☆ 通常プレイよりもゾクゾク感10倍間違い無し！', 2000, true, 2),
        (v_price_config_id, 'アイラインタッチ無し', '女性風俗に対して抵抗のあるお客様でも、ご安心してご利用頂けるオプションとなります。', -1000, true, 3);

      -- キャンペーン
      INSERT INTO campaigns (price_config_id, title, description, image_url, need_entry, accent_text, price_info, display_order) VALUES
        (v_price_config_id, '初回限定！最大4,000円OFF',
         '120〜180分コースで2,000円引、240分コース以上なら4,000円引！対象コースからお値引きいたします♫',
         'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=800',
         false, 'WELCOME DISCOUNT', 'MAX 4,000円引', 0),
        (v_price_config_id, '口コミ＆アンケート割引',
         '口コミとアンケートの両方ご記入で、次回1,000円引！短文でも大歓迎です。他割引との併用も可能♫',
         'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
         true, 'REVIEW & SURVEY', '1,000円引', 1),
        (v_price_config_id, 'お友達紹介割引',
         'ご紹介者様・お友達の双方ともコース料金から1,000円引！LINE予約時にお伝えください♫',
         'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
         true, 'REFER A FRIEND', '1,000円引', 2);
    
    ELSE
      RAISE NOTICE 'Price data for store: % already exists. Skipping...', v_store.slug;
    END IF;

  END LOOP;
  RAISE NOTICE 'Finished initializing price data for all stores.';
END $$;
