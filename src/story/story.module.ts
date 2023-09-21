import { PromptEntity } from '../entities/prompt.entity';
import { PageEntity } from '../entities/page.entity';
import { StoryEntity } from '../entities/story.entity';
import { UserEntity } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { ShareLinkEntity } from '../entities/shareLink.entity';
import { FeedbackEntity } from '../entities/feedback.entity';
import { StatisticModule } from '../statistic/statistic.module';
import { GenerateModule } from '../generate/generate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      StoryEntity,
      PageEntity,
      PromptEntity,
      ShareLinkEntity,
      FeedbackEntity,
    ]),
    StatisticModule,
    GenerateModule,
  ],
  providers: [StoryService],
  controllers: [StoryController],
  exports: [StoryService],
})
export class StoryModule {}
