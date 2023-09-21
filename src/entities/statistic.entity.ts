import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('statistic')
export class StatisticEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  // Users

  @Column()
  total_users: number;

  @Column({
    default: 0,
  })
  new_registration: number;

  @Column({
    default: 0,
  })
  new_subscription: number;

  @Column({
    default: 0,
  })
  unique_subscription: number;

  @Column({
    type: 'double',
    default: 0,
  })
  unique_subscription_in_percent: number;

  @Column({
    default: 0,
  })
  active_subscriptions: number;

  @Column({
    default: 0,
  })
  renew_subscription: number;

  // Stories

  @Column({
    default: 0,
  })
  total_stories: number;

  @Column({
    default: 0,
  })
  new_stories: number;

  @Column({
    default: 0,
  })
  new_stories_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  new_stories_in_percent: number;

  // Audio

  @Column({
    default: 0,
  })
  new_audio: number;

  @Column({
    default: 0,
  })
  new_audio_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  new_audio_in_percent: number;

  @Column({
    default: 0,
  })
  play_music_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  play_music_in_percent: number;

  // Other

  @Column({
    default: 0,
  })
  feedback_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  feedback_in_percent: number;

  @Column({
    default: 0,
  })
  sharing_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  sharing_in_percent: number;

  @Column({
    default: 0,
  })
  edit_image_by_user: number;

  @Column({
    type: 'double',
    default: 0,
  })
  edit_image_in_percent: number;
}
