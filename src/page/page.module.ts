import { PageEntity } from '../entities/page.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { UserEntity } from 'src/entities/user.entity';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity, UserEntity]),
    StatisticModule,
  ],
  providers: [PageService],
  controllers: [PageController],
})
export class PageModule {}
