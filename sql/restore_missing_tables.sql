CREATE TABLE IF NOT EXISTS public.lh_amenities (
  id uuid PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS public.lh_areas (
  city_id text,
  id text PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS public.lh_article_hotels (
  article_id text,
  hotel_id uuid
);

CREATE TABLE IF NOT EXISTS public.lh_article_tags (
  article_id text,
  tag text
);

CREATE TABLE IF NOT EXISTS public.lh_cities (
  count integer,
  id text PRIMARY KEY,
  name text,
  prefecture_id text
);

CREATE TABLE IF NOT EXISTS public.lh_feature_articles (
  article_date text,
  content text,
  created_at timestamp with time zone,
  id text PRIMARY KEY,
  image_url text,
  prefecture_id text,
  summary text,
  title text
);

CREATE TABLE IF NOT EXISTS public.lh_hotel_amenities (
  amenity_id uuid,
  hotel_id uuid
);

CREATE TABLE IF NOT EXISTS public.lh_hotel_images (
  category text,
  created_at timestamp with time zone,
  hotel_id uuid,
  id uuid PRIMARY KEY,
  sort_order integer,
  url text
);

CREATE TABLE IF NOT EXISTS public.lh_hotel_services (
  hotel_id uuid,
  service_id uuid
);

CREATE TABLE IF NOT EXISTS public.lh_hotels (
  address text,
  area_id text,
  city_id text,
  created_at timestamp with time zone,
  description text,
  distance_from_station text,
  id uuid PRIMARY KEY,
  image_url text,
  min_price_rest integer,
  min_price_stay integer,
  name text,
  phone text,
  place_id text,
  prefecture_id text,
  rating numeric,
  rest_price_max_weekday integer,
  rest_price_max_weekend integer,
  rest_price_min_weekday integer,
  rest_price_min_weekend integer,
  review_count integer,
  room_count integer,
  status text,
  stay_price_max_weekday integer,
  stay_price_max_weekend integer,
  stay_price_min_weekday integer,
  stay_price_min_weekend integer,
  website text
);

CREATE TABLE IF NOT EXISTS public.lh_prefectures (
  count integer,
  id text PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS public.lh_review_photos (
  category text,
  id uuid PRIMARY KEY,
  review_id uuid,
  url text
);

CREATE TABLE IF NOT EXISTS public.lh_reviews (
  cleanliness integer,
  content text,
  cost integer,
  created_at timestamp with time zone,
  hotel_id uuid,
  id uuid PRIMARY KEY,
  rating integer,
  review_date date,
  room_number text,
  rooms integer,
  service integer,
  stay_type text,
  user_name text,
  value integer
);

CREATE TABLE IF NOT EXISTS public.lh_services (
  id uuid PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS public.reservations (
  cast_id uuid,
  client_nickname text,
  consent_date text,
  consent_log_id text,
  consent_text_snapshot text,
  created_at timestamp with time zone,
  customer_name text,
  date_time text,
  email text,
  id uuid PRIMARY KEY,
  is_over_18 boolean,
  notes text,
  phone text,
  progress_json jsonb,
  reservation_datetime text,
  status text,
  store_id uuid,
  therapist_name text,
  updated_at timestamp with time zone,
  visit_count integer
);

CREATE TABLE IF NOT EXISTS public.review_tag_links (
  created_at timestamp with time zone,
  id uuid PRIMARY KEY,
  review_id uuid,
  tag_id uuid
);

CREATE TABLE IF NOT EXISTS public.review_tag_master (
  category text,
  created_at timestamp with time zone,
  id uuid PRIMARY KEY,
  is_active boolean,
  name text
);

CREATE TABLE IF NOT EXISTS public.review_tags (
  id uuid PRIMARY KEY,
  name text
);

CREATE TABLE IF NOT EXISTS public.reviews_with_tags_temp (
  cast_id uuid,
  comment text,
  created_at timestamp without time zone,
  rating integer,
  tags text,
  user_name text
);

CREATE TABLE IF NOT EXISTS public.video_hash_tags (
  id uuid PRIMARY KEY,
  tag text,
  video_id uuid
);

CREATE TABLE IF NOT EXISTS public.video_intuitive_tags (
  id uuid PRIMARY KEY,
  tag text,
  video_id uuid
);

CREATE TABLE IF NOT EXISTS public.workflow_cast_reflection (
  created_at timestamp with time zone,
  id uuid PRIMARY KEY,
  next_action text,
  reflection_data jsonb,
  reservation_id uuid,
  safety_score integer,
  satisfaction integer
);

CREATE TABLE IF NOT EXISTS public.workflow_counseling (
  answers jsonb,
  created_at timestamp with time zone,
  id uuid PRIMARY KEY,
  reservation_id uuid
);

CREATE TABLE IF NOT EXISTS public.workflow_post_survey (
  created_at timestamp with time zone,
  id uuid PRIMARY KEY,
  overall_satisfaction text,
  reservation_id uuid,
  survey_data jsonb
);

CREATE TABLE IF NOT EXISTS public.workflow_reflection (
  created_at timestamp with time zone,
  customer_analysis text,
  customer_traits jsonb,
  has_incident boolean,
  id uuid PRIMARY KEY,
  improvement_points jsonb,
  incident_detail text,
  next_action text,
  reservation_id uuid,
  safety_score integer,
  satisfaction integer,
  session_id text,
  success_memo text,
  success_points jsonb,
  updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.workflow_survey (
  arrival_support text,
  block_a_other text,
  block_b_other text,
  block_c_other text,
  block_d_other text,
  block_e_other text,
  booking_ease text,
  created_at timestamp with time zone,
  desired_hp_content jsonb,
  desired_services jsonb,
  device_type text,
  form_version text,
  free_text text,
  good_points jsonb,
  id uuid PRIMARY KEY,
  improvement_points jsonb,
  overall_satisfaction text,
  price_satisfaction text,
  recommend_intent text,
  repeat_intent text,
  reservation_id uuid,
  search_keyword text,
  service_impression jsonb,
  session_id text,
  site_usability text,
  skipped_flag boolean,
  source text,
  store_improvements jsonb,
  submitted_at timestamp with time zone,
  technical_satisfaction text,
  therapist_name text,
  updated_at timestamp with time zone
);