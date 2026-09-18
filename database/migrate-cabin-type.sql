-- ============================================================
-- MIGRATION: Add cabin_type column to tbl_cabin_categories
-- Values: 'outside_cabin' | 'suite' | 'guarantee'
-- ============================================================

ALTER TABLE tbl_cabin_categories
  ADD COLUMN IF NOT EXISTS cabin_type VARCHAR(50) NOT NULL DEFAULT 'outside_cabin';

-- ── Sea Cloud II: set correct types ──────────────────────────
DO $$
DECLARE
  v_ship_id UUID;
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  -- Outside cabins
  UPDATE tbl_cabin_categories SET cabin_type = 'outside_cabin'
  WHERE ship_id = v_ship_id AND code IN ('F', 'E', 'D', 'C');

  -- Suites
  UPDATE tbl_cabin_categories SET cabin_type = 'suite'
  WHERE ship_id = v_ship_id AND code IN ('A', 'B');

END;
$$;
