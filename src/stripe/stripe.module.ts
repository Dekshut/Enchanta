import { TokenModule } from '../token/token.module';
import { CreditsEntity } from '../entities/credits.entity';
import { UserEntity } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CreditsEntity]),
    TokenModule,
    StatisticModule,
  ],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
