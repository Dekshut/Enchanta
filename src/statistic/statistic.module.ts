import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { StatisticEntity } from '../entities/statistic.entity';
import { UserEntity } from '../entities/user.entity';
import { StoryEntity } from '../entities/story.entity';
import { LogEntity } from '../entities/log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StatisticEntity,
      UserEntity,
      StoryEntity,
      LogEntity,
    ]),
  ],
  providers: [StatisticService],
  controllers: [StatisticController],
  exports: [StatisticService],
})
export class StatisticModule {}
