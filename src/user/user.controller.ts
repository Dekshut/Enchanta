import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/auth.jwt.guard';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-user-info')
  async getUserInfo(@Req() req) {
    return await this.userService.getUserInfo(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-user-credits')
  async getUserCredits(@Req() req) {
    return await this.userService.getUserCredits(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('session-time')
  async sessionTime(@Req() req) {
    return await this.userService.sessionTime(req.user);
  }
}
