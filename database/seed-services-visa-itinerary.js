/**
 * seed-services-visa-itinerary.js
 *
 * 1. Seeds tbl_cruise_services for ALL published cruises
 *    (standard Sea Cloud Cruises included / not-included list)
 * 2. Seeds tbl_cruise_entry_requirements for ALL published cruises
 *    with 5 nationalities: Germany, United Kingdom, United States, France, Austria
 * 3. Cleans up bad itinerary stay_description values ('{}'  →  null)
 *
 * Run:  node database/seed-services-visa-itinerary.js
 */

const { Client } = require('pg');

const DB = 'postgresql://neondb_owner:npg_mhTUejyq70nD@ep-quiet-smoke-b4hxt88p-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

// ── Standard Sea Cloud services (same for every cruise) ────────────────
const INCLUDED_SERVICES = [
  { title: 'All meals on board (surcharges may apply at some specialty restaurants)', sort_order: 1 },
  { title: 'All soft drinks on board', sort_order: 2 },
  { title: 'Welcome cocktail', sort_order: 3 },
  { title: 'Beer and wine with main meals', sort_order: 4 },
  { title: 'Champagne as a welcome drink in the cabin', sort_order: 5 },
  { title: 'Free coffee and tea on board', sort_order: 6 },
  { title: 'Gratuities on board', sort_order: 7 },
  { title: 'Farewell cocktail', sort_order: 8 },
  { title: "Captain's Gala Dinner", sort_order: 9 },
  { title: 'German-speaking tour guide', sort_order: 10 },
  { title: 'Fruit basket in the cabin', sort_order: 11 },
  { title: 'Port taxes and fees', sort_order: 12 },
];

const NOT_INCLUDED_SERVICES = [
  { title: 'Personal expenses on board', sort_order: 1 },
  { title: 'Additional services such as hairdresser, massages, etc.', sort_order: 2 },
  { title: 'Land program (e.g. shore excursions, tours, walks)', sort_order: 3 },
  { title: 'Travel insurance', sort_order: 4 },
  { title: 'Additional onboard credit per person', sort_order: 5 },
  { title: 'Flights to and from the port', sort_order: 6 },
];

// ── Entry requirements per nationality ─────────────────────────────────
const ENTRY_REQUIREMENTS = [
  {
    nationality: 'Germany',
    visa_information:
      'No visa is required for stays of up to 90 days within any 180-day period. ' +
      'If you plan to stay longer than 90 days, please inform yourself about the different visa options well in advance. ' +
      'Required documents: - Onward or return flight ticket - Proof of sufficient funds - Proof of accommodation',
    transit_visa_information:
      'A transit visa is not required for German passport holders transiting through EU and Schengen countries.',
    entry_information:
      'Entry is possible with the following travel documents: Passport or national identity card. ' +
      'The travel document must be valid for at least six months beyond the intended stay. ' +
      'Please ensure that your travel documents are complete, in good condition, and have sufficient blank pages. ' +
      'All documents must be originals and must not have been extended, updated, or altered by hand.',
    health_regulations:
      'No vaccinations are required for entry. The following vaccinations are recommended: ' +
      '- Vaccinations according to WHO recommendations for routine immunization - Hepatitis A - Hepatitis B. ' +
      'Please check with your airline before departure regarding the required documents. ' +
      'Entry, visa, and vaccination requirements are subject to change at short notice, and individual exceptions may apply. ' +
      'Only the relevant embassy or consulate can provide legally binding information.',
  },
  {
    nationality: 'United Kingdom',
    visa_information:
      'No visa is required for stays of up to 90 days within any 180-day period in EU and Schengen countries. ' +
      'Required documents: - Valid passport - Onward or return ticket - Proof of sufficient funds - Travel or health insurance.',
    transit_visa_information:
      'A transit visa is not required when transiting through most European airports with a valid British passport. ' +
      'Please verify requirements for specific countries prior to travel.',
    entry_information:
      'Entry is possible with a valid British passport. ' +
      'The passport must be valid for at least six months beyond the intended stay. ' +
      'Please ensure your travel documents are complete and in good condition. ' +
      'All documents must be originals and must not have been extended or altered.',
    health_regulations:
      'No mandatory vaccinations are required. The following are recommended: ' +
      '- Routine immunizations as per NHS guidelines - Hepatitis A - Hepatitis B for some destinations. ' +
      'Please consult your GP or a travel health clinic before departure. ' +
      'Health advice always depends on the individual traveler\'s health and does not replace medical consultation.',
  },
  {
    nationality: 'United States',
    visa_information:
      'No visa is required for stays of up to 90 days in Schengen countries under the Visa Waiver Program (ESTA). ' +
      'ESTA registration must be completed online before departure. ' +
      'Required documents: - Valid US passport - ESTA approval - Onward or return ticket - Proof of accommodation.',
    transit_visa_information:
      'A transit visa is generally not required for US passport holders transiting through Schengen countries. ' +
      'Please verify for non-Schengen transit points.',
    entry_information:
      'Entry is possible with a valid US passport. ' +
      'The passport must be valid for the full duration of the stay and ideally six months beyond. ' +
      'All documents must be originals and must not have been altered. ' +
      'Customs declaration forms may be required upon return to the United States.',
    health_regulations:
      'No mandatory vaccinations are required for most European destinations. ' +
      'The CDC recommends being up to date on all routine vaccines before travel. ' +
      'Additional recommended vaccines depending on destination: - Hepatitis A - Hepatitis B - Typhoid. ' +
      'Travelers should obtain comprehensive travel health insurance prior to departure.',
  },
  {
    nationality: 'France',
    visa_information:
      'No visa is required for French citizens traveling within the EU and Schengen Area. ' +
      'For non-Schengen destinations, visa requirements vary by country. ' +
      'Required documents: - Valid passport or national identity card - Proof of sufficient funds.',
    transit_visa_information:
      'A transit visa is not required for French passport holders within the Schengen Area. ' +
      'Please verify transit requirements for non-EU destinations prior to travel.',
    entry_information:
      'Entry is possible with a valid French passport or national identity card for EU destinations. ' +
      'For non-EU destinations, a valid passport with at least six months validity beyond the stay is required. ' +
      'All travel documents must be originals and must not have been altered by hand.',
    health_regulations:
      'No mandatory vaccinations are required for most destinations served. ' +
      'Recommended vaccinations: - Hepatitis A - Hepatitis B - Routine immunizations per French health guidelines. ' +
      'Please consult your doctor or a travel medicine specialist before departure. ' +
      'Requirements are subject to change; individual exceptions may apply.',
  },
  {
    nationality: 'Austria',
    visa_information:
      'No visa is required for Austrian citizens traveling within the EU and Schengen Area. ' +
      'For Caribbean and non-Schengen destinations: stays of up to 90 days are generally visa-free. ' +
      'Required documents: - Valid Austrian passport - Proof of sufficient funds - Onward or return ticket.',
    transit_visa_information:
      'A transit visa is not required for Austrian passport holders within the Schengen Area and most Caribbean destinations. ' +
      'Please verify requirements for specific transit countries.',
    entry_information:
      'Entry is possible with a valid Austrian passport or national identity card for EU destinations. ' +
      'For non-EU destinations, a valid passport with at least six months validity beyond the stay is required. ' +
      'Travel documents must be complete, in good condition, and have sufficient blank pages.',
    health_regulations:
      'No mandatory vaccinations are required for most European cruise destinations. ' +
      'Recommended vaccinations: - Hepatitis A - Hepatitis B - Routine immunizations as per Austrian health guidelines. ' +
      'For Caribbean sailings, mosquito protection and awareness of dengue fever risk is advised. ' +
      'Please consult a travel medicine specialist before departure.',
  },
];

// ── Itinerary notes cleanup map ─────────────────────────────────────────
// Replaces the literal "{}" stay_description with a sensible default
const NOTES_CLEANUP = {
  '{}': null,
  '{ }': null,
};

async function run() {
  const client = new Client({ connectionString: DB, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('✓ Connected');

  try {
    await client.query('BEGIN');

    // ── 1. Get all published cruise IDs ──────────────────────────────
    const { rows: cruises } = await client.query(
      "SELECT id FROM tbl_cruises WHERE deleted_at IS NULL ORDER BY start_date"
    );
    console.log(`  Found ${cruises.length} cruises`);

    // ── 2. Wipe existing services and entry requirements ─────────────
    const delSvc  = await client.query('DELETE FROM tbl_cruise_services');
    const delVisa = await client.query('DELETE FROM tbl_cruise_entry_requirements');
    console.log(`✓ Deleted ${delSvc.rowCount} service rows, ${delVisa.rowCount} entry requirement rows`);

    // ── 3. Seed services for every cruise — BULK INSERT ─────────────
    {
      const vals = [];
      const params = [];
      let p = 1;
      for (const cruise of cruises) {
        for (const svc of INCLUDED_SERVICES) {
          vals.push(`(gen_random_uuid(),$${p++},'included',$${p++},NULL,$${p++})`);
          params.push(cruise.id, svc.title, svc.sort_order);
        }
        for (const svc of NOT_INCLUDED_SERVICES) {
          vals.push(`(gen_random_uuid(),$${p++},'not_included',$${p++},NULL,$${p++})`);
          params.push(cruise.id, svc.title, svc.sort_order);
        }
      }
      // Postgres max params = 65535; split into chunks of 20000 params (≈6666 rows)
      const CHUNK = 6000;
      let inserted = 0;
      for (let i = 0; i < vals.length; i += CHUNK) {
        const chunkVals   = vals.slice(i, i + CHUNK);
        const chunkParams = params.slice(i * 3, (i + CHUNK) * 3);
        const sql = `INSERT INTO tbl_cruise_services (id,cruise_id,service_type,title,description,sort_order) VALUES ${chunkVals.join(',')}`;
        const r = await client.query(sql, chunkParams);
        inserted += r.rowCount;
      }
      console.log(`✓ Inserted ${inserted} service rows across ${cruises.length} cruises`);
    }

    // ── 4. Seed entry requirements — BULK INSERT ─────────────────────
    {
      const vals = [];
      const params = [];
      let p = 1;
      for (const cruise of cruises) {
        for (const req of ENTRY_REQUIREMENTS) {
          vals.push(`(gen_random_uuid(),$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},'{}')`);
          params.push(cruise.id, req.nationality, req.visa_information,
                      req.transit_visa_information, req.entry_information, req.health_regulations);
        }
      }
      const CHUNK = 1000; // 7 params each → 7000 params per chunk
      let inserted = 0;
      for (let i = 0; i < vals.length; i += CHUNK) {
        const chunkVals   = vals.slice(i, i + CHUNK);
        const chunkParams = params.slice(i * 6, (i + CHUNK) * 6);
        const sql = `INSERT INTO tbl_cruise_entry_requirements
          (id,cruise_id,nationality,visa_information,transit_visa_information,entry_information,health_regulations,extra_data)
          VALUES ${chunkVals.join(',')}
          ON CONFLICT (cruise_id, nationality) DO UPDATE SET
            visa_information=EXCLUDED.visa_information,
            transit_visa_information=EXCLUDED.transit_visa_information,
            entry_information=EXCLUDED.entry_information,
            health_regulations=EXCLUDED.health_regulations`;
        const r = await client.query(sql, chunkParams);
        inserted += r.rowCount;
      }
      console.log(`✓ Inserted ${inserted} entry requirement rows`);
    }

    // ── 5. Fix itinerary notes — replace '{}' with null ──────────────
    const fixNotes = await client.query(
      `UPDATE tbl_cruise_itinerary
       SET stay_description = NULL
       WHERE stay_description = '{}' OR stay_description = '{ }'`
    );
    console.log(`✓ Fixed ${fixNotes.rowCount} itinerary rows with '{}' notes`);

    // Also fix route_description
    const fixRoute = await client.query(
      `UPDATE tbl_cruise_itinerary
       SET route_description = NULL
       WHERE route_description = '{}' OR route_description = '{ }'`
    );
    console.log(`✓ Fixed ${fixRoute.rowCount} itinerary route_description rows`);

    await client.query('COMMIT');
    console.log('✓ Transaction committed — all data seeded successfully');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✗ Error — rolled back:', err.message);
    throw err;
  } finally {
    await client.end();
    console.log('✓ Disconnected');
  }
}

run().catch(() => process.exit(1));
