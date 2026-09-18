-- ============================================================
-- SEED: Sea Cloud II — Full review data
-- Run AFTER migrate-reviews-v2.sql
-- user_id for all reviews: 3e0a66c5-2271-48b4-9afc-99eaadebf6f3
-- ============================================================

DO $$
DECLARE
  v_ship_id UUID;
  v_user_id UUID := '3e0a66c5-2271-48b4-9afc-99eaadebf6f3';

  -- Review IDs in travel_date DESC order (from existing data)
  ids UUID[];
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  -- Collect review IDs ordered by travel_date DESC
  SELECT ARRAY(
    SELECT id FROM tbl_reviews
    WHERE ship_id = v_ship_id AND status = 'approved'
    ORDER BY travel_date DESC
  ) INTO ids;

  -- ── Review 1: June 25, 2026 — rating 3.8 ─────────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 2,
    travel_duration      = 9,
    destination          = 'Eastern Mediterranean',
    countries            = 'Italy, Greece, Malta',
    ports                = 'Piraeus / Athens (Greece), Syracuse (Sicily, Italy), Taormina (Sicily, Italy), Valletta (Malta), Monemvasia (Peloponnese, Greece), Milos (Greece), Pylos (Greece), Poros (Greece)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 5.0,
    cabin_rating         = 4.0,
    route_rating         = 4.0,
    gastronomy_rating    = 4.0,
    entertainment_rating = 3.0,
    sport_rating         = 2.0,
    wellness_rating      = 2.0,
    service_rating       = 4.0,
    title                = 'Customer review for Sea Cloud II (travel period June 2026) by Finest Cruise Moments cruisers',
    description          = '9 days Eastern Mediterranean with the Sea Cloud II. A wonderful experience aboard this magnificent tall ship. The combination of sailing tradition and modern comfort exceeded our expectations. The crew was attentive and professional throughout the voyage.',
    read_count           = 20,
    helpful_count        = 15,
    not_helpful_count    = 2
  WHERE id = ids[1];

  -- ── Review 2: April 24, 2026 — rating 4.1 ────────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 3,
    travel_duration      = 8,
    destination          = 'Western Mediterranean',
    countries            = 'Spain, France, Italy',
    ports                = 'Barcelona (Spain), Marseille (France), Nice (France), Genoa (Italy), Civitavecchia / Rome (Italy)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 4.5,
    cabin_rating         = 4.5,
    route_rating         = 4.0,
    gastronomy_rating    = 4.5,
    entertainment_rating = 3.5,
    sport_rating         = 3.0,
    wellness_rating      = 3.0,
    service_rating       = 4.5,
    title                = 'Customer review for Sea Cloud II (travel period April 2026)',
    description          = 'A superb Mediterranean voyage. The ship has a unique romantic atmosphere that you cannot find on modern cruise ships. The food quality was exceptional thanks to the Chaîne des Rôtisseurs membership.',
    read_count           = 14,
    helpful_count        = 10,
    not_helpful_count    = 1
  WHERE id = ids[2];

  -- ── Review 3: January 3, 2025 — rating 5.0 ───────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 5,
    travel_duration      = 14,
    destination          = 'Caribbean',
    countries            = 'Barbados, Martinique, St. Maarten, Dominican Republic',
    ports                = 'Bridgetown (Barbados), Fort-de-France (Martinique), Philipsburg (St. Maarten), Santo Domingo (Dominican Republic)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 5.0,
    cabin_rating         = 5.0,
    route_rating         = 5.0,
    gastronomy_rating    = 5.0,
    entertainment_rating = 4.5,
    sport_rating         = 4.0,
    wellness_rating      = 4.0,
    service_rating       = 5.0,
    title                = 'Absolutely perfect Caribbean voyage — Sea Cloud II at its best',
    description          = 'This was our fifth cruise with Sea Cloud II and every voyage gets better. The Caribbean itinerary was breathtaking — the ship fits perfectly in the smaller bays and ports that larger ships cannot reach. The crew set the sails by hand and it is always a magical sight.',
    read_count           = 32,
    helpful_count        = 28,
    not_helpful_count    = 0
  WHERE id = ids[3];

  -- ── Review 4: June 5, 2024 — rating 4.3 ─────────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 1,
    travel_duration      = 11,
    destination          = 'Eastern Mediterranean',
    countries            = 'Greece, Turkey',
    ports                = 'Piraeus / Athens (Greece), Mykonos (Greece), Santorini (Greece), Rhodes (Greece), Bodrum (Turkey)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 4.5,
    cabin_rating         = 4.5,
    route_rating         = 4.5,
    gastronomy_rating    = 4.0,
    entertainment_rating = 3.5,
    sport_rating         = 3.0,
    wellness_rating      = 3.0,
    service_rating       = 4.5,
    title                = 'Beautiful Greek islands voyage on a unique sailing ship',
    description          = 'Our first time on a sailing ship and we were completely won over. The atmosphere aboard Sea Cloud II is unlike anything on modern cruise ships. Relaxed, personal and with a genuine connection to the sea.',
    read_count           = 18,
    helpful_count        = 12,
    not_helpful_count    = 1
  WHERE id = ids[4];

  -- ── Review 5: April 21, 2024 — rating 5.0 ────────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 4,
    travel_duration      = 8,
    destination          = 'Western Mediterranean',
    countries            = 'Portugal, Spain',
    ports                = 'Lisbon (Portugal), Cascais (Portugal), Cadiz (Spain), Malaga (Spain), Cartagena (Spain), Valencia (Spain)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 5.0,
    cabin_rating         = 5.0,
    route_rating         = 5.0,
    gastronomy_rating    = 5.0,
    entertainment_rating = 4.0,
    sport_rating         = 4.0,
    wellness_rating      = 4.0,
    service_rating       = 5.0,
    title                = 'Perfect spring voyage along the Iberian coast',
    description          = 'Spring on the Iberian coast with Sea Cloud II is simply magical. The weather was ideal for sailing, the ports were authentic and uncrowded, and the on-board experience was flawless as always.',
    read_count           = 25,
    helpful_count        = 22,
    not_helpful_count    = 0
  WHERE id = ids[5];

  -- ── Review 6: March 1, 2024 — rating 4.9 ────────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 3,
    travel_duration      = 8,
    destination          = 'Caribbean',
    countries            = 'Barbados, St. Lucia, Dominica, Guadeloupe',
    ports                = 'Bridgetown (Barbados), Castries (St. Lucia), Roseau (Dominica), Pointe-à-Pitre (Guadeloupe)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 5.0,
    cabin_rating         = 5.0,
    route_rating         = 5.0,
    gastronomy_rating    = 4.5,
    entertainment_rating = 4.0,
    sport_rating         = 3.5,
    wellness_rating      = 3.5,
    service_rating       = 5.0,
    title                = 'Unforgettable Caribbean sailing experience',
    description          = 'The Caribbean with Sea Cloud II offers an experience completely different from mainstream cruising. Smaller, more authentic ports, a relaxed atmosphere, and the pleasure of sailing under canvas.',
    read_count           = 22,
    helpful_count        = 18,
    not_helpful_count    = 1
  WHERE id = ids[6];

  -- ── Review 7: November 19, 2023 — rating 4.3 ────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 2,
    travel_duration      = 11,
    destination          = 'Canary Islands & Morocco',
    countries            = 'Spain, Morocco',
    ports                = 'Las Palmas (Gran Canaria), Tenerife (Spain), Agadir (Morocco), Casablanca (Morocco), Malaga (Spain)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 4.5,
    cabin_rating         = 4.0,
    route_rating         = 4.5,
    gastronomy_rating    = 4.5,
    entertainment_rating = 3.5,
    sport_rating         = 3.0,
    wellness_rating      = 3.0,
    service_rating       = 4.5,
    title                = 'Canary Islands and Morocco — a fascinating combination',
    description          = 'The combination of the Canary Islands and Morocco made for a varied and fascinating voyage. Sea Cloud II handled the Atlantic swell beautifully and the crew were superb as always.',
    read_count           = 16,
    helpful_count        = 11,
    not_helpful_count    = 2
  WHERE id = ids[7];

  -- ── Review 8: October 4, 2023 — rating 4.6 (suite) ──────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = TRUE,
    cruise_count         = 6,
    travel_duration      = 9,
    destination          = 'Eastern Mediterranean',
    countries            = 'Italy, Greece',
    ports                = 'Venice (Italy), Dubrovnik (Croatia), Kotor (Montenegro), Corfu (Greece), Kefalonia (Greece), Zakynthos (Greece)',
    cabin_type           = 'suite',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 5.0,
    cabin_rating         = 5.0,
    route_rating         = 4.5,
    gastronomy_rating    = 4.5,
    entertainment_rating = 4.0,
    sport_rating         = 3.5,
    wellness_rating      = 3.5,
    service_rating       = 5.0,
    title                = 'Owner Suite experience — absolute luxury on the Adriatic',
    description          = 'We treated ourselves to the Owner Suite for our sixth Sea Cloud II voyage. The four-poster bed, the fireplace, the panoramic windows — it is an extraordinary experience. The Adriatic itinerary visiting smaller ports was perfect.',
    read_count           = 29,
    helpful_count        = 24,
    not_helpful_count    = 0
  WHERE id = ids[8];

  -- ── Review 9: October 4, 2023 — rating 3.8 ──────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = FALSE,
    cruise_count         = 1,
    travel_duration      = 9,
    destination          = 'Eastern Mediterranean',
    countries            = 'Italy, Greece',
    ports                = 'Venice (Italy), Dubrovnik (Croatia), Kotor (Montenegro), Corfu (Greece), Kefalonia (Greece), Zakynthos (Greece)',
    cabin_type           = 'Outside',
    travelled_as         = 'Solo',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 4.0,
    cabin_rating         = 3.5,
    route_rating         = 4.0,
    gastronomy_rating    = 4.0,
    entertainment_rating = 3.0,
    sport_rating         = 2.5,
    wellness_rating      = 2.5,
    service_rating       = 4.0,
    title                = 'Good experience but some things fell short of expectations',
    description          = 'The ship itself is beautiful and the concept is wonderful. However, some of the facilities felt dated and the entertainment options were limited for solo travelers. The food was excellent and the crew professional.',
    read_count           = 11,
    helpful_count        = 7,
    not_helpful_count    = 3
  WHERE id = ids[9];

  -- ── Review 10: January 4, 2023 — rating 3.7 ─────────────
  UPDATE tbl_reviews SET
    user_id              = v_user_id,
    reviewer_name        = 'Finest Cruise Moments Cruisers',
    is_verified          = TRUE,
    recommends_cruise    = FALSE,
    cruise_count         = 1,
    travel_duration      = 11,
    destination          = 'Caribbean',
    countries            = 'Barbados, St. Vincent, Grenada',
    ports                = 'Bridgetown (Barbados), Kingstown (St. Vincent), St. George (Grenada), Bequia (St. Vincent and the Grenadines)',
    cabin_type           = 'Outside',
    travelled_as         = 'Couple',
    children_in_group    = FALSE,
    cruiser_type         = 'Classic & elegant',
    ship_rating          = 4.0,
    cabin_rating         = 3.5,
    route_rating         = 4.0,
    gastronomy_rating    = 3.5,
    entertainment_rating = 3.0,
    sport_rating         = 2.5,
    wellness_rating      = 2.5,
    service_rating       = 4.0,
    title                = 'Romantic but overpriced for the level of service',
    description          = 'The Sea Cloud II concept is unique and the ship is genuinely beautiful. However, we felt the price-to-service ratio was not fully met on this particular voyage. Some crew members were exceptional, others less so. The Caribbean ports were lovely.',
    read_count           = 9,
    helpful_count        = 5,
    not_helpful_count    = 4
  WHERE id = ids[10];

END;
$$;
