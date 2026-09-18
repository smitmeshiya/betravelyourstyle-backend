import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import { UserFavorite }     from '../../schema/user-favorites.schema';
import { Cruise }           from '../../schema/cruises.schema';
import { CruiseImage }      from '../../schema/cruise-images.schema';
import { Ship }             from '../../schema/ships.schema';
import { ShippingCompany }  from '../../schema/shipping-companies.schema';
import { CommonMessages }   from '../../common/common-message';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(UserFavorite)
    private readonly favRepo: Repository<UserFavorite>,

    @InjectRepository(Cruise)
    private readonly cruiseRepo: Repository<Cruise>,

    @InjectRepository(CruiseImage)
    private readonly imageRepo: Repository<CruiseImage>,

    @InjectRepository(Ship)
    private readonly shipRepo: Repository<Ship>,

    @InjectRepository(ShippingCompany)
    private readonly companyRepo: Repository<ShippingCompany>,
  ) {}

  private toAbsolute(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = (process.env.BASE_URL ?? 'http://localhost:3000/api').replace(/\/api$/, '');
    return `${base}/${path}`;
  }

  // ── GET /api/favorites ───────────────────────────────────
  async getList(userId: string) {
    const favs = await this.favRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
    if (favs.length === 0) return [];

    const cruiseIds = favs.map(f => f.cruise_id);

    const [cruises, images, ships, companies] = await Promise.all([
      this.cruiseRepo.createQueryBuilder('c').where('c.id IN (:...ids)', { ids: cruiseIds }).getMany(),
      this.imageRepo.createQueryBuilder('ci')
        .where('ci.cruise_id IN (:...ids)', { ids: cruiseIds })
        .orderBy("CASE WHEN ci.image_type = 'cover' THEN 0 ELSE 1 END", 'ASC')
        .addOrderBy('ci.sort_order', 'ASC')
        .getMany(),
      this.shipRepo.createQueryBuilder('s').getMany(),
      this.companyRepo.createQueryBuilder('sc').getMany(),
    ]);

    const shipMap    = new Map(ships.map(s => [s.id, s]));
    const companyMap = new Map(companies.map(c => [c.id, c]));
    const imageMap   = new Map<string, string>();
    for (const img of images) {
      if (!imageMap.has(img.cruise_id)) {
        imageMap.set(img.cruise_id, this.toAbsolute(img.image_url) ?? '');
      }
    }

    return favs.map(fav => {
      const cruise  = cruises.find(c => c.id === fav.cruise_id);
      if (!cruise) return null;
      const ship    = shipMap.get(cruise.ship_id);
      const company = companyMap.get(cruise.shipping_company_id);
      return {
        favorite_id:  fav.id,
        cruise_id:    cruise.id,
        name:         cruise.name,
        slug:         cruise.slug,
        cover_image:  imageMap.get(cruise.id) ?? null,
        price_per_person: cruise.price_per_person ? Number(cruise.price_per_person) : null,
        currency:     cruise.currency,
        start_date:   cruise.start_date,
        end_date:     cruise.end_date,
        duration_days: cruise.duration_days,
        ship_name:    ship?.name ?? null,
        company_name: company?.name ?? null,
        company_logo: this.toAbsolute(company?.logo ?? null),
        added_at:     fav.created_at,
      };
    }).filter(Boolean);
  }

  // ── POST /api/favorites ──────────────────────────────────
  async addFavorite(userId: string, cruiseId: string) {
    const cruise = await this.cruiseRepo.findOne({ where: { id: cruiseId } });
    if (!cruise) throw new NotFoundException(CommonMessages.not_found('Cruise'));

    const existing = await this.favRepo.findOne({
      where: { user_id: userId, cruise_id: cruiseId },
    });
    if (existing) return { already_added: true, id: existing.id };

    const fav = this.favRepo.create({ user_id: userId, cruise_id: cruiseId });
    await this.favRepo.save(fav);
    return { already_added: false, id: fav.id };
  }

  // ── DELETE /api/favorites/:cruise_id ────────────────────
  async removeFavorite(userId: string, cruiseId: string) {
    const fav = await this.favRepo.findOne({
      where: { user_id: userId, cruise_id: cruiseId },
    });
    if (!fav) throw new NotFoundException(CommonMessages.not_found('Favorite'));
    await this.favRepo.remove(fav);
  }

  // ── GET /api/favorites/ids ───────────────────────────────
  // Returns just the cruise IDs the user has favourited — cheap check for heart state
  async getFavoriteIds(userId: string): Promise<string[]> {
    const favs = await this.favRepo.find({
      where: { user_id: userId },
      select: ['cruise_id'],
    });
    return favs.map(f => f.cruise_id);
  }
}
