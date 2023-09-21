import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema,  } from 'src/schemas/notification.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule { }
