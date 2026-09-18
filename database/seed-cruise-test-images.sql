-- ============================================================
-- Seed 3 test images for every cruise in tbl_cruises.
-- Images are stored under uploads/cruise_images/ folder.
-- Image 1 = cover, Images 2 & 3 = gallery.
-- ============================================================

-- Clear previously seeded test images
DELETE FROM tbl_cruise_images
WHERE image_url IN (
  'uploads/cruise_images/1789727419615-784139917.png',
  'uploads/cruise_images/1789727434542-311352187.png',
  'uploads/cruise_images/1789727449447-330781082.png',
  'uploads/cruise_images/1789728598556-69232174.png'
);

-- Cover image for every cruise
INSERT INTO tbl_cruise_images (id, cruise_id, image_url, image_type, alt_text, sort_order)
SELECT
  gen_random_uuid(),
  c.id,
  'uploads/cruise_images/1789728598556-69232174.png',
  'cover',
  'Cruise cover image',
  0
FROM tbl_cruises c
WHERE c.deleted_at IS NULL;

-- Gallery image 1
INSERT INTO tbl_cruise_images (id, cruise_id, image_url, image_type, alt_text, sort_order)
SELECT
  gen_random_uuid(),
  c.id,
  'uploads/cruise_images/1789728598556-69232174.png',
  'gallery',
  'Cruise gallery image 1',
  1
FROM tbl_cruises c
WHERE c.deleted_at IS NULL;

-- Gallery image 2
INSERT INTO tbl_cruise_images (id, cruise_id, image_url, image_type, alt_text, sort_order)
SELECT
  gen_random_uuid(),
  c.id,
  'uploads/cruise_images/1789728598556-69232174.png',
  'gallery',
  'Cruise gallery image 2',
  2
FROM tbl_cruises c
WHERE c.deleted_at IS NULL;

-- Verify
SELECT COUNT(*) AS total_images FROM tbl_cruise_images;
