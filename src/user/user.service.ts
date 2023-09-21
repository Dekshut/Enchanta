import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ActionType, StatisticService } from '../statistic/statistic.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly statisticService: StatisticService,
  ) {}
  async getUserInfo(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserCredits(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: { quantity: true },
    });
  }

  async sessionTime(email) {
    const user = await this.userRepository.findOne({ where: { email } });
    user.sessionTime += 1;
    await this.userRepository.save(user);

    this.statisticService
      .logAction(ActionType.SESSION_TIME, user.id)
      .catch(console.log);

    return 'OK';
  }
}
