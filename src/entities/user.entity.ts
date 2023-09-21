import { StoryEntity } from './story.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  email: string;

  @Column()
  quantity: number;

  @OneToMany(() => StoryEntity, (story) => story.user)
  story: StoryEntity[];

  @Column()
  image: string;

  @Column({
    default: 0,
  })
  sessionTime: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createDate: string;

  @Column({ type: 'timestamp', nullable: true })
  registration_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscription_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  subscription_end: Date;

  @Column({
    default: false,
  })
  isSubscription: boolean;

  @Column()
  subscription_type: string;

  @Column({
    default: false,
  })
  newStoryCreated: boolean;

  @Column({
    default: false,
  })
  audioWasCreated: boolean;

  @Column({
    default: false,
  })
  musicWasPlayed: boolean;

  @Column({
    default: false,
  })
  feedbackWasLeft: boolean;

  @Column({
    default: false,
  })
  storyWasShared: boolean;

  @Column({
    default: false,
  })
  imageWasChanged: boolean;
}
