import { Body, Controller, Get, Post, UsePipes, ValidationPipe, UseGuards, Put } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from 'src/dto/request/notifications/createNotification.dto';
import { NotificationByUserDto } from 'src/dto/request/notifications/notificationByUser.dto';
import { Roles } from 'src/guards/roles/roles.decorator';
import { AccessLayer } from 'src/constants/constants';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { UpdateNotificationDto } from 'src/dto/request/notifications/updateNotification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }


    @Post()
    @Roles(AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async createNotififcation(@Body() createNotificationDto: CreateNotificationDto) {
        return await this.notificationsService.createNotification(createNotificationDto);
    }

    @Post('/user-notifications')
    @Roles(AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async getNotificationsByUsers(@Body() notificatonByUserDto: NotificationByUserDto) {
        return await this.notificationsService.getAllNotificationsByUser(notificatonByUserDto);
    }

    @Put('read-notification')
    @Roles(AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async readNotification(@Body() readNotificationDto: UpdateNotificationDto) {
        return await this.notificationsService.updateNotification(readNotificationDto);
    }
}
