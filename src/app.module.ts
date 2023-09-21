import { PromptEntity } from './entities/prompt.entity';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreditsEntity } from './entities/credits.entity';
import { StoryEntity } from './entities/story.entity';
import { PageEntity } from './entities/page.entity';
import { GoogleStrategy } from './auth/strategies/google.stategy';
import { UserEntity } from './entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { StoryModule } from './story/story.module';
import { PageModule } from './page/page.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StripeModule } from './stripe/stripe.module';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { UserModule } from './user/user.module';
import { ShareLinkEntity } from './entities/shareLink.entity';
import { AppController } from './app.controller';
import { FeedbackEntity } from './entities/feedback.entity';
import { StatisticModule } from './statistic/statistic.module';
import { StatisticEntity } from './entities/statistic.entity';
import { LogEntity } from './entities/log.entity';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'client', 'build'),
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_TYPE'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: false,
        entities: [
          UserEntity,
          PageEntity,
          StoryEntity,
          CreditsEntity,
          PromptEntity,
          ShareLinkEntity,
          FeedbackEntity,
          StatisticEntity,
          LogEntity,
        ],
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    TokenModule,
    StoryModule,
    PageModule,
    StripeModule,
    UserModule,
    StatisticModule,
    GenerateModule,
  ],
  providers: [GoogleStrategy],
  controllers: [AppController],
})
export class AppModule {}
