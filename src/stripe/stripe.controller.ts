import { JwtAuthGuard } from './../auth/guards/auth.jwt.guard';
import { getSessionInfoDto } from './dto/get-session-id.dto';
import { getCheckoutUrlDto } from './dto/get-checkout-url.dto';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { Controller, Query, Get, UseGuards } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule/dist';
import { ConfigService } from '@nestjs/config';

@ApiTags('Stripe')
@Controller('api/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-checkout-url')
  async getCheckoutUrl(@Query() body: getCheckoutUrlDto) {
    return await this.stripeService.getCheckoutUrl(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-session-info')
  async getSessionInfo(@Query() body: getSessionInfoDto) {
    return await this.stripeService.getSessionInfo(body);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    await this.stripeService.cron();
  }
}
