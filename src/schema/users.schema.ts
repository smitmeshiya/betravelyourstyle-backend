import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('tbl_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  firstname: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname: string | null;

  @Column({ type: 'text', nullable: true })
  profile_image: string | null;

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  county: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nationality: string | null;

  @Column({ type: 'text', nullable: true })
  reset_password_token: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  reset_password_expires_at: Date | null;

  @Column({ type: 'text', nullable: true })
  email_verification_token: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date | null;
}
