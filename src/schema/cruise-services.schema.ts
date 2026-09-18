import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity('tbl_cruise_services')
@Index('idx_cruise_services_cruise', ['cruise_id'])
export class CruiseService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'enum', enum: ['included', 'not_included'] })
  service_type: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  sort_order: number;
}
