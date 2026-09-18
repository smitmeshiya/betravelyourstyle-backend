import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('tbl_ship_decks')
@Index('idx_ship_decks_ship', ['ship_id'])
export class ShipDeck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ship_id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'int', nullable: true })
  deck_number: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  plan_image: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
