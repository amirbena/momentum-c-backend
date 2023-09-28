import { Body, Controller, Get, Post, UsePipes, ValidationPipe, UseGuards, Put, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from 'src/dto/request/notifications/createNotification.dto';
import { NotificationByUserDto as NotificationsByUserDto } from 'src/dto/request/notifications/notificationByUser.dto';
import { Roles } from 'src/guards/roles/roles.decorator';
import { AccessLayer } from 'src/constants/constants';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UpdateNotificationDto } from 'src/dto/request/notifications/updateNotification.dto';
import { Utils } from 'src/utils/Utils';

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }


    @Post()
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async createNotififcation(@Body() createNotificationDto: CreateNotificationDto) {
        Logger.log(`NotificationsController->createNotififcation() entered with: ${Utils.toString(createNotificationDto)}`);
        const createdNotification = await this.notificationsService.createNotification(createNotificationDto);
        Logger.log(`NotificationsController->createNotififcation() got: ${Utils.toString(createdNotification)}`);
        return createdNotification;
    }

    @Post('/user-notifications')
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async getNotificationsByUsers(@Body() notificatonsByUserDto: NotificationsByUserDto) {
        Logger.log(`NotificationsController->getNotificationsByUsers() entered with: ${Utils.toString(notificatonsByUserDto)}`);
        const notifications = await this.notificationsService.getAllNotificationsByUser(notificatonsByUserDto);
        Logger.log(`NotificationsController->getNotificationsByUsers() got: ${Utils.toString(notifications)}`);
        return notifications;
    }

    @Put('read-notification')
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async readNotification(@Body() readNotificationDto: UpdateNotificationDto) {
        Logger.log(`NotificationsController->readNotification() entered with: ${Utils.toString(readNotificationDto)}`);
        readNotificationDto.isRead = true;
        return await this.notificationsService.updateNotification(readNotificationDto);

    }

    @Put()
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async updateNotification(@Body() updateNotificationDto: UpdateNotificationDto) {
        Logger.log(`NotificationsController->readNotification() entered with: ${Utils.toString(updateNotificationDto)}`);
        return await this.notificationsService.updateNotification(updateNotificationDto);
    }
}
