import { PageEntity } from './page.entity';
import {
  childAge,
  illustrationStyle,
  storyType,
  storyTheme,
} from './intefaces/story.interface';
import { UserEntity } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('story')
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  character_name: string;

  @Column()
  theme: storyTheme;

  @Column()
  style: illustrationStyle;

  @Column()
  story_type: storyType;

  @Column()
  age: childAge;

  @Column()
  status: string;

  @OneToMany(() => PageEntity, (page) => page.story)
  page: PageEntity[];

  @Column()
  userId: number;

  @JoinColumn()
  @ManyToOne(() => UserEntity, (user) => user.story)
  user: UserEntity;

  @Column()
  audioUrl: string;

  @Column()
  audioCover: string;

  @Column({
    default: false,
  })
  hasAudio: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  audio_created_at: Date;
}
