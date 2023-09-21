import { storyType } from './intefaces/story.interface';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prompt')
export class PromptEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  text: string;

  @Column({ type: 'enum', enum: storyType })
  type: storyType;
}
