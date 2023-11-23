import { Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivateKey } from './private-keys/private-keys';
import { JwtModule } from '@nestjs/jwt';
import { TIME } from './constants/constants';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { GoogleService } from './google/google.service';
import { NotificationsModule } from './notifications/notifications.module';
import { VideosModule } from './videos/videos.module';
import { PopupModule } from './popup/popup.module';
import { MailService } from './mail/mail.service';
import { SellsModule } from './sells/sells.module';
import { SchedualingModule } from './schedualing/schedualing.module';



@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `src/environments/.${process.env.NODE_ENV}.env` }),
  RedisModule.forRoot({
    config: {
      host: process.env.REDIS_URI,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_SOCKET_PASSWORD
    }
  }), JwtModule.register({ signOptions: { expiresIn: TIME.DAY } }), MongooseModule.forRoot(`${process.env.MONGO_URI}`), UsersModule, NotificationsModule, VideosModule, PopupModule, SellsModule, SchedualingModule],
  controllers: [AppController],
  providers: [AppService, PrivateKey, GoogleService, MailService],
})
export class AppModule { }
