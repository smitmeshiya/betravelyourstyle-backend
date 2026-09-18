import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('tbl_cruise_images')
export class CruiseImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 50, default: 'gallery' })
  image_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
