import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    return await this.statisticService.createStatistic();
  }
}
