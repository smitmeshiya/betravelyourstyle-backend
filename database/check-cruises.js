const { Client } = require('pg');
require('dotenv').config();

async function checkCruises() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    // Get a sample cruise with all fields
    const result = await client.query(`
      SELECT 
        slug, 
        name, 
        cruise_code, 
        region,
        status
      FROM tbl_cruises
      WHERE cruise_code LIKE 'SCII-%'
      AND status = 'published'
      ORDER BY start_date
      LIMIT 5
    `);
    
    console.log('Sample cruises:');
    result.rows.forEach(cruise => {
      console.log(`\nSlug: ${cruise.slug}`);
      console.log(`Name: ${cruise.name}`);
      console.log(`Code: ${cruise.cruise_code}`);
      console.log(`Region: ${cruise.region || 'NULL'}`);
      console.log(`URL: /api/cruises/get/${cruise.slug}`);
    });

    // Check regions
    const regionResult = await client.query(`
      SELECT DISTINCT region FROM tbl_cruises 
      WHERE region IS NOT NULL 
      ORDER BY region
    `);
    
    console.log('\n\nAvailable regions:');
    regionResult.rows.forEach(r => console.log(`  - ${r.region}`));
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkCruises();
