# Database Schema Reference — Finest Cruise Moments

---

## tbl_users
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| role | enum('admin','user') | NO | user | |
| firstname | varchar(100) | YES | | |
| lastname | varchar(100) | YES | | |
| profile_image | text | YES | | |
| birth_date | date | YES | | |
| email | varchar(255) | NO | | UNIQUE |
| password | text | NO | | |
| street | varchar(255) | YES | | |
| city | varchar(100) | YES | | |
| county | varchar(100) | YES | | |
| nationality | varchar(100) | YES | | |
| reset_password_token | text | YES | | |
| reset_password_expires_at | timestamptz | YES | | |
| email_verification_token | text | YES | | |
| email_verified_at | timestamptz | YES | | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

---

## tbl_device_tokens
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| user_id | uuid | NO | | FK → tbl_users |
| email | varchar(255) | YES | | |
| device_token | text | NO | | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

Index: `idx_device_tokens_user_id` on (user_id)

---

## tbl_shipping_companies
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| name | varchar(255) | NO | | |
| slug | varchar(255) | NO | | UNIQUE |
| logo | text | YES | | |
| description | text | YES | | |
| website | text | YES | | |
| contact_email | varchar(255) | YES | | |
| contact_phone | varchar(100) | YES | | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

---

## tbl_ships
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| shipping_company_id | uuid | NO | | FK → tbl_shipping_companies |
| name | varchar(255) | NO | | |
| slug | varchar(255) | NO | | UNIQUE |
| description | text | YES | | |
| year_of_construction | smallint | YES | | |
| tonnage | numeric(12,2) | YES | | |
| length_meters | numeric(8,2) | YES | | |
| width_meters | numeric(8,2) | YES | | |
| speed_knots | numeric(6,2) | YES | | |
| flag | varchar(100) | YES | | |
| shipyard | varchar(255) | YES | | |
| number_of_decks | smallint | YES | | |
| passenger_capacity | int | YES | | |
| crew_members | int | YES | | |
| restaurant_count | smallint | YES | | |
| onboard_language | varchar(255) | YES | | |
| onboard_currency | varchar(50) | YES | | |
| facts | jsonb | NO | {} | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

Index: `idx_ships_company` on (shipping_company_id)

---

## tbl_ship_images
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| ship_id | uuid | NO | | FK → tbl_ships |
| image_url | text | NO | | |
| image_type | varchar(50) | NO | gallery | |
| alt_text | varchar(255) | YES | | |
| sort_order | int | NO | 0 | |
| created_at | timestamptz | NO | now() | |

---

## tbl_ship_decks
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| ship_id | uuid | NO | | FK → tbl_ships |
| name | varchar(150) | NO | | |
| deck_number | int | YES | | |
| description | text | YES | | |
| plan_image | text | YES | | |
| sort_order | int | NO | 0 | |

Index: `idx_ship_decks_ship` on (ship_id)

---

## tbl_ship_content_sections
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| ship_id | uuid | NO | | FK → tbl_ships |
| section_key | varchar(100) | NO | | |
| title | varchar(255) | YES | | |
| content | text | YES | | |
| sort_order | int | NO | 0 | |

Unique: (ship_id, section_key)

---

## tbl_cabin_categories
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| ship_id | uuid | NO | | FK → tbl_ships |
| code | varchar(50) | NO | | |
| name | varchar(255) | NO | | |
| description | text | YES | | |
| max_occupancy | smallint | YES | | |
| amenities | jsonb | NO | [] | |
| images | jsonb | NO | [] | |

Unique: (ship_id, code)

---

## tbl_cabins
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| ship_id | uuid | NO | | FK → tbl_ships |
| deck_id | uuid | YES | | FK → tbl_ship_decks |
| cabin_category_id | uuid | YES | | FK → tbl_cabin_categories |
| cabin_number | varchar(50) | YES | | |
| name | varchar(255) | YES | | |
| description | text | YES | | |
| max_occupancy | smallint | YES | | |
| location | varchar(100) | YES | | |
| features | jsonb | NO | [] | |

Unique: (ship_id, cabin_number)

---

## tbl_ports
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| name | varchar(255) | NO | | |
| country | varchar(150) | YES | | |
| country_code | char(2) | YES | | |
| latitude | numeric(10,7) | YES | | |
| longitude | numeric(10,7) | YES | | |
| description | text | YES | | |

Unique: (name, country)

---

## tbl_recommendations
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| name | varchar(255) | NO | | |
| slug | varchar(255) | NO | | UNIQUE |
| description | text | YES | | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

---

## tbl_cruises
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| shipping_company_id | uuid | NO | | FK → tbl_shipping_companies |
| ship_id | uuid | NO | | FK → tbl_ships |
| name | varchar(255) | NO | | |
| slug | varchar(255) | NO | | UNIQUE |
| cruise_code | varchar(100) | YES | | |
| status | enum('draft','published','inactive','sold_out') | NO | draft | |
| duration_days | int | YES | | |
| start_date | date | YES | | |
| end_date | date | YES | | |
| start_port_id | uuid | YES | | FK → tbl_ports |
| end_port_id | uuid | YES | | FK → tbl_ports |
| price_per_person | numeric(12,2) | YES | | |
| currency | char(3) | NO | EUR | |
| short_description | text | YES | | |
| description | text | YES | | |
| highlights | jsonb | NO | [] | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

Indexes: `idx_cruises_ship` (ship_id), `idx_cruises_company` (shipping_company_id), `idx_cruises_dates` (start_date, end_date), `idx_cruises_status` (status)

---

## tbl_cruise_images
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| image_url | text | NO | | |
| image_type | varchar(50) | NO | gallery | |
| alt_text | varchar(255) | YES | | |
| sort_order | int | NO | 0 | |
| created_at | timestamptz | NO | now() | |

---

## tbl_cruise_itinerary
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| day_number | int | NO | | |
| port_id | uuid | YES | | FK → tbl_ports |
| arrival_at | timestamptz | YES | | |
| departure_at | timestamptz | YES | | |
| stay_description | text | YES | | |
| route_description | text | YES | | |
| latitude | numeric(10,7) | YES | | |
| longitude | numeric(10,7) | YES | | |

Unique: (cruise_id, day_number) — Index: `idx_itinerary_cruise_day`

---

## tbl_cruise_services
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| service_type | enum('included','not_included') | NO | | |
| title | varchar(255) | NO | | |
| description | text | YES | | |
| sort_order | int | NO | 0 | |

Index: `idx_cruise_services_cruise` on (cruise_id)

---

## tbl_cruise_cabin_offers
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| cabin_category_id | uuid | NO | | FK → tbl_cabin_categories |
| price_per_person | numeric(12,2) | YES | | |
| single_supplement | numeric(12,2) | YES | | |
| available_units | int | YES | | |
| min_occupancy | smallint | NO | 1 | |
| max_occupancy | smallint | YES | | |
| currency | char(3) | NO | EUR | |
| is_available | boolean | NO | true | |
| price_details | jsonb | NO | {} | |

Unique: (cruise_id, cabin_category_id) — Index: `idx_cabin_offers_cruise`

---

## tbl_cruise_recommendations
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| cruise_id | uuid | NO | PK + FK → tbl_cruises |
| recommendation_id | uuid | NO | PK + FK → tbl_recommendations |

Composite PK: (cruise_id, recommendation_id)

---

## tbl_cruise_entry_requirements
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| nationality | varchar(100) | NO | | |
| visa_information | text | YES | | |
| transit_visa_information | text | YES | | |
| entry_information | text | YES | | |
| health_regulations | text | YES | | |
| extra_data | jsonb | NO | {} | |

Unique: (cruise_id, nationality)

---

## tbl_reviews
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| cruise_id | uuid | YES | | FK → tbl_cruises |
| ship_id | uuid | YES | | FK → tbl_ships |
| user_id | uuid | YES | | FK → tbl_users |
| reviewer_name | varchar(255) | YES | | |
| travel_date | date | YES | | |
| cabin_type | varchar(100) | YES | | |
| cruise_ship_type | varchar(150) | YES | | |
| rating | numeric(2,1) | NO | | |
| ship_rating | numeric(2,1) | YES | | |
| cabin_rating | numeric(2,1) | YES | | |
| gastronomy_rating | numeric(2,1) | YES | | |
| entertainment_rating | numeric(2,1) | YES | | |
| sport_rating | numeric(2,1) | YES | | |
| wellness_rating | numeric(2,1) | YES | | |
| service_rating | numeric(2,1) | YES | | |
| title | varchar(255) | YES | | |
| description | text | YES | | |
| status | enum('pending','approved','rejected') | NO | approved | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |

Indexes: `idx_reviews_ship` (ship_id), `idx_reviews_cruise` (cruise_id)

---

## tbl_user_favorites
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | uuid | NO | PK |
| user_id | uuid | NO | FK → tbl_users |
| cruise_id | uuid | NO | FK → tbl_cruises |
| created_at | timestamptz | NO | |

Unique: (user_id, cruise_id)

---

## tbl_booking_inquiries
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| inquiry_number | varchar(50) | NO | | UNIQUE |
| user_id | uuid | YES | | FK → tbl_users |
| cruise_id | uuid | NO | | FK → tbl_cruises |
| cabin_offer_id | uuid | YES | | FK → tbl_cruise_cabin_offers |
| status | enum('inquiry','confirmed','cancelled') | NO | inquiry | |
| number_of_adults | smallint | NO | 1 | |
| number_of_children | smallint | NO | 0 | |
| total_estimated_amount | numeric(12,2) | YES | | |
| currency | char(3) | NO | EUR | |
| customer_email | varchar(255) | NO | | |
| customer_phone | varchar(50) | YES | | |
| customer_message | text | YES | | |
| created_at | timestamptz | NO | now() | |
| updated_at | timestamptz | NO | now() | |
| deleted_at | timestamptz | YES | | Soft delete |

Indexes: `idx_booking_inquiries_user` (user_id), `idx_booking_inquiries_cruise` (cruise_id)

---

## tbl_booking_passengers
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | | PK |
| booking_inquiry_id | uuid | NO | | FK → tbl_booking_inquiries |
| firstname | varchar(100) | NO | | |
| lastname | varchar(100) | NO | | |
| birth_date | date | YES | | |
| nationality | varchar(100) | YES | | |
| gender | enum('male','female','other') | YES | | |
| email | varchar(255) | YES | | |
| phone | varchar(50) | YES | | |
| is_primary | boolean | NO | false | |
