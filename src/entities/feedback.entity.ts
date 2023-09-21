import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  feedback: string;

  @Column()
  toStoryId: number;

  @Column()
  rate: number;

  @Column({
    default: false,
  })
  isReviewed: boolean;

  @Column({
    default: 'Unregistered',
  })
  email: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;
}
