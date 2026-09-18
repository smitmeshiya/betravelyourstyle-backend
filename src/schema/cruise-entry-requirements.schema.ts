import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('tbl_cruise_entry_requirements')
@Unique(['cruise_id', 'nationality'])
export class CruiseEntryRequirement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'varchar', length: 100 })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  visa_information: string | null;

  @Column({ type: 'text', nullable: true })
  transit_visa_information: string | null;

  @Column({ type: 'text', nullable: true })
  entry_information: string | null;

  @Column({ type: 'text', nullable: true })
  health_regulations: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  extra_data: Record<string, any>;
}
