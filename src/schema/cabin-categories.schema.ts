import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('tbl_cabin_categories')
@Unique(['ship_id', 'code'])
export class CabinCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'smallint', nullable: true })
  max_occupancy: number | null;

  @Column({ type: 'varchar', length: 50, default: 'outside_cabin' })
  cabin_type: string;

  @Column({ type: 'jsonb', default: '[]' })
  amenities: any[];

  @Column({ type: 'jsonb', default: '[]' })
  images: any[];
}
