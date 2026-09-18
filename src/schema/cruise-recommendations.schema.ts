import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('tbl_cruise_recommendations')
export class CruiseRecommendation {
  @PrimaryColumn({ type: 'uuid' })
  cruise_id: string;

  @PrimaryColumn({ type: 'uuid' })
  recommendation_id: string;
}
