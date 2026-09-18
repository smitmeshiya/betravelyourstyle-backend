-- ============================================================
-- MIGRATION: Add new columns to tbl_reviews
-- ============================================================

ALTER TABLE tbl_reviews
  ADD COLUMN IF NOT EXISTS reviewer_avatar      TEXT,
  ADD COLUMN IF NOT EXISTS is_verified          BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS recommends_cruise    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cruise_count         SMALLINT,
  ADD COLUMN IF NOT EXISTS travel_duration      SMALLINT,
  ADD COLUMN IF NOT EXISTS destination          VARCHAR(255),
  ADD COLUMN IF NOT EXISTS countries            VARCHAR(255),
  ADD COLUMN IF NOT EXISTS ports                TEXT,
  ADD COLUMN IF NOT EXISTS travelled_as         VARCHAR(100),
  ADD COLUMN IF NOT EXISTS children_in_group    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cruiser_type         VARCHAR(150),
  ADD COLUMN IF NOT EXISTS route_rating         NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS read_count           INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS helpful_count        INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS not_helpful_count    INT NOT NULL DEFAULT 0;
