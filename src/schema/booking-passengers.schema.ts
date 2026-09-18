import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('tbl_booking_passengers')
export class BookingPassenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  booking_inquiry_id: string;

  @Column({ type: 'varchar', length: 100 })
  firstname: string;

  @Column({ type: 'varchar', length: 100 })
  lastname: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true,
  })
  gender: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'boolean', default: false })
  is_primary: boolean;
}
