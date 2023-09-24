import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from 'src/dto/request/notifications/createNotification.dto';
import { NotificationByUserDto } from 'src/dto/request/notifications/notificationByUser.dto';
import { UpdateNotificationDto } from 'src/dto/request/notifications/updateNotification.dto';
import { Notification, NotificationDocument, NotificationSchema, } from 'src/schemas/notification.schema';
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

    async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        Logger.log(`NotificationsService->createNotification() entered with: ${Utils.toString(createNotificationDto)}`);
        const { description, userSentIds, headline } = createNotificationDto;
        const notification: Notification = {
            headline,
            description,
            usersSent: await this.convertUsersIdsToUsers(userSentIds),
            creationDate: new Date()
        }

        const notificationItem = new this.notificationModel(notification);
        await notificationItem.save();
        return notification;
    }

    async getAllNotificationsByUser(notificatonByUserDto: NotificationByUserDto): Promise<NotificationDocument[]> {
        Logger.log(`NotificationsService->getAllNotificationsByUser() entered with: ${Utils.toString(notificatonByUserDto)}`);
        const { userId } = notificatonByUserDto;
        const notifications = await this.notificationModel.find({ usersSent: { '$in': userId } });
        Logger.log(`NotificationsService->getAllNotificationsByUser() got: ${Utils.toString(notifications)}`)
        return notifications;
    }

    async updateNotification(updateNotificationDto: UpdateNotificationDto): Promise<NotificationDocument> {
        Logger.log(`NotificationsService->updateNotification() entered with: ${Utils.toString(updateNotificationDto)}`);
        const { notificationId } = updateNotificationDto;
        const updatedItem = await this.notificationModel.findByIdAndUpdate(notificationId, updateNotificationDto);
        if (!updatedItem) {
            Logger.warn(`NotificationsService->updateNotification() can't found id, can't update`);
            throw new NotFoundException("Can't find notification id");
        }
        Object.entries(updateNotificationDto).forEach(([key, value]) => {
            if (value) {
                updatedItem[key] = value;
            }
        });
        Logger.log(`NotificationsService->updateNotification() got: ${Utils.toString(updatedItem)}`)
        return updatedItem;
    }

}
