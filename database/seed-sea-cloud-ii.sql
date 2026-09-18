-- ============================================================
-- SEED: Sea Cloud II — Full Data
-- Run this after your shipping company is already inserted.
-- ============================================================

-- ── STEP 1: Get the ship ID (we use a variable pattern via CTE) ──
-- First update the ship's null fields
UPDATE tbl_ships SET
  description            = 'Sea Cloud II is a three-masted barque offering an intimate sailing experience with classic elegance. Launched in 2001, this magnificent tall ship combines Windjammer romance with stylish modern comfort. Mahogany, brass, and the creaking of the rigging create an atmosphere of another era – without sacrificing modern amenities.',
  year_of_construction   = 2001,
  tonnage                = 3849.00,
  length_meters          = 117.00,
  width_meters           = 16.00,
  speed_knots            = 14.00,
  flag                   = 'Malta',
  shipyard               = 'Astilleros Gondan, Figueres',
  number_of_decks        = 4,
  passenger_capacity     = 94,
  crew_members           = 65,
  restaurant_count       = 1,
  onboard_language       = 'German',
  onboard_currency       = 'Euro',
  facts                  = '{
    "source_ship_code": "SCII",
    "highlights": [
      "A magnificent tall ship with a romantic atmosphere",
      "Luxurious, nostalgic flair",
      "Exquisite cuisine from the Chaîne de Rôtisseurs",
      "Nostalgia meets modern luxury"
    ],
    "sail_count": 23,
    "sail_area_sqm": 3000,
    "cabin_count": 47,
    "water_sports_platform": true
  }'
WHERE slug = 'sea-cloud-ii';


-- ── STEP 2: Ship content sections (description sections) ────
-- We need the ship id for inserts below — wrap in a DO block
DO $$
DECLARE
  v_ship_id UUID;
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  -- ── Content sections ──────────────────────────────────────
  INSERT INTO tbl_ship_content_sections (id, ship_id, section_key, title, content, sort_order) VALUES
    (gen_random_uuid(), v_ship_id, 'intro', 'Nostalgia meets modern luxury',
     'When you step aboard the Sea Cloud II, you will be welcomed into a world where sailing tradition comes alive. This three-masted ship combines classic windjammer romance with stylish comfort. Mahogany, brass, and the creaking of the rigging create an atmosphere that transports you to another era – without sacrificing modern amenities.

The Sea Cloud II luxury cruise appeals to travelers seeking something special. It is not about size or spectacle, but about the tranquility of the sea, the power of the wind, and the elegance of a true sailing ship. Small Mediterranean ports, hidden Caribbean coves, and the joy of gliding under full sail – these are the moments that truly matter on this journey.', 1),

    (gen_random_uuid(), v_ship_id, 'philosophy', 'Windjammer philosophy with a luxurious aspiration',
     'The Sea Cloud II offers an experience that deliberately sets itself apart from conventional cruises. For decades, Sea Cloud Cruises has cultivated the art of sailing – not as a nostalgic add-on, but as a central element of every voyage. Launched in 2001, the three-masted ship measures 117 meters and carries 23 sails with a total sail area of 3,000 square meters. These are traditionally set by hand by a crew of 15 – a spectacle you can witness from the deck.

The ship''s philosophy blends maritime tradition with contemporary luxury. While modern cruise ships focus on entertainment and programs, the Sea Cloud II offers something different: a focus on the essentials. The sound of the wind in the sails, the rhythm of the waves, the stillness of the open sea – these are the sounds that dominate on board.', 2),

    (gen_random_uuid(), v_ship_id, 'onboard_culture', 'Sailing experience and onboard culture',
     'Life on board follows a natural rhythm. The crew prepares the sails, climbs into the rigging, and coordinates maneuvers. Guests experience an authentic tall ship feeling without sacrificing comfort. The atmosphere is friendly and relaxed. Casual attire is appropriate; there are no formal evenings. Instead, conversations over a glass of wine on the Lido Deck, views of the horizon, and a shared fascination with sailing shape daily life.', 3),

    (gen_random_uuid(), v_ship_id, 'culinary', 'Culinary delights at sea',
     'The cuisine aboard Sea Cloud II is a member of the Chaîne des Rôtisseurs, an international association of gastronomic excellence. The main restaurant serves international dishes with regional touches. Fresh market ingredients, local specialties, and a French influence characterize the menus.

Breakfast is served buffet-style with an egg station. Lunch is a combination of buffet and table service, often on the Lido Deck with barbecue options. Afternoon tea and coffee are served with snacks. Dinner is a four-course à la carte menu with a vegetarian option. Selected wines and beers with lunch and dinner, as well as soft drinks, coffee, and tea, are included in the price.', 4),

    (gen_random_uuid(), v_ship_id, 'equipment', 'Equipment and onboard life',
     'The ship spans four decks and offers an elegant lounge, a library, a fitness center, a massage and beauty salon, and a boutique. The Lido Bar is a popular meeting place for drinks with a sea view. Instead of a pool, the Sea Cloud II features a fold-down platform for water sports, allowing direct access to the sea for swimming and snorkeling in tranquil bays.', 5),

    (gen_random_uuid(), v_ship_id, 'routes', 'Routes and sailing areas',
     'The Sea Cloud II connects regions ideal for sailing ships. In the Mediterranean, routes lead from Lisbon to Barcelona, along the French and Italian Rivieras, to Sardinia, Corsica, Sicily, and Greece. In the Caribbean, the ship cruises between St. Maarten and Barbados from January to April. Transatlantic crossings between the Canary Islands and Guadeloupe mark the changing of seasons – 17-day voyages under full sail that are highlights for sailing enthusiasts.', 6)

  ON CONFLICT (ship_id, section_key) DO UPDATE
    SET title = EXCLUDED.title, content = EXCLUDED.content;


  -- ── Decks ─────────────────────────────────────────────────
  DECLARE
    v_deck1_id UUID := gen_random_uuid();
    v_deck2_id UUID := gen_random_uuid();
    v_deck3_id UUID := gen_random_uuid();
    v_deck4_id UUID := gen_random_uuid();
  BEGIN
    INSERT INTO tbl_ship_decks (id, ship_id, name, deck_number, description, sort_order) VALUES
      (v_deck1_id, v_ship_id, 'Cabin Deck 1',    1, 'Main cabin deck with outside cabins categories D, E and F. Also houses hospital, fitness area, sauna and water sports platform.', 1),
      (v_deck2_id, v_ship_id, 'Promenade Deck 2', 2, 'Promenade deck with outside cabins category C, Junior Suites (B) and restaurant. Also houses reception and boutique.', 2),
      (v_deck3_id, v_ship_id, 'Lido Deck 3',      3, 'Lido deck with Owner Suites (A). Features the Lido Bar, open deck space and panoramic views.', 3),
      (v_deck4_id, v_ship_id, 'Sun Deck 4',       4, 'Sun deck – no cabins. Features Kapitän Brücke (captain bridge) area. Open deck for relaxation.', 4);


    -- ── Cabin categories ──────────────────────────────────────
    INSERT INTO tbl_cabin_categories (id, ship_id, code, name, description, max_occupancy, amenities, images) VALUES
      (gen_random_uuid(), v_ship_id, 'F', 'Outside Cabin with Upper and Lower Berths',
       'approx. 12 sq m. Outside cabin with 2 portholes and 1 upper and 1 lower bed. Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
       2,
       '["hairdryer","bathrobe","armchair","table","dressing table","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning","power outlet for razor"]',
       '[]'),

      (gen_random_uuid(), v_ship_id, 'E', 'Deluxe Outside Cabin',
       'approx. 16 sq m. Outside cabin with 2 portholes and 1 Queen-size bed (separable). Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
       2,
       '["hairdryer","bathrobe","2 armchairs","table","dressing table","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning","power outlet for razor"]',
       '[]'),

      (gen_random_uuid(), v_ship_id, 'D', 'Deluxe Outside Cabin',
       'approx. 19 sq m. Outside cabin with 2 portholes and 1 Queen-size bed (separable). Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
       2,
       '["hairdryer","bathrobe","2 armchairs","table","dressing table","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning","power outlet for razor"]',
       '[]'),

      (gen_random_uuid(), v_ship_id, 'C', 'Deluxe Outside Cabin (Promenade)',
       'Deluxe outside cabin on Promenade Deck 2 with large windows and sitting area.',
       2,
       '["hairdryer","bathrobe","armchairs","table","dressing table","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning"]',
       '[]'),

      (gen_random_uuid(), v_ship_id, 'B', 'Junior Suite',
       'approx. 23 sq m. Large windows, high-quality furnishings, marble bathroom with bathtub. Located on Promenade Deck 2.',
       2,
       '["hairdryer","bathrobe","sitting area","marble bathroom with bathtub","armchairs","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning"]',
       '[]'),

      (gen_random_uuid(), v_ship_id, 'A', 'Owner Suite',
       'approx. 27 sq m. Located on Lido Deck with panoramic windows, four-poster bed, fireplace and spacious marble bathroom with bathtub and separate shower.',
       2,
       '["panoramic windows","four-poster bed","fireplace","marble bathroom with bathtub and separate shower","sitting area","wardrobe","TV and Video","phone","safe","mini-bar","adjustable air conditioning"]',
       '[]')

    ON CONFLICT (ship_id, code) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description,
          max_occupancy = EXCLUDED.max_occupancy, amenities = EXCLUDED.amenities;

  END;
END;
$$;


-- ── STEP 3: Reviews ───────────────────────────────────────────
DO $$
DECLARE
  v_ship_id UUID;
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  INSERT INTO tbl_reviews (
    id, ship_id, cruise_id, user_id, travel_date, cabin_type,
    rating, ship_rating, cabin_rating, gastronomy_rating,
    entertainment_rating, sport_rating, wellness_rating, service_rating,
    status, created_at, updated_at
  ) VALUES
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2026-06-25', 'Outside', 3.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2026-04-24', 'Outside', 4.1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2025-01-03', 'Outside', 5.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2024-06-05', 'Outside', 4.3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2024-04-21', 'Outside', 5.0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2024-03-01', 'Outside', 4.9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2023-11-19', 'Outside', 4.3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2023-10-04', 'suite',   4.6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2023-10-04', 'Outside', 3.8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW()),
    (gen_random_uuid(), v_ship_id, NULL, NULL, '2023-01-04', 'Outside', 3.7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'approved', NOW(), NOW());

END;
$$;


-- ── STEP 4: Cruises (Route calendar) ─────────────────────────
DO $$
DECLARE
  v_ship_id    UUID;
  v_company_id UUID;
BEGIN
  SELECT id INTO v_ship_id    FROM tbl_ships             WHERE slug = 'sea-cloud-ii';
  SELECT id INTO v_company_id FROM tbl_shipping_companies WHERE slug = 'sea-cloud-cruises';

  INSERT INTO tbl_cruises (
    id, shipping_company_id, ship_id, name, slug, status,
    duration_days, start_date, end_date,
    price_per_person, currency, short_description
  ) VALUES
    (gen_random_uuid(), v_company_id, v_ship_id,
     'Málaga to Las Palmas', 'scii-malaga-laspalmas-oct2026', 'published',
     11, '2026-10-26', '2026-11-05', 6790.00, 'EUR',
     'Málaga (Spain) - Las Palmas (Gran Canaria, Canary Islands)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Las Palmas to Bridgetown (Transatlantic)', 'scii-laspalmas-bridgetown-nov2026', 'published',
     18, '2026-11-21', '2026-12-08', 8810.00, 'EUR',
     'Las Palmas (Gran Canaria, Canary Islands) - Bridgetown (Barbados)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Bridgetown Caribbean Loop', 'scii-bridgetown-loop-dec2026a', 'published',
     8, '2026-12-08', '2026-12-15', 4800.00, 'EUR',
     'Bridgetown (Barbados) - Bridgetown (Barbados)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Bridgetown Caribbean Loop', 'scii-bridgetown-loop-dec2026b', 'published',
     8, '2026-12-15', '2026-12-22', 4800.00, 'EUR',
     'Bridgetown (Barbados) - Bridgetown (Barbados)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Bridgetown to Santo Domingo', 'scii-bridgetown-santodomingo-dec2026', 'published',
     14, '2026-12-22', '2027-01-04', 8990.00, 'EUR',
     'Bridgetown (Barbados) - Santo Domingo (Dominican Republic)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Philipsburg Caribbean Round', 'scii-philipsburg-loop-mar2027', 'published',
     11, '2027-03-15', '2027-03-25', 6790.00, 'EUR',
     'Philipsburg (St. Maarten) - Philipsburg (St. Maarten)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Lisbon to Tarragona', 'scii-lisbon-tarragona-apr2027', 'published',
     10, '2027-04-14', '2027-04-23', 6190.00, 'EUR',
     'Lisbon (Portugal) - Tarragona (Spain)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Tarragona to Nice', 'scii-tarragona-nice-apr2027', 'published',
     5, '2027-04-23', '2027-04-27', 2760.00, 'EUR',
     'Tarragona (Spain) - Nice (France)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Nice to Civitavecchia / Rome', 'scii-nice-rome-apr2027', 'published',
     8, '2027-04-27', '2027-05-04', 4790.00, 'EUR',
     'Nice (France) - Civitavecchia / Rome (Italy)'),

    (gen_random_uuid(), v_company_id, v_ship_id,
     'Nice to Civitavecchia / Rome', 'scii-nice-rome-may2027', 'published',
     5, '2027-05-15', '2027-05-19', 2760.00, 'EUR',
     'Nice (France) - Civitavecchia / Rome (Italy)')

  ON CONFLICT (slug) DO NOTHING;

END;
$$;


-- ── STEP 5: Onboard prices (stored in ship facts JSONB) ──────
-- We store prices on board inside the ship facts column
UPDATE tbl_ships SET
  facts = facts || '{
    "prices_on_board": {
      "drinks": {
        "non_alcoholic": [
          { "item": "Mineral water",              "unit": "",      "price": "including" },
          { "item": "Soft drinks (Coca-Cola etc)", "unit": "",      "price": "including" }
        ],
        "alcoholic": [
          { "item": "Draft beer",  "unit": "Glass", "price": "approx. 4.00" },
          { "item": "Red wine",    "unit": "Glass", "price": "from 5.00" },
          { "item": "White wine",  "unit": "Glass", "price": "from 5.00" },
          { "item": "Champagne",   "unit": "Glass", "price": "approx. 7.50" },
          { "item": "Cocktails",   "unit": "Glass", "price": "approx. 9.00" }
        ],
        "hot_drinks": [
          { "item": "Coffee",          "unit": "cup", "price": "including" },
          { "item": "Cappuccino",      "unit": "cup", "price": "including" },
          { "item": "Latte Macchiato", "unit": "cup", "price": "including" },
          { "item": "Espresso",        "unit": "cup", "price": "including" },
          { "item": "Tea",             "unit": "cup", "price": "including" }
        ]
      },
      "sport": [
        { "item": "Fitness area",  "unit": "", "price": "including" },
        { "item": "Water sports",  "unit": "", "price": "including" }
      ],
      "wellness_beauty": [
        { "item": "Sauna", "unit": "", "price": "including" }
      ],
      "internet": [
        { "item": "Package deal", "unit": "500 MB", "price": "20.00" },
        { "item": "Package deal", "unit": "250 MB", "price": "10.00" }
      ],
      "other_services": {
        "gifts": [
          { "item": "Fruit basket", "unit": "",        "price": "including" }
        ],
        "laundry": [
          { "item": "Wash", "unit": "1 piece", "price": "from 5.00" }
        ]
      },
      "note": "The above prices are indicative and are subject to change."
    }
  }'::jsonb
WHERE slug = 'sea-cloud-ii';
