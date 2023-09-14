import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ConfigModule.forRoot({envFilePath: `src/environments/.${process.env.NODE_ENV}.env`}) ,MongooseModule.forRoot(`${process.env.MONGO_URI}`), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
