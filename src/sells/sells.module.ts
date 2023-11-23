import { Module } from '@nestjs/common';
import { SellsService } from './sells.service';
import { SellsController } from './sells.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sells, SellsSchema } from 'src/schemas/sells.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';

@Module({
    imports: [MongooseModule.forFeature([{ name: Sells.name, schema: SellsSchema }]), UsersModule],
    providers: [JwtService,PrivateKey,SellsService],
    controllers: [SellsController],
    exports: [SellsService]
})
export class SellsModule { }
