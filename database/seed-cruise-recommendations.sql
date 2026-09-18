-- ============================================================
-- SEED: Cruises + tbl_cruise_recommendations
-- Uses the real recommendation IDs already in your database.
-- Run this AFTER seed-ships.sql so companies/ships exist.
-- ============================================================

-- ── Recommendation slugs (already in your DB) ────────────────
-- last-minute-luxuskreuzfahrten   → Last Minute Cruises
-- all-inclusive-luxuskreuzfahrten → All-inclusive cruises
-- uxuskreuzfahrten-mit-flug       → Cruises with flights
-- luxus-expeditionskreuzfahrten   → Expedition cruises
-- luxuskreuzfahrten-kleine-schiffe→ Cruises on small ships
-- luxus-segelkreuzfahrten         → Sailing cruises
-- All INSERTs use slug-based subqueries — no hardcoded UUIDs.

-- ── Update descriptions on existing recommendations ───────────
UPDATE tbl_recommendations
SET description = 'Your moment of spontaneity

Sometimes the most wonderful travel dreams arise spontaneously. Last minute bookings with Finest Cruise Moments don''t mean compromising on comfort or quality, but rather the chance for a spontaneous vacation on an exclusive luxury ship. We offer you the perfect selection for your spontaneous travel desire.

Upon request, your personal Cruise Consultant will also advise you on the currently available last minute offers from the most renowned shipping companies and find the right trip for you.

Find your last-minute luxury experience – discover it now at Finest Cruise Moments.'
WHERE slug = 'last-minute-luxuskreuzfahrten';

UPDATE tbl_recommendations
SET description = 'Everything included — from gourmet dining to premium beverages, excursions, and gratuities. All-inclusive luxury cruises let you fully relax without thinking about extras. Discover our handpicked selection of the finest all-inclusive voyages on the world''s most prestigious ships.'
WHERE slug = 'all-inclusive-luxuskreuzfahrten';

UPDATE tbl_recommendations
SET description = 'No transfer stress, no separate booking — our cruises with flights combine seamless air travel with your luxury voyage. Depart from your home airport and step aboard your dream ship with everything arranged for you.'
WHERE slug = 'uxuskreuzfahrten-mit-flug';

UPDATE tbl_recommendations
SET description = 'Push beyond the beaten path. Our expedition cruises take you to the world''s most remote and breathtaking destinations — from the Arctic and Antarctica to the Amazon and the Galápagos — aboard purpose-built ships with expert guides.'
WHERE slug = 'luxus-expeditionskreuzfahrten';

UPDATE tbl_recommendations
SET description = 'Intimacy, authenticity, and personal service. Small ships reach hidden harbours, anchor in secluded bays, and offer an atmosphere closer to a private yacht than a floating resort. Ideal for travellers who value exclusivity over scale.'
WHERE slug = 'luxuskreuzfahrten-kleine-schiffe';

UPDATE tbl_recommendations
SET description = 'Hoist the sails and feel the wind. Luxury sailing cruises combine the romance of traditional seafaring with five-star service and gourmet cuisine. Experience the Mediterranean, Caribbean, and beyond under full canvas.'
WHERE slug = 'luxus-segelkreuzfahrten';


-- ============================================================
-- STEP 1 – Fixed UUIDs for ships (look them up once)
-- We store the ship/company IDs in a temp table so the cruise
-- INSERTs below can reference them by name instead of raw UUID.
-- ============================================================

CREATE TEMP TABLE _ships AS
SELECT id, slug FROM tbl_ships WHERE deleted_at IS NULL;

CREATE TEMP TABLE _companies AS
SELECT id, slug FROM tbl_shipping_companies WHERE deleted_at IS NULL;


-- ============================================================
-- STEP 2 – Ports (idempotent)
-- ============================================================

INSERT INTO tbl_ports (id, name, country, country_code, latitude, longitude) VALUES
  ('aa000001-0000-0000-0000-000000000001', 'Papeete',          'French Polynesia', 'PF', -17.5334, -149.5667),
  ('aa000001-0000-0000-0000-000000000002', 'Piraeus',           'Greece',           'GR',  37.9475,   23.6430),
  ('aa000001-0000-0000-0000-000000000003', 'Venice',            'Italy',            'IT',  45.4408,   12.3155),
  ('aa000001-0000-0000-0000-000000000004', 'Barcelona',         'Spain',            'ES',  41.3851,    2.1734),
  ('aa000001-0000-0000-0000-000000000005', 'Lisbon',            'Portugal',         'PT',  38.7167,   -9.1395),
  ('aa000001-0000-0000-0000-000000000006', 'Dubai',             'UAE',              'AE',  25.2048,   55.2708),
  ('aa000001-0000-0000-0000-000000000007', 'Singapore',         'Singapore',        'SG',   1.3521,  103.8198),
  ('aa000001-0000-0000-0000-000000000008', 'Longyearbyen',      'Norway',           'NO',  78.2232,   15.6469),
  ('aa000001-0000-0000-0000-000000000009', 'Tromsø',            'Norway',           'NO',  69.6492,   18.9553),
  ('aa000001-0000-0000-0000-000000000010', 'Ushuaia',           'Argentina',        'AR', -54.8019,  -68.3030),
  ('aa000001-0000-0000-0000-000000000011', 'Civitavecchia',     'Italy',            'IT',  42.0940,   11.7994),
  ('aa000001-0000-0000-0000-000000000012', 'Monte Carlo',       'Monaco',           'MC',  43.7384,    7.4246),
  ('aa000001-0000-0000-0000-000000000013', 'Valletta',          'Malta',            'MT',  35.8997,   14.5147),
  ('aa000001-0000-0000-0000-000000000014', 'Bridgetown',        'Barbados',         'BB',  13.0975,  -59.6167),
  ('aa000001-0000-0000-0000-000000000015', 'Fort Lauderdale',   'USA',              'US',  26.1224,  -80.1373),
  ('aa000001-0000-0000-0000-000000000016', 'Reykjavik',         'Iceland',          'IS',  64.1355,  -21.8954),
  ('aa000001-0000-0000-0000-000000000017', 'Hamburg',           'Germany',          'DE',  53.5753,    9.9752),
  ('aa000001-0000-0000-0000-000000000018', 'Funchal',           'Portugal',         'PT',  32.6502,  -16.9083),
  ('aa000001-0000-0000-0000-000000000019', 'Bora Bora',         'French Polynesia', 'PF', -16.5004, -151.7415),
  ('aa000001-0000-0000-0000-000000000020', 'Dubrovnik',         'Croatia',          'HR',  42.6507,   18.0944)
ON CONFLICT (name, country) DO NOTHING;


-- ============================================================
-- STEP 3 – Cruises  (20 cruises across all 6 recommendation types)
-- ============================================================

INSERT INTO tbl_cruises (
  id, shipping_company_id, ship_id,
  name, slug, cruise_code, status,
  duration_days, start_date, end_date,
  start_port_id, end_port_id,
  price_per_person, currency,
  short_description, description, highlights
) VALUES

-- ── 1. South Seas - from/to Papeete (Last Minute + Small ships + Sailing) ──
(
  'cc000001-0000-0000-0000-000000000001',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'ms-europa'),
  'South Seas - from/to Papeete',
  'south-seas-papeete-2026-oct',
  'EU-82833',
  'published',
  8,
  '2026-10-01', '2026-10-09',
  'aa000001-0000-0000-0000-000000000001',
  'aa000001-0000-0000-0000-000000000001',
  3510.00, 'EUR',
  'Eight days through the magical islands of French Polynesia aboard MS EUROPA.',
  'Experience the South Seas in unparalleled luxury. MS EUROPA takes you through the stunning island world of French Polynesia — turquoise lagoons, palm-fringed beaches, and the warm hospitality of the local people await you.',
  '["Bora Bora overnight anchorage", "Private beach barbecue", "Polynesian cultural show", "Snorkeling in coral gardens"]'
),

-- ── 2. Eastern Mediterranean – Piraeus to Venice (All-inclusive + Flights) ──
(
  'cc000001-0000-0000-0000-000000000002',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'ms-europa-2'),
  'Eastern Mediterranean – Piraeus to Venice',
  'eastern-mediterranean-piraeus-venice-2026',
  'EU2-111480',
  'published',
  8,
  '2026-10-05', '2026-10-13',
  'aa000001-0000-0000-0000-000000000002',
  'aa000001-0000-0000-0000-000000000003',
  5320.00, 'EUR',
  'A grand journey through the Eastern Mediterranean's most iconic cities.',
  'Sail from the ancient port of Piraeus past the mythical coastlines of Greece and Croatia before arriving in the timeless city of Venice. All-inclusive pricing covers gourmet dining, premium beverages, and select shore excursions.',
  '["Athens Acropolis excursion", "Mykonos free time", "Dubrovnik Old Town", "Venice Grand Canal arrival"]'
),

-- ── 3. Arabia & India – Dubai Roundtrip (All-inclusive + Flights) ──
(
  'cc000001-0000-0000-0000-000000000003',
  (SELECT id FROM _companies WHERE slug = 'silversea-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'silver-moon'),
  'Arabia & India – Dubai Roundtrip',
  'arabia-india-dubai-roundtrip-2026',
  'SS-AID-2026',
  'published',
  14,
  '2026-11-10', '2026-11-24',
  'aa000001-0000-0000-0000-000000000006',
  'aa000001-0000-0000-0000-000000000006',
  7890.00, 'EUR',
  'Discover the jewels of Arabia and India on this all-inclusive voyage.',
  'From the glittering skyline of Dubai, Silver Moon glides into the historic spice ports of Oman, India, and Sri Lanka. Every detail is included — flights, transfers, shore excursions, and fine dining.',
  '["Muscat Mutrah Souq", "Kochi backwaters tour", "Colombo city highlights", "Dubai dune dinner on embarkation night"]'
),

-- ── 4. Arctic Svalbard Expedition (Expedition + Small ships) ──
(
  'cc000001-0000-0000-0000-000000000004',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'hanseatic-nature'),
  'Arctic Svalbard – Wilderness & Polar Bears',
  'arctic-svalbard-hanseatic-nature-2026',
  'HN-SVA-2026',
  'published',
  11,
  '2026-07-15', '2026-07-26',
  'aa000001-0000-0000-0000-000000000008',
  'aa000001-0000-0000-0000-000000000008',
  9250.00, 'EUR',
  'Explore the breathtaking High Arctic aboard the expedition ship HANSEATIC nature.',
  'Svalbard''s dramatic fjords, glaciers, and polar wildlife await. HANSEATIC nature carries Zodiac landing craft and a team of expert naturalist guides who bring this pristine wilderness to life. Polar bear encounters, walrus colonies, and midnight sun photography are highlights of this extraordinary voyage.',
  '["Zodiac landings in remote fjords", "Polar bear safari", "Glacier trekking", "Midnight sun photography workshop"]'
),

-- ── 5. Antarctica – End of the World (Expedition + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000005',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'hanseatic-spirit'),
  'Antarctica – Voyage to the White Continent',
  'antarctica-hanseatic-spirit-2026-dec',
  'HS-ANT-2026',
  'published',
  15,
  '2026-12-01', '2026-12-16',
  'aa000001-0000-0000-0000-000000000010',
  'aa000001-0000-0000-0000-000000000010',
  14500.00, 'EUR',
  'The ultimate polar adventure — sail to Antarctica on the luxury expedition ship HANSEATIC spirit.',
  'Cross the legendary Drake Passage and enter a world of towering icebergs, penguin rookeries, and pristine silence. HANSEATIC spirit''s PC6 ice-class hull and Zodiacs allow landings on the Antarctic Peninsula unavailable to larger vessels.',
  '["Drake Passage crossing", "Zodiac landings on the Antarctic Peninsula", "Penguin rookery visits", "Onboard polar science program"]'
),

-- ── 6. Mediterranean Sailing – Sea Cloud Spirit (Sailing + Small ships) ──
(
  'cc000001-0000-0000-0000-000000000006',
  (SELECT id FROM _companies WHERE slug = 'sea-cloud-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'sea-cloud-spirit'),
  'Mediterranean Under Sail – Sea Cloud Spirit',
  'mediterranean-sail-sea-cloud-spirit-2026',
  'SCS-MED-2026',
  'published',
  7,
  '2026-09-20', '2026-09-27',
  'aa000001-0000-0000-0000-000000000011',
  'aa000001-0000-0000-0000-000000000012',
  4100.00, 'EUR',
  'A week of pure sailing magic through the Italian and French Riviera.',
  'Sea Cloud Spirit combines the romance of a tall ship with modern five-star comforts. Watch the crew set 30 sails by hand as you glide between the gems of the western Mediterranean — Portofino, Corsica, Sardinia, and Monte Carlo.',
  '["Hand-set square sails", "Portofino harbour anchorage", "Corsican village market visit", "Monte Carlo arrival by sail"]'
),

-- ── 7. Sea Cloud II – Greek Islands Sailing (Sailing + Small ships + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000007',
  (SELECT id FROM _companies WHERE slug = 'sea-cloud-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'sea-cloud-ii'),
  'Greek Islands Sailing – Sea Cloud II',
  'greek-islands-sea-cloud-ii-2026-oct',
  'SCII-GRK-2026',
  'published',
  8,
  '2026-10-12', '2026-10-20',
  'aa000001-0000-0000-0000-000000000002',
  'aa000001-0000-0000-0000-000000000013',
  5600.00, 'EUR',
  'Sail through the Aegean on the iconic three-masted barque Sea Cloud II.',
  'With just 96 guests aboard the legendary Sea Cloud II, this voyage is among the most intimate ways to experience the Greek islands. Anchor in secluded bays, explore ancient ruins, and dine under a canopy of stars on the teak deck.',
  '["Santorini caldera anchorage", "Ancient Delos excursion", "Ouzo tasting in Chios", "Open-air deck dinner in the Aegean"]'
),

-- ── 8. Northern Lights – Norway (Expedition + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000008',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'hanseatic-inspiration'),
  'Norwegian Fjords & Northern Lights',
  'norway-northern-lights-2026-jan',
  'HI-NNL-2026',
  'published',
  10,
  '2027-01-10', '2027-01-20',
  'aa000001-0000-0000-0000-000000000009',
  'aa000001-0000-0000-0000-000000000017',
  6800.00, 'EUR',
  'Chase the Northern Lights through Norway's spectacular fjords.',
  'Winter in Norway is the season of the aurora borealis. HANSEATIC inspiration navigates deep into the snow-draped fjords of northern Norway, with expert guides on deck every night for Northern Lights watches and photography sessions.',
  '["Aurora borealis watches", "Dog sledding excursion", "Reindeer herding visit", "Ice hotel overnight option"]'
),

-- ── 9. Caribbean Escape – Silver Shadow (All-inclusive + Flights) ──
(
  'cc000001-0000-0000-0000-000000000009',
  (SELECT id FROM _companies WHERE slug = 'silversea-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'silver-shadow'),
  'Caribbean Escape – Barbados to Fort Lauderdale',
  'caribbean-barbados-fort-lauderdale-2026',
  'SS-CAR-2026',
  'published',
  12,
  '2026-12-10', '2026-12-22',
  'aa000001-0000-0000-0000-000000000014',
  'aa000001-0000-0000-0000-000000000015',
  6200.00, 'EUR',
  'Island-hop through the Caribbean in ultra-luxury, all-inclusive style.',
  'Silversea''s Silver Shadow takes you on a sun-drenched journey through the most beautiful islands of the Caribbean. From Barbados to Antigua, St. Kitts, and St. Barts, every port is a new discovery — and every evening returns you to the finest all-inclusive luxury at sea.',
  '["Champagne beach picnic in St. Barts", "Antigua English Harbour tour", "St. Kitts rainforest hike", "Complimentary shore excursions in every port"]'
),

-- ── 10. Atlantic Islands – MS Europa 2 (Last Minute + Flights) ──
(
  'cc000001-0000-0000-0000-000000000010',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'ms-europa-2'),
  'Atlantic Islands – Lisbon to Hamburg',
  'atlantic-islands-lisbon-hamburg-2026',
  'EU2-ATL-2026',
  'published',
  14,
  '2026-10-20', '2026-11-03',
  'aa000001-0000-0000-0000-000000000005',
  'aa000001-0000-0000-0000-000000000017',
  4750.00, 'EUR',
  'Discover Madeira, the Azores, and the Canaries on this Atlantic island-hopping voyage.',
  'MS EUROPA 2 departs Lisbon for a relaxed Atlantic island-hopping cruise calling at Madeira, the Azores, and the Canaries before arriving in Hamburg. Autumn colours, volcanic landscapes, and whale watching make this voyage unforgettable.',
  '["Whale watching off the Azores", "Levada walk in Madeira", "Teide National Park visit", "Transatlantic stargazing nights"]'
),

-- ── 11. Southeast Asia – Azamara (All-inclusive + Flights) ──
(
  'cc000001-0000-0000-0000-000000000011',
  (SELECT id FROM _companies WHERE slug = 'azamara'),
  (SELECT id FROM _ships    WHERE slug = 'azamara-journey'),
  'Southeast Asia Explorer – Singapore Roundtrip',
  'southeast-asia-singapore-roundtrip-2026',
  'AZ-SEA-2026',
  'published',
  14,
  '2027-02-05', '2027-02-19',
  'aa000001-0000-0000-0000-000000000007',
  'aa000001-0000-0000-0000-000000000007',
  5100.00, 'EUR',
  'Immerse yourself in Southeast Asia's colours, flavours, and culture.',
  'Azamara Journey''s longer port stays mean you truly experience each destination. From Singapore, sail to Vietnam, Cambodia, and Thailand — exploring ancient temples, floating markets, and street food scenes with a local expert by your side.',
  '["Ha Long Bay overnight", "Angkor Wat sunrise excursion", "Bangkok canals by longtail boat", "Overnight in Ho Chi Minh City"]'
),

-- ── 12. Icelandic Wonders – MS EUROPA (Expedition + Small ships) ──
(
  'cc000001-0000-0000-0000-000000000012',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'ms-europa'),
  'Icelandic Wonders – Reykjavik Roundtrip',
  'iceland-reykjavik-roundtrip-2026',
  'EU-ICE-2026',
  'published',
  9,
  '2026-08-05', '2026-08-14',
  'aa000001-0000-0000-0000-000000000016',
  'aa000001-0000-0000-0000-000000000016',
  7200.00, 'EUR',
  'Geysers, glaciers, and the midnight sun aboard MS EUROPA.',
  'Iceland''s dramatic volcanic landscapes unfold from the intimate vantage point of MS EUROPA. Circumnavigate the island to discover thundering waterfalls, natural hot springs, puffin colonies, and the ethereal light of the Arctic summer.',
  '["Circumnavigation of Iceland", "Geysir and Gullfoss visit", "Húsavík whale watching", "Natural hot spring bathing"]'
),

-- ── 13. Tahiti & Society Islands – Last Minute (Last Minute + Sailing) ──
(
  'cc000001-0000-0000-0000-000000000013',
  (SELECT id FROM _companies WHERE slug = 'sea-cloud-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'sea-cloud-spirit'),
  'Tahiti & Society Islands – Sea Cloud Spirit',
  'tahiti-society-islands-sea-cloud-spirit-2027',
  'SCS-TAH-2027',
  'published',
  10,
  '2027-01-25', '2027-02-04',
  'aa000001-0000-0000-0000-000000000001',
  'aa000001-0000-0000-0000-000000000019',
  6900.00, 'EUR',
  'Last-minute availability: sail Tahiti''s Society Islands on Sea Cloud Spirit.',
  'A rare last-minute berth has opened on this sought-after voyage. Sea Cloud Spirit visits Tahiti, Moorea, Huahine, Raiatea, and Bora Bora under full sail. Swim in crystal lagoons and snorkel vibrant coral reefs on this paradise cruise.',
  '["Bora Bora lagoon snorkeling", "Vanilla plantation visit in Tahaa", "Traditional Polynesian feast", "Night sailing under the stars"]'
),

-- ── 14. Adriatic & Dalmatian Coast – Azamara (Flights + All-inclusive) ──
(
  'cc000001-0000-0000-0000-000000000014',
  (SELECT id FROM _companies WHERE slug = 'azamara'),
  (SELECT id FROM _ships    WHERE slug = 'azamara-journey'),
  'Adriatic & Dalmatian Coast – Venice to Athens',
  'adriatic-venice-athens-2026',
  'AZ-ADR-2026',
  'published',
  10,
  '2026-09-28', '2026-10-08',
  'aa000001-0000-0000-0000-000000000003',
  'aa000001-0000-0000-0000-000000000002',
  4400.00, 'EUR',
  'Explore Croatia's hidden harbours and Greek antiquity on this all-inclusive Adriatic voyage.',
  'From Venice, Azamara Journey winds south along the Dalmatian coast — calling at Rovinj, Split, Hvar, Kotor, and Corfu before arriving in Athens. Longer stays mean dinners ashore, evening strolls through old towns, and genuine local connections.',
  '["Dubrovnik walls walking tour", "Hvar lavender fields visit", "Kotor Bay sunset sail", "Athens Acropolis morning excursion"]'
),

-- ── 15. Galapagos Expedition (Expedition + Small ships + All-inclusive) ──
(
  'cc000001-0000-0000-0000-000000000015',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'hanseatic-nature'),
  'Galápagos Islands Expedition',
  'galapagos-expedition-hanseatic-nature-2027',
  'HN-GAL-2027',
  'published',
  12,
  '2027-03-10', '2027-03-22',
  'aa000001-0000-0000-0000-000000000010',
  'aa000001-0000-0000-0000-000000000010',
  16200.00, 'EUR',
  'Discover Darwin''s living laboratory on an all-inclusive Galápagos expedition.',
  'The Galápagos Islands remain the world''s finest destination for wildlife encounters at close range. HANSEATIC nature''s size allows access to remote anchorages denied to larger ships. Expert naturalists accompany every Zodiac landing, turning each excursion into a discovery of evolution in action.',
  '["Giant tortoise reserve visit", "Snorkeling with sea lions", "Blue-footed booby nesting grounds", "Charles Darwin Research Station"]'
),

-- ── 16. Western Mediterranean – Silver Moon (All-inclusive + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000016',
  (SELECT id FROM _companies WHERE slug = 'silversea-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'silver-moon'),
  'Western Mediterranean – Barcelona to Civitavecchia',
  'western-mediterranean-barcelona-rome-2026',
  'SM-WMD-2026',
  'published',
  7,
  '2026-10-18', '2026-10-25',
  'aa000001-0000-0000-0000-000000000004',
  'aa000001-0000-0000-0000-000000000011',
  4980.00, 'EUR',
  'Last-minute luxury: the Western Mediterranean''s greatest hits in just seven days.',
  'Silver Moon sails from vibrant Barcelona through the turquoise waters of the Balearics, Sardinia, and Amalfi to arrive in Rome. All-inclusive pricing, butler service in every suite, and Silversea''s renowned cuisine make this the ultimate spontaneous escape.',
  '["Sagrada Família private morning visit", "Mallorca Serra de Tramuntana drive", "Amalfi Coast boat excursion", "Rome city transfer to airport"]'
),

-- ── 17. North Cape & Fjords – HANSEATIC spirit (Expedition) ──
(
  'cc000001-0000-0000-0000-000000000017',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'hanseatic-spirit'),
  'North Cape & Fjords – Tromsø to Hamburg',
  'north-cape-fjords-tromso-hamburg-2026',
  'HS-NCF-2026',
  'published',
  12,
  '2026-08-20', '2026-09-01',
  'aa000001-0000-0000-0000-000000000009',
  'aa000001-0000-0000-0000-000000000017',
  8100.00, 'EUR',
  'Sail Norway''s legendary North Cape route in summer midnight-sun conditions.',
  'HANSEATIC spirit navigates Norway's most dramatic scenery: Geirangerfjord, the Lofoten Islands, and the towering cliff of Nordkapp — Europe''s northernmost point accessible by sea. Summer brings endless daylight, waterfalls in full flow, and eagles overhead.',
  '["North Cape landing", "Geirangerfjord UNESCO cruise", "Lofoten fishing village visit", "Midnight sun kayaking"]'
),

-- ── 18. MS EUROPA – Caribbean (All-inclusive + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000018',
  (SELECT id FROM _companies WHERE slug = 'hapag-lloyd-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'ms-europa'),
  'Caribbean – Bridgetown to Fort Lauderdale',
  'caribbean-bridgetown-fort-lauderdale-eu-2026',
  'EU-CAR-2026',
  'published',
  11,
  '2026-11-28', '2026-12-09',
  'aa000001-0000-0000-0000-000000000014',
  'aa000001-0000-0000-0000-000000000015',
  8700.00, 'EUR',
  'The finest way to experience the Caribbean — aboard the world''s best cruise ship.',
  'MS EUROPA''s intimate scale (just 204 guests) means exclusive anchorages, private beach landings, and an atmosphere closer to a private yacht than a conventional cruise ship. All restaurants operate without reservation in a relaxed, unhurried atmosphere.',
  '["Private island beach landing", "St. Barts champagne morning", "Bequia local fish market", "Sunset cocktails on the bow"]'
),

-- ── 19. Sea Cloud II – Caribbean Sailing (Sailing + Small ships + Flights) ──
(
  'cc000001-0000-0000-0000-000000000019',
  (SELECT id FROM _companies WHERE slug = 'sea-cloud-cruises'),
  (SELECT id FROM _ships    WHERE slug = 'sea-cloud-ii'),
  'Caribbean Sailing – Sea Cloud II Barbados Roundtrip',
  'caribbean-sailing-sea-cloud-ii-2026',
  'SCII-CAR-2026',
  'published',
  10,
  '2026-12-28', '2027-01-07',
  'aa000001-0000-0000-0000-000000000014',
  'aa000001-0000-0000-0000-000000000014',
  7400.00, 'EUR',
  'Spend New Year under the stars aboard the legendary sailing ship Sea Cloud II.',
  'Welcome 2027 at sea on the most romantic ship afloat. Sea Cloud II''s 96 guests gather under 23 sails as the ship glides between Barbados, Grenada, St. Vincent, and the Grenadines. New Year''s Eve dinner on the teak deck is legendary.',
  '["New Year''s Eve dinner under sail", "Tobago Cays snorkeling", "Mustique island visit", "Grenadines lagoon anchorage"]'
),

-- ── 20. Azamara – Holy Land (All-inclusive + Flights + Last Minute) ──
(
  'cc000001-0000-0000-0000-000000000020',
  (SELECT id FROM _companies WHERE slug = 'azamara'),
  (SELECT id FROM _ships    WHERE slug = 'azamara-journey'),
  'Holy Land & Levant – Piraeus to Dubai',
  'holy-land-piraeus-dubai-2026',
  'AZ-HLD-2026',
  'published',
  14,
  '2026-11-02', '2026-11-16',
  'aa000001-0000-0000-0000-000000000002',
  'aa000001-0000-0000-0000-000000000006',
  5850.00, 'EUR',
  'A last-minute opportunity to sail the ancient shores of the Holy Land and Levant.',
  'Azamara Journey''s unique AzAmazing Evenings® bring you private access to historic sites at dusk. Sail from Athens through Cyprus, Israel, Jordan, and Oman to Dubai — experiencing civilisations that have shaped human history for millennia.',
  '["Jerusalem private evening excursion", "Petra by night", "Dead Sea float experience", "Wadi Rum desert sunset"]'
)

ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- STEP 4 – Cruise cover images
-- ============================================================

INSERT INTO tbl_cruise_images (cruise_id, image_url, image_type, alt_text, sort_order) VALUES
  ('cc000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800', 'cover', 'MS EUROPA in French Polynesia', 0),
  ('cc000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'cover', 'Eastern Mediterranean coastline', 0),
  ('cc000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800', 'cover', 'Silver Moon in Arabian waters', 0),
  ('cc000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800', 'cover', 'Arctic Svalbard polar landscape', 0),
  ('cc000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', 'cover', 'Antarctica icebergs and penguins', 0),
  ('cc000001-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', 'cover', 'Sea Cloud Spirit under sail Mediterranean', 0),
  ('cc000001-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800', 'cover', 'Sea Cloud II in Greek Islands', 0),
  ('cc000001-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', 'cover', 'Northern Lights over Norwegian fjord', 0),
  ('cc000001-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', 'cover', 'Caribbean turquoise waters', 0),
  ('cc000001-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 'cover', 'Madeira coastal cliffs', 0),
  ('cc000001-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', 'cover', 'Southeast Asia temple at sunrise', 0),
  ('cc000001-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800', 'cover', 'Iceland waterfall and green hills', 0),
  ('cc000001-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800', 'cover', 'Bora Bora overwater bungalows', 0),
  ('cc000001-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800', 'cover', 'Dubrovnik old town from the sea', 0),
  ('cc000001-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1502581827181-9cf3c3ee0106?w=800', 'cover', 'Galapagos sea lion on rock', 0),
  ('cc000001-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', 'cover', 'Amalfi coast from the sea', 0),
  ('cc000001-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'cover', 'Norwegian fjord summer panorama', 0),
  ('cc000001-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', 'cover', 'Caribbean beach palm trees', 0),
  ('cc000001-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'cover', 'Sailing ship at sunset Caribbean', 0),
  ('cc000001-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1555664374-b1a5d0a35d32?w=800', 'cover', 'Jerusalem golden dome at dusk', 0)
ON CONFLICT DO NOTHING;


-- ============================================================
-- STEP 5 – Link cruises to recommendations
-- Uses subqueries to look up real IDs by slug — no hardcoded UUIDs.
-- ============================================================

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'south-seas-papeete-2026-oct',
  'antarctica-hanseatic-spirit-2026-dec',
  'greek-islands-sea-cloud-ii-2026-oct',
  'atlantic-islands-lisbon-hamburg-2026',
  'tahiti-society-islands-sea-cloud-spirit-2027',
  'western-mediterranean-barcelona-rome-2026',
  'caribbean-bridgetown-fort-lauderdale-eu-2026',
  'holy-land-piraeus-dubai-2026'
)
AND r.slug = 'last-minute-luxuskreuzfahrten'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'eastern-mediterranean-piraeus-venice-2026',
  'arabia-india-dubai-roundtrip-2026',
  'caribbean-barbados-fort-lauderdale-2026',
  'southeast-asia-singapore-roundtrip-2026',
  'adriatic-venice-athens-2026',
  'galapagos-expedition-hanseatic-nature-2027',
  'western-mediterranean-barcelona-rome-2026',
  'caribbean-bridgetown-fort-lauderdale-eu-2026',
  'holy-land-piraeus-dubai-2026'
)
AND r.slug = 'all-inclusive-luxuskreuzfahrten'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'eastern-mediterranean-piraeus-venice-2026',
  'arabia-india-dubai-roundtrip-2026',
  'caribbean-barbados-fort-lauderdale-2026',
  'southeast-asia-singapore-roundtrip-2026',
  'adriatic-venice-athens-2026',
  'caribbean-sailing-sea-cloud-ii-2026',
  'holy-land-piraeus-dubai-2026'
)
AND r.slug = 'uxuskreuzfahrten-mit-flug'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'arctic-svalbard-hanseatic-nature-2026',
  'antarctica-hanseatic-spirit-2026-dec',
  'norway-northern-lights-2026-jan',
  'iceland-reykjavik-roundtrip-2026',
  'galapagos-expedition-hanseatic-nature-2027',
  'north-cape-fjords-tromso-hamburg-2026'
)
AND r.slug = 'luxus-expeditionskreuzfahrten'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'arctic-svalbard-hanseatic-nature-2026',
  'antarctica-hanseatic-spirit-2026-dec',
  'mediterranean-sail-sea-cloud-spirit-2026',
  'greek-islands-sea-cloud-ii-2026-oct',
  'iceland-reykjavik-roundtrip-2026',
  'tahiti-society-islands-sea-cloud-spirit-2027',
  'galapagos-expedition-hanseatic-nature-2027',
  'caribbean-sailing-sea-cloud-ii-2026'
)
AND r.slug = 'luxuskreuzfahrten-kleine-schiffe'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c, tbl_recommendations r
WHERE c.slug IN (
  'south-seas-papeete-2026-oct',
  'mediterranean-sail-sea-cloud-spirit-2026',
  'greek-islands-sea-cloud-ii-2026-oct',
  'tahiti-society-islands-sea-cloud-spirit-2027',
  'caribbean-sailing-sea-cloud-ii-2026'
)
AND r.slug = 'luxus-segelkreuzfahrten'
ON CONFLICT DO NOTHING;


-- ── Clean up temp tables ──────────────────────────────────────
DROP TABLE IF EXISTS _ships;
DROP TABLE IF EXISTS _companies;
