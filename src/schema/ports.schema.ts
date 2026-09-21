import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('tbl_ports')
@Unique(['name', 'country'])
export class Port {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  country: string | null;

  @Column({ type: 'char', length: 2, nullable: true })
  country_code: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  port_code: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  latitude: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  longitude: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
