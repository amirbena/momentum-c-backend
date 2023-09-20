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


@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `src/environments/.${process.env.NODE_ENV}.env` }),
  RedisModule.forRoot({
    config: {
      host: process.env.REDIS_URI,
      port: parseInt(process.env.REDIS_PORT)

    }
  }), JwtModule.register({ signOptions: { expiresIn: TIME.DAY } }), MongooseModule.forRoot(`${process.env.MONGO_URI}`), UsersModule],
  controllers: [AppController],
  providers: [AppService, PrivateKey, GoogleService],
})
export class AppModule { }
