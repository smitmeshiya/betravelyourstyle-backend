-- ============================================================
-- STEP 5 ONLY: Link existing cruises to recommendations
-- Run this after seed-cruise-recommendations.sql has inserted
-- the cruises. Uses your exact recommendation IDs from the DB.
-- ============================================================

-- Your real recommendation IDs:
-- 86e17851-52fb-4fe2-b3cf-b80d61a33e1b  → last-minute-luxuskreuzfahrten
-- aab127e1-9496-407b-8414-0b0af90afe35  → all-inclusive-luxuskreuzfahrten
-- 6d27ab7d-4966-4cb0-a1d9-cbe76c22481c  → uxuskreuzfahrten-mit-flug
-- 45fb44fd-9400-41b8-9029-2bb90c2df406  → luxus-expeditionskreuzfahrten
-- 06636328-2243-4615-9a33-8cdbe54487b7  → luxuskreuzfahrten-kleine-schiffe
-- 6afedd6b-b146-4e1f-a7fe-13e968dc39b9  → luxus-segelkreuzfahrten

-- First verify cruises exist
DO $$
DECLARE
  cruise_count INT;
BEGIN
  SELECT COUNT(*) INTO cruise_count FROM tbl_cruises
  WHERE slug IN (
    'south-seas-papeete-2026-oct',
    'eastern-mediterranean-piraeus-venice-2026',
    'arabia-india-dubai-roundtrip-2026',
    'arctic-svalbard-hanseatic-nature-2026',
    'antarctica-hanseatic-spirit-2026-dec',
    'mediterranean-sail-sea-cloud-spirit-2026',
    'greek-islands-sea-cloud-ii-2026-oct',
    'norway-northern-lights-2026-jan',
    'caribbean-barbados-fort-lauderdale-2026',
    'atlantic-islands-lisbon-hamburg-2026',
    'southeast-asia-singapore-roundtrip-2026',
    'iceland-reykjavik-roundtrip-2026',
    'tahiti-society-islands-sea-cloud-spirit-2027',
    'adriatic-venice-athens-2026',
    'galapagos-expedition-hanseatic-nature-2027',
    'western-mediterranean-barcelona-rome-2026',
    'north-cape-fjords-tromso-hamburg-2026',
    'caribbean-bridgetown-fort-lauderdale-eu-2026',
    'caribbean-sailing-sea-cloud-ii-2026',
    'holy-land-piraeus-dubai-2026'
  );
  RAISE NOTICE 'Found % cruises ready to link', cruise_count;
END $$;


-- ── Last Minute Cruises ───────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '86e17851-52fb-4fe2-b3cf-b80d61a33e1b'
FROM tbl_cruises c
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
ON CONFLICT DO NOTHING;


-- ── All-inclusive cruises ─────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, 'aab127e1-9496-407b-8414-0b0af90afe35'
FROM tbl_cruises c
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
ON CONFLICT DO NOTHING;


-- ── Cruises with flights ──────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6d27ab7d-4966-4cb0-a1d9-cbe76c22481c'
FROM tbl_cruises c
WHERE c.slug IN (
  'eastern-mediterranean-piraeus-venice-2026',
  'arabia-india-dubai-roundtrip-2026',
  'caribbean-barbados-fort-lauderdale-2026',
  'southeast-asia-singapore-roundtrip-2026',
  'adriatic-venice-athens-2026',
  'caribbean-sailing-sea-cloud-ii-2026',
  'holy-land-piraeus-dubai-2026'
)
ON CONFLICT DO NOTHING;


-- ── Expedition cruises ────────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '45fb44fd-9400-41b8-9029-2bb90c2df406'
FROM tbl_cruises c
WHERE c.slug IN (
  'arctic-svalbard-hanseatic-nature-2026',
  'antarctica-hanseatic-spirit-2026-dec',
  'norway-northern-lights-2026-jan',
  'iceland-reykjavik-roundtrip-2026',
  'galapagos-expedition-hanseatic-nature-2027',
  'north-cape-fjords-tromso-hamburg-2026'
)
ON CONFLICT DO NOTHING;


-- ── Cruises on small ships ────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '06636328-2243-4615-9a33-8cdbe54487b7'
FROM tbl_cruises c
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
ON CONFLICT DO NOTHING;


-- ── Sailing cruises ───────────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6afedd6b-b146-4e1f-a7fe-13e968dc39b9'
FROM tbl_cruises c
WHERE c.slug IN (
  'south-seas-papeete-2026-oct',
  'mediterranean-sail-sea-cloud-spirit-2026',
  'greek-islands-sea-cloud-ii-2026-oct',
  'tahiti-society-islands-sea-cloud-spirit-2027',
  'caribbean-sailing-sea-cloud-ii-2026'
)
ON CONFLICT DO NOTHING;


-- ── Verify result ─────────────────────────────────────────────
SELECT
  r.name AS recommendation,
  COUNT(cr.cruise_id) AS cruise_count
FROM tbl_recommendations r
LEFT JOIN tbl_cruise_recommendations cr ON cr.recommendation_id = r.id
GROUP BY r.name
ORDER BY r.name;
