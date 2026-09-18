import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation } from '../../schema/recommendations.schema';
import { CruiseRecommendation } from '../../schema/cruise-recommendations.schema';
import { Cruise } from '../../schema/cruises.schema';
import { CruiseImage } from '../../schema/cruise-images.schema';
import { Ship } from '../../schema/ships.schema';
import { ShipImage } from '../../schema/ship-images.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { CruiseItinerary } from '../../schema/cruise-itinerary.schema';
import { Port } from '../../schema/ports.schema';
import { CommonMessages } from '../../common/common-message';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly recommendationRepo: Repository<Recommendation>,

    @InjectRepository(CruiseRecommendation)
    private readonly cruiseRecommendationRepo: Repository<CruiseRecommendation>,

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
  ) {}

  // ── Get all recommendations ───────────────────────────────
  async getAll() {
    try {
      return await this.recommendationRepo.find({
        order: { created_at: 'DESC' },
      });
    } catch (error: any) {
      console.error('Error in getAll recommendations:', error);
      throw error;
    }
  }

  // ── Get single recommendation by id ──────────────────────
  async getById(slug: string) {
    try {
      const record = await this.recommendationRepo.findOne({ where: { slug } });
      if (!record) throw new NotFoundException(CommonMessages.not_found('Recommendation'));
      return record;
    } catch (error: any) {
      console.error('Error in getById recommendation:', error);
      throw error;
    }
  }

  // ── Get cruises for a recommendation (by slug) ────────────
  async getCruisesBySlug(
    slug: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      // Base URL for building absolute image URLs (no trailing slash)
      const baseUrl = (process.env.BASE_URL ?? 'http://localhost:3000/api')
        .replace(/\/api$/, '');   // strip /api → gives http://host:port

      const toAbsolute = (path: string | null): string | null => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${baseUrl}/${path}`;
      };

      // 1. Resolve recommendation
      const recommendation = await this.recommendationRepo.findOne({ where: { slug } });
      if (!recommendation) {
        throw new NotFoundException(CommonMessages.not_found('Recommendation'));
      }

      // 2. Count total linked cruises for debug
      const totalLinks = await this.cruiseRecommendationRepo.count({
        where: { recommendation_id: recommendation.id },
      });
      console.log(`[recommendations] slug="${slug}" id="${recommendation.id}" total_links=${totalLinks}`);

      const skip = (page - 1) * limit;

      // 3. Paginated cruises via JOIN
      const [cruises, total] = await this.cruiseRepo
        .createQueryBuilder('c')
        .innerJoin(
          'tbl_cruise_recommendations',
          'cr',
          'cr.cruise_id = c.id AND cr.recommendation_id = :recId',
          { recId: recommendation.id },
        )
        .where('c.deleted_at IS NULL')
        .orderBy('c.start_date', 'ASC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      console.log(`[recommendations] cruises found: ${total}`);

      if (cruises.length === 0) {
        return { recommendation, cruises: [], total, page, limit, total_pages: 0 };
      }

      const cruiseIds  = cruises.map((c) => c.id);
      const shipIds    = [...new Set(cruises.map((c) => c.ship_id))];
      const companyIds = [...new Set(cruises.map((c) => c.shipping_company_id))];

      // 4. Fetch all enrichment data in parallel
      const [
        allCruiseImages,   // ALL images per cruise (not just cover)
        ships,
        shipImages,
        companies,
        itineraryRows,
      ] = await Promise.all([
        // all cruise images ordered: cover first, then gallery by sort_order
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

        // ship cover images — fallback when no cruise images exist
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

      // 5. Fetch port names
      const portIds = [...new Set(itineraryRows.map((r) => r.port_id).filter(Boolean))];
      const ports = portIds.length
        ? await this.portRepo
            .createQueryBuilder('p')
            .where('p.id IN (:...ids)', { ids: portIds })
            .getMany()
        : [];

      // 6. Build lookup maps
      // cruise images grouped by cruise_id → array of absolute URLs
      const cruiseImagesMap = new Map<string, string[]>();
      for (const img of allCruiseImages) {
        if (!cruiseImagesMap.has(img.cruise_id)) {
          cruiseImagesMap.set(img.cruise_id, []);
        }
        cruiseImagesMap.get(img.cruise_id).push(toAbsolute(img.image_url));
      }

      // ship images grouped by ship_id → array of absolute URLs
      const shipImagesMap = new Map<string, string[]>();
      for (const img of shipImages) {
        if (!shipImagesMap.has(img.ship_id)) {
          shipImagesMap.set(img.ship_id, []);
        }
        shipImagesMap.get(img.ship_id).push(toAbsolute(img.image_url));
      }

      const shipMap    = new Map<string, Ship>();
      for (const ship of ships) shipMap.set(ship.id, ship);

      const companyMap = new Map<string, ShippingCompany>();
      for (const co of companies) companyMap.set(co.id, co);

      const portNameMap = new Map<string, string>();
      for (const p of ports) portNameMap.set(p.id, p.name);

      // itinerary grouped by cruise — unique port names in order
      const itineraryByCruise = new Map<string, string[]>();
      for (const row of itineraryRows) {
        const portName = portNameMap.get(row.port_id) ?? null;
        if (!portName) continue;
        if (!itineraryByCruise.has(row.cruise_id)) {
          itineraryByCruise.set(row.cruise_id, []);
        }
        const list = itineraryByCruise.get(row.cruise_id);
        if (list[list.length - 1] !== portName) {
          list.push(portName);
        }
      }

      // 7. Assemble final result
      const result = cruises.map((c) => {
        const ship    = shipMap.get(c.ship_id);
        const company = companyMap.get(c.shipping_company_id);

        // use cruise images; fall back to ship images if none
        const images: string[] =
          cruiseImagesMap.get(c.id)?.length
            ? cruiseImagesMap.get(c.id)
            : (shipImagesMap.get(c.ship_id) ?? []);

        return {
          ...c,
          images,                                       // all images as array
          cover_image:     images[0] ?? null,           // first = cover
          ship_name:       ship?.name ?? null,
          ship_slug:       ship?.slug ?? null,
          company_name:    company?.name ?? null,
          company_logo:    toAbsolute(company?.logo),   // full URL
          company_slug:    company?.slug ?? null,
          itinerary_ports: itineraryByCruise.get(c.id) ?? [],
        };
      });

      return {
        recommendation,
        cruises: result,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      };
    } catch (error: any) {
      console.error('Error in getCruisesBySlug:', error);
      throw error;
    }
  }
}
