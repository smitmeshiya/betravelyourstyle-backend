const { Client } = require('pg');
const c = new Client({
  connectionString: 'postgresql://neondb_owner:npg_mhTUejyq70nD@ep-quiet-smoke-b4hxt88p-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});
c.connect().then(async () => {
  const cruises = await c.query("SELECT id,name,slug,duration_days FROM tbl_cruises WHERE deleted_at IS NULL AND status='published' ORDER BY start_date LIMIT 10");
  console.log('CRUISES=' + JSON.stringify(cruises.rows));
  const ports = await c.query("SELECT id,name,country,country_code FROM tbl_ports ORDER BY name LIMIT 40");
  console.log('PORTS=' + JSON.stringify(ports.rows));
  const itin = await c.query("SELECT COUNT(*) as cnt FROM tbl_cruise_itinerary");
  console.log('ITIN_TOTAL=' + JSON.stringify(itin.rows));
  const svc = await c.query("SELECT COUNT(*) as cnt FROM tbl_cruise_services");
  console.log('SVC_TOTAL=' + JSON.stringify(svc.rows));
  const visa = await c.query("SELECT COUNT(*) as cnt FROM tbl_cruise_entry_requirements");
  console.log('VISA_TOTAL=' + JSON.stringify(visa.rows));
  c.end();
}).catch(e => { console.error('ERR:' + e.message); process.exit(1); });
