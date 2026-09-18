import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('tbl_user_favorites')
@Unique(['user_id', 'cruise_id'])
export class UserFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  cruise_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
