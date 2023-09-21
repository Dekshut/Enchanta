import { getCheckoutUrlDto } from './dto/get-checkout-url.dto';
import { getSessionInfoDto } from './dto/get-session-id.dto';
import { TokenService } from '../token/token.service';
import { CreditsEntity } from '../entities/credits.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticService } from '../statistic/statistic.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CreditsEntity)
    private readonly creditsRepository: Repository<CreditsEntity>,
    private readonly tokenService: TokenService,
    private readonly statisticService: StatisticService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_API_KEY'), {
      apiVersion: this.configService.get('STRIPE_API_VERSION'),
    });
  }

  async getCheckoutUrl({ priceId, quantity, email }: getCheckoutUrlDto) {
    try {
      if (!priceId || !quantity || !email)
        throw new BadRequestException('BadRequest');

      const customerInfo = await this.stripe.customers.search({
        query: `email:"${email}"`,
      });

      let customerId = '';

      if (customerInfo?.data[0]?.id) {
        customerId = customerInfo?.data[0]?.id;
      } else {
        const newCustomer = await this.stripe.customers.create({
          email,
        });

        customerId = newCustomer.id;
      }

      const mode = (await this.stripe.prices.retrieve(priceId)).metadata.mode;

      const checkoutSession = await this.stripe.checkout.sessions.create({
        line_items: [{ price: priceId, quantity }],
        customer: customerId,
        cancel_url: `${process.env.PROTOCOL}${process.env.HOST}${
          +process.env.PORT === 8000 ? ':8000' : ''
        }/dashboard`,
        success_url: `${process.env.PROTOCOL}${process.env.HOST}${
          +process.env.PORT === 8000 ? ':8000' : ''
        }/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        mode: mode ? 'subscription' : 'payment',
        allow_promotion_codes: true,
      });

      return {
        url: checkoutSession.url,
      };
    } catch (error) {
      if (error) throw new BadRequestException(error.message);
    }
  }

  async getSessionInfo({ session_id }: getSessionInfoDto) {
    try {
      if (!session_id) throw new BadRequestException();

      const sessionInfo = await this.stripe.checkout.sessions.retrieve(
        session_id,
        {
          expand: ['line_items'],
        },
      );
      if (!sessionInfo) throw new BadRequestException();

      const user = await this.userRepository.findOne({
        where: { email: sessionInfo.customer_details.email },
      });

      const subscriptionInterval =
        sessionInfo.line_items?.data[0]?.price.recurring?.interval;

      if (subscriptionInterval === 'month' || subscriptionInterval === 'year') {
        user.isSubscription = true;
        user.subscription_type = subscriptionInterval;

        const isNewUser = user.subscription_at === null;

        user.subscription_at = new Date();
        user.subscription_end =
          subscriptionInterval === 'month'
            ? new Date(
                user.subscription_at.setMonth(
                  user.subscription_at.getMonth() + 1,
                ),
              )
            : new Date(
                user.subscription_at.setFullYear(
                  user.subscription_at.getFullYear() + 1,
                ),
              );

        this.statisticService
          .newSubscription(
            user.registration_at,
            user.subscription_at,
            isNewUser,
          )
          .catch();
      } else {
        user.subscription_type = 'per-story';
      }

      const data = sessionInfo.line_items?.data[0]?.price.id;
      const value = (await this.stripe.prices.retrieve(data)).metadata.value;

      user.quantity += value ? +value : 1;

      await this.userRepository.save(user);

      return {
        total: sessionInfo.amount_total / 100,
        subtotal: sessionInfo.amount_subtotal / 100,
        discount:
          (sessionInfo.amount_subtotal - sessionInfo.amount_total) / 100,
        quantity: sessionInfo.line_items?.data[0]?.quantity || 1,
      };
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async cron() {
    const data = await this.creditsRepository.find();
    data.map(async (e) => {
      try {
        const token = e.token;
        const result = jwt.verify(token, 'secret');
        if (!result) {
          e.credits = 0;
          await this.creditsRepository.save(e);
        }
      } catch (error) {
        if (error) {
          e.credits = 0;
          await this.creditsRepository.save(e);
        }
      }
    });
  }
}
