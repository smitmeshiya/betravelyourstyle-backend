import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('tbl_cabins')
@Unique(['ship_id', 'cabin_number'])
export class Cabin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'uuid', nullable: true })
  deck_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  cabin_category_id: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cabin_number: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'smallint', nullable: true })
  max_occupancy: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @Column({ type: 'jsonb', default: '[]' })
  features: any[];
}
