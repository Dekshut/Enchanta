import { ConfigService } from '@nestjs/config/dist';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();
const PORT = +process.env.PORT;
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        '868454354754-41c6c5mtk7iag3f9gd3fkmuvha6vpvfv.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: `http://localhost:8000/api/auth/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      image: photos[0].value || '',
      accessToken,
    };
    done(null, user);
  }
}
