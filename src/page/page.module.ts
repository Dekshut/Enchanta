import { PageEntity } from '../entities/page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { UserEntity } from 'src/entities/user.entity';
import { StatisticModule } from '../statistic/statistic.module';
import { GenerateModule } from 'src/generate/generate.module';
import { StoryModule } from 'src/story/story.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity, UserEntity]),
    StatisticModule,
    GenerateModule,
    StoryModule,
  ],
  providers: [PageService],
  controllers: [PageController],
})
export class PageModule {}
