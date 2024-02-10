import { ConfigService } from '@nestjs/config/dist';
import { ApiTags } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
const PORT = +process.env.PORT;

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
    try {
      const response = await this.authService.googleLogin(req);
      res.cookie('googleToken', response.googleToken, {
        maxAge: 168 * 60 * 60 * 1000,
      });
      res.cookie('jwtToken', response.jwtToken, {
        maxAge: 168 * 60 * 60 * 1000,
      });
      console.log(true);
      return res.redirect(
        `http${PORT === 8000 ? '' : 's'}://${await this.configService.get(
          'HOST',
        )}${PORT === 8000 ? ':3000' : ''}/dashboard`,
      );
    } catch (error) {
      if (error) throw new BadRequestException(error.message);
    }
  }
}
