import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
} from 'typeorm';

@Entity('tbl_cruise_itinerary')
@Index('idx_itinerary_cruise_day', ['cruise_id', 'day_number'])
@Unique(['cruise_id', 'day_number'])
export class CruiseItinerary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'int' })
  day_number: number;

  @Column({ type: 'uuid', nullable: true })
  port_id: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  arrival_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  departure_at: Date | null;

  @Column({ type: 'text', nullable: true })
  stay_description: string | null;

  @Column({ type: 'text', nullable: true })
  route_description: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  latitude: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  longitude: number | null;
}
