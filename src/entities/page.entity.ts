import { StoryEntity } from './story.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('page')
export class PageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoryEntity, (story) => story.page, { onDelete: 'CASCADE' })
  story: StoryEntity;

  @Column({ type: Number })
  position: number;

  @Column()
  text: string;

  @Column()
  image: string;

  @Column()
  image_prompt: string;

  @Column({
    type: 'text',
  })
  images: string;
}
