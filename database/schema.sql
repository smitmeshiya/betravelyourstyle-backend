-- Finest Cruise Moments / Sea Cloud interview assignment
-- PostgreSQL schema
-- Design: normalized relational core + JSONB only for genuinely variable content.
-- Current seed can contain only Sea Cloud data; schema supports additional cruise
-- companies, ships, cruises, cabins, routes, etc.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE cruise_status AS ENUM ('draft', 'published', 'inactive', 'sold_out');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE service_type AS ENUM ('included', 'not_included');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('inquiry', 'confirmed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE passenger_gender AS ENUM ('male', 'female', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================================================
-- USERS / AUTH
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL DEFAULT 'user',
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    profile_image TEXT,
    birth_date DATE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    nationality VARCHAR(100),
    reset_password_token TEXT,
    reset_password_expires_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tbl_device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    device_token TEXT NOT NULL,
    device_type VARCHAR(30),
    device_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON tbl_device_tokens(user_id);

-- =========================================================
-- CRUISE COMPANY / SHIP
-- A company operates many ships. A ship has many cruises.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_shipping_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo TEXT,
    description TEXT,
    website TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tbl_ships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_company_id UUID NOT NULL REFERENCES tbl_shipping_companies(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    year_of_construction SMALLINT,
    tonnage NUMERIC(12,2),
    length_meters NUMERIC(8,2),
    width_meters NUMERIC(8,2),
    speed_knots NUMERIC(6,2),
    flag VARCHAR(100),
    shipyard VARCHAR(255),
    number_of_decks SMALLINT,
    passenger_capacity INTEGER,
    crew_members INTEGER,
    restaurant_count SMALLINT,
    onboard_language VARCHAR(255),
    onboard_currency VARCHAR(50),
    facts JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ships_company ON tbl_ships(shipping_company_id);

CREATE TABLE IF NOT EXISTS tbl_ship_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'gallery',
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional ship-level text sections. This avoids making dozens of nullable columns.
CREATE TABLE IF NOT EXISTS tbl_ship_content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE CASCADE,
    section_key VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    content TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(ship_id, section_key)
);

-- =========================================================
-- DECKS / DECK PLANS / CABINS
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_ship_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    deck_number INTEGER,
    description TEXT,
    plan_image TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ship_decks_ship ON tbl_ship_decks(ship_id);

CREATE TABLE IF NOT EXISTS tbl_cabin_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    max_occupancy SMALLINT,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    UNIQUE(ship_id, code)
);

CREATE TABLE IF NOT EXISTS tbl_cabins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES tbl_ship_decks(id) ON DELETE SET NULL,
    cabin_category_id UUID REFERENCES tbl_cabin_categories(id) ON DELETE SET NULL,
    cabin_number VARCHAR(50),
    name VARCHAR(255),
    description TEXT,
    max_occupancy SMALLINT,
    location VARCHAR(100),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    UNIQUE(ship_id, cabin_number)
);

-- =========================================================
-- CRUISES / OFFERS
-- IMPORTANT: cruise = a specific sailing/voyage, ship = vessel.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_cruises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_company_id UUID NOT NULL REFERENCES tbl_shipping_companies(id) ON DELETE RESTRICT,
    ship_id UUID NOT NULL REFERENCES tbl_ships(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    cruise_code VARCHAR(100),
    status cruise_status NOT NULL DEFAULT 'draft',
    duration_days INTEGER,
    start_date DATE,
    end_date DATE,
    start_port_id UUID,
    end_port_id UUID,
    price_per_person NUMERIC(12,2),
    currency CHAR(3) NOT NULL DEFAULT 'EUR',
    short_description TEXT,
    description TEXT,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cruises_ship ON tbl_cruises(ship_id);
CREATE INDEX IF NOT EXISTS idx_cruises_company ON tbl_cruises(shipping_company_id);
CREATE INDEX IF NOT EXISTS idx_cruises_dates ON tbl_cruises(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_cruises_status ON tbl_cruises(status);

CREATE TABLE IF NOT EXISTS tbl_cruise_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'gallery',
    alt_text VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- =========================================================
-- ROUTE / ITINERARY
-- Keep this relational because it is important for search,
-- filtering, ordering, dates and maps.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_ports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(150),
    country_code CHAR(2),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    description TEXT,
    UNIQUE(name, country)
);

ALTER TABLE tbl_cruises
    ADD CONSTRAINT fk_cruises_start_port
    FOREIGN KEY (start_port_id) REFERENCES tbl_ports(id) ON DELETE SET NULL;

ALTER TABLE tbl_cruises
    ADD CONSTRAINT fk_cruises_end_port
    FOREIGN KEY (end_port_id) REFERENCES tbl_ports(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS tbl_cruise_itinerary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    port_id UUID REFERENCES tbl_ports(id) ON DELETE SET NULL,
    arrival_at TIMESTAMPTZ,
    departure_at TIMESTAMPTZ,
    stay_description TEXT,
    route_description TEXT,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    UNIQUE(cruise_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_itinerary_cruise_day
    ON tbl_cruise_itinerary(cruise_id, day_number);

-- =========================================================
-- SERVICES
-- Included and not included should NOT be one JSON blob.
-- This makes it easy to render both lists and query them.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_cruise_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    service_type service_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cruise_services_cruise
    ON tbl_cruise_services(cruise_id);

-- =========================================================
-- VISA / ENTRY
-- Visa information can vary by nationality and cruise.
-- JSONB is appropriate here because source data may have
-- different expandable sections.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_cruise_entry_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    nationality VARCHAR(100) NOT NULL,
    visa_information TEXT,
    transit_visa_information TEXT,
    entry_information TEXT,
    health_regulations TEXT,
    extra_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE(cruise_id, nationality)
);

-- =========================================================
-- CRUISE CABIN OFFERS / PRICES
-- A cabin category belongs to a ship; its price/availability
-- for a particular cruise belongs here.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_cruise_cabin_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    cabin_category_id UUID NOT NULL REFERENCES tbl_cabin_categories(id) ON DELETE RESTRICT,
    price_per_person NUMERIC(12,2),
    single_supplement NUMERIC(12,2),
    available_units INTEGER,
    min_occupancy SMALLINT DEFAULT 1,
    max_occupancy SMALLINT,
    currency CHAR(3) NOT NULL DEFAULT 'EUR',
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    price_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE(cruise_id, cabin_category_id)
);

CREATE INDEX IF NOT EXISTS idx_cabin_offers_cruise
    ON tbl_cruise_cabin_offers(cruise_id);

-- =========================================================
-- RECOMMENDATIONS / CATEGORIES
-- Can be used for "Luxury Cruises", "Exclusive Sailing Cruises",
-- or recommendation/tag style filters.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tbl_cruise_recommendations (
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    recommendation_id UUID NOT NULL REFERENCES tbl_recommendations(id) ON DELETE CASCADE,
    PRIMARY KEY (cruise_id, recommendation_id)
);

-- =========================================================
-- REVIEWS
-- Separate table because reviews are repeated records and
-- may later be submitted by users.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cruise_id UUID REFERENCES tbl_cruises(id) ON DELETE SET NULL,
    ship_id UUID REFERENCES tbl_ships(id) ON DELETE SET NULL,
    user_id UUID REFERENCES tbl_users(id) ON DELETE SET NULL,
    reviewer_name VARCHAR(255),
    travel_date DATE,
    cabin_type VARCHAR(100),
    cruise_ship_type VARCHAR(150),
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    ship_rating NUMERIC(2,1),
    cabin_rating NUMERIC(2,1),
    gastronomy_rating NUMERIC(2,1),
    entertainment_rating NUMERIC(2,1),
    sport_rating NUMERIC(2,1),
    wellness_rating NUMERIC(2,1),
    service_rating NUMERIC(2,1),
    title VARCHAR(255),
    description TEXT,
    status review_status NOT NULL DEFAULT 'approved',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_ship ON tbl_reviews(ship_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cruise ON tbl_reviews(cruise_id);

-- =========================================================
-- BOOKING INQUIRY
-- No payment table required for this assignment.
-- Inquiry is the final step after cabin/passenger selection.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_booking_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID REFERENCES tbl_users(id) ON DELETE SET NULL,
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE RESTRICT,
    cabin_offer_id UUID REFERENCES tbl_cruise_cabin_offers(id) ON DELETE SET NULL,
    status booking_status NOT NULL DEFAULT 'inquiry',
    number_of_adults SMALLINT NOT NULL DEFAULT 1,
    number_of_children SMALLINT NOT NULL DEFAULT 0,
    total_estimated_amount NUMERIC(12,2),
    currency CHAR(3) NOT NULL DEFAULT 'EUR',
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tbl_booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_inquiry_id UUID NOT NULL REFERENCES tbl_booking_inquiries(id) ON DELETE CASCADE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(100),
    gender passenger_gender,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_booking_inquiries_user
    ON tbl_booking_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_cruise
    ON tbl_booking_inquiries(cruise_id);

-- =========================================================
-- OPTIONAL FAVORITES
-- Favorites are kept as an optional feature; price alerts are not included.
-- =========================================================

CREATE TABLE IF NOT EXISTS tbl_user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
    cruise_id UUID NOT NULL REFERENCES tbl_cruises(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, cruise_id)
);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON tbl_users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON tbl_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_device_tokens_updated_at ON tbl_device_tokens;
CREATE TRIGGER trg_device_tokens_updated_at BEFORE UPDATE ON tbl_device_tokens
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_shipping_companies_updated_at ON tbl_shipping_companies;
CREATE TRIGGER trg_shipping_companies_updated_at BEFORE UPDATE ON tbl_shipping_companies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_ships_updated_at ON tbl_ships;
CREATE TRIGGER trg_ships_updated_at BEFORE UPDATE ON tbl_ships
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_cruises_updated_at ON tbl_cruises;
CREATE TRIGGER trg_cruises_updated_at BEFORE UPDATE ON tbl_cruises
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_recommendations_updated_at ON tbl_recommendations;
CREATE TRIGGER trg_recommendations_updated_at BEFORE UPDATE ON tbl_recommendations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON tbl_reviews;
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON tbl_reviews
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_booking_inquiries_updated_at ON tbl_booking_inquiries;
CREATE TRIGGER trg_booking_inquiries_updated_at BEFORE UPDATE ON tbl_booking_inquiries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- RELATIONSHIP SUMMARY
-- =========================================================
-- shipping_company 1 -> N ships
-- shipping_company 1 -> N cruises
-- ship              1 -> N cruises
-- ship              1 -> N decks
-- ship              1 -> N cabin_categories
-- ship              1 -> N cabins
-- cruise            1 -> N images
-- cruise            1 -> N itinerary rows
-- cruise            1 -> N services
-- cruise            1 -> N entry requirements
-- cruise            1 -> N cabin offers
-- cruise            N -> N recommendations
-- cruise/ship       1 -> N reviews
-- user              1 -> N device tokens
-- user              1 -> N booking inquiries
-- booking inquiry   1 -> N passengers
