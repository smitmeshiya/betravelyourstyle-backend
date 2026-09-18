-- ============================================================
-- Link existing cruises to recommendations
-- Uses your real recommendation IDs from tbl_recommendations.
-- All slugs are the ones already in your tbl_cruises.
-- Safe to re-run — ON CONFLICT DO NOTHING on all inserts.
-- ============================================================

-- Your recommendation IDs:
-- 86e17851-52fb-4fe2-b3cf-b80d61a33e1b  → Last Minute Cruises
-- aab127e1-9496-407b-8414-0b0af90afe35  → All-inclusive cruises
-- 6d27ab7d-4966-4cb0-a1d9-cbe76c22481c  → Cruises with flights
-- 45fb44fd-9400-41b8-9029-2bb90c2df406  → Expedition cruises
-- 06636328-2243-4615-9a33-8cdbe54487b7  → Cruises on small ships
-- 6afedd6b-b146-4e1f-a7fe-13e968dc39b9  → Sailing cruises

-- ── Sailing cruises ───────────────────────────────────────────
-- All scii-* and scs-* cruises are sailing ships → Sailing cruises
-- Sea Cloud II (scii) and Sea Cloud Spirit (scs) are small ships too
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6afedd6b-b146-4e1f-a7fe-13e968dc39b9'
FROM tbl_cruises c
WHERE c.slug IN (
  'scii-2614','scii-2615','scii-2616','scii-2618','scii-2622',
  'scii-2623','scii-2625','scii-2626','scii-2627','scii-2628',
  'scii-2629','scii-2631','scii-2634','scii-2638','scii-2641',
  'scii-2642','scii-2643','scii-2644','scii-2708','scii-2709',
  'scii-2712','scii-2713','scii-2714','scii-2717','scii-2723',
  'scii-2724','scii-2725','scii-2729','scii-2730','scii-2731',
  'scii-2735','scii-2736','scii-2737','scii-2739','scii-2741',
  'scii-2742','scii-2743','scii-2744','scii-274546','scii-2808',
  'scii-2809','scii-2810',
  'scii-bridgetown-loop-dec2026a','scii-bridgetown-loop-dec2026b',
  'scii-bridgetown-santodomingo-dec2026','scii-laspalmas-bridgetown-nov2026',
  'scii-lisbon-tarragona-apr2027','scii-malaga-laspalmas-oct2026',
  'scii-nice-rome-apr2027','scii-nice-rome-may2027',
  'scii-philipsburg-loop-mar2027','scii-tarragona-nice-apr2027',
  'scs-2613','scs-2618','scs-2621','scs-2624','scs-2625',
  'scs-2626','scs-2627','scs-2628','scs-2629','scs-2632',
  'scs-2633','scs-2634','scs-2635','scs-2636','scs-2637',
  'scs-2638','scs-2639','scs-2640','scs-2641','scs-2642',
  'scs-2643','scs-2701','scs-2702','scs-2703','scs-2704',
  'scs-2706','scs-2707','scs-2708','scs-2709','scs-2711',
  'scs-271112','scs-2712','scs-2713','scs-2716','scs-271617',
  'scs-2717','scs-271718','scs-2718','scs-2722','scs-272324',
  'scs-2725','scs-2727','scs-2728','scs-2730','scs-2734',
  'scs-2735','scs-2737','scs-2738'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── Cruises on small ships ────────────────────────────────────
-- Both Sea Cloud II (94 passengers) and Sea Cloud Spirit (136) are small ships
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '06636328-2243-4615-9a33-8cdbe54487b7'
FROM tbl_cruises c
WHERE c.slug IN (
  'scii-2614','scii-2615','scii-2616','scii-2618','scii-2622',
  'scii-2623','scii-2625','scii-2626','scii-2627','scii-2628',
  'scii-2629','scii-2631','scii-2634','scii-2638','scii-2641',
  'scii-2642','scii-2643','scii-2644','scii-2708','scii-2709',
  'scii-2712','scii-2713','scii-2714','scii-2717','scii-2723',
  'scii-2724','scii-2725','scii-2729','scii-2730','scii-2731',
  'scii-2735','scii-2736','scii-2737','scii-2739','scii-2741',
  'scii-2742','scii-2743','scii-2744','scii-274546','scii-2808',
  'scii-2809','scii-2810',
  'scii-bridgetown-loop-dec2026a','scii-bridgetown-loop-dec2026b',
  'scii-bridgetown-santodomingo-dec2026','scii-laspalmas-bridgetown-nov2026',
  'scii-lisbon-tarragona-apr2027','scii-malaga-laspalmas-oct2026',
  'scii-nice-rome-apr2027','scii-nice-rome-may2027',
  'scii-philipsburg-loop-mar2027','scii-tarragona-nice-apr2027',
  'scs-2613','scs-2618','scs-2621','scs-2624','scs-2625',
  'scs-2626','scs-2627','scs-2628','scs-2629','scs-2632',
  'scs-2633','scs-2634','scs-2635','scs-2636','scs-2637',
  'scs-2638','scs-2639','scs-2640','scs-2641','scs-2642',
  'scs-2643','scs-2701','scs-2702','scs-2703','scs-2704',
  'scs-2706','scs-2707','scs-2708','scs-2709','scs-2711',
  'scs-271112','scs-2712','scs-2713','scs-2716','scs-271617',
  'scs-2717','scs-271718','scs-2718','scs-2722','scs-272324',
  'scs-2725','scs-2727','scs-2728','scs-2730','scs-2734',
  'scs-2735','scs-2737','scs-2738'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── Last Minute Cruises ───────────────────────────────────────
-- Tag upcoming cruises (next 3 months) as last minute
-- Also manually tag a spread of scii and scs cruises
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '86e17851-52fb-4fe2-b3cf-b80d61a33e1b'
FROM tbl_cruises c
WHERE c.slug IN (
  'scii-2614','scii-2615','scii-2618','scii-2622','scii-2625',
  'scii-2708','scii-2709','scii-2712',
  'scii-malaga-laspalmas-oct2026','scii-bridgetown-loop-dec2026a',
  'scii-bridgetown-loop-dec2026b','scii-laspalmas-bridgetown-nov2026',
  'scs-2613','scs-2618','scs-2621','scs-2624','scs-2625',
  'scs-2626','scs-2701','scs-2702','scs-2703','scs-2704'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── All-inclusive cruises ─────────────────────────────────────
-- Sea Cloud Cruises packages include all meals and beverages
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, 'aab127e1-9496-407b-8414-0b0af90afe35'
FROM tbl_cruises c
WHERE c.slug IN (
  'scii-2626','scii-2627','scii-2628','scii-2629','scii-2631',
  'scii-2634','scii-2638','scii-2641','scii-2642','scii-2643',
  'scii-2644','scii-2729','scii-2730','scii-2731','scii-2735',
  'scs-2627','scs-2628','scs-2629','scs-2632','scs-2633',
  'scs-2634','scs-2635','scs-2636','scs-2637','scs-2638',
  'scs-2706','scs-2707','scs-2708','scs-2709','scs-2711'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── Cruises with flights ──────────────────────────────────────
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '6d27ab7d-4966-4cb0-a1d9-cbe76c22481c'
FROM tbl_cruises c
WHERE c.slug IN (
  'scii-2713','scii-2714','scii-2717','scii-2723','scii-2724',
  'scii-2725','scii-2739','scii-2741','scii-2742','scii-2743',
  'scii-2744','scii-274546','scii-2808','scii-2809','scii-2810',
  'scii-bridgetown-santodomingo-dec2026','scii-lisbon-tarragona-apr2027',
  'scii-nice-rome-apr2027','scii-nice-rome-may2027',
  'scii-philipsburg-loop-mar2027','scii-tarragona-nice-apr2027',
  'scs-2639','scs-2640','scs-2641','scs-2642','scs-2643',
  'scs-2712','scs-2713','scs-2716','scs-271617','scs-2717',
  'scs-271718','scs-2718','scs-2722','scs-272324','scs-2725',
  'scs-2727','scs-2728','scs-2730','scs-2734','scs-2735',
  'scs-2737','scs-2738'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── Expedition cruises ────────────────────────────────────────
-- Sea Cloud Spirit does Atlantic/expedition-style routes
INSERT INTO tbl_cruise_recommendations (cruise_id, recommendation_id)
SELECT c.id, '45fb44fd-9400-41b8-9029-2bb90c2df406'
FROM tbl_cruises c
WHERE c.slug IN (
  'scs-2613','scs-2618','scs-2621','scs-2624',
  'scs-271112','scs-271617','scs-271718','scs-272324',
  'scs-2701','scs-2702','scs-2703','scs-2704',
  'scs-2706','scs-2707','scs-2711','scs-2716',
  'scs-2717','scs-2718','scs-2722','scs-2725'
)
AND c.deleted_at IS NULL
ON CONFLICT DO NOTHING;


-- ── Verify: show cruise count per recommendation ──────────────
SELECT
  r.name            AS recommendation,
  COUNT(cr.cruise_id) AS linked_cruises
FROM tbl_recommendations r
LEFT JOIN tbl_cruise_recommendations cr ON cr.recommendation_id = r.id
GROUP BY r.name
ORDER BY r.name;
