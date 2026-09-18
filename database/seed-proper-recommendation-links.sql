-- ============================================================
-- PROPER recommendation links based on real itinerary data.
-- Run this AFTER clearing the CROSS JOIN data from before.
-- ============================================================

-- Step 1: Clear the brute-force CROSS JOIN links
DELETE FROM tbl_cruise_recommendations;

-- ============================================================
-- SAILING CRUISES → ALL scii-* and scs-* cruises
-- Sea Cloud II and Sea Cloud Spirit are both sailing ships
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6afedd6b-b146-4e1f-a7fe-13e968dc39b9'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- CRUISES ON SMALL SHIPS → ALL scii-* and scs-* cruises
-- Sea Cloud II: 94 passengers, Sea Cloud Spirit: 136 passengers
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '06636328-2243-4615-9a33-8cdbe54487b7'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- LAST MINUTE CRUISES → Cruises starting within 90 days from
-- today (Sept 18 2026), so up to ~Dec 17 2026.
-- These are the cruises a spontaneous booker could still join.
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '86e17851-52fb-4fe2-b3cf-b80d61a33e1b'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
AND c.start_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '90 days')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ALL-INCLUSIVE CRUISES → Caribbean & Transatlantic routes
-- Sea Cloud packages include all meals/beverages by default.
-- Caribbean voyages are the flagship all-inclusive product.
-- Source: FAFR category in flat file (full fare with services)
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, 'aab127e1-9496-407b-8414-0b0af90afe35'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
AND (
  c.short_description ILIKE '%Caribbean%'
  OR c.short_description ILIKE '%Transatlantic%'
  OR c.short_description ILIKE '%Costa Rica%'
  OR c.short_description ILIKE '%Panama%'
  OR c.short_description ILIKE '%Central America%'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CRUISES WITH FLIGHTS → Long-haul routes where guests need
-- to fly to reach the embarkation port.
-- Transatlantic, Caribbean (from Europe), Costa Rica, Panama
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6d27ab7d-4966-4cb0-a1d9-cbe76c22481c'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
AND (
  c.short_description ILIKE '%Transatlantic%'
  OR c.short_description ILIKE '%Caribbean%'
  OR c.short_description ILIKE '%Costa Rica%'
  OR c.short_description ILIKE '%Panama%'
  OR c.short_description ILIKE '%Central America%'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- EXPEDITION CRUISES → Remote, off-the-beaten-path routes.
-- Transatlantic crossings, Panama Canal transits, Costa Rica,
-- Central America, Canary Islands & Morocco routes.
-- Sea Cloud Spirit does true expedition-style remote routes.
-- ============================================================
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '45fb44fd-9400-41b8-9029-2bb90c2df406'
FROM tbl_cruises c
WHERE (c.slug LIKE 'scii-%' OR c.slug LIKE 'scs-%')
AND c.deleted_at IS NULL
AND (
  c.short_description ILIKE '%Transatlantic%'
  OR c.short_description ILIKE '%Costa Rica%'
  OR c.short_description ILIKE '%Panama%'
  OR c.short_description ILIKE '%Central America%'
  OR c.short_description ILIKE '%Canary Islands%'
  OR c.short_description ILIKE '%Morocco%'
  OR c.short_description ILIKE '%United Kingdom%'
  OR c.short_description ILIKE '%Western Europe%'
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFY: Show cruise count per recommendation
-- ============================================================
SELECT
  r.name               AS recommendation,
  r.slug               AS slug,
  COUNT(cr.cruise_id)  AS linked_cruises
FROM tbl_recommendations r
LEFT JOIN tbl_cruise_recommendations cr ON cr.recommendation_id = r.id
GROUP BY r.name, r.slug
ORDER BY r.name;
