import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from 'src/dto/request/createNotification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }


    @Post()
    @UsePipes(ValidationPipe)
    async createNotififcation(@Body() createNotificationDto: CreateNotificationDto) {
        return await this.notificationsService.createNotification(createNotificationDto);
    }
}
