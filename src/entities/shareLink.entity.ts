import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StoryEntity } from './story.entity';

@Entity('share-link')
export class ShareLinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @OneToOne(() => StoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  toStory: StoryEntity;
}
