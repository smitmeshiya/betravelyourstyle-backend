import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('tbl_ship_images')
export class ShipImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 50, default: 'gallery' })
  image_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt_text: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
