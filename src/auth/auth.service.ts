import { TokenService } from '../token/token.service';
import { UserEntity } from '../entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionType, StatisticService } from '../statistic/statistic.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    // @InjectRepository(LogEntity)
    // private readonly logsRepository: Repository<LogEntity>,
    private readonly tokenService: TokenService,
    private readonly statisticService: StatisticService,
  ) {}

  async googleLogin(req) {
    if (!req.user) throw new UnauthorizedException('User not found');
    const alreadyExistUser = await this.userRepository.findOne({
      where: { email: req.user.email },
    });

    if (alreadyExistUser) {
      this.userRepository
        .update({ email: req.user.email }, { image: req.user.image })
        .catch();

      this.statisticService
        .logAction(ActionType.AUTH, alreadyExistUser.id)
        .catch(console.log);
    }

    if (!alreadyExistUser) {
      await this.userRepository.save({
        ...req.user,
        quantity: 1,
        registration_at: new Date(),
      });
      const token = await this.tokenService.generateToken({ ...req.user });

      const addedUser = await this.userRepository.findOne({
        where: { email: req.user.email },
      });

      this.statisticService
        .logAction(ActionType.AUTH, addedUser.id)
        .catch(console.log);

      this.statisticService.newRegistration().catch();

      return {
        jwtToken: token,
        googleToken: req.user.accessToken,
      };
    }
    const token = await this.tokenService.generateToken({ ...req.user });

    return {
      jwtToken: token,
      googleToken: req.user.accessToken,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      image: req.user.image,
    };
  }
}
