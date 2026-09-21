-- Migration: Add itinerary details from CSV
-- Adds: remark, region, changeover flag, port codes, country codes

-- 1. Add columns to cruise_itinerary table
ALTER TABLE tbl_cruise_itinerary 
ADD COLUMN IF NOT EXISTS remark TEXT,
ADD COLUMN IF NOT EXISTS is_changeover BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS port_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS region VARCHAR(100);

-- 2. Add region to cruises table (for filtering)
ALTER TABLE tbl_cruises
ADD COLUMN IF NOT EXISTS region VARCHAR(100);

-- 3. Add availability tracking to cabin offers
ALTER TABLE tbl_cruise_cabin_offers
ADD COLUMN IF NOT EXISTS available_quantity INTEGER,
ADD COLUMN IF NOT EXISTS total_quantity INTEGER;

-- 4. Update ports table to include port codes and country codes (if not exists)
ALTER TABLE tbl_ports
ADD COLUMN IF NOT EXISTS port_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country_code VARCHAR(5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_itinerary_region ON tbl_cruise_itinerary(region);
CREATE INDEX IF NOT EXISTS idx_itinerary_changeover ON tbl_cruise_itinerary(is_changeover);
CREATE INDEX IF NOT EXISTS idx_cruises_region ON tbl_cruises(region);
CREATE INDEX IF NOT EXISTS idx_ports_port_code ON tbl_ports(port_code);
CREATE INDEX IF NOT EXISTS idx_ports_country_code ON tbl_ports(country_code);

-- Add comments for documentation
COMMENT ON COLUMN tbl_cruise_itinerary.remark IS 'Special notes like Embarkation 16:00, Anchorage, RON, etc.';
COMMENT ON COLUMN tbl_cruise_itinerary.is_changeover IS 'TRUE if this is an embarkation or disembarkation day';
COMMENT ON COLUMN tbl_cruise_itinerary.region IS 'Geographic region like Western Mediterranean, Caribbean, etc.';
COMMENT ON COLUMN tbl_cruise_itinerary.port_code IS 'Port code from CSV like ES-PMI, IT-NAP, etc.';
COMMENT ON COLUMN tbl_cruises.region IS 'Primary region for this cruise';
COMMENT ON COLUMN tbl_cruise_cabin_offers.available_quantity IS 'Number of cabins available for booking';
COMMENT ON COLUMN tbl_cruise_cabin_offers.total_quantity IS 'Total number of cabins in this category';
