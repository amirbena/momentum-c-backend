import { Module } from '@nestjs/common';
import { PopupService } from './popup.service';
import { PopupController } from './popup.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Popup, PopupSchema } from 'src/schemas/popup.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { PrivateKey } from 'src/private-keys/private-keys';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{ name: Popup.name, schema: PopupSchema }]), UsersModule],
  providers: [PopupService, AuthGuard, RolesGuard, PrivateKey, JwtService],
  controllers: [PopupController]
})
export class PopupModule { }
