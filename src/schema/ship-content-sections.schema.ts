import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('tbl_ship_content_sections')
@Unique(['ship_id', 'section_key'])
export class ShipContentSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'varchar', length: 100 })
  section_key: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
