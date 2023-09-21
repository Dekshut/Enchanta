import { UserEntity } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from 'src/token/token.module';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TokenModule,
    StatisticModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
