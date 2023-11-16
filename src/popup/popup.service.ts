import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isBIC } from 'class-validator';
import { Model, Types } from 'mongoose';
import { PopupCreation } from 'src/constants/constants';
import { CreateRegularPopup } from 'src/dto/request/popup/createRegularPopup.dto';
import { CreateSchedualingPopup } from 'src/dto/request/popup/createSchedualingPopup.dto';
import { RetreivePopups } from 'src/dto/request/popup/getPopupsToUser.dto';
import { UpdatePopupDto } from 'src/dto/request/popup/updatePopup.dto';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { CreatePopupResult } from 'src/dto/response/popup/createPopup.result';
import { Popup, PopupDocument } from 'src/schemas/popup.schema';
import { UsersService } from 'src/users/users.service';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class PopupService {
    constructor(@InjectModel(Popup.name) private popupModel: Model<Popup>, private userService: UsersService) { }

    async createRegularPopup(createPopupDto: CreateRegularPopup): Promise<CreatePopupResult> {
        Logger.log(`PopupService->createRegularPopup() entered with: ${Utils.toString(createPopupDto)}`);
        const { user, ...popupRef } = createPopupDto;
        const popup: Popup = {
            ...popupRef,
            userReadIds: []
        }

        const popupItem = new this.popupModel(popup);
        await popupItem.save();
        Logger.log(`PopupService->createRegularPopup() got: ${Utils.toString(popupItem)}`);
        await this.userService.updateUserDto(user);
        return { message: PopupCreation.REGULAR_POPUP };
    }

    async createSchedualingPopup(createPopupDto: CreateSchedualingPopup): Promise<CreatePopupResult> {
        Logger.log(`PopupService->createSchedualingPopup() entered with: ${Utils.toString(createPopupDto)}`);
        const { user, ...popupRef } = createPopupDto;
        const popup: Popup = {
            ...popupRef,
            userReadIds: []
        }

        const popupItem = new this.popupModel(popup);
        await popupItem.save();
        Logger.log(`PopupService->createSchedualingPopup() got: ${Utils.toString(popupItem)}`);
        await this.userService.updateUserDto(user);
        return { message: PopupCreation.SCHEDUALING_POPUP };
    }

    async showPopupsAccordingUser(popupToUser: RetreivePopups): Promise<PopupDocument[]> {
        try {
            Logger.log(`PopupService->showPopupsAccordingUser() entered with: ${Utils.toString(popupToUser)}`);
            const { dateToCheck, user } = popupToUser;
            const { dateBefore, dateAfter } = Utils.buildDateRangeOfDate(dateToCheck);
            const id = await this.userService.getIdByFullName(user.fullName);
            if (!id) return [];
            const popups = await this.popupModel.find({ $or: [{ creationDate: { $gte: dateBefore, $lte: dateAfter } }, { scheudlingDate: { $lte: dateToCheck } }], userReadIds: { $nin: [id] } });
            this.sortPopups(popups);
            await this.userService.updateUserDto(user);
            Logger.log(`PopupService->showPopupsAccordingUser() got popups, ${Utils.toString(popups)}`);
            return popups;
        } catch (error) {
            Logger.error(`PopupService->showPopupsAccordingUser() an error occured: ${Utils.toString(error.message)}`);
            return [];
        }
    }


    async updatePopup(updatePopup: UpdatePopupDto): Promise<void> {
        Logger.log(`PopupService->updatePopup() entered with: ${Utils.toString(updatePopup)}`);
        const { popupId, user } = updatePopup;
        const popup = await this.popupModel.findById(popupId);
        if (!popup) return;
        let userId = await this.userService.getIdByFullName(user.fullName);
        if (!userId) return;
        userId = userId as Types.ObjectId;
        popup.userReadIds = [...popup.userReadIds, userId];
        await popup.save();
        await this.userService.updateUserDto(user);
        return;
    }

    private sortPopups(popupArray: PopupDocument[]) {
        popupArray.sort((a, b) => {
            if (a.scheudlingDate && b.scheudlingDate) return b.scheudlingDate.getTime() - a.scheudlingDate.getTime();
            if (a.scheudlingDate && !b.scheudlingDate) return b.creationDate.getTime() - a.scheudlingDate.getTime();
            if (!a.scheudlingDate && b.scheudlingDate) return b.scheudlingDate.getTime() - a.creationDate.getTime();
            return b.creationDate.getTime() - a.creationDate.getTime();
        })
    }


    async showAllMessagesInHistory(tokenDto: TokenDto): Promise<PopupDocument[]> {
        try {
            Logger.log(`PopupService->showAllMessagesInHistory() entered with: ${Utils.toString(tokenDto)}`);
            const id = await this.userService.getIdByFullName(tokenDto.fullName);
            if (!id) return [];
            const popups = await this.popupModel.find({ userReadIds: { $in: [id] } });
            this.sortPopups(popups);
            Logger.log(`PopupService->showAllMessagesInHistory() got popups, ${Utils.toString(popups)}`);
            return popups;
        } catch (error) {
            Logger.error(`PopupService->showAllMessagesInHistory() an error occured: ${Utils.toString(error.message)}`);
            return [];
        }
    }
}
