/**
 * seed-fix-cruise-images.js
 *
 * 1. Deletes ALL existing rows from tbl_cruise_images
 * 2. For every published cruise, inserts:
 *    - 1 cover image  (alternates between the 2 "profile" images)
 *    - 5 gallery images (cycles through the 8 gallery images)
 *
 * Cover images (2 — shown on list cards):
 *   uploads/cruise_images/1789732237024-348694879.png
 *   uploads/cruise_images/1789732277210-105432696.png
 *
 * Gallery images (6 — shown on detail page):
 *   uploads/cruise_images/1789732259701-802604949.png
 *   uploads/cruise_images/1789732375744-650535755.png
 *   uploads/cruise_images/1789732389107-768810686.png
 *   uploads/cruise_images/1789732401748-558343521.png
 *   uploads/cruise_images/1789732420209-736348744.png
 *   uploads/cruise_images/1789732434652-149501214.png
 *
 * Run with:  node database/seed-fix-cruise-images.js
 */

const { Client } = require('pg');

const DB_URL =
  'postgresql://neondb_owner:npg_mhTUejyq70nD@ep-quiet-smoke-b4hxt88p-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

// ── Image pools ──────────────────────────────────────────────
const COVER_IMAGES = [
  'uploads/cruise_images/1789732237024-348694879.png',
  'uploads/cruise_images/1789732277210-105432696.png',
];

const GALLERY_IMAGES = [
  'uploads/cruise_images/1789732259701-802604949.png',
  'uploads/cruise_images/1789732375744-650535755.png',
  'uploads/cruise_images/1789732389107-768810686.png',
  'uploads/cruise_images/1789732401748-558343521.png',
  'uploads/cruise_images/1789732420209-736348744.png',
  'uploads/cruise_images/1789732434652-149501214.png',
];

async function run() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('✓ Connected to database');

  try {
    await client.query('BEGIN');

    // 1 — wipe all existing cruise images
    const del = await client.query('DELETE FROM tbl_cruise_images');
    console.log(`✓ Deleted ${del.rowCount} old cruise image rows`);

    // 2 — fetch all cruise IDs (no status filter — cover all cruises)
    const { rows: cruises } = await client.query(
      `SELECT id FROM tbl_cruises WHERE deleted_at IS NULL ORDER BY created_at`
    );
    console.log(`✓ Found ${cruises.length} cruises`);

    // 3 — build INSERT rows
    const values = [];
    const params = [];
    let p = 1;

    cruises.forEach((cruise, idx) => {
      // One cover image — alternate between the 2 cover images
      const coverImg = COVER_IMAGES[idx % COVER_IMAGES.length];
      values.push(`(gen_random_uuid(), $${p++}, $${p++}, $${p++}, $${p++})`);
      params.push(cruise.id, coverImg, 'cover', 0);

      // Five gallery images — cycle through the 6 gallery images
      GALLERY_IMAGES.forEach((img, gIdx) => {
        // rotate starting gallery image per cruise so they don't all look identical
        const rotated = GALLERY_IMAGES[(gIdx + idx) % GALLERY_IMAGES.length];
        values.push(`(gen_random_uuid(), $${p++}, $${p++}, $${p++}, $${p++})`);
        params.push(cruise.id, rotated, 'gallery', gIdx + 1);
      });
    });

    const sql = `
      INSERT INTO tbl_cruise_images (id, cruise_id, image_url, image_type, sort_order)
      VALUES ${values.join(', ')}
    `;

    const ins = await client.query(sql, params);
    console.log(`✓ Inserted ${ins.rowCount} cruise image rows`);
    console.log(`  → ${cruises.length} cover images`);
    console.log(`  → ${cruises.length * GALLERY_IMAGES.length} gallery images`);

    await client.query('COMMIT');
    console.log('✓ Transaction committed');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✗ Error — rolled back:', err.message);
    throw err;
  } finally {
    await client.end();
    console.log('✓ Disconnected');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
