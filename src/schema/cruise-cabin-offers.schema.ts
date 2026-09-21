import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
} from 'typeorm';

@Entity('tbl_cruise_cabin_offers')
@Index('idx_cabin_offers_cruise', ['cruise_id'])
@Unique(['cruise_id', 'cabin_category_id'])
export class CruiseCabinOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'uuid' })
  cabin_category_id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price_per_person: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  single_supplement: number | null;

  @Column({ type: 'int', nullable: true })
  available_units: number | null;

  @Column({ type: 'smallint', default: 1 })
  min_occupancy: number;

  @Column({ type: 'smallint', nullable: true })
  max_occupancy: number | null;

  @Column({ type: 'char', length: 3, default: 'EUR' })
  currency: string;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @Column({ type: 'int', nullable: true })
  available_quantity: number | null;

  @Column({ type: 'int', nullable: true })
  total_quantity: number | null;

  @Column({ type: 'jsonb', default: '{}' })
  price_details: Record<string, any>;
}
