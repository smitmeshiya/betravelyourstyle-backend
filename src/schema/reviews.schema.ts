import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('tbl_reviews')
@Index('idx_reviews_ship', ['ship_id'])
@Index('idx_reviews_cruise', ['cruise_id'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  cruise_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  ship_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  // ── Reviewer info ──────────────────────────────────────────
  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewer_name: string | null;

  @Column({ type: 'text', nullable: true })
  reviewer_avatar: string | null;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: false })
  recommends_cruise: boolean;

  @Column({ type: 'smallint', nullable: true })
  cruise_count: number | null;        // "I've been on two cruises"

  // ── Travel details ─────────────────────────────────────────
  @Column({ type: 'date', nullable: true })
  travel_date: Date | null;

  @Column({ type: 'smallint', nullable: true })
  travel_duration: number | null;     // days

  @Column({ type: 'varchar', length: 255, nullable: true })
  destination: string | null;         // e.g. "Eastern Mediterranean"

  @Column({ type: 'varchar', length: 255, nullable: true })
  countries: string | null;           // e.g. "Italy, Greece, Malta"

  @Column({ type: 'text', nullable: true })
  ports: string | null;               // comma-separated port list

  @Column({ type: 'varchar', length: 100, nullable: true })
  cabin_type: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  travelled_as: string | null;        // e.g. "Couple", "Family", "Solo"

  @Column({ type: 'boolean', default: false })
  children_in_group: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  cruise_ship_type: string | null;    // e.g. "Classic & elegant"

  @Column({ type: 'varchar', length: 150, nullable: true })
  cruiser_type: string | null;        // e.g. "Classic & elegant"

  // ── Ratings ────────────────────────────────────────────────
  @Column({ type: 'numeric', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  ship_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  cabin_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  route_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  gastronomy_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  entertainment_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  sport_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  wellness_rating: number | null;

  @Column({ type: 'numeric', precision: 2, scale: 1, nullable: true })
  service_rating: number | null;

  // ── Review content ─────────────────────────────────────────
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // ── Engagement ─────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  read_count: number;

  @Column({ type: 'int', default: 0 })
  helpful_count: number;

  @Column({ type: 'int', default: 0 })
  not_helpful_count: number;

  // ── Status ─────────────────────────────────────────────────
  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
