import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('tbl_booking_inquiries')
@Index('idx_booking_inquiries_user', ['user_id'])
@Index('idx_booking_inquiries_cruise', ['cruise_id'])
export class BookingInquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  inquiry_number: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @Column({ type: 'uuid', nullable: true })
  cabin_offer_id: string | null;

  @Column({
    type: 'enum',
    enum: ['inquiry', 'confirmed', 'cancelled'],
    default: 'inquiry',
  })
  status: string;

  @Column({ type: 'smallint', default: 1 })
  number_of_adults: number;

  @Column({ type: 'smallint', default: 0 })
  number_of_children: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  total_estimated_amount: number | null;

  @Column({ type: 'char', length: 3, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  customer_email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  customer_phone: string | null;

  @Column({ type: 'text', nullable: true })
  customer_message: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
