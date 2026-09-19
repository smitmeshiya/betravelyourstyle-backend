import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cruise }                   from '../../schema/cruises.schema';
import { CruiseImage }              from '../../schema/cruise-images.schema';
import { Ship }                     from '../../schema/ships.schema';
import { ShipImage }                from '../../schema/ship-images.schema';
import { ShippingCompany }          from '../../schema/shipping-companies.schema';
import { CruiseItinerary }          from '../../schema/cruise-itinerary.schema';
import { Port }                     from '../../schema/ports.schema';
import { CruiseService as CruiseSvc } from '../../schema/cruise-services.schema';
import { CruiseEntryRequirement }   from '../../schema/cruise-entry-requirements.schema';
import { Review }                   from '../../schema/reviews.schema';
import { CabinCategory }            from '../../schema/cabin-categories.schema';
import { CruiseCabinOffer }         from '../../schema/cruise-cabin-offers.schema';
import { CommonMessages } from '../../common/common-message';
import { getPagination, getPagingData } from '../../common/common.utils';

@Injectable()
export class CruisesService {
  constructor(
    @InjectRepository(Cruise)
    private readonly cruiseRepo: Repository<Cruise>,

    @InjectRepository(CruiseImage)
    private readonly cruiseImageRepo: Repository<CruiseImage>,

    @InjectRepository(Ship)
    private readonly shipRepo: Repository<Ship>,

    @InjectRepository(ShipImage)
    private readonly shipImageRepo: Repository<ShipImage>,

    @InjectRepository(ShippingCompany)
    private readonly companyRepo: Repository<ShippingCompany>,

    @InjectRepository(CruiseItinerary)
    private readonly itineraryRepo: Repository<CruiseItinerary>,

    @InjectRepository(Port)
    private readonly portRepo: Repository<Port>,

    @InjectRepository(CruiseSvc)
    private readonly cruiseServiceRepo: Repository<CruiseSvc>,

    @InjectRepository(CruiseEntryRequirement)
    private readonly entryRequirementRepo: Repository<CruiseEntryRequirement>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(CabinCategory)
    private readonly cabinCategoryRepo: Repository<CabinCategory>,

    @InjectRepository(CruiseCabinOffer)
    private readonly cabinOfferRepo: Repository<CruiseCabinOffer>,
  ) {}

  // ── Shared helper: make relative paths absolute ──────────
  private toAbsolute(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3000/api').replace(/\/api$/, '');
    return `${baseUrl}/${path}`;
  }

  // ── Shared helper: enrich cruise rows with images, ship, company, ports ──
  private async enrichCruises(cruises: Cruise[]): Promise<any[]> {
    if (cruises.length === 0) return [];

    const cruiseIds  = cruises.map((c) => c.id);
    const shipIds    = [...new Set(cruises.map((c) => c.ship_id))];
    const companyIds = [...new Set(cruises.map((c) => c.shipping_company_id))];

    const [
      allCruiseImages,
      ships,
      shipImages,
      companies,
      itineraryRows,
    ] = await Promise.all([
      // cruise images: cover first, then gallery by sort_order
      this.cruiseImageRepo
        .createQueryBuilder('ci')
        .where('ci.cruise_id IN (:...ids)', { ids: cruiseIds })
        .orderBy("CASE WHEN ci.image_type = 'cover' THEN 0 ELSE 1 END", 'ASC')
        .addOrderBy('ci.sort_order', 'ASC')
        .getMany(),

      this.shipRepo
        .createQueryBuilder('s')
        .where('s.id IN (:...ids)', { ids: shipIds })
        .getMany(),

      // ship cover images — fallback when cruise has no images
      this.shipImageRepo
        .createQueryBuilder('si')
        .where('si.ship_id IN (:...ids)', { ids: shipIds })
        .orderBy("CASE WHEN si.image_type = 'cover' THEN 0 ELSE 1 END", 'ASC')
        .addOrderBy('si.sort_order', 'ASC')
        .getMany(),

      this.companyRepo
        .createQueryBuilder('sc')
        .where('sc.id IN (:...ids)', { ids: companyIds })
        .getMany(),

      // itinerary stops ordered by day
      this.itineraryRepo
        .createQueryBuilder('it')
        .where('it.cruise_id IN (:...ids)', { ids: cruiseIds })
        .andWhere('it.port_id IS NOT NULL')
        .orderBy('it.cruise_id', 'ASC')
        .addOrderBy('it.day_number', 'ASC')
        .getMany(),
    ]);

    // fetch port names
    const portIds = [...new Set(itineraryRows.map((r) => r.port_id).filter(Boolean))];
    const ports   = portIds.length
      ? await this.portRepo
          .createQueryBuilder('p')
          .where('p.id IN (:...ids)', { ids: portIds })
          .getMany()
      : [];

    // build lookup maps
    const cruiseImagesMap = new Map<string, string[]>();
    for (const img of allCruiseImages) {
      if (!cruiseImagesMap.has(img.cruise_id)) cruiseImagesMap.set(img.cruise_id, []);
      cruiseImagesMap.get(img.cruise_id)!.push(this.toAbsolute(img.image_url)!);
    }

    const shipImagesMap = new Map<string, string[]>();
    for (const img of shipImages) {
      if (!shipImagesMap.has(img.ship_id)) shipImagesMap.set(img.ship_id, []);
      shipImagesMap.get(img.ship_id)!.push(this.toAbsolute(img.image_url)!);
    }

    const shipMap    = new Map(ships.map((s) => [s.id, s]));
    const companyMap = new Map(companies.map((co) => [co.id, co]));
    const portNameMap = new Map(ports.map((p) => [p.id, p.name]));

    const itineraryByCruise = new Map<string, string[]>();
    for (const row of itineraryRows) {
      const portName = portNameMap.get(row.port_id!) ?? null;
      if (!portName) continue;
      if (!itineraryByCruise.has(row.cruise_id)) itineraryByCruise.set(row.cruise_id, []);
      const list = itineraryByCruise.get(row.cruise_id)!;
      if (list[list.length - 1] !== portName) list.push(portName);
    }

    return cruises.map((c) => {
      const ship    = shipMap.get(c.ship_id);
      const company = companyMap.get(c.shipping_company_id);
      const images  = cruiseImagesMap.get(c.id)?.length
        ? cruiseImagesMap.get(c.id)!
        : (shipImagesMap.get(c.ship_id) ?? []);

      return {
        ...c,
        images,
        cover_image:     images[0] ?? null,
        ship_name:       ship?.name ?? null,
        ship_slug:       ship?.slug ?? null,
        company_name:    company?.name ?? null,
        company_logo:    this.toAbsolute(company?.logo ?? null),
        company_slug:    company?.slug ?? null,
        itinerary_ports: itineraryByCruise.get(c.id) ?? [],
      };
    });
  }

  // ── GET /api/cruises/list ─────────────────────────────────
  // Query params: page, limit, search, min_price, max_price,
  //               duration_days, company_slug, sort
  async getList(filters: {
    page?: number;
    limit?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    duration_days?: number;
    company_slug?: string;
    sort?: string;
  }) {
    const {
      page  = 1,
      limit = 12,
      search,
      min_price,
      max_price,
      duration_days,
      company_slug,
      sort = 'start_date_asc',
    } = filters;

    const { offset } = getPagination(page, limit);

    let qb = this.cruiseRepo
      .createQueryBuilder('c')
      .where("c.status = 'published'")
      .andWhere('c.deleted_at IS NULL');

    // --- filters ---
    if (search) {
      qb = qb.andWhere(
        '(LOWER(c.name) LIKE :search OR LOWER(c.short_description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    if (min_price !== undefined && !isNaN(min_price)) {
      qb = qb.andWhere('c.price_per_person >= :min_price', { min_price });
    }

    if (max_price !== undefined && !isNaN(max_price)) {
      qb = qb.andWhere('c.price_per_person <= :max_price', { max_price });
    }

    if (duration_days !== undefined && !isNaN(duration_days)) {
      qb = qb.andWhere('c.duration_days = :duration_days', { duration_days });
    }

    // filter by company via join
    if (company_slug) {
      qb = qb
        .innerJoin(
          'tbl_shipping_companies',
          'sc',
          'sc.id = c.shipping_company_id AND sc.slug = :company_slug',
          { company_slug },
        );
    }

    // --- sorting ---
    switch (sort) {
      case 'price_asc':
        qb = qb.orderBy('c.price_per_person', 'ASC', 'NULLS LAST');
        break;
      case 'price_desc':
        qb = qb.orderBy('c.price_per_person', 'DESC', 'NULLS LAST');
        break;
      case 'duration_asc':
        qb = qb.orderBy('c.duration_days', 'ASC', 'NULLS LAST');
        break;
      case 'duration_desc':
        qb = qb.orderBy('c.duration_days', 'DESC', 'NULLS LAST');
        break;
      case 'start_date_desc':
        qb = qb.orderBy('c.start_date', 'DESC', 'NULLS LAST');
        break;
      default: // start_date_asc
        qb = qb.orderBy('c.start_date', 'ASC', 'NULLS LAST');
    }

    const [cruises, total] = await qb.skip(offset).take(limit).getManyAndCount();
    const enriched = await this.enrichCruises(cruises);

    return getPagingData({ count: total, rows: enriched }, page, limit);
  }

  // ── GET /api/cruises/get/:slug ────────────────────────────
  async getBySlug(slug: string) {
    const cruise = await this.cruiseRepo.findOne({
      where: { slug, status: 'published' },
    });
    if (!cruise) throw new NotFoundException(CommonMessages.not_found('Cruise'));

    // Base enrichment (images, ship, company, port names)
    const [enriched] = await this.enrichCruises([cruise]);

    // ── Services (included / not_included) ───────────────
    const serviceRows = await this.cruiseServiceRepo.find({
      where: { cruise_id: cruise.id },
      order: { service_type: 'ASC', sort_order: 'ASC' },
    });

    const services = {
      included: serviceRows
        .filter((s) => s.service_type === 'included')
        .map((s) => ({ title: s.title, description: s.description })),
      not_included: serviceRows
        .filter((s) => s.service_type === 'not_included')
        .map((s) => ({ title: s.title, description: s.description })),
    };

    // ── Entry requirements (all nationalities for this cruise) ──
    const entryRows = await this.entryRequirementRepo.find({
      where: { cruise_id: cruise.id },
      order: { nationality: 'ASC' },
    });

    const entry_requirements = entryRows.map((r) => ({
      nationality:              r.nationality,
      visa_information:         r.visa_information,
      transit_visa_information: r.transit_visa_information,
      entry_information:        r.entry_information,
      health_regulations:       r.health_regulations,
    }));

    // ── Full itinerary (day-by-day with port details) ─────
    const itineraryRows = await this.itineraryRepo.find({
      where: { cruise_id: cruise.id },
      order: { day_number: 'ASC' },
    });

    const portIds = [...new Set(itineraryRows.map((r) => r.port_id).filter(Boolean))];
    const ports = portIds.length
      ? await this.portRepo
          .createQueryBuilder('p')
          .where('p.id IN (:...ids)', { ids: portIds })
          .getMany()
      : [];

    const portMap = new Map(ports.map((p) => [p.id, p]));

    const itinerary = itineraryRows.map((row) => {
      const port = row.port_id ? portMap.get(row.port_id) : null;
      return {
        day_number:        row.day_number,
        port_name:         port?.name ?? null,
        country:           port?.country ?? null,
        country_code:      port?.country_code ?? null,
        latitude:          row.latitude ?? port?.latitude ?? null,
        longitude:         row.longitude ?? port?.longitude ?? null,
        arrival_at:        row.arrival_at,
        departure_at:      row.departure_at,
        stay_description:  row.stay_description,
        route_description: row.route_description,
      };
    });

    return {
      ...enriched,
      services,
      entry_requirements,
      itinerary,
    };
  }

  // ── GET /api/cruises/filters/meta ─────────────────────────
  // Returns distinct values for populating filter dropdowns
  async getFiltersMeta() {
    const [durationRows, companies] = await Promise.all([
      this.cruiseRepo
        .createQueryBuilder('c')
        .select('DISTINCT c.duration_days', 'duration_days')
        .where("c.status = 'published'")
        .andWhere('c.duration_days IS NOT NULL')
        .orderBy('c.duration_days', 'ASC')
        .getRawMany<{ duration_days: number }>(),

      this.companyRepo.find({
        select: ['id', 'name', 'slug', 'logo'],
        order: { name: 'ASC' },
      }),
    ]);

    const priceRow = await this.cruiseRepo
      .createQueryBuilder('c')
      .select('MIN(c.price_per_person)', 'min_price')
      .addSelect('MAX(c.price_per_person)', 'max_price')
      .where("c.status = 'published'")
      .andWhere('c.price_per_person IS NOT NULL')
      .getRawOne<{ min_price: string; max_price: string }>();

    return {
      duration_options: durationRows.map((r) => Number(r.duration_days)),
      companies:        companies.map((co) => ({
        slug: co.slug,
        name: co.name,
        logo: this.toAbsolute(co.logo),
      })),
      price_range: {
        min: priceRow?.min_price ? Number(priceRow.min_price) : 0,
        max: priceRow?.max_price ? Number(priceRow.max_price) : 0,
      },
    };
  }

  // ── GET /api/cruises/reviews/:slug ────────────────────────
  // Returns review summary + paginated list for the ship that runs this cruise
  async getReviews(slug: string, page = 1, size = 10) {
    const cruise = await this.cruiseRepo.findOne({
      where: { slug, status: 'published' },
      select: ['id', 'ship_id', 'name'],
    });
    if (!cruise) throw new NotFoundException(CommonMessages.not_found('Cruise'));

    const ship = await this.shipRepo.findOne({
      where: { id: cruise.ship_id },
      select: ['id', 'name', 'slug'],
    });

    // All approved reviews for this ship (for summary)
    const allReviews = await this.reviewRepo.find({
      where: { ship_id: cruise.ship_id, status: 'approved' },
      order: { travel_date: 'DESC' },
    });

    const avgOf = (vals: (number | null)[]) => {
      const clean = vals.filter((v): v is number => v !== null && !isNaN(v));
      return clean.length
        ? +(clean.reduce((a, b) => a + b, 0) / clean.length).toFixed(1)
        : null;
    };

    let summary = null;
    if (allReviews.length > 0) {
      const recommended   = allReviews.filter(r => Number(r.rating) >= 4.0).length;
      const recommendRate = +((recommended / allReviews.length) * 100).toFixed(1);

      summary = {
        total_reviews:       allReviews.length,
        average_rating:      avgOf(allReviews.map(r => Number(r.rating))),
        recommendation_rate: recommendRate,
        detail_ratings: {
          ship_general:  avgOf(allReviews.map(r => r.ship_rating          ? Number(r.ship_rating)          : null)),
          cabin:         avgOf(allReviews.map(r => r.cabin_rating         ? Number(r.cabin_rating)         : null)),
          gastronomy:    avgOf(allReviews.map(r => r.gastronomy_rating    ? Number(r.gastronomy_rating)    : null)),
          entertainment: avgOf(allReviews.map(r => r.entertainment_rating ? Number(r.entertainment_rating) : null)),
          sport:         avgOf(allReviews.map(r => r.sport_rating         ? Number(r.sport_rating)         : null)),
          wellness:      avgOf(allReviews.map(r => r.wellness_rating      ? Number(r.wellness_rating)      : null)),
          service:       avgOf(allReviews.map(r => r.service_rating       ? Number(r.service_rating)       : null)),
        },
        star_breakdown: {
          five:  allReviews.filter(r => Number(r.rating) >= 4.5).length,
          four:  allReviews.filter(r => Number(r.rating) >= 3.5 && Number(r.rating) < 4.5).length,
          three: allReviews.filter(r => Number(r.rating) >= 2.5 && Number(r.rating) < 3.5).length,
          two:   allReviews.filter(r => Number(r.rating) >= 1.5 && Number(r.rating) < 2.5).length,
          one:   allReviews.filter(r => Number(r.rating) < 1.5).length,
        },
      };
    }

    // Paginated review list
    const { limit, offset, currentPage } = getPagination(page, size);
    const [rows, total] = await this.reviewRepo.findAndCount({
      where: { ship_id: cruise.ship_id, status: 'approved' },
      order: { travel_date: 'DESC' },
      take: limit,
      skip: offset,
    });

    const reviews = rows.map(r => ({
      id:          r.id,
      travel_date: r.travel_date,
      rating:      Number(r.rating),
      cabin_type:  r.cabin_type,
      title:       r.title,
      description: r.description,
      reviewer:    r.reviewer_name,
      travelled_as: r.travelled_as,
      recommends:  r.recommends_cruise,
    }));

    return {
      ship_name: ship?.name ?? null,
      summary,
      reviews,
      total,
      page:        currentPage,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  // ── GET /api/cruises/cabins/:slug ─────────────────────────
  async getCabins(slug: string) {
    const cruise = await this.cruiseRepo.findOne({
      where: { slug, status: 'published' },
      select: ['id', 'currency', 'ship_id'],
    });
    if (!cruise) throw new NotFoundException(CommonMessages.not_found('Cruise'));

    const offers = await this.cabinOfferRepo
      .createQueryBuilder('co')
      .where('co.cruise_id = :id', { id: cruise.id })
      .andWhere('co.is_available = true')
      .andWhere('co.price_per_person IS NOT NULL')
      .orderBy('co.price_per_person', 'ASC')
      .getMany();

    if (offers.length === 0) return { categories: [], currency: cruise.currency };

    const categoryIds = [...new Set(offers.map(o => o.cabin_category_id))];
    const categories  = await this.cabinCategoryRepo
      .createQueryBuilder('cc')
      .where('cc.id IN (:...ids)', { ids: categoryIds })
      .getMany();

    const catMap = new Map(categories.map(c => [c.id, c]));

    type OccEntry = { occupancy_code: string; min_occupancy: number; max_occupancy: number; price_per_person: number };
    type GroupEntry = { category: CabinCategory; min_price: number; prices_by_occupancy: OccEntry[] };
    const grouped = new Map<string, GroupEntry>();

    for (const offer of offers) {
      const cat = catMap.get(offer.cabin_category_id);
      if (!cat) continue;
      const price = Number(offer.price_per_person);
      const occCode = (offer.price_details as any)?.source_category_extended ?? '2V';

      if (!grouped.has(cat.id)) {
        grouped.set(cat.id, { category: cat, min_price: price, prices_by_occupancy: [] });
      }
      const grp = grouped.get(cat.id)!;
      if (price < grp.min_price) grp.min_price = price;

      const existing = grp.prices_by_occupancy.find(p => p.occupancy_code === occCode);
      if (!existing) {
        grp.prices_by_occupancy.push({
          occupancy_code: occCode,
          min_occupancy:  offer.min_occupancy,
          max_occupancy:  offer.max_occupancy ?? offer.min_occupancy,
          price_per_person: price,
        });
      } else if (price < existing.price_per_person) {
        existing.price_per_person = price;
      }
    }

    const OCC_ORDER: Record<string, number> = { '2V': 0, '2T': 1, '3V': 2, '1V': 3 };

    const result = [...grouped.values()]
      .sort((a, b) => a.min_price - b.min_price)
      .map(g => ({
        id:            g.category.id,
        code:          g.category.code,
        name:          g.category.name,
        cabin_type:    g.category.cabin_type,
        max_occupancy: g.category.max_occupancy,
        images:        g.category.images as string[],
        min_price:     g.min_price,
        prices_by_occupancy: g.prices_by_occupancy.sort(
          (a, b) => (OCC_ORDER[a.occupancy_code] ?? 99) - (OCC_ORDER[b.occupancy_code] ?? 99),
        ),
      }));

    return { categories: result, currency: cruise.currency };
  }
}
