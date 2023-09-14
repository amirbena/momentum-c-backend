import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { PrivateKey } from './private-keys/private-keys';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { TIME } from './constants/constants';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `src/environments/.${process.env.NODE_ENV}.env` }), CacheModule.register(), JwtModule.register({ signOptions: { expiresIn: TIME.DAY } }), MongooseModule.forRoot(`${process.env.MONGO_URI}`), UsersModule],
  controllers: [AppController],
  providers: [AppService, PrivateKey, AuthService],
})
export class AppModule { }
