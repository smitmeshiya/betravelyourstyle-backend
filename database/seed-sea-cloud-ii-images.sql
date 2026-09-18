-- ============================================================
-- SEED: Sea Cloud II — Deck plan images + Cabin category images
-- Run after seed-sea-cloud-ii.sql
-- ============================================================

DO $$
DECLARE
  v_ship_id UUID;
BEGIN
  SELECT id INTO v_ship_id FROM tbl_ships WHERE slug = 'sea-cloud-ii';

  -- ── Deck plan images ──────────────────────────────────────
  UPDATE tbl_ship_decks
    SET plan_image = 'uploads/profile_image/1789715148205-794138177.png'
  WHERE ship_id = v_ship_id AND name = 'Cabin Deck 1';

  UPDATE tbl_ship_decks
    SET plan_image = 'uploads/profile_image/1789715605781-229913130.png'
  WHERE ship_id = v_ship_id AND name = 'Promenade Deck 2';

  -- ── Cabin category images ─────────────────────────────────

  -- F - Outside Cabin with Upper and Lower Berths
  UPDATE tbl_cabin_categories
    SET
      images      = '[{"url": "uploads/profile_image/1789715333888-952669448.png", "is_sample": true}]',
      description = 'approx. 12 sq m. 2 portholes. 1 upper and 1 lower bed. Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
      amenities   = '["hairdryer","bathrobe","Armchair","Table","dressing table","Wardrobe","TV and Video","phone","safe","mini-bar","Adjustable air conditioning","Power outlet for using the razor"]'
  WHERE ship_id = v_ship_id AND code = 'F';

  -- E - Deluxe Outside Cabin (Cabin Deck 1)
  UPDATE tbl_cabin_categories
    SET
      images      = '[{"url": "uploads/profile_image/1789715415417-763994436.png", "is_sample": true}]',
      description = 'approx. 16 sq m. 2 portholes. 1 Queen-size bed (separable). Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
      amenities   = '["hairdryer","bathrobe","2 armchairs","Table","dressing table","Wardrobe","TV and Video","phone","safe","mini-bar","Adjustable air conditioning","Power outlet for using the razor"]'
  WHERE ship_id = v_ship_id AND code = 'E';

  -- D - Deluxe Outside Cabin (Cabin Deck 1)
  UPDATE tbl_cabin_categories
    SET
      images      = '[{"url": "uploads/profile_image/1789715392938-900011286.png", "is_sample": true}]',
      description = 'approx. 19 sq m. 2 portholes. 1 Queen-size bed (separable). Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
      amenities   = '["hairdryer","bathrobe","2 armchairs","Table","dressing table","Wardrobe","TV and Video","phone","safe","mini-bar","Adjustable air conditioning","Power outlet for using the razor"]'
  WHERE ship_id = v_ship_id AND code = 'D';

  -- C - Deluxe Outside Cabin (Promenade Deck 2)
  -- No image provided yet — placeholder kept empty, update when available
  UPDATE tbl_cabin_categories
    SET
      description = 'approx. 20 sqm. Panoramic windows. 1 Queen-size bed (separable). Bathroom approx. 3 sq m with shower, toilet, washbasin (marble and gold fittings).',
      amenities   = '["hairdryer","bathrobe","2 armchairs","Table","dressing table","Wardrobe","TV and Video","phone","safe","mini-bar","Adjustable air conditioning","Power outlet for using the razor"]'
  WHERE ship_id = v_ship_id AND code = 'C';

  -- B - Junior Suite (Promenade Deck 2)
  UPDATE tbl_cabin_categories
    SET
      images      = '[{"url": "uploads/profile_image/1789715640518-969785572.png", "is_sample": true}]',
      description = 'approx. 23 sq m. Panoramic windows. 1 queen-size bed with separate mattresses. Bathroom approx. 2-3 sq m with bathtub, toilet, washbasin (marble and gold fittings).',
      amenities   = '["hairdryer","bathrobe","sofa","Table","Armchair","Chimney","dressing table","Walk-in wardrobe","Cabinet with minibar and TV, video","phone","safe","Adjustable air conditioning","Power outlet for using the razor"]'
  WHERE ship_id = v_ship_id AND code = 'B';

END;
$$;
