import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('tbl_ships')
@Index('idx_ships_company', ['shipping_company_id'])
export class Ship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shipping_company_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'smallint', nullable: true })
  year_of_construction: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  tonnage: number | null;

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  length_meters: number | null;

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  width_meters: number | null;

  @Column({ type: 'numeric', precision: 6, scale: 2, nullable: true })
  speed_knots: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  flag: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  shipyard: string | null;

  @Column({ type: 'smallint', nullable: true })
  number_of_decks: number | null;

  @Column({ type: 'int', nullable: true })
  passenger_capacity: number | null;

  @Column({ type: 'int', nullable: true })
  crew_members: number | null;

  @Column({ type: 'smallint', nullable: true })
  restaurant_count: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  onboard_language: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  onboard_currency: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  facts: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
