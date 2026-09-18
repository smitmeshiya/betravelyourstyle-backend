import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ship } from '../../schema/ships.schema';
import { ShipContentSection } from '../../schema/ship-content-sections.schema';
import { ShipDeck } from '../../schema/ship-decks.schema';
import { CabinCategory } from '../../schema/cabin-categories.schema';
import { Review } from '../../schema/reviews.schema';
import { Cruise } from '../../schema/cruises.schema';
import { ShippingCompany } from '../../schema/shipping-companies.schema';
import { CommonMessages } from '../../common/common-message';
import { getPagination, getPagingData } from '../../common/common.utils';

@Injectable()
export class ShipsService {
  constructor(
    @InjectRepository(Ship)
    private readonly shipRepo: Repository<Ship>,

    @InjectRepository(ShipContentSection)
    private readonly contentSectionRepo: Repository<ShipContentSection>,

    @InjectRepository(ShipDeck)
    private readonly deckRepo: Repository<ShipDeck>,

    @InjectRepository(CabinCategory)
    private readonly cabinCategoryRepo: Repository<CabinCategory>,

    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(Cruise)
    private readonly cruiseRepo: Repository<Cruise>,

    @InjectRepository(ShippingCompany)
    private readonly companyRepo: Repository<ShippingCompany>,
  ) {}

  // ── Get all ships (name list only) ────────────────────────
  async getAll() {
    try {
      return await this.shipRepo.find({
        select: ['id', 'name', 'slug'],
        order: { name: 'ASC' },
      });
    } catch (error: any) {
      console.error('Error in getAll ships:', error);
      throw error;
    }
  }

  // ── Get ship by slug (full data) ──────────────────────────
  async getBySlug(slug: string, reviewPage = 1, reviewSize = 10) {
    try {
      const ship = await this.shipRepo.findOne({ where: { slug } });
      if (!ship) throw new NotFoundException(CommonMessages.not_found('Ship'));

      const serverBase = (process.env.BASE_URL ?? '').replace(/\/api$/, '');
      const fullUrl = (path: string | null) =>
        path ? `${serverBase}/${path}` : null;

      const company = await this.companyRepo.findOne({
        where: { id: ship.shipping_company_id },
        select: ['id', 'name', 'slug'],
      });

      const contentSections = await this.contentSectionRepo.find({
        where: { ship_id: ship.id },
        order: { sort_order: 'ASC' },
      });

      const decks = await this.deckRepo.find({
        where: { ship_id: ship.id },
        order: { sort_order: 'ASC' },
      });

      const cabinCategories = await this.cabinCategoryRepo.find({
        where: { ship_id: ship.id },
      });

      const cabinCategoriesWithUrls = cabinCategories.map(cat => {
        const images = (cat.images as any[]).map(img => ({
          ...img,
          url: fullUrl(img.url),
        }));
        return { ...cat, images };
      });

      const deckCategoryMap: Record<string, typeof cabinCategoriesWithUrls> = {
        'Cabin Deck 1':     cabinCategoriesWithUrls.filter(c => ['F', 'E', 'D'].includes(c.code)),
        'Promenade Deck 2': cabinCategoriesWithUrls.filter(c => ['C', 'B'].includes(c.code)),
        'Lido Deck 3':      cabinCategoriesWithUrls.filter(c => ['A'].includes(c.code)),
        'Sun Deck 4':       [],
      };

      const labelMap: Record<string, string> = {
        outside_cabin: 'Outside cabins',
        suite:         'Suites',
        guarantee:     'Guarantee cabins',
      };

      const groupByType = (cats: typeof cabinCategoriesWithUrls) => {
        const groups: Record<string, typeof cabinCategoriesWithUrls> = {};
        for (const cat of cats) {
          const key = cat.cabin_type || 'outside_cabin';
          if (!groups[key]) groups[key] = [];
          groups[key].push(cat);
        }
        return Object.entries(groups).map(([type, categories]) => ({
          type,
          label: labelMap[type] ?? type,
          categories,
        }));
      };

      const decksWithCabins = decks.map(deck => ({
        ...deck,
        plan_image:   fullUrl(deck.plan_image),
        cabin_groups: groupByType(deckCategoryMap[deck.name] ?? []),
      }));

      // Fetch ALL reviews for summary computation
      const allReviews = await this.reviewRepo.find({
        where: { ship_id: ship.id, status: 'approved' },
        order: { travel_date: 'DESC' },
      });

      // Compute review summary from all reviews
      let reviewSummary = null;
      if (allReviews.length > 0) {
        const avgOf = (vals: (number | null)[]) => {
          const clean = vals.filter((v): v is number => v !== null && !isNaN(v));
          return clean.length
            ? +(clean.reduce((a, b) => a + b, 0) / clean.length).toFixed(1)
            : null;
        };

        const recommended   = allReviews.filter(r => Number(r.rating) >= 4.0).length;
        const recommendRate = +((recommended / allReviews.length) * 100).toFixed(1);

        reviewSummary = {
          total_reviews:       allReviews.length,
          average_rating:      avgOf(allReviews.map(r => Number(r.rating))),
          recommendation_rate: `${recommendRate}%`,
          details_overall_rating: {
            ship_general:  avgOf(allReviews.map(r => r.ship_rating          ? Number(r.ship_rating)          : null)),
            cabin:         avgOf(allReviews.map(r => r.cabin_rating         ? Number(r.cabin_rating)         : null)),
            gastronomy:    avgOf(allReviews.map(r => r.gastronomy_rating    ? Number(r.gastronomy_rating)    : null)),
            entertainment: avgOf(allReviews.map(r => r.entertainment_rating ? Number(r.entertainment_rating) : null)),
            sport:         avgOf(allReviews.map(r => r.sport_rating         ? Number(r.sport_rating)         : null)),
            wellness:      avgOf(allReviews.map(r => r.wellness_rating      ? Number(r.wellness_rating)      : null)),
            service:       avgOf(allReviews.map(r => r.service_rating       ? Number(r.service_rating)       : null)),
          },
          star_breakdown: {
            five_stars:  allReviews.filter(r => Number(r.rating) >= 4.5).length,
            four_stars:  allReviews.filter(r => Number(r.rating) >= 3.5 && Number(r.rating) < 4.5).length,
            three_stars: allReviews.filter(r => Number(r.rating) >= 2.5 && Number(r.rating) < 3.5).length,
            two_stars:   allReviews.filter(r => Number(r.rating) >= 1.5 && Number(r.rating) < 2.5).length,
            one_star:    allReviews.filter(r => Number(r.rating) < 1.5).length,
          },
        };
      }

      // Fetch paginated review list
      const { limit, offset, currentPage } = getPagination(reviewPage, reviewSize);
      const [pagedReviews, totalReviews]   = await this.reviewRepo.findAndCount({
        where: { ship_id: ship.id, status: 'approved' },
        order: { travel_date: 'DESC' },
        take:  limit,
        skip:  offset,
      });
      const reviewPaging = getPagingData(
        { count: totalReviews, rows: pagedReviews },
        currentPage,
        limit,
      );

      const routeCalendar = await this.cruiseRepo.find({
        where: { ship_id: ship.id, status: 'published' },
        select: ['id', 'name', 'slug', 'duration_days', 'start_date', 'end_date',
                 'price_per_person', 'currency', 'short_description', 'status'],
        order: { start_date: 'ASC' },
      });

      const facts         = ship.facts as Record<string, any>;
      const pricesOnBoard = facts?.prices_on_board ?? null;
      const highlights    = facts?.highlights ?? [];

      return {
        ship: {
          id:               ship.id,
          name:             ship.name,
          slug:             ship.slug,
          shipping_company: company ?? null,
          description:      ship.description,
          highlights,
          facts_and_figures: {
            tonnage:              ship.tonnage,
            year_of_construction: ship.year_of_construction,
            length_meters:        ship.length_meters,
            width_meters:         ship.width_meters,
            speed_knots:          ship.speed_knots,
            flag:                 ship.flag,
            shipyard:             ship.shipyard,
            number_of_decks:      ship.number_of_decks,
            passenger_capacity:   ship.passenger_capacity,
            crew_members:         ship.crew_members,
            restaurant_count:     ship.restaurant_count,
            onboard_language:     ship.onboard_language,
            onboard_currency:     ship.onboard_currency,
          },
          content_sections: contentSections,
          created_at: ship.created_at,
          updated_at: ship.updated_at,
        },
        decks_and_cabins: decksWithCabins,
        reviews: {
          summary: reviewSummary,
          list:    reviewPaging,
        },
        route_calendar:  routeCalendar,
        prices_on_board: pricesOnBoard,
      };
    } catch (error: any) {
      console.error('Error in getBySlug ship:', error);
      throw error;
    }
  }

  // ── Get review by id (detail view) ───────────────────────
  async getReviewById(id: string) {
    try {
      const review = await this.reviewRepo.findOne({
        where: { id, status: 'approved' },
      });
      if (!review) throw new NotFoundException(CommonMessages.not_found('Review'));

      const serverBase = (process.env.BASE_URL ?? '').replace(/\/api$/, '');

      // Increment read count
      await this.reviewRepo.update(id, { read_count: (review.read_count ?? 0) + 1 });

      const ratingLabel = (r: number | null): string => {
        if (r === null || isNaN(r)) return '';
        if (r >= 4.5) return 'Perfect';
        if (r >= 4.0) return 'Terrific';
        if (r >= 3.5) return 'Very good';
        if (r >= 3.0) return 'In order';
        if (r >= 2.0) return 'Sufficient';
        return 'Poor';
      };

      return {
        id:             review.id,
        title:          review.title,
        reviewer: {
          name:              review.reviewer_name,
          avatar:            review.reviewer_avatar
                               ? `${serverBase}/${review.reviewer_avatar}`
                               : null,
          is_verified:       review.is_verified,
          recommends_cruise: review.recommends_cruise,
          cruise_count:      review.cruise_count,
        },
        overall_rating: Number(review.rating),
        rating_label:   ratingLabel(Number(review.rating)),
        description:    review.description,
        travel_details: {
          travel_date:       review.travel_date,
          travel_duration:   review.travel_duration ? `${review.travel_duration} days` : null,
          destination:       review.destination,
          countries:         review.countries,
          ports:             review.ports,
          cabin_type:        review.cabin_type,
          travelled_as:      review.travelled_as,
          children_in_group: review.children_in_group,
          cruiser_type:      review.cruiser_type,
        },
        evaluation_categories: {
          ship:          { rating: Number(review.ship_rating),          label: ratingLabel(Number(review.ship_rating)) },
          cabin:         { rating: Number(review.cabin_rating),         label: ratingLabel(Number(review.cabin_rating)) },
          route:         { rating: Number(review.route_rating),         label: ratingLabel(Number(review.route_rating)) },
          gastronomy:    { rating: Number(review.gastronomy_rating),    label: ratingLabel(Number(review.gastronomy_rating)) },
          entertainment: { rating: Number(review.entertainment_rating), label: ratingLabel(Number(review.entertainment_rating)) },
          sport:         { rating: Number(review.sport_rating),         label: ratingLabel(Number(review.sport_rating)) },
          wellness:      { rating: Number(review.wellness_rating),      label: ratingLabel(Number(review.wellness_rating)) },
          service:       { rating: Number(review.service_rating),       label: ratingLabel(Number(review.service_rating)) },
        },
        read_count:        (review.read_count ?? 0) + 1,
        helpful_count:     review.helpful_count,
        not_helpful_count: review.not_helpful_count,
        created_at:        review.created_at,
      };
    } catch (error: any) {
      console.error('Error in getReviewById:', error);
      throw error;
    }
  }

  // ── Mark review helpful / not helpful ────────────────────
  async markReviewHelpful(id: string, helpful: boolean) {
    try {
      const review = await this.reviewRepo.findOne({ where: { id } });
      if (!review) throw new NotFoundException(CommonMessages.not_found('Review'));

      if (helpful) {
        await this.reviewRepo.update(id, { helpful_count: (review.helpful_count ?? 0) + 1 });
      } else {
        await this.reviewRepo.update(id, { not_helpful_count: (review.not_helpful_count ?? 0) + 1 });
      }
    } catch (error: any) {
      console.error('Error in markReviewHelpful:', error);
      throw error;
    }
  }
}
