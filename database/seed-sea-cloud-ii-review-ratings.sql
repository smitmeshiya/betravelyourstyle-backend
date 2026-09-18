-- ============================================================
-- SEED: Sea Cloud II — Update reviews with sub-category ratings
-- Based on the screenshot: 4.8 ship, 4.7 cabin, 4.4 gastronomy,
-- 3.6 entertainment, 3.1 sport, 3.0 wellness, 4.7 service
-- Recommendation rate: 91.4% (reviews with rating >= 4.0)
-- ============================================================

DO $$
DECLARE
  v_ship_id UUID;
  r         RECORD;
  i         INT := 0;
  -- Sub-ratings to distribute across 10 reviews to land on target averages:
  -- ship_general:  4.8 → total 48 across 10 reviews
  -- cabin:         4.7 → total 47
  -- gastronomy:    4.4 → total 44
  -- entertainment: 3.6 → total 36
  -- sport:         3.1 → total 31
  -- wellness:      3.0 → total 30
  -- service:       4.7 → total 47
  ship_ratings    NUMERIC[] := ARRAY[5.0, 5.0, 5.0, 5.0, 4.5, 4.5, 5.0, 5.0, 4.5, 4.5];
  cabin_ratings   NUMERIC[] := ARRAY[5.0, 5.0, 5.0, 4.5, 4.5, 4.5, 5.0, 4.5, 4.5, 4.5];
  gastro_ratings  NUMERIC[] := ARRAY[4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.5, 4.0, 4.0];
  entertain_rts   NUMERIC[] := ARRAY[4.0, 4.0, 3.5, 3.5, 3.5, 3.5, 4.0, 3.5, 3.5, 3.0];
  sport_ratings   NUMERIC[] := ARRAY[3.5, 3.5, 3.0, 3.0, 3.0, 3.0, 3.5, 3.0, 3.0, 3.0];
  wellness_rts    NUMERIC[] := ARRAY[3.5, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0];
  service_ratings NUMERIC[] := ARRAY[5.0, 5.0, 5.0, 4.5, 4.5, 4.5, 5.0, 5.0, 4.5, 4.5];
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  FOR r IN
    SELECT id FROM tbl_reviews
    WHERE ship_id = v_ship_id AND status = 'approved'
    ORDER BY travel_date DESC
  LOOP
    i := i + 1;
    UPDATE tbl_reviews SET
      ship_rating           = ship_ratings[i],
      cabin_rating          = cabin_ratings[i],
      gastronomy_rating     = gastro_ratings[i],
      entertainment_rating  = entertain_rts[i],
      sport_rating          = sport_ratings[i],
      wellness_rating       = wellness_rts[i],
      service_rating        = service_ratings[i]
    WHERE id = r.id;

    EXIT WHEN i >= 10;
  END LOOP;
END;
$$;
