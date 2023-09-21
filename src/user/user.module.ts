import { UserEntity } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), StatisticModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
