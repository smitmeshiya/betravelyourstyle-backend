-- ============================================================
-- DIAGNOSTIC: run this first to see what's in the DB
-- ============================================================

SELECT 
  (SELECT COUNT(*) FROM tbl_cruise_recommendations) AS total_links,
  (SELECT COUNT(*) FROM tbl_cruises)                AS total_cruises,
  (SELECT COUNT(*) FROM tbl_cruises WHERE status = 'published') AS published_cruises;

-- ============================================================
-- FIX: Link ALL existing cruises to ALL 6 recommendations
-- This is a brute-force approach — every cruise gets every tag.
-- You can refine later. Just run this to prove the endpoint works.
-- ============================================================

INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, r.id
FROM tbl_cruises c
CROSS JOIN tbl_recommendations r
WHERE c.deleted_at IS NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFY: Should show cruise count > 0 for every recommendation
-- ============================================================

SELECT
  r.name               AS recommendation,
  COUNT(cr.cruise_id)  AS linked_cruises
FROM tbl_recommendations r
LEFT JOIN tbl_cruise_recommendations cr ON cr.recommendation_id = r.id
GROUP BY r.name
ORDER BY r.name;
