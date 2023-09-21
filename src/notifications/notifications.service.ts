import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from 'src/dto/request/createNotification.dto';
import { Notification, NotificationSchema, } from 'src/schemas/notification.schema';
import { User } from 'src/schemas/user.schema';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>, @InjectModel(User.name) private userModel: Model<User>) { }


    private async convertUsersIdsToUsers(userIds: Types.ObjectId[]): Promise<User[]> {
        const returnedArr: User[] = []
        for (let index = 0; index < userIds.length; index++) {
            const element = await this.userModel.findById(userIds[index]);
            returnedArr.push(element);
        }
        return returnedArr;
    }

    async createNotification(createNotificationDto: CreateNotificationDto) {
        Logger.log(`NotificationsService->createNotification() entered with: ${Utils.toString(createNotificationDto)}`);
        const { description, usersIdsToPing, headline } = createNotificationDto;
        const notification: Notification = {
            headline,
            description,
            usersToPing: await this.convertUsersIdsToUsers(usersIdsToPing)
        }

        const notificationItem = new this.notificationModel(notification);
        await notificationItem.save();
        return notification;

    }
}
