import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logs')
export class LogEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column({
    default: 0,
  })
  total_time: number;

  @Column({
    type: 'double',
    default: 0,
  })
  retention: number;

  @Column({
    default: 0,
  })
  story_created: number;

  @Column({
    default: 0,
  })
  audio_created: number;

  @Column({
    default: 0,
  })
  total_actions: number;

  @Column({
    default: 0,
  })
  playing_music: number;

  @Column({
    type: 'double',
    default: 0,
  })
  playing_music_in_percent: number;

  @Column({
    default: 0,
  })
  leave_feedback: number;

  @Column({
    type: 'double',
    default: 0,
  })
  leave_feedback_in_percent: number;

  @Column({
    default: 0,
  })
  story_shared: number;

  @Column({
    type: 'double',
    default: 0,
  })
  story_shared_in_percent: number;

  @Column({
    default: 0,
  })
  image_changed: number;

  @Column({
    type: 'double',
    default: 0,
  })
  image_changed_in_percent: number;
}
