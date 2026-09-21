import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('tbl_cruises')
@Index('idx_cruises_ship', ['ship_id'])
@Index('idx_cruises_company', ['shipping_company_id'])
@Index('idx_cruises_dates', ['start_date', 'end_date'])
@Index('idx_cruises_status', ['status'])
export class Cruise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  shipping_company_id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cruise_code: string | null;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'inactive', 'sold_out'],
    default: 'draft',
  })
  status: string;

  @Column({ type: 'int', nullable: true })
  duration_days: number | null;

  @Column({ type: 'date', nullable: true })
  start_date: Date | null;

  @Column({ type: 'date', nullable: true })
  end_date: Date | null;

  @Column({ type: 'uuid', nullable: true })
  start_port_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  end_port_id: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price_per_person: number | null;

  @Column({ type: 'char', length: 3, default: 'EUR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  short_description: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', default: '[]' })
  highlights: any[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
