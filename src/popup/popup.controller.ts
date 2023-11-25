import { Body, Controller, HttpCode, HttpStatus, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PopupService } from './popup.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { AccessLayer } from 'src/constants/constants';
import { CreateRegularPopup } from 'src/dto/request/popup/createRegularPopup.dto';
import { RetreivePopups } from 'src/dto/request/popup/getPopupsToUser.dto';
import { UpdatePopupDto } from 'src/dto/request/popup/updatePopup.dto';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { PopupDocument } from 'src/schemas/popup.schema';

@Controller('popup')
export class PopupController {

    constructor(private popupService: PopupService) { }

    @Post('/regular')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.OK)
    async createRegularPopup(@Body() regularPopup: CreateRegularPopup) {
        return await this.popupService.createRegularPopup(regularPopup);
    }

    @Post('/schedualing')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.OK)
    async createSchedualingPopup(@Body() regularPopup: CreateRegularPopup) {
        return await this.popupService.createRegularPopup(regularPopup);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.OK)
    async getAllPopups(@Body() retreivePopups: RetreivePopups): Promise<PopupDocument[]> {
        return await this.popupService.showPopupsAccordingUser(retreivePopups);
    }

    @Post('/read-popups')
    @UseGuards(AuthGuard)
    async getAllReadPopup(@Body() user: TokenDto, @Req() request: any): Promise<PopupDocument[]> {
        return await this.popupService.showAllMessagesInHistory(user);
    }

    @Put()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async updatePopupRead(@Body() updatePopup: UpdatePopupDto) {
        return await this.popupService.updatePopup(updatePopup);
    }




}
